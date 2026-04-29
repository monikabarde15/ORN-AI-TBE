import { Router, type IRouter, type Request } from "express";
import { eq } from "drizzle-orm";
import multer from "multer";
import {
  db,
  candidatesTable,
  trainingAssignmentsTable,
  projectsTable,
} from "@workspace/db";
import { serializeCandidate } from "../lib/serialize";
import { evaluate, type CandidateLike } from "../lib/evaluation";
import { parseCvBuffer, extractProfileFromText } from "../lib/cv-parser";
import { buildCandidateCvPdf } from "../lib/cv-pdf";
import { analyzeSkillGap } from "../lib/skill-gap";
import { recordAudit } from "../lib/audit";
import { requireAuth, requireRole, requireCandidateAccess } from "../lib/auth";

const router: IRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

const ALLOWED_MIME = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "text/plain",
]);

async function loadCandidateRow(id: string) {
  const [row] = await db
    .select()
    .from(candidatesTable)
    .where(eq(candidatesTable.id, id))
    .limit(1);
  return row ?? null;
}

async function ensureCanMutateCandidate(
  req: Request,
  candidateId: string,
): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const user = req.user!;
  if (user.role === "admin" || user.role === "recruiter") return { ok: true };
  if (user.role === "candidate" && user.candidateId === candidateId)
    return { ok: true };
  return { ok: false, status: 403, error: "Insufficient permissions" };
}

// ---- POST /candidates/:id/cv-file ------------------------------------------
router.post(
  "/candidates/:id/cv-file",
  requireAuth,
  upload.single("file"),
  async (req, res): Promise<void> => {
    const id = req.params.id as string;
    const guard = await ensureCanMutateCandidate(req, id);
    if (!guard.ok) {
      res.status(guard.status).json({ error: guard.error });
      return;
    }
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }
    if (!ALLOWED_MIME.has(file.mimetype)) {
      res.status(415).json({ error: `Unsupported file type: ${file.mimetype}` });
      return;
    }

    let text = "";
    try {
      text = await parseCvBuffer(file.buffer, file.mimetype);
    } catch (err) {
      req.log.error({ err }, "CV parsing failed");
      res.status(422).json({ error: "Could not parse the uploaded CV" });
      return;
    }
    const extracted = extractProfileFromText(text);

    const cvMeta = {
      fileName: file.originalname,
      fileSize: file.size,
      contentSummary: extracted.rawText.slice(0, 280),
    };

    const updates: Record<string, unknown> = {
      cv: cvMeta,
      cvFileBytes: file.buffer,
      cvFileName: file.originalname,
      cvMimeType: file.mimetype,
      careerGapMonths: extracted.careerGapMonths,
    };
    if (extracted.lastRole) updates["lastRole"] = extracted.lastRole;
    if (extracted.domain) updates["domain"] = extracted.domain;
    if (extracted.skills.length > 0) {
      // Merge with any existing skills, dedupe case-insensitively.
      const existing = (await loadCandidateRow(id))?.skills ?? [];
      const merged = new Map<string, string>();
      for (const s of [...existing, ...extracted.skills])
        merged.set(s.toLowerCase(), s);
      updates["skills"] = Array.from(merged.values()).slice(0, 24);
    }

    const [updated] = await db
      .update(candidatesTable)
      .set(updates)
      .where(eq(candidatesTable.id, id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Candidate not found" });
      return;
    }
    await recordAudit(req, {
      action: "candidate.cv_upload",
      entityType: "candidate",
      entityId: id,
      metadata: {
        fileName: file.originalname,
        fileSize: file.size,
        skillsExtracted: extracted.skills.length,
      },
    });
    res.status(200).json({
      candidate: serializeCandidate(updated),
      extracted: {
        fullName: extracted.fullName,
        email: extracted.email,
        phone: extracted.phone,
        location: extracted.location,
        yearsExperience: extracted.yearsExperience,
        lastRole: extracted.lastRole,
        domain: extracted.domain,
        careerGapMonths: extracted.careerGapMonths,
        skills: extracted.skills,
      },
    });
  },
);

// ---- GET /candidates/:id/skill-gap -----------------------------------------
router.get("/candidates/:id/skill-gap", requireAuth, requireCandidateAccess(), async (req, res): Promise<void> => {
  const row = await loadCandidateRow(req.params.id as string);
  if (!row) {
    res.status(404).json({ error: "Candidate not found" });
    return;
  }
  const result = analyzeSkillGap(row.targetRole, row.skills ?? []);
  res.status(200).json(result);
});

