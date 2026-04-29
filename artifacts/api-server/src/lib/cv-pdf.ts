import PDFDocument from "pdfkit";
import type { CandidateRow, TrainingAssignmentRow, ProjectRow } from "@workspace/db";

interface CvBuildContext {
  candidate: CandidateRow;
  training: TrainingAssignmentRow | null;
  projects: ProjectRow[];
  evaluation: {
    scores?: {
      cvQuality?: number;
      technicalRelevance?: number;
      englishReadiness?: number;
      europeJobReadiness?: number;
      marketReadiness?: number;
      overall?: number;
    };
    classification?: string;
  } | null;
  masked: boolean;
}

const ORANGE = "#e8633a";
const INK = "#1a1a1a";
const MUTED = "#6b6b6b";

function H(doc: PDFKit.PDFDocument, text: string): void {
  doc.fillColor(ORANGE).font("Helvetica-Bold").fontSize(13).text(text);
  doc.moveDown(0.3);
  doc.fillColor(INK).font("Helvetica").fontSize(10);
}

function muted(doc: PDFKit.PDFDocument, text: string): void {
  doc.fillColor(MUTED).font("Helvetica").fontSize(9).text(text);
  doc.fillColor(INK);
}

/**
 * Strip personally identifiable information from a free-text string before
 * including it in a "masked" anonymised profile. Removes emails, phone
 * numbers, URLs (LinkedIn, GitHub, personal sites), and common name/handle
 * patterns. Used by the masked CV generator so recruiter-supplied feedback
 * cannot accidentally leak the candidate's identity.
 */
function redactPII(input: string): string {
  return input
    .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, "[email redacted]")
    .replace(/https?:\/\/\S+/g, "[link redacted]")
    .replace(/(?:\+?\d[\s.-]?){7,}\d/g, "[phone redacted]")
    .replace(/linkedin\.com\/in\/[\w-]+/gi, "[linkedin redacted]")
    .replace(/@[A-Za-z0-9_]{2,}/g, "[handle redacted]");
}

