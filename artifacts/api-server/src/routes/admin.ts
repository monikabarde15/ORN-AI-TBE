import { Router, type IRouter } from "express";
import { sql, desc, eq } from "drizzle-orm";
import {
  db,
  candidatesTable,
  activityTable,
  auditLogsTable,
  userCourseProgressTable,
  usersTable,
  coursesTable,
  sectionsTable,
  subSectionsTable,
} from "@workspace/db";
import {
  AdminPipelineResponse,
  AdminActivityResponse,
} from "@workspace/api-zod";
import { REGIONS, UPSKILLING_AREAS } from "../lib/regions";
import { serializeActivity, serializeAuditLog } from "../lib/serialize";
import { requireAuth, requireRole } from "../lib/auth";

const router: IRouter = Router();

router.get("/admin/pipeline", requireAuth, requireRole("admin"), async (_req, res): Promise<void> => {
  const totalRow = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(candidatesTable);
  const totalCandidates = totalRow[0]?.count ?? 0;

  const evaluatedRow = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(candidatesTable)
    .where(sql`${candidatesTable.evaluation} IS NOT NULL`);
  const evaluated = evaluatedRow[0]?.count ?? 0;

  const upskillingRow = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(candidatesTable)
    .where(
      sql`COALESCE((${candidatesTable.evaluation}->'scores'->>'upskillingNeeds')::int, 0) >= 40`,
    );
  const upskillingActive = upskillingRow[0]?.count ?? 0;

  const placementsRow = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(activityTable)
    .where(
      sql`${activityTable.kind} = 'placement' AND ${activityTable.timestamp} >= now() - interval '90 days'`,
    );
  const placementsThisQuarter = placementsRow[0]?.count ?? 0;

  const countryRows = await db
    .select({
      country: candidatesTable.country,
      count: sql<number>`count(*)::int`,
    })
    .from(candidatesTable)
    .groupBy(candidatesTable.country)
    .orderBy(sql`count(*) DESC`);

  const byCountry = countryRows.map((r) => ({
    country: r.country,
    count: r.count,
    flag: REGIONS.find((reg) => reg.name === r.country)?.flag ?? "",
  }));

  const skillRows = await db.execute<{ skill: string; count: number }>(sql`
    SELECT unnest(skills) AS skill, COUNT(*)::int AS count
    FROM candidates
    GROUP BY skill
    ORDER BY count DESC
    LIMIT 12
  `);
  const bySkill = skillRows.rows.map((r) => ({ skill: r.skill, count: r.count }));

  const tierRows = await db.execute<{ tier: string; count: number }>(sql`
    SELECT COALESCE(evaluation->>'readinessTier', 'unscored') AS tier,
           COUNT(*)::int AS count
    FROM candidates
    GROUP BY tier
    ORDER BY count DESC
  `);
  const byReadiness = tierRows.rows.map((r) => ({
    tier: r.tier,
    count: r.count,
  }));

  // Synthetic but realistic upskilling distribution from candidate readiness
  const upskillingBuckets = await Promise.all(
    UPSKILLING_AREAS.slice(0, 6).map(async (area, i) => {
      const r = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(candidatesTable)
        .where(
          sql`COALESCE((${candidatesTable.evaluation}->'scores'->>'upskillingNeeds')::int, 0) BETWEEN ${i * 12} AND ${i * 12 + 30}`,
        );
      return { area, count: r[0]?.count ?? 0 };
    }),
  );

  const monthlyRows = await db.execute<{
    month: string;
    registrations: number;
    evaluations: number;
  }>(sql`
    SELECT to_char(date_trunc('month', created_at), 'Mon YYYY') AS month,
           COUNT(*)::int AS registrations,
           COUNT(*) FILTER (WHERE evaluation IS NOT NULL)::int AS evaluations
    FROM candidates
    GROUP BY date_trunc('month', created_at)
    ORDER BY date_trunc('month', created_at)
  `);
  const monthlyGrowth = monthlyRows.rows.map((r) => ({
    month: r.month,
    registrations: r.registrations,
    evaluations: r.evaluations,
  }));

  res.json(
    AdminPipelineResponse.parse({
      totalCandidates,
      evaluated,
      upskillingActive,
      placementsThisQuarter,
      byCountry,
      bySkill,
      byReadiness,
      byUpskilling: upskillingBuckets,
      monthlyGrowth,
    }),
  );
});

router.get("/admin/activity", requireAuth, requireRole("admin"), async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(activityTable)
    .orderBy(desc(activityTable.timestamp))
    .limit(20);
  res.json(AdminActivityResponse.parse(rows.map(serializeActivity)));
});

