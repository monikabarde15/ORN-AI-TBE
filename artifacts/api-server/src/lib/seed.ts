import {
  db,
  candidatesTable,
  activityTable,
  trainingAssignmentsTable,
  usersTable,
} from "@workspace/db";
import { sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { REGIONS, ROLES } from "./regions";
import { evaluate, pickSkillsFor, type CandidateLike } from "./evaluation";
import { logger } from "./logger";
import {
  recommendTraining,
  buildInitialModules,
  buildInitialLiveSessions,
  type ModuleState,
  type LiveSessionState,
  type TrainingStatus,
} from "./training";

const FIRST_NAMES = [
  "Andrei",
  "Tomas",
  "Anna",
  "Bartosz",
  "Mihaela",
  "Jana",
  "Petar",
  "Magda",
  "Stefan",
  "Ivona",
  "Lukas",
  "Kasia",
  "Vlad",
  "Ondrej",
  "Eszter",
  "Goran",
  "Niko",
  "Branka",
  "Pavel",
  "Sanja",
  "Radu",
  "Dorota",
  "Marko",
  "Hana",
  "Adam",
  "Beata",
  "Dragan",
  "Filip",
  "Greta",
  "Iva",
  "Boris",
  "Lara",
  "Matej",
  "Zsofia",
  "Tomislav",
  "Karolina",
];

const LAST_NAMES = [
  "Popescu",
  "Novak",
  "Kovac",
  "Nowak",
  "Horvath",
  "Petrov",
  "Kowalski",
  "Ionescu",
  "Varga",
  "Dvorak",
  "Jankovic",
  "Stoyanov",
  "Wisniewski",
  "Hristov",
  "Krajcir",
  "Marinov",
  "Lazar",
  "Wojcik",
  "Toth",
  "Adamczyk",
  "Stanev",
  "Dimitrov",
  "Vlcek",
  "Pavic",
  "Andrejic",
  "Krol",
  "Cernak",
  "Babic",
  "Penev",
  "Gajdos",
];

const ENGLISH_LEVELS = ["A2", "B1", "B1", "B2", "B2", "B2", "C1", "C1", "C2"];
const VISA_OPTIONS = [
  "eu_citizen",
  "eu_citizen",
  "eu_citizen",
  "blue_card",
  "work_permit",
  "requires_sponsorship",
  "student_visa",
];

function pick<T>(arr: T[], i: number): T {
  return arr[Math.abs(i) % arr.length]!;
}

function avatarFor(seed: number): string {
  // Deterministic neutral portrait illustrations from a stable open API.
  const id = (seed % 90) + 1;
  const gender = seed % 2 === 0 ? "men" : "women";
  return `https://randomuser.me/api/portraits/${gender}/${id}.jpg`;
}

async function ensureTrainingSeed(): Promise<void> {
  const [{ count: trainingCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(trainingAssignmentsTable);
  if (trainingCount > 0) {
    logger.info({ trainingCount }, "Training assignments already seeded; skipping");
    return;
  }
  const seededCandidates = await db.select().from(candidatesTable);
  const trainingRows = buildTrainingRowsFor(seededCandidates);
  if (trainingRows.length) {
    await db.insert(trainingAssignmentsTable).values(trainingRows);
  }
  logger.info(
    { trainingAssignments: trainingRows.length },
    "Seeded training assignments",
  );
}

async function ensureSeedUsers(): Promise<void> {
  // Demo accounts only run in non-production environments. In production a real
  // admin must bootstrap accounts manually so we never leak default credentials.
  if (process.env["NODE_ENV"] === "production") {
    return;
  }
  const passwordHash = await bcrypt.hash("Password123!", 10);
  const seeds = [
    {
      email: "admin@orn-ai.example",
      passwordHash,
      fullName: "Platform Admin",
      role: "admin" as const,
      gdprConsentAt: new Date(),
    },
    {
      email: "recruiter@orn-ai.example",
      passwordHash,
      fullName: "Demo Recruiter",
      role: "recruiter" as const,
      gdprConsentAt: new Date(),
    },
  ];
  await db
    .insert(usersTable)
    .values(seeds)
    .onConflictDoUpdate({
      target: usersTable.email,
      set: {
        passwordHash: sql`excluded.password_hash`,
        role: sql`excluded.role`,
        fullName: sql`excluded.full_name`,
      },
    });

  logger.info(
    "Demo admin and recruiter accounts ensured (development environment).",
  );
}

export async function ensureSeedData(): Promise<void> {
  await ensureSeedUsers();

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(candidatesTable);
  if (count > 0) {
    logger.info({ count }, "Candidates already seeded; skipping");
    // Still backfill training assignments if they're missing (e.g. existing
    // databases predating the training module).
    await ensureTrainingSeed();
    return;
  }

  logger.info("Seeding candidate dataset");

  const phase1Regions = REGIONS.filter((r) => r.phase === 1);
  const rows: Array<typeof candidatesTable.$inferInsert> = [];
  const TOTAL = 64;

  for (let i = 0; i < TOTAL; i++) {
    const first = pick(FIRST_NAMES, i * 7 + 3);
    const last = pick(LAST_NAMES, i * 11 + 5);
    const fullName = `${first} ${last}`;
    const region = pick(phase1Regions, i * 3 + 1);
    const role = pick(ROLES, i * 13 + 2);
    const yearsExperience = (i * 5 + 1) % 14; // 0..13
    const englishLevel = pick(ENGLISH_LEVELS, i * 2 + 4);
    const visaStatus = pick(VISA_OPTIONS, i * 5 + 6);
    const euWorkEligible =
      visaStatus === "eu_citizen" ||
      visaStatus === "blue_card" ||
      visaStatus === "work_permit";
    const email = `${first}.${last}`.toLowerCase().replace(/[^a-z.]/g, "") +
      `${i}@orn-ai.example`;
    const phone = `+40 7${(10000000 + i * 12347).toString().slice(0, 8)}`;
    const linkedinUrl = `https://www.linkedin.com/in/${first.toLowerCase()}-${last.toLowerCase()}-${i}`;
    const avatarUrl = avatarFor(i * 17);
    const skills = pickSkillsFor(role, i * 19 + 7);

    const id = crypto.randomUUID();
    const candidateLike: CandidateLike = {
      id,
      fullName,
      email,
      englishLevel,
      visaStatus,
      yearsExperience,
      euWorkEligible,
      targetRole: role,
      country: region.name,
      skills,
      cv: {
        fileName: `${first}_${last}_CV.pdf`,
        contentSummary: `${yearsExperience} yrs ${role} background in ${region.name}.`,
      },
    };

    const evalResult = evaluate(candidateLike);

    rows.push({
      id,
      fullName,
      email,
      phone,
      country: region.name,
      targetRole: role,
      yearsExperience,
      visaStatus,
      englishLevel,
      euWorkEligible,
      linkedinUrl,
      avatarUrl,
      skills,
      cv: {
        fileName: `${first}_${last}_CV.pdf`,
        fileSize: 220_000 + (i * 13_337) % 600_000,
        contentSummary: candidateLike.cv!.contentSummary!,
      },
      evaluation: evalResult,
      createdAt: new Date(Date.now() - (i + 1) * 36 * 3600 * 1000),
    });
  }

  await db.insert(candidatesTable).values(rows);

  // Seed activity feed
  const activitySeeds: Array<typeof activityTable.$inferInsert> = [];
  const kinds: Array<"registration" | "evaluation" | "upskilling" | "placement"> = [
    "registration",
    "evaluation",
    "upskilling",
    "placement",
  ];
  for (let i = 0; i < 24; i++) {
    const row = rows[i % rows.length]!;
    const kind = kinds[i % kinds.length]!;
    const message =
      kind === "registration"
        ? `${row.fullName} registered as ${row.targetRole}`
        : kind === "evaluation"
          ? `AI evaluation completed for ${row.fullName}`
          : kind === "upskilling"
            ? `${row.fullName} enrolled in upskilling track`
            : `${row.fullName} matched with EU recruiter`;
    activitySeeds.push({
      kind,
      candidateName: row.fullName,
      country: row.country,
      message,
      timestamp: new Date(Date.now() - i * 3.5 * 3600 * 1000),
    });
  }
  await db.insert(activityTable).values(activitySeeds);

  // ---- Seed training assignments ----
  // Pull every candidate row back so we have the persisted `id`s and
  // `evaluation` fields to feed the recommender.
  const seededCandidates = await db.select().from(candidatesTable);
  const trainingRows = buildTrainingRowsFor(seededCandidates);
  if (trainingRows.length) {
    await db.insert(trainingAssignmentsTable).values(trainingRows);
  }

  logger.info(
    {
      candidates: rows.length,
      activity: activitySeeds.length,
      trainingAssignments: trainingRows.length,
    },
    "Seeded",
  );
}

function buildTrainingRowsFor(
  candidates: Array<{
    id: string;
    targetRole: string;
    evaluation: unknown;
  }>,
): Array<typeof trainingAssignmentsTable.$inferInsert> {
  const trainingRows: Array<typeof trainingAssignmentsTable.$inferInsert> = [];
  const now = Date.now();
  let trainingIdx = 0;

  for (const c of candidates) {
    const evalAny = c.evaluation as { scores?: { overall?: number } } | null;
    const overall = evalAny?.scores?.overall ?? 0;

    // Only "developing" / "emerging" tiers get training. Elite & ready
    // candidates are recruiter-ready and don't need a transformation track.
    if (overall >= 75) continue;

    const rec = recommendTraining({
      id: c.id,
      targetRole: c.targetRole,
      evaluation: c.evaluation,
    });

    // Spread start dates 1-60 days in the past so progress can be realistic
    const daysAgo = (trainingIdx * 7 + 3) % 60;
    const startDate = new Date(now - daysAgo * 24 * 3600 * 1000);
    const targetCompletionDate = new Date(
      startDate.getTime() + rec.program.durationWeeks * 7 * 24 * 3600 * 1000,
    );

    const modules = buildInitialModules(rec.program);
    const liveSessions = buildInitialLiveSessions(
      rec.program,
      rec.suggestedTrainer,
      startDate,
    );

    const elapsedRatio = Math.min(
      1,
      (now - startDate.getTime()) /
        (rec.program.durationWeeks * 7 * 24 * 3600 * 1000),
    );
    const completedCount = Math.floor(modules.length * elapsedRatio);
    const advancedModules: ModuleState[] = modules.map((m, i) => {
      if (i < completedCount) return { ...m, status: "completed" };
      if (i === completedCount && elapsedRatio < 0.95)
        return { ...m, status: "in_progress" };
      return m;
    });

    const advancedSessions: LiveSessionState[] = liveSessions.map((s) => {
      if (new Date(s.scheduledFor).getTime() < now) {
        return { ...s, status: "completed" };
      }
      return s;
    });

    const progressPct = Math.round((completedCount / modules.length) * 100);

    let status: TrainingStatus;
    if (progressPct >= 100) {
      status = trainingIdx % 3 === 0 ? "recruiter_ready" : "completed";
    } else if (progressPct === 0) {
      status = "not_started";
    } else if (
      advancedSessions.some(
        (s) =>
          s.status === "scheduled" &&
          new Date(s.scheduledFor).getTime() < now + 7 * 24 * 3600 * 1000,
      )
    ) {
      status = "live_session_pending";
    } else if (trainingIdx % 5 === 0 && progressPct >= 40) {
      status = "assessment_pending";
    } else if (progressPct >= 50) {
      status = "module_completed";
    } else {
      status = "in_progress";
    }

    trainingRows.push({
      candidateId: c.id,
      assessmentCategory: rec.assessmentCategory,
      trainingType: rec.trainingType,
      programId: rec.program.id,
      programName: rec.program.name,
      recommendedPath: rec.recommendedPath,
      deliveryMode: "hybrid",
      trainerId: rec.suggestedTrainer.id,
      trainerName: rec.suggestedTrainer.name,
      modules: advancedModules,
      liveSessions: advancedSessions,
      startDate,
      targetCompletionDate,
      status,
      progressPct,
      finalReadinessNote:
        status === "recruiter_ready"
          ? `Final review passed by ${rec.suggestedTrainer.name}. Cleared for recruiter shortlists.`
          : null,
      createdAt: startDate,
      updatedAt: new Date(now - (daysAgo * 24 * 3600 * 1000) / 2),
    });

    trainingIdx++;
  }

  return trainingRows;
}
