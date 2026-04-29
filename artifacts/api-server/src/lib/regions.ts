export interface RegionDef {
  code: string;
  name: string;
  phase: number;
  flag: string;
}

export const REGIONS: RegionDef[] = [
  { code: "RO", name: "Romania", phase: 1, flag: "RO" },
  { code: "CZ", name: "Czechia", phase: 1, flag: "CZ" },
  { code: "HU", name: "Hungary", phase: 1, flag: "HU" },
  { code: "PL", name: "Poland", phase: 1, flag: "PL" },
  { code: "SK", name: "Slovakia", phase: 1, flag: "SK" },
  { code: "BG", name: "Bulgaria", phase: 1, flag: "BG" },
  { code: "RS", name: "Serbia", phase: 1, flag: "RS" },
  { code: "HR", name: "Croatia", phase: 1, flag: "HR" },
  { code: "IT", name: "Italy", phase: 2, flag: "IT" },
  { code: "ES", name: "Spain", phase: 2, flag: "ES" },
  { code: "PT", name: "Portugal", phase: 2, flag: "PT" },
  { code: "GR", name: "Greece", phase: 2, flag: "GR" },
];

export const ROLES = [
  "Software Engineer",
  "Frontend Engineer",
  "Backend Engineer",
  "Full-Stack Engineer",
  "Data Engineer",
  "Data Scientist",
  "Machine Learning Engineer",
  "DevOps Engineer",
  "Cloud Architect",
  "Cybersecurity Analyst",
  "Product Manager",
  "Product Designer",
  "UX Researcher",
  "QA Engineer",
  "Mobile Engineer",
  "Solutions Architect",
  "Customer Success Manager",
  "Technical Recruiter",
  "Operations Manager",
  "Business Analyst",
];

export const SKILL_POOL = [
  "TypeScript",
  "Python",
  "React",
  "Node.js",
  "Go",
  "Rust",
  "Java",
  "Kotlin",
  "Kubernetes",
  "Docker",
  "AWS",
  "GCP",
  "Azure",
  "PostgreSQL",
  "Redis",
  "Kafka",
  "Terraform",
  "PyTorch",
  "TensorFlow",
  "GraphQL",
  "Next.js",
  "Django",
  "FastAPI",
  "Spring Boot",
  "CI/CD",
  "MLOps",
  "Snowflake",
  "Databricks",
  "Figma",
  "Tailwind",
];

export const UPSKILLING_AREAS = [
  "Advanced English (C1+)",
  "EU Compliance & GDPR",
  "Cloud Certifications",
  "System Design",
  "AI/ML Fundamentals",
  "Cross-Cultural Communication",
  "Senior Engineering Leadership",
  "Data Engineering Pipelines",
];
