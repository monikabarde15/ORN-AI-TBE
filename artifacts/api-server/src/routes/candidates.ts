import { Router, type IRouter } from "express";
import { eq, and, gte, lte, desc, sql } from "drizzle-orm";
import { db, candidatesTable, activityTable } from "@workspace/db";
import {
  ListCandidatesQueryParams,
  ListCandidatesResponse,
  RegisterCandidateBody,
  GetCandidateParams,
  GetCandidateResponse,
  UploadCvParams,
  UploadCvBody,
  UploadCvResponse,
} from "@workspace/api-zod";
import { serializeCandidate } from "../lib/serialize";
import { pickSkillsFor } from "../lib/evaluation";

const router: IRouter = Router();

router.get("/candidates", async (req, res): Promise<void> => {
  const parsed = ListCandidatesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const f = parsed.data;
  const filters = [];
  if (f.country) filters.push(eq(candidatesTable.country, f.country));
  if (f.role) filters.push(eq(candidatesTable.targetRole, f.role));
  if (f.englishLevel)
    filters.push(eq(candidatesTable.englishLevel, f.englishLevel));
  if (typeof f.experienceMin === "number")
    filters.push(gte(candidatesTable.yearsExperience, f.experienceMin));
  if (typeof f.experienceMax === "number")
    filters.push(lte(candidatesTable.yearsExperience, f.experienceMax));
  if (f.search) {
    const pattern = `%${f.search}%`;
    filters.push(
      sql`(${candidatesTable.fullName} ILIKE ${pattern} OR ${candidatesTable.email} ILIKE ${pattern} OR ${candidatesTable.targetRole} ILIKE ${pattern})`,
    );
  }
  if (typeof f.minReadiness === "number") {
    filters.push(
      sql`COALESCE((${candidatesTable.evaluation}->'scores'->>'overall')::int, 0) >= ${f.minReadiness}`,
    );
  }

  const rows = await db
    .select()
    .from(candidatesTable)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(candidatesTable.createdAt))
    .limit(200);

  res.json(ListCandidatesResponse.parse(rows.map(serializeCandidate)));
});

router.post("/candidates", async (req, res): Promise<void> => {
  const parsed = RegisterCandidateBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const submittedSkills = parsed.data.skills?.filter((s) => s.trim().length > 0) ?? [];
  const skills =
    submittedSkills.length > 0
      ? submittedSkills.slice(0, 20)
      : pickSkillsFor(parsed.data.targetRole, Date.now());
  const seed = Math.floor(Math.random() * 89) + 1;
  const gender = seed % 2 === 0 ? "men" : "women";
  const avatarUrl = `https://randomuser.me/api/portraits/${gender}/${seed}.jpg`;

  const { skills: _ignored, ...rest } = parsed.data;
  const [row] = await db
    .insert(candidatesTable)
    .values({
      ...rest,
      skills,
      avatarUrl,
    })
    .returning();

  if (!row) {
    res.status(500).json({ error: "Failed to create candidate" });
    return;
  }

  await db.insert(activityTable).values({
    kind: "registration",
    candidateName: row.fullName,
    country: row.country,
    message: `${row.fullName} registered as ${row.targetRole}`,
  });

  res.status(201).json(GetCandidateResponse.parse(serializeCandidate(row)));
});

router.get("/candidates/:id", async (req, res): Promise<void> => {
  const params = GetCandidateParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db
    .select()
    .from(candidatesTable)
    .where(eq(candidatesTable.id, params.data.id));
  if (!row) {
    res.status(404).json({ error: "Candidate not found" });
    return;
  }
  res.json(GetCandidateResponse.parse(serializeCandidate(row)));
});

router.post("/candidates/:id/cv", async (req, res): Promise<void> => {
  const params = UploadCvParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = UploadCvBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [row] = await db
    .update(candidatesTable)
    .set({ cv: body.data })
    .where(eq(candidatesTable.id, params.data.id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Candidate not found" });
    return;
  }
  res.json(UploadCvResponse.parse(serializeCandidate(row)));
});

export default router;
