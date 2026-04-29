import { Router, type IRouter } from "express";
import { sql, desc } from "drizzle-orm";
import { db, candidatesTable, activityTable } from "@workspace/db";
import {
  AdminPipelineResponse,
  AdminActivityResponse,
} from "@workspace/api-zod";
import { REGIONS, UPSKILLING_AREAS } from "../lib/regions";
import { serializeActivity } from "../lib/serialize";

const router: IRouter = Router();

router.get("/admin/pipeline", async (_req, res): Promise<void> => {
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

router.get("/admin/activity", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(activityTable)
    .orderBy(desc(activityTable.timestamp))
    .limit(20);
  res.json(AdminActivityResponse.parse(rows.map(serializeActivity)));
});

export default router;
