import { REGIONS, SKILL_POOL, UPSKILLING_AREAS } from "./regions";

const ENGLISH_SCORE: Record<string, number> = {
  A1: 28,
  A2: 42,
  B1: 60,
  B2: 76,
  C1: 89,
  C2: 96,
};

const VISA_BONUS: Record<string, number> = {
  eu_citizen: 18,
  blue_card: 12,
  work_permit: 8,
  student_visa: 4,
  requires_sponsorship: -6,
};

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function clamp(n: number, lo = 0, hi = 100): number {
  return Math.min(hi, Math.max(lo, Math.round(n)));
}

export interface CandidateLike {
  id: string;
  fullName: string;
  email: string;
  englishLevel: string;
  visaStatus: string;
  yearsExperience: number;
  euWorkEligible: boolean;
  targetRole: string;
  country: string;
  skills?: string[] | null;
  cv?: { fileName?: string; contentSummary?: string } | null;
}

export interface EvaluationScores {
  cvQuality: number;
  technicalSkillMatch: number;
  englishReadiness: number;
  europeJobReadiness: number;
  upskillingNeeds: number;
  overall: number;
}

export interface EvaluationInsight {
  title: string;
  detail: string;
  severity: "strength" | "opportunity" | "gap";
}

export interface EvaluationResult {
  candidateId: string;
  evaluatedAt: string;
  scores: EvaluationScores;
  strengths: string[];
  gaps: string[];
  recommendedUpskilling: string[];
  insights: EvaluationInsight[];
  readinessTier: "emerging" | "developing" | "ready" | "elite";
}

export function pickSkillsFor(role: string, seed: number): string[] {
  const focus: string[] = [];
  const lower = role.toLowerCase();
  if (lower.includes("frontend") || lower.includes("designer"))
    focus.push("React", "TypeScript", "Next.js", "Tailwind", "Figma");
  if (lower.includes("backend"))
    focus.push("Node.js", "PostgreSQL", "Go", "Kafka", "Redis");
  if (lower.includes("data") || lower.includes("machine") || lower.includes("ml"))
    focus.push("Python", "PyTorch", "Snowflake", "Databricks", "MLOps");
  if (lower.includes("devops") || lower.includes("cloud") || lower.includes("architect"))
    focus.push("Kubernetes", "Terraform", "AWS", "GCP", "CI/CD");
  if (lower.includes("mobile")) focus.push("Kotlin", "TypeScript", "GraphQL");
  if (lower.includes("full") || lower.includes("software"))
    focus.push("TypeScript", "React", "Node.js", "PostgreSQL", "AWS");

  const pool = focus.length > 0 ? focus : SKILL_POOL;
  const out = new Set<string>();
  let cursor = seed;
  while (out.size < Math.min(6, pool.length)) {
    cursor = (cursor * 1103515245 + 12345) & 0x7fffffff;
    out.add(pool[cursor % pool.length]!);
  }
  return Array.from(out);
}

