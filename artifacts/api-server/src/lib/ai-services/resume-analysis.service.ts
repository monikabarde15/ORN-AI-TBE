import { getAIProvider } from "../ai/factory";
import type { ResumeAnalysis } from "../ai";
import { SKILL_POOL } from "../regions";

const DOMAINS = [
  "Fintech",
  "Healthcare",
  "E-commerce",
  "SaaS",
  "Banking",
  "Telecom",
  "Insurance",
  "Logistics",
  "Gaming",
  "EdTech",
  "Cybersecurity",
];

const SKILL_ALIASES: Record<string, string> = {
  reactjs: "React",
  react: "React",
  ts: "TypeScript",
  typescript: "TypeScript",
  js: "JavaScript",
  javascript: "JavaScript",
  node: "Node.js",
  nodejs: "Node.js",
  next: "Next.js",
  nextjs: "Next.js",
};

export async function analyzeResume(
  resumeText: string,
): Promise<ResumeAnalysis> {
  const provider = getAIProvider();

  const result = await provider.analyzeResume(resumeText);

  return normalize(result);
}

function normalize(data: ResumeAnalysis): ResumeAnalysis {
  return {
    fullName: normalizeString(data.fullName),

    email: normalizeString(data.email),

    phone: normalizeString(data.phone),

    location: normalizeString(data.location),

    yearsExperience: normalizeYears(
      data.yearsExperience,
    ),

    lastRole: normalizeString(data.lastRole),

    domain: normalizeDomain(data.domain),

    careerGapMonths: 0,

    skills: normalizeSkills(data.skills),

    rawText: "",
  };
}

function normalizeString(
  value: string | null,
): string | null {
  if (!value) return null;

  const trimmed = value.trim();

  return trimmed.length ? trimmed : null;
}

function normalizeYears(
  years: number | null,
): number | null {
  if (years == null) return null;

  if (Number.isNaN(years)) return null;

  return Math.max(0, Math.min(40, Math.round(years)));
}

function normalizeDomain(
  domain: string | null,
): string | null {
  if (!domain) return null;

  const found = DOMAINS.find(
    d => d.toLowerCase() === domain.toLowerCase(),
  );

  return found ?? null;
}

function normalizeSkills(
  skills: string[],
): string[] {
  const found = new Set<string>();

  for (const skill of skills ?? []) {
    const lower = skill.trim().toLowerCase();

    const normalized =
      SKILL_ALIASES[lower] ?? skill.trim();

    const official =
      SKILL_POOL.find(
        s =>
          s.toLowerCase() ===
          normalized.toLowerCase(),
      ) ?? normalized;

    found.add(official);
  }

  return [...found].sort();
}