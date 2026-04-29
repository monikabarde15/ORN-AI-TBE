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

export default router;
