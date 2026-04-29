import type { TrainingAssignmentRow, CandidateRow } from "@workspace/db";
import {
  TRAINING_PROGRAMS,
  defaultTrainerForProgram,
  findProgramById,
  findTrainerById,
  type TrainingProgramDef,
  type TrainerDef,
} from "./training-catalog";

// ---- Types that mirror the OpenAPI shapes ----

export interface ModuleState {
  id: string;
  title: string;
  durationMinutes: number;
  status: "not_started" | "in_progress" | "completed" | "assessment_pending";
}

export interface LiveSessionState {
  id: string;
  title: string;
  scheduledFor: string;
  trainerName: string;
  status: "scheduled" | "completed" | "cancelled";
}

export type TrainingStatus =
  | "not_started"
  | "in_progress"
  | "module_completed"
  | "live_session_pending"
  | "assessment_pending"
  | "completed"
  | "recruiter_ready";

// ---- Recommendation logic ----

export interface RecommendationResult {
  assessmentCategory: "needs_upskilling" | "needs_reskilling";
  trainingType: "upskilling" | "reskilling";
  recommendedPath: string;
  program: TrainingProgramDef;
  suggestedTrainer: TrainerDef;
  rationale: string;
}

interface MinCandidate {
  id: string;
  targetRole: string;
  evaluation: unknown;
}

interface EvalScores {
  overall: number;
  englishReadiness: number;
  technicalSkillMatch: number;
  europeJobReadiness: number;
  upskillingNeeds: number;
}

function readScores(candidate: MinCandidate): EvalScores | null {
  const e = candidate.evaluation as
    | { scores?: Partial<EvalScores> }
    | null
    | undefined;
  const s = e?.scores;
  if (
    !s ||
    typeof s.overall !== "number" ||
    typeof s.englishReadiness !== "number" ||
    typeof s.technicalSkillMatch !== "number" ||
    typeof s.europeJobReadiness !== "number" ||
    typeof s.upskillingNeeds !== "number"
  ) {
    return null;
  }
  return s as EvalScores;
}

/**
 * Decide what kind of transformation a candidate needs.
 *
 * Heuristic (transparent on the UI):
 *  - reskilling: candidate's role doesn't match their evaluation strength
 *    (low technical match + high upskilling need) — they need a track change.
 *  - upskilling: candidate is on the right track but has a specific gap.
 */
export function recommendTraining(
  candidate: MinCandidate,
): RecommendationResult {
  const scores = readScores(candidate);
  const role = (candidate.targetRole ?? "").toLowerCase();

  // Reskilling triggers: weak technical AND high upskilling need (career pivot).
  const needsReskilling =
    !!scores &&
    scores.technicalSkillMatch < 60 &&
    scores.upskillingNeeds > 55;

  let program: TrainingProgramDef;
  let rationale: string;

  if (needsReskilling) {
    // Match a reskilling track from role hints; default to data engineering.
    if (role.includes("data") || role.includes("analyst")) {
      program = findProgramById("prog_data_engineering")!;
      rationale =
        "Strong analytical signal but limited stack depth — Data Engineering reskilling closes the production-engineering gap.";
    } else if (role.includes("ml") || role.includes("ai") || role.includes("machine")) {
      program = findProgramById("prog_ai_ml_bridge")!;
      rationale =
        "Aspirational AI/ML target with foundational gaps — the ML Practitioner Bridge is the canonical reskilling path.";
    } else {
      program = findProgramById("prog_data_engineering")!;
      rationale =
        "Career repositioning recommended: Data Engineering Bridge gives the highest EU placement uplift for this profile.";
    }
  } else if (scores && scores.englishReadiness < 65) {
    program = findProgramById("prog_eu_workplace_english")!;
    rationale =
      "Technical fundamentals are in place; the binding constraint is workplace English for EU placement.";
  } else if (scores && scores.europeJobReadiness < 65) {
    program = findProgramById("prog_eu_compliance")!;
    rationale =
      "Strong technical and language profile; EU Workplace Readiness covers the remaining compliance & onboarding gap.";
  } else if (
    scores &&
    scores.technicalSkillMatch < 75 &&
    (role.includes("devops") ||
      role.includes("cloud") ||
      role.includes("backend") ||
      role.includes("software") ||
      role.includes("full"))
  ) {
    program = findProgramById("prog_cloud_devops")!;
    rationale =
      "Cloud-native gaps are the fastest closeable; this track typically lifts overall readiness by 18-25 points.";
  } else if (
    scores &&
    scores.overall >= 75 &&
    candidateIsSenior(candidate)
  ) {
    program = findProgramById("prog_leadership")!;
    rationale =
      "Recruiter-ready profile with senior signal — Leadership track maximizes placement comp band.";
  } else {
    program = findProgramById("prog_cloud_devops")!;
    rationale =
      "Default upskilling path for general engineering profiles with mid-tier readiness.";
  }

  const trainingType = program.trainingType;
  const assessmentCategory =
    trainingType === "reskilling" ? "needs_reskilling" : "needs_upskilling";
  const trainer = defaultTrainerForProgram(program.id);

  return {
    assessmentCategory,
    trainingType,
    recommendedPath: program.recommendedPath,
    program,
    suggestedTrainer: trainer,
    rationale,
  };
}

function candidateIsSenior(c: MinCandidate): boolean {
  // We don't have yearsExperience on MinCandidate; rely on role hint as a proxy.
  const r = c.targetRole.toLowerCase();
  return r.includes("senior") || r.includes("lead") || r.includes("architect");
}

