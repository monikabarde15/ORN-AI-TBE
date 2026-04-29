/**
 * ORN-AI training catalog.
 *
 * This is **not** a generic LMS — these programs are the curated, hybrid
 * career-transformation tracks that move CEE talent from
 * "evaluated" → "recruiter-ready". Programs combine pre-recorded modules,
 * live trainer-led sessions, post-module assessments, and a final
 * readiness review.
 *
 * The catalog is intentionally code-defined (not in the database) because
 * programs evolve in product, not in user data.
 */

export interface ModuleTemplate {
  title: string;
  durationMinutes: number;
}

export interface TrainingProgramDef {
  id: string;
  name: string;
  trainingType: "upskilling" | "reskilling";
  recommendedPath: string;
  deliveryMode: "hybrid";
  durationWeeks: number;
  moduleTemplates: ModuleTemplate[];
  focusAreas: string[];
}

export interface TrainerDef {
  id: string;
  name: string;
  specialism: string;
  yearsExperience: number;
  country: string;
}

export const TRAINERS: TrainerDef[] = [
  {
    id: "trn_eu_business_english",
    name: "Dr. Helena Brașov",
    specialism: "EU Business English & Cross-Cultural Communication",
    yearsExperience: 14,
    country: "Romania",
  },
  {
    id: "trn_cloud_devops",
    name: "Marek Šimek",
    specialism: "Cloud Architecture & DevOps Acceleration",
    yearsExperience: 11,
    country: "Czechia",
  },
  {
    id: "trn_data_eng",
    name: "Aleksandra Wójcik",
    specialism: "Data Engineering & Analytics Bridge",
    yearsExperience: 9,
    country: "Poland",
  },
  {
    id: "trn_ai_ml",
    name: "Dr. Goran Petrović",
    specialism: "AI / ML Practitioner Bridge",
    yearsExperience: 12,
    country: "Serbia",
  },
  {
    id: "trn_leadership",
    name: "Eszter Tóth",
    specialism: "Senior Engineering Leadership",
    yearsExperience: 16,
    country: "Hungary",
  },
  {
    id: "trn_compliance",
    name: "Pavel Krajčír",
    specialism: "EU Compliance, GDPR & Workplace Readiness",
    yearsExperience: 10,
    country: "Slovakia",
  },
];

