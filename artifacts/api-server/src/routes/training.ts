import { Router, type IRouter } from "express";
import { eq, desc, and, inArray } from "drizzle-orm";
import {
  db,
  candidatesTable,
  trainingAssignmentsTable,
  activityTable,
  type CandidateRow,
} from "@workspace/db";
import {
  ListTrainingCatalogResponse,
  TrainingDashboardResponse,
  ListTrainingAssignmentsResponse,
  ListTrainingAssignmentsQueryParams,
  CreateTrainingAssignmentBody,
  GetTrainingAssignmentParams,
  GetTrainingAssignmentResponse,
  UpdateTrainingAssignmentParams,
  UpdateTrainingAssignmentBody,
  UpdateTrainingAssignmentResponse,
  GetCandidateTrainingParams,
  GetCandidateTrainingResponse,
  RecommendTrainingForCandidateParams,
  RecommendTrainingForCandidateResponse,
} from "@workspace/api-zod";
import {
  TRAINING_PROGRAMS,
  TRAINERS,
  findProgramById,
  findTrainerById,
} from "../lib/training-catalog";
import {
  recommendTraining,
  buildInitialModules,
  buildInitialLiveSessions,
  applyTrainingUpdate,
  serializeTrainingAssignment,
  type LiveSessionState,
} from "../lib/training";

const router: IRouter = Router();

// ----- Catalog -----
router.get("/training/catalog", async (_req, res): Promise<void> => {
  res.json(
    ListTrainingCatalogResponse.parse({
      programs: TRAINING_PROGRAMS,
      trainers: TRAINERS,
    }),
  );
});

// ----- Recommendation -----
router.get(
  "/training/recommend/:candidateId",
  async (req, res): Promise<void> => {
    const params = RecommendTrainingForCandidateParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const [candidate] = await db
      .select()
      .from(candidatesTable)
      .where(eq(candidatesTable.id, params.data.candidateId));
    if (!candidate) {
      res.status(404).json({ error: "Candidate not found" });
      return;
    }
    const rec = recommendTraining({
      id: candidate.id,
      targetRole: candidate.targetRole,
      evaluation: candidate.evaluation,
    });
    const start = new Date();
    start.setDate(start.getDate() + 7); // suggest a 7-day kickoff window
    const target = new Date(start);
    target.setDate(target.getDate() + rec.program.durationWeeks * 7);

    res.json(
      RecommendTrainingForCandidateResponse.parse({
        candidateId: candidate.id,
        assessmentCategory: rec.assessmentCategory,
        trainingType: rec.trainingType,
        recommendedPath: rec.recommendedPath,
        program: rec.program,
        suggestedTrainer: rec.suggestedTrainer,
        suggestedStartDate: start.toISOString(),
        suggestedTargetCompletionDate: target.toISOString(),
        rationale: rec.rationale,
      }),
    );
  },
);

