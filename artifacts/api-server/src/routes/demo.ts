import { Router, type IRouter } from "express";
import { db, candidatesTable, activityTable } from "@workspace/db";
import { RunDemoJourneyResponse } from "@workspace/api-zod";
import { evaluate, pickSkillsFor } from "../lib/evaluation";
import { REGIONS, ROLES } from "../lib/regions";
import { serializeCandidate } from "../lib/serialize";

const router: IRouter = Router();

const DEMO_NAMES = [
  "Andrei Marinescu",
  "Petra Novakova",
  "Bartosz Kaminski",
  "Eszter Toth",
  "Goran Petrov",
  "Lukas Krajcir",
  "Mihaela Stoica",
  "Tomas Dvorak",
];

const DEMO_ROLES = [
  "Senior Backend Engineer",
  "Machine Learning Engineer",
  "Cloud Architect",
  "Full-Stack Engineer",
];

const DEMO_VISA = ["eu_citizen", "blue_card", "eu_citizen"];

router.post("/demo/seed", async (_req, res): Promise<void> => {
  const i = Math.floor(Math.random() * DEMO_NAMES.length);
  const fullName = DEMO_NAMES[i]!;
  const region = REGIONS.filter((r) => r.phase === 1)[
    Math.floor(Math.random() * 8)
  ]!;
  const role =
    DEMO_ROLES[Math.floor(Math.random() * DEMO_ROLES.length)] ??
    ROLES[0]!;
  const visaStatus = DEMO_VISA[Math.floor(Math.random() * DEMO_VISA.length)]!;
  const yearsExperience = 5 + Math.floor(Math.random() * 7);
  const englishLevel = ["B2", "C1", "C1", "C2"][Math.floor(Math.random() * 4)]!;
  const skills = pickSkillsFor(role, Date.now());
  const seed = Math.floor(Math.random() * 89) + 1;
  const gender = seed % 2 === 0 ? "men" : "women";
  const avatarUrl = `https://randomuser.me/api/portraits/${gender}/${seed}.jpg`;
  const slug = fullName.toLowerCase().replace(/[^a-z]/g, "");

  const [row] = await db
    .insert(candidatesTable)
    .values({
      fullName,
      email: `${slug}.demo${Date.now()}@orn-ai.example`,
      phone: "+40 700 000 000",
      country: region.name,
      targetRole: role,
      yearsExperience,
      visaStatus,
      englishLevel,
      euWorkEligible: true,
      linkedinUrl: `https://www.linkedin.com/in/${slug}-demo`,
      avatarUrl,
      skills,
      cv: {
        fileName: `${fullName.replace(/ /g, "_")}_CV.pdf`,
        fileSize: 482_113,
        contentSummary: `${yearsExperience} years as ${role} in ${region.name}.`,
      },
    })
    .returning();

  if (!row) {
    res.status(500).json({ error: "Failed to seed demo candidate" });
    return;
  }

  const evaluation = evaluate({
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
    cv: row.cv as { fileName?: string; contentSummary?: string } | null,
  });

  const [updated] = await db
    .update(candidatesTable)
    .set({ evaluation })
    .where((await import("drizzle-orm")).eq(candidatesTable.id, row.id))
    .returning();

  await db.insert(activityTable).values({
    kind: "evaluation",
    candidateName: row.fullName,
    country: row.country,
    message: `Investor demo: ${row.fullName} reached ${evaluation.scores.overall}% readiness`,
  });

  const candidate = serializeCandidate(updated ?? row);
  candidate.evaluation = evaluation;

  const steps = [
    {
      label: "Candidate registers",
      detail: `${fullName} signs up from ${region.name} targeting ${role}.`,
      status: "done" as const,
    },
    {
      label: "CV uploaded & parsed",
      detail: `Structured profile extracted: ${skills.slice(0, 3).join(", ")}, ${yearsExperience} yrs experience.`,
      status: "done" as const,
    },
    {
      label: "AI evaluation completed",
      detail: `Overall readiness ${evaluation.scores.overall}% — tier: ${evaluation.readinessTier}.`,
      status: "done" as const,
    },
    {
      label: "Recruiter shortlist",
      detail:
        evaluation.scores.overall >= 75
          ? "Auto-promoted to recruiter shortlist for EU placements."
          : "Routed into upskilling track before recruiter shortlist.",
      status: evaluation.scores.overall >= 75 ? ("done" as const) : ("active" as const),
    },
    {
      label: "EU placement match",
      detail:
        "Surfaced to 3 EU recruiters: a Berlin scale-up, a Vienna fintech, and a remote-first Amsterdam product team.",
      status: "active" as const,
    },
  ];

  res.json(RunDemoJourneyResponse.parse({ candidate, steps }));
});

export default router;
