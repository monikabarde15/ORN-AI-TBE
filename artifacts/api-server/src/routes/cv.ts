// artifacts\api-server\src\routes\cv.ts
import { Router, type IRouter, type Request } from "express";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../lib/s3";
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
import { parseCvWithAI } from "../lib/cv-parser-ai";
import { AI_CONFIG } from "../lib/ai/config";
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

// Download the original CV uploaded for a candidate.
router.get(
  "/candidates/:id/cv-file",
  requireAuth,
  async (req, res): Promise<void> => {
    const candidate = await loadCandidateRow(req.params.id as string);
    if (!candidate?.cvFileBytes) {
      res.status(404).json({ error: "CV not found" });
      return;
    }
    res.setHeader("Content-Type", candidate.cvMimeType || "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${(candidate.cvFileName || "candidate-cv").replace(/[\"\\\r\n]/g, "_")}"`,
    );
    res.send(candidate.cvFileBytes);
  },
);

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

import { processAndSaveCv } from "../lib/cv-processor";

// ---- POST /candidates/:id/cv -----------------------------------------------
router.post(
  "/candidates/:id/cv",
  requireAuth,
  requireCandidateAccess(),
  upload.single("file"),
  async (req, res) => {
    const candidateId = req.params.id;

    if (!req.file) {
      return res.status(400).json({
        error: "Resume file required",
      });
    }

    try {
      const result = await processAndSaveCv({
        candidateId,
        fileBuffer: req.file.buffer,
        fileName: req.file.originalname,
        mimeType: req.file.mimetype,
        fileSize: req.file.size,
      });

      return res.json({
        success: true,
        cv: result.cv,
        evaluation: result.evaluation,
      });
    } catch (err) {
      console.error("CV upload error in cv.ts:", err);
      return res.status(500).json({
        error: "Failed to process uploaded CV",
        details: err instanceof Error ? err.message : String(err),
      });
    }
  }
);

// ---- POST /candidates/:id/cv-file ------------------------------------------
router.post(
  "/candidates/:id/cv-file",
  requireAuth,
  requireCandidateAccess(),
  upload.single("file"),
  async (req, res) => {
    const candidateId = req.params.id;

    if (!req.file) {
      return res.status(400).json({
        error: "Resume file required",
      });
    }

    try {
      const result = await processAndSaveCv({
        candidateId,
        fileBuffer: req.file.buffer,
        fileName: req.file.originalname,
        mimeType: req.file.mimetype,
        fileSize: req.file.size,
      });

      return res.json({
        success: true,
        cv: result.cv,
        evaluation: result.evaluation,
      });
    } catch (err) {
      console.error("CV-file upload error in cv.ts:", err);
      return res.status(500).json({
        error: "Failed to process uploaded CV file",
        details: err instanceof Error ? err.message : String(err),
      });
    }
  }
);
// ---- GET /candidates/:id/skill-gap -----------------------------------------
router.get("/candidates/:id/skill-gap", requireAuth, async (req, res): Promise<void> => {
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