export function evaluate(candidate: CandidateLike): EvaluationResult {
  const seed = hashSeed(candidate.id + candidate.email);
  const noise = (n: number) => ((seed >> n) & 0x1f) - 15; // -15..16

  const cvQuality = clamp(
    62 +
      Math.min(20, candidate.yearsExperience * 1.5) +
      (candidate.cv ? 8 : -10) +
      noise(2),
  );
  const technicalSkillMatch = clamp(
    55 + Math.min(30, candidate.yearsExperience * 2.2) + noise(4),
  );
  const englishReadiness = clamp(
    (ENGLISH_SCORE[candidate.englishLevel] ?? 50) + noise(6) / 2,
  );
  const europeJobReadiness = clamp(
    (candidate.euWorkEligible ? 70 : 45) +
      (VISA_BONUS[candidate.visaStatus] ?? 0) +
      Math.min(15, candidate.yearsExperience) +
      noise(8) / 2,
  );
  const upskillingNeeds = clamp(
    100 -
      (technicalSkillMatch * 0.45 + englishReadiness * 0.35 + cvQuality * 0.2),
  );
  const overall = clamp(
    cvQuality * 0.18 +
      technicalSkillMatch * 0.32 +
      englishReadiness * 0.18 +
      europeJobReadiness * 0.22 +
      (100 - upskillingNeeds) * 0.1,
  );

  const tier: EvaluationResult["readinessTier"] =
    overall >= 88
      ? "elite"
      : overall >= 75
        ? "ready"
        : overall >= 60
          ? "developing"
          : "emerging";

  const strengths: string[] = [];
  const gaps: string[] = [];

  if (technicalSkillMatch >= 75)
    strengths.push(`Strong technical alignment with ${candidate.targetRole}`);
  if (englishReadiness >= 80)
    strengths.push(`Professional English proficiency (${candidate.englishLevel})`);
  if (europeJobReadiness >= 80)
    strengths.push("EU work-ready with clear authorization path");
  if (candidate.yearsExperience >= 5)
    strengths.push(`${candidate.yearsExperience} years of relevant experience`);
  if (cvQuality >= 78)
    strengths.push("Well-structured CV with quantified outcomes");

  if (englishReadiness < 65)
    gaps.push("English fluency below the threshold for client-facing roles");
  if (europeJobReadiness < 60)
    gaps.push("Visa or work-authorization friction for EU placement");
  if (technicalSkillMatch < 65)
    gaps.push("Core technical stack needs deeper hands-on coverage");
  if (cvQuality < 65)
    gaps.push("CV lacks measurable outcomes and recent project depth");
  if (upskillingNeeds > 60)
    gaps.push("Significant upskilling required before recruiter shortlist");

  if (strengths.length === 0)
    strengths.push("Open to a structured upskilling track");
  if (gaps.length === 0) gaps.push("No critical placement blockers identified");

  const recommendedUpskilling: string[] = [];
  if (englishReadiness < 80) recommendedUpskilling.push(UPSKILLING_AREAS[0]!);
  if (europeJobReadiness < 75) recommendedUpskilling.push(UPSKILLING_AREAS[1]!);
  if (technicalSkillMatch < 80) recommendedUpskilling.push(UPSKILLING_AREAS[3]!);
  if (upskillingNeeds > 50) recommendedUpskilling.push(UPSKILLING_AREAS[4]!);
  if (candidate.yearsExperience >= 7 && overall >= 75)
    recommendedUpskilling.push(UPSKILLING_AREAS[6]!);
  if (recommendedUpskilling.length === 0)
    recommendedUpskilling.push(UPSKILLING_AREAS[5]!);

  const region =
    REGIONS.find((r) => r.name === candidate.country) ?? REGIONS[0]!;

  const insights: EvaluationInsight[] = [
    {
      title: "Market positioning",
      detail: `${candidate.targetRole} talent from ${region.name} is in active demand across DACH and Nordics, with median time-to-shortlist of 9 days.`,
      severity: technicalSkillMatch >= 75 ? "strength" : "opportunity",
    },
    {
      title: "Compensation band",
      detail: `Estimated EU-remote band: €${(45 + Math.round(overall / 2)).toLocaleString()}k - €${(60 + Math.round(overall * 0.9)).toLocaleString()}k base, depending on role seniority.`,
      severity: "strength",
    },
    {
      title: "Time-to-ready",
      detail:
        upskillingNeeds > 55
          ? "8-12 weeks of structured upskilling will lift this candidate into the recruiter-shortlist tier."
          : "Ready for recruiter shortlist within 7 days following CV calibration.",
      severity: upskillingNeeds > 55 ? "gap" : "strength",
    },
  ];

  return {
    candidateId: candidate.id,
    evaluatedAt: new Date().toISOString(),
    scores: {
      cvQuality,
      technicalSkillMatch,
      englishReadiness,
      europeJobReadiness,
      upskillingNeeds,
      overall,
    },
    strengths,
    gaps,
    recommendedUpskilling,
    insights,
    readinessTier: tier,
  };
}