router.get(
  "/admin/audit-logs",
  requireAuth,
  requireRole("admin"),
  async (req, res): Promise<void> => {
    const limit = Math.min(
      200,
      Math.max(1, Number(req.query["limit"] ?? 50) || 50),
    );
    const rows = await db
      .select()
      .from(auditLogsTable)
      .orderBy(desc(auditLogsTable.createdAt))
      .limit(limit);
    res.status(200).json(rows.map(serializeAuditLog));
  },
);

router.get("/admin/course-progress", requireAuth, requireRole("admin", "recruiter"), async (_req, res): Promise<void> => {
  try {
    // 1. Fetch total lessons count for each course safely
    let lessonCountMap = new Map<string, number>();
    try {
      const courseLessonCounts = await db
        .select({
          courseId: sectionsTable.courseId,
          count: sql<number>`count(${subSectionsTable.id})::int`,
        })
        .from(subSectionsTable)
        .innerJoin(sectionsTable, eq(subSectionsTable.sectionId, sectionsTable.id))
        .groupBy(sectionsTable.courseId);

      lessonCountMap = new Map<string, number>(
        courseLessonCounts.map((c) => [c.courseId, c.count])
      );
    } catch (e) {
      console.warn("Lesson count query warning:", e);
    }

    // 2. Fetch progress rows safely
    const progressList = await db
      .select()
      .from(userCourseProgressTable)
      .orderBy(desc(userCourseProgressTable.updatedAt));

    const users = await db.select().from(usersTable);
    const courses = await db.select().from(coursesTable);

    const userMap = new Map<string, any>(users.map((u) => [String(u.id), u]));
    const courseMap = new Map<string, any>(courses.map((c) => [String(c.id), c]));

    // Aggregate data by unique user (1 row per user)
    const aggregatedUserMap = new Map<string, any>();

    progressList.forEach((r) => {
      const uId = String(r.userId);
      const user = userMap.get(uId) || {};
      const course = courseMap.get(String(r.courseId)) || {};

      const completedLessonsObj = (r.completedLessons as Record<string, boolean>) || {};
      const completedCount = Object.values(completedLessonsObj).filter(Boolean).length;
      const finalAssessmentObj = (r.finalAssessment as any) || null;
      
      const totalLessons = lessonCountMap.get(r.courseId) || 0;
      const courseName = course.courseName || course.title || "Course";
      const hasCertificate = (totalLessons > 0 && completedCount >= totalLessons) || !!finalAssessmentObj?.passed;
      const numericScore = typeof finalAssessmentObj?.percentage === "number" ? finalAssessmentObj.percentage : (totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0);

      if (!aggregatedUserMap.has(uId)) {
        aggregatedUserMap.set(uId, {
          id: r.id,
          userId: r.userId,
          userName: user.fullName || user.email || r.userId || "Student",
          userEmail: user.email || "",
          courseId: r.courseId,
          courseTitle: courseName,
          coursesList: [{ courseId: r.courseId, title: courseName, completedViews: completedCount, totalLessons, score: numericScore }],
          completedViews: completedCount,
          totalLessons: totalLessons,
          totalScore: numericScore,
          score: numericScore,
          finalAssessment: finalAssessmentObj,
          hasCertificate: hasCertificate,
          certificateDate: hasCertificate ? new Date(r.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : null,
          certificateId: hasCertificate ? `ORN-${r.id.substring(0, 8).toUpperCase()}` : "",
          lastActive: r.updatedAt,
        });
      } else {
        const existing = aggregatedUserMap.get(uId);
        existing.completedViews += completedCount;
        existing.totalLessons += totalLessons;
        existing.totalScore = Math.max(existing.totalScore, numericScore);
        existing.score = existing.totalScore;
        if (!existing.courseTitle.includes(courseName)) {
          existing.courseTitle = `${existing.courseTitle} & ${courseName}`;
        }
        existing.coursesList.push({ courseId: r.courseId, title: courseName, completedViews: completedCount, totalLessons, score: numericScore });
        if (hasCertificate) existing.hasCertificate = true;
        if (new Date(r.updatedAt) > new Date(existing.lastActive)) {
          existing.lastActive = r.updatedAt;
        }
      }
    });

    const data = Array.from(aggregatedUserMap.values()).map((u) => {
      const progressPct = u.totalLessons > 0 ? Math.round((u.completedViews / u.totalLessons) * 100) : 0;
      return {
        ...u,
        progressPct,
      };
    });

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Failed to fetch admin course progress:", err);
    res.status(500).json({ success: false, message: "Internal server error", error: String(err) });
  }
});

export default router;