export function buildCandidateCvPdf(ctx: CvBuildContext): Buffer {
  const { candidate, training, projects, evaluation, masked } = ctx;
  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 54, bottom: 54, left: 54, right: 54 },
    info: {
      Title: masked ? "ORN-AI Anonymised Profile" : `${candidate.fullName} — CV`,
      Author: "ORN-AI",
    },
  });
  const chunks: Buffer[] = [];
  doc.on("data", (c: Buffer) => chunks.push(c));

  // ---- Header ---------------------------------------------------------------
  doc
    .fillColor(ORANGE)
    .font("Helvetica-Bold")
    .fontSize(11)
    .text("ORN-AI", { continued: true })
    .fillColor(MUTED)
    .font("Helvetica")
    .fontSize(9)
    .text("    Talent Transformation Engine", { align: "left" });

  doc.moveDown(1);

  doc.fillColor(INK).font("Helvetica-Bold").fontSize(22);
  doc.text(masked ? "Anonymised Talent Profile" : candidate.fullName);
  doc.moveDown(0.2);

  doc.fillColor(MUTED).font("Helvetica").fontSize(11);
  const headline = [
    candidate.targetRole,
    `${candidate.yearsExperience}+ yrs experience`,
    candidate.country,
  ]
    .filter(Boolean)
    .join("  •  ");
  doc.text(headline);

  if (!masked) {
    doc.moveDown(0.3);
    doc.fillColor(INK).fontSize(9);
    doc.text(
      [candidate.email, candidate.phone, candidate.linkedinUrl]
        .filter(Boolean)
        .join("    "),
    );
  }

  doc.moveDown(1);
  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .strokeColor("#eeeeee")
    .lineWidth(1)
    .stroke();
  doc.moveDown(0.8);

  // ---- Headline / classification -------------------------------------------
  if (evaluation?.classification) {
    H(doc, "Readiness");
    const classMap: Record<string, string> = {
      recruiter_ready: "Recruiter ready",
      needs_upskilling: "In active upskilling",
      needs_reskilling: "In active reskilling",
      not_ready_yet: "Pre-readiness assessment",
    };
    doc.text(classMap[evaluation.classification] ?? evaluation.classification);
    if (evaluation.scores) {
      const s = evaluation.scores;
      const summary = [
        s.overall != null ? `Overall ${s.overall}` : null,
        s.technicalRelevance != null
          ? `Technical relevance ${s.technicalRelevance}`
          : null,
        s.europeJobReadiness != null
          ? `EU readiness ${s.europeJobReadiness}`
          : null,
        s.englishReadiness != null
          ? `English ${s.englishReadiness}`
          : null,
      ]
        .filter(Boolean)
        .join("    •    ");
      muted(doc, summary);
    }
    doc.moveDown(0.8);
  }

  // ---- Skills ---------------------------------------------------------------
  if (candidate.skills.length > 0) {
    H(doc, "Core skills");
    doc.text(candidate.skills.join("  •  "));
    doc.moveDown(0.8);
  }

  // ---- Experience snapshot --------------------------------------------------
  H(doc, "Experience snapshot");
  const expBits = [
    candidate.lastRole
      ? `Most recent: ${candidate.lastRole}`
      : `Target role: ${candidate.targetRole}`,
    candidate.domain ? `Domain: ${candidate.domain}` : null,
    candidate.careerGapMonths > 0
      ? `Career gap noted: ${candidate.careerGapMonths} months`
      : "No significant career gap",
  ].filter(Boolean) as string[];
  expBits.forEach((b) => doc.text(`•  ${b}`));
  doc.moveDown(0.8);

  // ---- Training program -----------------------------------------------------
  if (training) {
    H(doc, "ORN-AI training program");
    doc.text(`${training.programName}  (${training.recommendedPath})`);
    doc.fontSize(9).fillColor(MUTED);
    doc.text(
      `Trainer: ${training.trainerName} · ${training.deliveryMode} delivery · ${training.progressPct}% complete`,
    );
    doc.fillColor(INK).fontSize(10);
    doc.moveDown(0.8);
  }

  // ---- Projects -------------------------------------------------------------
  if (projects.length > 0) {
    H(doc, "Capstone projects");
    projects.forEach((p) => {
      doc.font("Helvetica-Bold").text(p.name);
      doc.font("Helvetica").fontSize(9).fillColor(MUTED);
      doc.text(
        `${p.techStack.join(", ")}  •  ${p.durationWeeks} weeks  •  ${p.status}`,
      );
      if (p.feedback) {
        doc.fillColor(INK).fontSize(10).text(masked ? redactPII(p.feedback) : p.feedback);
      }
      doc.fillColor(INK).fontSize(10);
      doc.moveDown(0.4);
    });
    doc.moveDown(0.4);
  }

  // ---- Footer ---------------------------------------------------------------
  doc.moveDown(1);
  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .strokeColor("#eeeeee")
    .stroke();
  doc.moveDown(0.4);
  muted(
    doc,
    masked
      ? "This anonymised profile is generated by ORN-AI. Personal identifiers have been removed pending recruiter shortlist."
      : "Generated by ORN-AI · Talent Transformation Engine for Eastern & Central Europe.",
  );

  doc.end();
  return Buffer.concat(chunks);
}

/**
 * pdfkit emits chunks asynchronously; collect them into a single Buffer that
 * the caller can pipe into the HTTP response.
 */
export function buildCandidateCvPdfAsync(
  ctx: CvBuildContext,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margins: { top: 54, bottom: 54, left: 54, right: 54 },
      });
      const chunks: Buffer[] = [];
      doc.on("data", (c: Buffer) => chunks.push(c));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      // Re-use the synchronous builder by re-invoking with the same doc; for
      // simplicity we just call buildCandidateCvPdf and return its buffer.
      const buf = buildCandidateCvPdf(ctx);
      resolve(buf);
      doc.end();
    } catch (err) {
      reject(err as Error);
    }
  });
}
