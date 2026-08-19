import { db, userCourseProgressTable, usersTable, coursesTable, sectionsTable, subSectionsTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";

async function testQuery() {
  try {
    const courseLessonCounts = await db
      .select({
        courseId: sectionsTable.courseId,
        count: sql<number>`count(${subSectionsTable.id})::int`,
      })
      .from(subSectionsTable)
      .innerJoin(sectionsTable, eq(subSectionsTable.sectionId, sectionsTable.id))
      .groupBy(sectionsTable.courseId);

    const lessonCountMap = new Map<string, number>(
      courseLessonCounts.map((c) => [c.courseId, c.count])
    );

    const rows = await db
      .select({
        progressId: userCourseProgressTable.id,
        userId: userCourseProgressTable.userId,
        courseId: userCourseProgressTable.courseId,
        completedLessons: userCourseProgressTable.completedLessons,
        completedQuizzes: userCourseProgressTable.completedQuizzes,
        finalAssessment: userCourseProgressTable.finalAssessment,
        lastActiveLessonId: userCourseProgressTable.lastActiveLessonId,
        updatedAt: userCourseProgressTable.updatedAt,
        userName: usersTable.fullName,
        userEmail: usersTable.email,
        courseTitle: coursesTable.title,
      })
      .from(userCourseProgressTable)
      .innerJoin(usersTable, sql`${userCourseProgressTable.userId}::uuid = ${usersTable.id}`)
      .innerJoin(coursesTable, sql`${userCourseProgressTable.courseId}::uuid = ${coursesTable.id}`)
      .orderBy(desc(userCourseProgressTable.updatedAt));

    const data = rows.map((r) => {
      const completedLessonsObj = (r.completedLessons as Record<string, boolean>) || {};
      const completedCount = Object.values(completedLessonsObj).filter(Boolean).length;
      const totalLessons = lessonCountMap.get(r.courseId) || 0;
      const hasCertificate = totalLessons > 0 && completedCount === totalLessons;
      const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

      return {
        id: r.progressId,
        userId: r.userId,
        userName: r.userName || "Unknown",
        userEmail: r.userEmail || "",
        courseId: r.courseId,
        courseTitle: r.courseTitle || "Unknown Course",
        completedViews: completedCount,
        totalLessons,
        totalScore: `${progressPercent}%`,
        hasCertificate,
        certificateDate: hasCertificate ? new Date(r.updatedAt).toLocaleDateString() : null,
        certificateId: hasCertificate ? `ORN-${r.progressId.substring(0, 8).toUpperCase()}` : "",
        lastActive: r.updatedAt,
      };
    });

    console.log("Success:", data);
  } catch (err) {
    console.error("SQL Error:", err);
  }
  process.exit(0);
}

testQuery();