export const TRAINING_PROGRAMS: TrainingProgramDef[] = [
  {
    id: "prog_eu_workplace_english",
    name: "EU Workplace Communication & Business English",
    trainingType: "upskilling",
    recommendedPath: "Workplace Communication Path",
    deliveryMode: "hybrid",
    durationWeeks: 8,
    focusAreas: ["English fluency", "Stakeholder communication", "Async writing"],
    moduleTemplates: [
      { title: "Module 01 — Professional Email & Async Writing", durationMinutes: 65 },
      { title: "Module 02 — Stand-ups, Demos & Presenting in English", durationMinutes: 80 },
      { title: "Module 03 — Cross-Cultural Workplace Norms (DACH/Nordics)", durationMinutes: 70 },
      { title: "Module 04 — Negotiating Scope & Disagreement in English", durationMinutes: 75 },
      { title: "Module 05 — Final Communication Assessment", durationMinutes: 90 },
    ],
  },
  {
    id: "prog_cloud_devops",
    name: "Cloud Foundations & DevOps Acceleration",
    trainingType: "upskilling",
    recommendedPath: "Cloud-Native Engineering Path",
    deliveryMode: "hybrid",
    durationWeeks: 10,
    focusAreas: ["AWS", "Kubernetes", "Terraform", "CI/CD"],
    moduleTemplates: [
      { title: "Module 01 — Cloud Fundamentals: AWS Core Services", durationMinutes: 90 },
      { title: "Module 02 — Containers & Kubernetes Essentials", durationMinutes: 120 },
      { title: "Module 03 — Infrastructure as Code with Terraform", durationMinutes: 95 },
      { title: "Module 04 — CI/CD Pipelines & GitOps", durationMinutes: 85 },
      { title: "Module 05 — Production Readiness & Observability", durationMinutes: 75 },
      { title: "Module 06 — Capstone Project Assessment", durationMinutes: 110 },
    ],
  },
  {
    id: "prog_data_engineering",
    name: "Data Engineering Bridge Program",
    trainingType: "reskilling",
    recommendedPath: "Engineering → Data Engineering Reskilling Path",
    deliveryMode: "hybrid",
    durationWeeks: 12,
    focusAreas: ["SQL", "Python", "Snowflake", "dbt", "Airflow"],
    moduleTemplates: [
      { title: "Module 01 — SQL for Analytics at Scale", durationMinutes: 95 },
      { title: "Module 02 — Python for Data Pipelines", durationMinutes: 110 },
      { title: "Module 03 — Modern Warehouse: Snowflake & BigQuery", durationMinutes: 95 },
      { title: "Module 04 — Pipeline Orchestration with Airflow & dbt", durationMinutes: 100 },
      { title: "Module 05 — Data Modeling & Schema Design", durationMinutes: 85 },
      { title: "Module 06 — Reskilling Capstone Assessment", durationMinutes: 120 },
    ],
  },
  {
    id: "prog_ai_ml_bridge",
    name: "AI / ML Practitioner Bridge",
    trainingType: "reskilling",
    recommendedPath: "Engineering → ML Engineering Reskilling Path",
    deliveryMode: "hybrid",
    durationWeeks: 12,
    focusAreas: ["Python", "PyTorch", "MLOps", "Production ML"],
    moduleTemplates: [
      { title: "Module 01 — Applied ML Foundations", durationMinutes: 100 },
      { title: "Module 02 — PyTorch & Modern Model Training", durationMinutes: 120 },
      { title: "Module 03 — Feature Engineering & Evaluation", durationMinutes: 90 },
      { title: "Module 04 — MLOps: Serving, Monitoring, Drift", durationMinutes: 110 },
      { title: "Module 05 — End-to-End ML Capstone Assessment", durationMinutes: 130 },
    ],
  },
  {
    id: "prog_leadership",
    name: "Senior Engineering Leadership Track",
    trainingType: "upskilling",
    recommendedPath: "Tech-Lead Readiness Path",
    deliveryMode: "hybrid",
    durationWeeks: 8,
    focusAreas: ["Tech leadership", "System design", "EU hiring norms"],
    moduleTemplates: [
      { title: "Module 01 — System Design at Scale", durationMinutes: 110 },
      { title: "Module 02 — Leading Teams in EU Engineering Cultures", durationMinutes: 75 },
      { title: "Module 03 — Architecture Reviews & Tech Strategy", durationMinutes: 90 },
      { title: "Module 04 — Hiring, Mentoring & Performance", durationMinutes: 70 },
      { title: "Module 05 — Leadership Readiness Assessment", durationMinutes: 95 },
    ],
  },
  {
    id: "prog_eu_compliance",
    name: "EU Compliance, GDPR & Workplace Readiness",
    trainingType: "upskilling",
    recommendedPath: "EU Workplace Onboarding Path",
    deliveryMode: "hybrid",
    durationWeeks: 6,
    focusAreas: ["GDPR", "EU labor norms", "Visa & onboarding"],
    moduleTemplates: [
      { title: "Module 01 — GDPR for Engineers & Designers", durationMinutes: 70 },
      { title: "Module 02 — EU Labor Norms & Contracts 101", durationMinutes: 60 },
      { title: "Module 03 — Visa, Blue Card & Relocation Logistics", durationMinutes: 55 },
      { title: "Module 04 — Compliance Readiness Assessment", durationMinutes: 80 },
    ],
  },
];

export function findProgramById(id: string): TrainingProgramDef | undefined {
  return TRAINING_PROGRAMS.find((p) => p.id === id);
}

export function findTrainerById(id: string): TrainerDef | undefined {
  return TRAINERS.find((t) => t.id === id);
}

/**
 * Map a program id to the most aligned trainer id. Used for both
 * recommendations and seed data so the demo stays internally consistent.
 */
export function defaultTrainerForProgram(programId: string): TrainerDef {
  const map: Record<string, string> = {
    prog_eu_workplace_english: "trn_eu_business_english",
    prog_cloud_devops: "trn_cloud_devops",
    prog_data_engineering: "trn_data_eng",
    prog_ai_ml_bridge: "trn_ai_ml",
    prog_leadership: "trn_leadership",
    prog_eu_compliance: "trn_compliance",
  };
  const id = map[programId] ?? TRAINERS[0]!.id;
  return TRAINERS.find((t) => t.id === id) ?? TRAINERS[0]!;
}
