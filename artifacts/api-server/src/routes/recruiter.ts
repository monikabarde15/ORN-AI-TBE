import { Router, type IRouter } from "express";
import { sql } from "drizzle-orm";
import { db, candidatesTable } from "@workspace/db";
import { RecruiterSummaryResponse } from "@workspace/api-zod";
import { requireAuth, requireRole } from "../lib/auth";

const router: IRouter = Router();

router.get("/recruiter/summary", requireAuth, requireRole("recruiter", "admin"), async (_req, res): Promise<void> => {
  const totalRow = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(candidatesTable);
  const total = totalRow[0]?.count ?? 0;

  const readyRow = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(candidatesTable)
    .where(
      sql`COALESCE((${candidatesTable.evaluation}->'scores'->>'overall')::int, 0) >= 75`,
    );
  const ready = readyRow[0]?.count ?? 0;

  const newRow = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(candidatesTable)
    .where(sql`${candidatesTable.createdAt} >= now() - interval '7 days'`);
  const newThisWeek = newRow[0]?.count ?? 0;

  const avgRow = await db
    .select({
      avg: sql<number>`COALESCE(AVG((${candidatesTable.evaluation}->'scores'->>'overall')::int), 0)::int`,
    })
    .from(candidatesTable);
  const avgReadiness = avgRow[0]?.avg ?? 0;

  const countryRows = await db
    .select({
      country: candidatesTable.country,
      count: sql<number>`count(*)::int`,
      avgReadiness: sql<number>`COALESCE(AVG((${candidatesTable.evaluation}->'scores'->>'overall')::int), 0)::int`,
    })
    .from(candidatesTable)
    .groupBy(candidatesTable.country)
    .orderBy(sql`count(*) DESC`);

  const roleRows = await db
    .select({
      role: candidatesTable.targetRole,
      count: sql<number>`count(*)::int`,
    })
    .from(candidatesTable)
    .groupBy(candidatesTable.targetRole)
    .orderBy(sql`count(*) DESC`)
    .limit(8);

  res.json(
    RecruiterSummaryResponse.parse({
      totalCandidates: total,
      readyCandidates: ready,
      newThisWeek,
      avgReadiness,
      countryBreakdown: countryRows,
      topRoles: roleRows,
    }),
  );
});

router.post(
  "/recruiter/ai-search",
  requireAuth,
  requireRole("recruiter", "admin"),
  async (req, res): Promise<void> => {
    try {
      const { query } = req.body;

      if (!query || !String(query).trim()) {
        res.status(400).json({
          success: false,
          message: "Search query is required",
        });
        return;
      }

      const text = String(query).trim().toLowerCase();

      const stopWords = [
        "i",
        "am",
        "im",
        "i'm",
        "me",
        "my",
        "want",
        "need",
        "looking",
        "look",
        "search",
        "searching",
        "find",
        "finding",
        "show",
        "give",
        "please",
        "for",
        "with",
        "who",
        "has",
        "having",
        "a",
        "an",
        "the",
        "of",
        "to",
        "in",
        "on",
        "at",
        "from",
        "candidate",
        "candidates",
      ];

      const keywords = text
        .replace(/[^\w\s]/g, " ")
        .split(/\s+/)
        .filter(Boolean)
        .filter((word) => !stopWords.includes(word));

      const candidates = await db
        .select()
        .from(candidatesTable);

      const result = candidates.filter((candidate) => {
        const overall =
          (candidate.evaluation as any)?.scores?.overall ?? "";

        const searchable = [
          candidate.fullName,
          candidate.email,
          candidate.phone,
          candidate.country,
          candidate.currentLocation,
          candidate.currentRole,
          candidate.preferredRole,
          candidate.targetRole,
          candidate.visaStatus,
          candidate.englishLevel,
          candidate.linkedinUrl,
          candidate.lastRole ?? "",
          candidate.domain ?? "",
          String(candidate.yearsExperience),
          String(candidate.careerGapMonths),
          String(overall),
          ...(candidate.skills ?? []),
        ]
          .join(" ")
          .toLowerCase();

        if (keywords.length === 0) return true;

        let score = 0;

        keywords.forEach((word) => {
          if (candidate.fullName.toLowerCase().includes(word))
            score += 10;

          if (candidate.targetRole.toLowerCase().includes(word))
            score += 8;

          if (candidate.currentRole.toLowerCase().includes(word))
            score += 7;

          if (candidate.preferredRole.toLowerCase().includes(word))
            score += 7;

          if (candidate.country.toLowerCase().includes(word))
            score += 6;

          if (candidate.currentLocation.toLowerCase().includes(word))
            score += 6;

          if (candidate.englishLevel.toLowerCase().includes(word))
            score += 5;

          if (
            candidate.skills.some((skill) =>
              skill.toLowerCase().includes(word)
            )
          )
            score += 8;

          if (
            String(candidate.yearsExperience).includes(word)
          )
            score += 5;

          if (searchable.includes(word))
            score += 2;
        });

        (candidate as any).__score = score;

        return score > 0;
      });

      result.sort(
        (a: any, b: any) =>
          (b.__score ?? 0) - (a.__score ?? 0)
      );

      res.json({
        success: true,
        total: result.length,
        data: result,
      });

    } catch (error) {
      console.error("AI Search Error:", error);

      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
);

export default router;
