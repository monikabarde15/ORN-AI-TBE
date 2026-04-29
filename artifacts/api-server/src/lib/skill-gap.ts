// Required skill catalog per target role. Used by the skill-gap analysis to
// surface specific missing capabilities and recommend next-step training.

export interface SkillGapResult {
  targetRole: string;
  required: string[];
  matched: string[];
  missing: string[];
  matchPct: number;
}

const ROLE_SKILL_CATALOG: Record<string, string[]> = {
  // Engineering
  "Frontend Engineer": [
    "React",
    "TypeScript",
    "Next.js",
    "Tailwind",
    "Testing Library",
    "Accessibility",
    "Performance Optimisation",
  ],
  "Backend Engineer": [
    "Node.js",
    "PostgreSQL",
    "REST API",
    "GraphQL",
    "Redis",
    "Docker",
    "Observability",
  ],
  "Full Stack Engineer": [
    "TypeScript",
    "React",
    "Node.js",
    "PostgreSQL",
    "Docker",
    "AWS",
    "CI/CD",
  ],
  "DevOps Engineer": [
    "Kubernetes",
    "Terraform",
    "AWS",
    "CI/CD Security",
    "Cloud Security",
    "Observability",
    "Linux",
  ],
  "Cloud Architect": [
    "AWS",
    "GCP",
    "Kubernetes",
    "Terraform",
    "Cloud Security",
    "Networking",
    "Cost Optimisation",
  ],
  "Site Reliability Engineer": [
    "Kubernetes",
    "Observability",
    "Incident Response",
    "Terraform",
    "Linux",
    "SLO/SLA Design",
  ],
  "Mobile Engineer": [
    "Kotlin",
    "Swift",
    "React Native",
    "GraphQL",
    "Performance Optimisation",
    "Mobile Testing",
  ],
  "QA Engineer": [
    "Test Automation",
    "Playwright",
    "Cypress",
    "API Testing",
    "Performance Testing",
    "CI/CD",
  ],
  // Data
  "Data Engineer": [
    "Python",
    "Snowflake",
    "Databricks",
    "Airflow",
    "dbt",
    "Spark",
    "Data Modeling",
  ],
  "Data Scientist": [
    "Python",
    "Statistics",
    "Pandas",
    "scikit-learn",
    "SQL",
    "Experiment Design",
    "Visualization",
  ],
  "Machine Learning Engineer": [
    "Python",
    "PyTorch",
    "MLOps",
    "Vector Databases",
    "Kubernetes",
    "Model Evaluation",
  ],
  // Product
  "Product Manager": [
    "Discovery",
    "Roadmapping",
    "Stakeholder Communication",
    "Analytics",
    "User Research",
  ],
  "Product Designer": [
    "Figma",
    "Design Systems",
    "User Research",
    "Prototyping",
    "Accessibility",
  ],
  // Security
  "Security Engineer": [
    "AppSec",
    "Cloud Security",
    "Threat Modeling",
    "Pen Testing",
    "Cryptography",
    "Compliance",
  ],
};

const ALIASES: Record<string, string> = {
  ts: "TypeScript",
  typescript: "TypeScript",
  js: "JavaScript",
  javascript: "JavaScript",
  node: "Node.js",
  "node.js": "Node.js",
  k8s: "Kubernetes",
  postgres: "PostgreSQL",
  postgresql: "PostgreSQL",
  reactjs: "React",
  "react.js": "React",
};

function canonical(skill: string): string {
  const key = skill.trim().toLowerCase();
  return ALIASES[key] ?? skill.trim();
}

function defaultRequiredFor(targetRole: string): string[] {
  const lower = targetRole.toLowerCase();
  if (lower.includes("frontend")) return ROLE_SKILL_CATALOG["Frontend Engineer"]!;
  if (lower.includes("backend")) return ROLE_SKILL_CATALOG["Backend Engineer"]!;
  if (lower.includes("devops") || lower.includes("sre"))
    return ROLE_SKILL_CATALOG["DevOps Engineer"]!;
  if (lower.includes("cloud") || lower.includes("architect"))
    return ROLE_SKILL_CATALOG["Cloud Architect"]!;
  if (lower.includes("data engineer"))
    return ROLE_SKILL_CATALOG["Data Engineer"]!;
  if (lower.includes("data scientist"))
    return ROLE_SKILL_CATALOG["Data Scientist"]!;
  if (lower.includes("machine learning") || lower.includes("ml"))
    return ROLE_SKILL_CATALOG["Machine Learning Engineer"]!;
  if (lower.includes("mobile")) return ROLE_SKILL_CATALOG["Mobile Engineer"]!;
  if (lower.includes("qa") || lower.includes("test"))
    return ROLE_SKILL_CATALOG["QA Engineer"]!;
  if (lower.includes("product manager") || lower === "pm")
    return ROLE_SKILL_CATALOG["Product Manager"]!;
  if (lower.includes("designer")) return ROLE_SKILL_CATALOG["Product Designer"]!;
  if (lower.includes("security")) return ROLE_SKILL_CATALOG["Security Engineer"]!;
  return ROLE_SKILL_CATALOG["Full Stack Engineer"]!;
}

export function analyzeSkillGap(
  targetRole: string,
  candidateSkills: readonly string[],
): SkillGapResult {
  const required = ROLE_SKILL_CATALOG[targetRole] ?? defaultRequiredFor(targetRole);
  const have = new Set(candidateSkills.map((s) => canonical(s).toLowerCase()));
  const matched: string[] = [];
  const missing: string[] = [];
  for (const r of required) {
    if (have.has(r.toLowerCase())) matched.push(r);
    else missing.push(r);
  }
  const matchPct =
    required.length === 0
      ? 100
      : Math.round((matched.length / required.length) * 100);
  return {
    targetRole,
    required: [...required],
    matched,
    missing,
    matchPct,
  };
}

export function listKnownTargetRoles(): string[] {
  return Object.keys(ROLE_SKILL_CATALOG);
}
