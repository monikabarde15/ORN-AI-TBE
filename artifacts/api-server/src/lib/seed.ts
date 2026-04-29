import { db, candidatesTable, activityTable } from "@workspace/db";
import { sql } from "drizzle-orm";
import { REGIONS, ROLES } from "./regions";
import { evaluate, pickSkillsFor, type CandidateLike } from "./evaluation";
import { logger } from "./logger";

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

export async function ensureSeedData(): Promise<void> {
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(candidatesTable);
  if (count > 0) {
    logger.info({ count }, "Candidates already seeded; skipping");
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

  logger.info({ candidates: rows.length, activity: activitySeeds.length }, "Seeded");
}
