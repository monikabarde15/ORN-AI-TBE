import type { CandidateRow, ActivityRow } from "@workspace/db";

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
    evaluation: row.evaluation ?? null,
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
