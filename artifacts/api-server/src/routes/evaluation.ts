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
// import { requireAuth, requireRole } from "../lib/auth";
import { backfillEvaluation } from "../lib/serialize";

const router: IRouter = Router();

router.post(
  "/candidates/:id/evaluation",
  async (req, res): Promise<void> => {
    try {
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
        cv: row.cv as any,
      });

      await db
        .update(candidatesTable)
        .set({ evaluation: result })
        .where(eq(candidatesTable.id, row.id));

      const [updated] = await db
        .select()
        .from(candidatesTable)
        .where(eq(candidatesTable.id, row.id));

      console.log("POST Candidate ID:", row.id);
      console.log("Saved Evaluation:", updated?.evaluation);

      await db.insert(activityTable).values({
        kind: "evaluation",
        candidateName: row.fullName,
        country: row.country,
        message: `AI evaluation completed for ${row.fullName} — ${result.scores.overall}% readiness`,
      });

      res.json(result);
    } catch (error) {
      console.error("Evaluation Error:", error);

      res.status(500).json({
        error: "Failed to generate evaluation",
        details: error instanceof Error ? error.message : error,
      });
    }
  }
);

router.get(
  "/candidates/:id/evaluation",
  async (req, res): Promise<void> => {
    try {
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

      console.log("GET Candidate ID:", row.id);
      console.log("GET Evaluation:", row.evaluation);

      // Permission check removed

      if (!row.evaluation) {
        res.status(404).json({
          error: "Evaluation not yet generated",
          candidateId: row.id,
        });
        return;
      }

      res.json(row.evaluation);
    } catch (error) {
      console.error("Get Evaluation Error:", error);

      res.status(500).json({
        error: "Failed to fetch evaluation",
        details: error instanceof Error ? error.message : error,
      });
    }
  }
);

export default router;