// ----- List assignments -----
router.get("/training/assignments", async (req, res): Promise<void> => {
  const parsed = ListTrainingAssignmentsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const f = parsed.data;
  const filters = [];
  if (f.status) filters.push(eq(trainingAssignmentsTable.status, f.status));
  if (f.trainingType)
    filters.push(eq(trainingAssignmentsTable.trainingType, f.trainingType));
  if (f.trainerId)
    filters.push(eq(trainingAssignmentsTable.trainerId, f.trainerId));

  const rows = await db
    .select()
    .from(trainingAssignmentsTable)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(trainingAssignmentsTable.updatedAt))
    .limit(200);

  // Hydrate candidate basics in a single query
  const ids = Array.from(new Set(rows.map((r) => r.candidateId)));
  const candidates = ids.length
    ? await db
        .select()
        .from(candidatesTable)
        .where(inArray(candidatesTable.id, ids))
    : [];
  const byId = new Map<string, CandidateRow>(candidates.map((c) => [c.id, c]));

  const out = rows
    .map((r) => {
      const c = byId.get(r.candidateId);
      if (!c) return null;
      return serializeTrainingAssignment(r, c);
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  res.json(ListTrainingAssignmentsResponse.parse(out));
});

// ----- Create assignment -----
router.post("/training/assignments", async (req, res): Promise<void> => {
  const body = CreateTrainingAssignmentBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const program = findProgramById(body.data.programId);
  if (!program) {
    res.status(400).json({ error: "Unknown programId" });
    return;
  }
  const trainer = findTrainerById(body.data.trainerId);
  if (!trainer) {
    res.status(400).json({ error: "Unknown trainerId" });
    return;
  }
  const [candidate] = await db
    .select()
    .from(candidatesTable)
    .where(eq(candidatesTable.id, body.data.candidateId));
  if (!candidate) {
    res.status(404).json({ error: "Candidate not found" });
    return;
  }

  const startDate = new Date(body.data.startDate);
  const targetCompletionDate = new Date(body.data.targetCompletionDate);
  const modules = buildInitialModules(program);
  const liveSessions = buildInitialLiveSessions(program, trainer, startDate);

  // Derive assessment category from program training type (single source of truth)
  const assessmentCategory =
    program.trainingType === "reskilling" ? "needs_reskilling" : "needs_upskilling";

  const [row] = await db
    .insert(trainingAssignmentsTable)
    .values({
      candidateId: candidate.id,
      assessmentCategory,
      trainingType: program.trainingType,
      programId: program.id,
      programName: program.name,
      recommendedPath: program.recommendedPath,
      deliveryMode: "hybrid",
      trainerId: trainer.id,
      trainerName: trainer.name,
      modules,
      liveSessions,
      startDate,
      targetCompletionDate,
      status: "not_started",
      progressPct: 0,
    })
    .returning();
  if (!row) {
    res.status(500).json({ error: "Failed to create assignment" });
    return;
  }

  await db.insert(activityTable).values({
    kind: "upskilling",
    candidateName: candidate.fullName,
    country: candidate.country,
    message: `${candidate.fullName} assigned to ${program.name}`,
  });

  res
    .status(201)
    .json(
      GetTrainingAssignmentResponse.parse(
        serializeTrainingAssignment(row, candidate),
      ),
    );
});

// ----- Get one -----
router.get("/training/assignments/:id", async (req, res): Promise<void> => {
  const params = GetTrainingAssignmentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db
    .select()
    .from(trainingAssignmentsTable)
    .where(eq(trainingAssignmentsTable.id, params.data.id));
  if (!row) {
    res.status(404).json({ error: "Assignment not found" });
    return;
  }
  const [candidate] = await db
    .select()
    .from(candidatesTable)
    .where(eq(candidatesTable.id, row.candidateId));
  if (!candidate) {
    res.status(404).json({ error: "Candidate not found" });
    return;
  }
  res.json(
    GetTrainingAssignmentResponse.parse(
      serializeTrainingAssignment(row, candidate),
    ),
  );
});

// ----- Patch progress -----
router.patch("/training/assignments/:id", async (req, res): Promise<void> => {
  const params = UpdateTrainingAssignmentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = UpdateTrainingAssignmentBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [current] = await db
    .select()
    .from(trainingAssignmentsTable)
    .where(eq(trainingAssignmentsTable.id, params.data.id));
  if (!current) {
    res.status(404).json({ error: "Assignment not found" });
    return;
  }

  const next = applyTrainingUpdate(current, body.data);

  const [updated] = await db
    .update(trainingAssignmentsTable)
    .set({
      modules: next.modules,
      liveSessions: next.liveSessions,
      status: next.status,
      progressPct: next.progressPct,
      finalReadinessNote: next.finalReadinessNote,
      updatedAt: new Date(),
    })
    .where(eq(trainingAssignmentsTable.id, params.data.id))
    .returning();
  if (!updated) {
    res.status(500).json({ error: "Failed to update assignment" });
    return;
  }
  const [candidate] = await db
    .select()
    .from(candidatesTable)
    .where(eq(candidatesTable.id, updated.candidateId));
  if (!candidate) {
    res.status(404).json({ error: "Candidate not found" });
    return;
  }
  res.json(
    UpdateTrainingAssignmentResponse.parse(
      serializeTrainingAssignment(updated, candidate),
    ),
  );
});

// ----- Candidate's assignment -----
router.get(
  "/candidates/:id/training",
  async (req, res): Promise<void> => {
    const params = GetCandidateTrainingParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const [row] = await db
      .select()
      .from(trainingAssignmentsTable)
      .where(eq(trainingAssignmentsTable.candidateId, params.data.id))
      .orderBy(desc(trainingAssignmentsTable.createdAt))
      .limit(1);
    if (!row) {
      res.json(GetCandidateTrainingResponse.parse(null));
      return;
    }
    const [candidate] = await db
      .select()
      .from(candidatesTable)
      .where(eq(candidatesTable.id, row.candidateId));
    if (!candidate) {
      res.json(GetCandidateTrainingResponse.parse(null));
      return;
    }
    res.json(
      GetCandidateTrainingResponse.parse(
        serializeTrainingAssignment(row, candidate),
      ),
    );
  },
);

// ----- Dashboard aggregates -----
router.get("/training/dashboard", async (_req, res): Promise<void> => {
  const allRows = await db.select().from(trainingAssignmentsTable);

  const totalInTraining = allRows.filter(
    (r) => r.status !== "completed" && r.status !== "recruiter_ready",
  ).length;
  const upskillingCount = allRows.filter(
    (r) => r.trainingType === "upskilling",
  ).length;
  const reskillingCount = allRows.filter(
    (r) => r.trainingType === "reskilling",
  ).length;
  const completedCount = allRows.filter((r) => r.status === "completed").length;
  const recruiterReadyCount = allRows.filter(
    (r) => r.status === "recruiter_ready",
  ).length;

  // Pending live sessions = scheduled sessions in the future
  const now = Date.now();
  let pendingLiveSessions = 0;
  const upcomingFlat: Array<{
    assignmentId: string;
    candidateName: string;
    sessionTitle: string;
    trainerName: string;
    scheduledFor: string;
    scheduledTs: number;
  }> = [];
  for (const r of allRows) {
    const sessions = (r.liveSessions as LiveSessionState[]) ?? [];
    for (const s of sessions) {
      if (s.status === "scheduled" && new Date(s.scheduledFor).getTime() >= now) {
        pendingLiveSessions++;
      }
    }
  }

  // Hydrate candidates for upcoming sessions
  const ids = Array.from(new Set(allRows.map((r) => r.candidateId)));
  const cands = ids.length
    ? await db
        .select()
        .from(candidatesTable)
        .where(inArray(candidatesTable.id, ids))
    : [];
  const candById = new Map(cands.map((c) => [c.id, c]));

  for (const r of allRows) {
    const c = candById.get(r.candidateId);
    if (!c) continue;
    const sessions = (r.liveSessions as LiveSessionState[]) ?? [];
    for (const s of sessions) {
      if (s.status === "scheduled" && new Date(s.scheduledFor).getTime() >= now) {
        upcomingFlat.push({
          assignmentId: r.id,
          candidateName: c.fullName,
          sessionTitle: s.title,
          trainerName: s.trainerName,
          scheduledFor: s.scheduledFor,
          scheduledTs: new Date(s.scheduledFor).getTime(),
        });
      }
    }
  }
  upcomingFlat.sort((a, b) => a.scheduledTs - b.scheduledTs);
  const upcomingLiveSessions = upcomingFlat.slice(0, 8).map((u) => ({
    assignmentId: u.assignmentId,
    candidateName: u.candidateName,
    sessionTitle: u.sessionTitle,
    trainerName: u.trainerName,
    scheduledFor: u.scheduledFor,
  }));

  // Status breakdown — include all 7 statuses, even with count 0
  const STATUSES = [
    "not_started",
    "in_progress",
    "module_completed",
    "live_session_pending",
    "assessment_pending",
    "completed",
    "recruiter_ready",
  ] as const;
  const statusBreakdown = STATUSES.map((s) => ({
    status: s,
    count: allRows.filter((r) => r.status === s).length,
  }));

  // Trainer allocation (only include trainers who have at least one assignment OR
  // who exist in the catalog so allocation cards always render)
  const trainerAllocation = TRAINERS.map((t) => {
    const mine = allRows.filter((r) => r.trainerId === t.id);
    const active = mine.filter(
      (r) => r.status !== "completed" && r.status !== "recruiter_ready",
    ).length;
    const completed = mine.filter(
      (r) => r.status === "completed" || r.status === "recruiter_ready",
    ).length;
    return {
      trainerId: t.id,
      trainerName: t.name,
      specialism: t.specialism,
      activeAssignments: active,
      completedAssignments: completed,
    };
  });

  const avgProgressPct =
    allRows.length === 0
      ? 0
      : Math.round(
          allRows.reduce((sum, r) => sum + r.progressPct, 0) / allRows.length,
        );

  res.json(
    TrainingDashboardResponse.parse({
      totalInTraining,
      upskillingCount,
      reskillingCount,
      completedCount,
      recruiterReadyCount,
      pendingLiveSessions,
      avgProgressPct,
      statusBreakdown,
      trainerAllocation,
      upcomingLiveSessions,
    }),
  );
});

export default router;
