import type {
  CandidateRow,
  ActivityRow,
  ProjectRow,
  AuditLogRow,
} from "@workspace/db";
import { analyzeSkillGap } from "./skill-gap";

export function backfillEvaluation(
  evaluation: CandidateRow["evaluation"],
  candidate: CandidateRow,
): CandidateRow["evaluation"] {
  if (!evaluation) return evaluation;
  const ev = evaluation as Record<string, unknown>;
  const s = ((ev.scores ?? {}) as Record<string, number | undefined>);
  const careerGapMonths = candidate.careerGapMonths ?? 0;
  const technicalRelevance = s.technicalRelevance ?? s.technicalSkillMatch ?? 0;
  const technicalSkillMatch = s.technicalSkillMatch ?? technicalRelevance;
  const upskillingNeeds = s.upskillingNeeds ?? 0;
  const marketReadiness =
    s.marketReadiness ?? Math.max(0, 100 - upskillingNeeds);
  const careerGapRisk =
    s.careerGapRisk ?? Math.min(100, Math.max(0, careerGapMonths * 6));
  const overall = s.overall ?? 0;
  const englishReadiness = s.englishReadiness ?? 0;
  const europeJobReadiness = s.europeJobReadiness ?? 0;

  const skillGap =
    (ev.skillGap as ReturnType<typeof analyzeSkillGap> | undefined) ??
    analyzeSkillGap(candidate.targetRole, candidate.skills ?? []);

  let classification = ev.classification as
    | "recruiter_ready"
    | "needs_upskilling"
    | "needs_reskilling"
    | "not_ready_yet"
    | undefined;
  if (!classification) {
    if (careerGapMonths > 24) classification = "needs_reskilling";
    else if (
      overall >= 80 &&
      technicalRelevance >= 75 &&
      europeJobReadiness >= 70 &&
      englishReadiness >= 70
    )
      classification = "recruiter_ready";
    else if (overall >= 60 && technicalRelevance >= 55)
      classification = "needs_upskilling";
    else classification = "not_ready_yet";
  }

  return {
    ...evaluation,
    scores: {
      cvQuality: s.cvQuality ?? 0,
      technicalSkillMatch,
      technicalRelevance,
      englishReadiness,
      europeJobReadiness,
      marketReadiness,
      careerGapRisk,
      upskillingNeeds,
      overall,
    },
    classification,
    skillGap,
  } as CandidateRow["evaluation"];
}

export function serializeCandidate(row: CandidateRow) {
  return {
    id: row.id,
    fullName: row.fullName,
    email: row.email,
    phone: row.phone,
    country: row.country,
    targetRole: row.targetRole,
    yearsExperience: row.yearsExperience,
    visaStatus: row.visaStatus,
    englishLevel: row.englishLevel,
    euWorkEligible: row.euWorkEligible,
    linkedinUrl: row.linkedinUrl,
    avatarUrl: row.avatarUrl,
    skills: row.skills ?? [],
    createdAt: row.createdAt.toISOString(),
    cv: row.cv ?? null,
    evaluation: backfillEvaluation(row.evaluation, row),
    source: (row.source ?? "direct") as "direct" | "recruiter",
    lastRole: row.lastRole ?? null,
    domain: row.domain ?? null,
    careerGapMonths: row.careerGapMonths ?? 0,
    isShortlisted: row.isShortlisted ?? false,
    isClientReady: row.isClientReady ?? false,
    isIndustryReady: row.isIndustryReady ?? false,
    hasCvFile: !!row.cvFileBytes,
  };
}

export function serializeActivity(row: ActivityRow) {
  return {
    id: row.id,
    kind: row.kind,
    candidateName: row.candidateName,
    country: row.country,
    message: row.message,
    timestamp: row.timestamp.toISOString(),
  };
}

export function serializeProject(row: ProjectRow) {
  return {
    id: row.id,
    candidateId: row.candidateId,
    name: row.name,
    techStack: row.techStack ?? [],
    durationWeeks: row.durationWeeks,
    status: row.status as "in_progress" | "completed" | "cancelled",
    feedback: row.feedback ?? null,
    startDate: row.startDate.toISOString(),
    endDate: row.endDate ? row.endDate.toISOString() : null,
    createdAt: row.createdAt.toISOString(),
  };
}

export function serializeAuditLog(row: AuditLogRow) {
  return {
    id: row.id,
    actorUserId: row.actorUserId ?? null,
    actorEmail: row.actorEmail ?? null,
    actorRole: row.actorRole ?? null,
    action: row.action,
    entityType: row.entityType ?? null,
    entityId: row.entityId ?? null,
    metadata: (row.metadata ?? {}) as Record<string, unknown>,
    createdAt: row.createdAt.toISOString(),
  };
}