// ---- POST /candidates/:id/shortlist ----------------------------------------
router.post(
  "/candidates/:id/shortlist",
  requireAuth,
  requireRole("recruiter", "admin"),
  async (req, res): Promise<void> => {
    const id = req.params.id as string;
    const shortlisted = (req.body as { shortlisted?: boolean }).shortlisted === true;
    const [row] = await db
      .update(candidatesTable)
      .set({ isShortlisted: shortlisted })
      .where(eq(candidatesTable.id, id))
      .returning();
    if (!row) {
      res.status(404).json({ error: "Candidate not found" });
      return;
    }
    await recordAudit(req, {
      action: shortlisted ? "candidate.shortlist" : "candidate.unshortlist",
      entityType: "candidate",
      entityId: id,
      metadata: { shortlisted },
    });
    res.status(200).json(serializeCandidate(row));
  },
);

// ---- POST /candidates/:id/client-ready -------------------------------------
router.post(
  "/candidates/:id/client-ready",
  requireAuth,
  requireRole("recruiter", "admin"),
  async (req, res): Promise<void> => {
    const id = req.params.id as string;
    const clientReady = (req.body as { clientReady?: boolean }).clientReady === true;
    const [row] = await db
      .update(candidatesTable)
      .set({ isClientReady: clientReady })
      .where(eq(candidatesTable.id, id))
      .returning();
    if (!row) {
      res.status(404).json({ error: "Candidate not found" });
      return;
    }
    await recordAudit(req, {
      action: "candidate.client_ready",
      entityType: "candidate",
      entityId: id,
      metadata: { clientReady },
    });
    res.status(200).json(serializeCandidate(row));
  },
);

// ---- GET /candidates/:id/cv/full.pdf ---------------------------------------
async function buildPdfForCandidate(candidateId: string, masked: boolean) {
  const candidate = await loadCandidateRow(candidateId);
  if (!candidate) return null;

  const [training] = await db
    .select()
    .from(trainingAssignmentsTable)
    .where(eq(trainingAssignmentsTable.candidateId, candidateId))
    .limit(1);

  const projects = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.candidateId, candidateId));

  // Re-evaluate to keep the PDF in sync with the current candidate state
  const cl: CandidateLike = {
    id: candidate.id,
    fullName: candidate.fullName,
    email: candidate.email,
    englishLevel: candidate.englishLevel,
    visaStatus: candidate.visaStatus,
    yearsExperience: candidate.yearsExperience,
    euWorkEligible: candidate.euWorkEligible,
    targetRole: candidate.targetRole,
    country: candidate.country,
    skills: candidate.skills ?? [],
    cv: candidate.cv as { fileName?: string; contentSummary?: string } | null,
    careerGapMonths: candidate.careerGapMonths,
  };
  const evaluation = evaluate(cl);

  const buffer = buildCandidateCvPdf({
    candidate,
    training: training ?? null,
    projects,
    evaluation: {
      scores: evaluation.scores,
      classification: evaluation.classification,
    },
    masked,
  });
  return { buffer, candidate };
}

router.get("/candidates/:id/cv/full.pdf", requireAuth, async (req, res) => {
  const id = req.params.id as string;
  const guard = await ensureCanMutateCandidate(req, id);
  if (!guard.ok) {
    res.status(guard.status).json({ error: guard.error });
    return;
  }
  const result = await buildPdfForCandidate(id, false);
  if (!result) {
    res.status(404).json({ error: "Candidate not found" });
    return;
  }
  const safeName = result.candidate.fullName.replace(/[^A-Za-z0-9_-]+/g, "_");
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${safeName}_ORN-AI_CV.pdf"`,
  );
  res.send(result.buffer);
});

router.get(
  "/candidates/:id/cv/masked.pdf",
  requireAuth,
  requireRole("recruiter", "admin"),
  async (req, res) => {
    const id = req.params.id as string;
    const result = await buildPdfForCandidate(id, true);
    if (!result) {
      res.status(404).json({ error: "Candidate not found" });
      return;
    }
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="ORN-AI_Anonymised_${id.slice(0, 8)}.pdf"`,
    );
    res.send(result.buffer);
  },
);

export default router;