// ---- Build modules + live sessions from a program template ----

export function buildInitialModules(program: TrainingProgramDef): ModuleState[] {
  return program.moduleTemplates.map((m, i) => ({
    id: `${program.id}_m${i + 1}`,
    title: m.title,
    durationMinutes: m.durationMinutes,
    status: "not_started" as const,
  }));
}

export function buildInitialLiveSessions(
  program: TrainingProgramDef,
  trainer: TrainerDef,
  startDate: Date,
): LiveSessionState[] {
  // Two live sessions per program at evenly-spaced milestones.
  const total = 3;
  const span = program.durationWeeks * 7 * 24 * 3600 * 1000;
  return Array.from({ length: total }, (_, i) => {
    const at = new Date(
      startDate.getTime() + (span * (i + 1)) / (total + 1),
    );
    return {
      id: `${program.id}_ls${i + 1}`,
      title:
        i === 0
          ? "Live Trainer Kickoff & Path Calibration"
          : i === total - 1
            ? "Final Readiness Review with Trainer"
            : `Live Workshop — ${program.focusAreas[i % program.focusAreas.length] ?? "Working Session"}`,
      scheduledFor: at.toISOString(),
      trainerName: trainer.name,
      status: "scheduled" as const,
    };
  });
}

// ---- Apply progress updates to modules / sessions / status ----

interface UpdateInput {
  status?: TrainingStatus;
  progressPct?: number;
  moduleId?: string;
  moduleStatus?: ModuleState["status"];
  liveSessionId?: string;
  liveSessionStatus?: LiveSessionState["status"];
  finalReadinessNote?: string;
}

export function applyTrainingUpdate(
  current: TrainingAssignmentRow,
  input: UpdateInput,
): {
  modules: ModuleState[];
  liveSessions: LiveSessionState[];
  status: TrainingStatus;
  progressPct: number;
  finalReadinessNote: string | null;
} {
  const modules = (current.modules as ModuleState[]).map((m) =>
    input.moduleId && m.id === input.moduleId && input.moduleStatus
      ? { ...m, status: input.moduleStatus }
      : m,
  );
  const liveSessions = (current.liveSessions as LiveSessionState[]).map((s) =>
    input.liveSessionId && s.id === input.liveSessionId && input.liveSessionStatus
      ? { ...s, status: input.liveSessionStatus }
      : s,
  );

  const completedModules = modules.filter((m) => m.status === "completed").length;
  const computedPct =
    modules.length === 0
      ? 0
      : Math.round((completedModules / modules.length) * 100);
  const progressPct =
    typeof input.progressPct === "number" ? input.progressPct : computedPct;

  // Status: explicit input wins (e.g. trainer review → completed, promote to
  // recruiter_ready). Otherwise derive from module/session state — but never
  // auto-jump past trainer review. 100% modules with all live sessions done
  // lands the assignment in assessment_pending (awaiting trainer sign-off).
  let status: TrainingStatus;
  const hasScheduledLiveSession = liveSessions.some((s) => s.status === "scheduled");
  const allModulesDone = modules.length > 0 && completedModules === modules.length;
  const terminal: TrainingStatus[] = ["completed", "recruiter_ready"];

  if (input.status) {
    status = input.status;
  } else if (terminal.includes(current.status as TrainingStatus)) {
    // Don't regress out of terminal states from passive updates.
    status = current.status as TrainingStatus;
  } else if (allModulesDone && !hasScheduledLiveSession) {
    status = "assessment_pending";
  } else if (modules.some((m) => m.status === "assessment_pending")) {
    status = "assessment_pending";
  } else if (
    hasScheduledLiveSession &&
    liveSessions.some(
      (s) =>
        s.status === "scheduled" &&
        new Date(s.scheduledFor).getTime() < Date.now() + 7 * 24 * 3600 * 1000,
    )
  ) {
    status = "live_session_pending";
  } else if (modules.some((m) => m.status === "completed")) {
    status = "module_completed";
  } else if (modules.some((m) => m.status === "in_progress")) {
    status = "in_progress";
  } else {
    status = current.status as TrainingStatus;
  }

  const finalReadinessNote =
    input.finalReadinessNote ?? current.finalReadinessNote ?? null;

  return { modules, liveSessions, status, progressPct, finalReadinessNote };
}

// ---- Serialize for JSON / OpenAPI ----

export function serializeTrainingAssignment(
  row: TrainingAssignmentRow,
  candidate: Pick<
    CandidateRow,
    "fullName" | "country" | "avatarUrl" | "targetRole"
  >,
) {
  return {
    id: row.id,
    candidateId: row.candidateId,
    candidateName: candidate.fullName,
    candidateCountry: candidate.country,
    candidateAvatarUrl: candidate.avatarUrl,
    candidateTargetRole: candidate.targetRole,
    assessmentCategory: row.assessmentCategory,
    trainingType: row.trainingType,
    programId: row.programId,
    programName: row.programName,
    recommendedPath: row.recommendedPath,
    deliveryMode: row.deliveryMode,
    trainerId: row.trainerId,
    trainerName: row.trainerName,
    modules: row.modules as ModuleState[],
    liveSessions: row.liveSessions as LiveSessionState[],
    startDate: row.startDate.toISOString(),
    targetCompletionDate: row.targetCompletionDate.toISOString(),
    status: row.status,
    progressPct: row.progressPct,
    finalReadinessNote: row.finalReadinessNote ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export { TRAINING_PROGRAMS, findProgramById, findTrainerById, defaultTrainerForProgram };
