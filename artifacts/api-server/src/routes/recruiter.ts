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
          const role = (
            candidate.targetRole ||
            candidate.currentRole ||
            candidate.preferredRole ||
            ""
          ).toLowerCase();

          const experience = candidate.yearsExperience ?? 0;

          let roleMatch = true;
          let expMatch = true;

          // Role detection
          if (text.includes("full stack")) {
            roleMatch = role.includes("full stack");
          } else if (text.includes("react")) {
            roleMatch = role.includes("react");
          } else if (text.includes("frontend")) {
            roleMatch = role.includes("front");
          } else if (text.includes("backend")) {
            roleMatch = role.includes("back");
          } else if (text.includes("devops")) {
            roleMatch = role.includes("devops");
          } else if (text.includes("java")) {
            roleMatch = role.includes("java");
          } else if (text.includes("python")) {
            roleMatch = role.includes("python");
          }

          // Experience detection
          const exp = text.match(/(\d+)\s*year/);

          if (exp) {
            expMatch = experience === Number(exp[1]);
          }

          return roleMatch && expMatch;
      });

      result.sort(
        (a: any, b: any) =>
          (b.__score ?? 0) - (a.__score ?? 0)
      );

      const response = result.map((candidate: any) => ({
          id: candidate.id,
          fullName: candidate.fullName,
          email: candidate.email,
          phone: candidate.phone,
          currentRole: candidate.currentRole,
          preferredRole: candidate.preferredRole,
          targetRole: candidate.targetRole,
          yearsExperience: candidate.yearsExperience,
          skills: candidate.skills,
          country: candidate.country,
          currentLocation: candidate.currentLocation,
          evaluation: candidate.evaluation,
          availability: candidate.availability,
          expectedSalary: candidate.expectedSalary,
        }));

      res.json({
        success: true,
        total: response.length,
        data: response,
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
