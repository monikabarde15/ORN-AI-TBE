import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, candidatesTable, activityTable } from "@workspace/db";
import {
  RunEvaluationParams,
  RunEvaluationResponse,
  GetEvaluationParams,
  GetEvaluationResponse,
} from "@workspace/api-zod";
import { evaluate } from "../lib/evaluation";
import { requireAuth, requireRole } from "../lib/auth";
import { backfillEvaluation } from "../lib/serialize";

const router: IRouter = Router();

router.post("/candidates/:id/evaluation", requireAuth, requireRole("recruiter", "admin"), async (req, res): Promise<void> => {
  const params = RunEvaluationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db
    .select()
    .from(candidatesTable)
    .where(eq(candidatesTable.id, params.data.id));
  if (!row) {
    res.status(404).json({ error: "Candidate not found" });
    return;
  }

  const result = evaluate({
    id: row.id,
    fullName: row.fullName,
    email: row.email,
    englishLevel: row.englishLevel,
    visaStatus: row.visaStatus,
    yearsExperience: row.yearsExperience,
    euWorkEligible: row.euWorkEligible,
    targetRole: row.targetRole,
    country: row.country,
    skills: row.skills,
    careerGapMonths: row.careerGapMonths ?? 0,
    cv: row.cv as { fileName?: string; contentSummary?: string } | null,
  });

  await db
    .update(candidatesTable)
    .set({ evaluation: result })
    .where(eq(candidatesTable.id, row.id));

  await db.insert(activityTable).values({
    kind: "evaluation",
    candidateName: row.fullName,
    country: row.country,
    message: `AI evaluation completed for ${row.fullName} — ${result.scores.overall}% readiness`,
  });

  res.json(RunEvaluationResponse.parse(result));
});

router.get("/candidates/:id/evaluation", requireAuth, async (req, res): Promise<void> => {
  const params = GetEvaluationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db
    .select()
    .from(candidatesTable)
    .where(eq(candidatesTable.id, params.data.id));
  if (!row) {
    res.status(404).json({ error: "Candidate not found" });
    return;
  }
  if (
    req.user!.role === "candidate" &&
    req.user!.candidateId !== row.id
  ) {
    res.status(403).json({ error: "Insufficient permissions" });
    return;
  }
  if (!row.evaluation) {
    res.status(404).json({ error: "Evaluation not yet generated" });
    return;
  }
  res.json(GetEvaluationResponse.parse(backfillEvaluation(row.evaluation, row)));
});

export default router;
