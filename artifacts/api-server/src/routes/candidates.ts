// artifacts\api-server\src\routes\candidates.ts
import { Router, type IRouter } from "express";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { evaluateWithAI } from "../lib/evaluation-full-ai";
import { s3 } from "../lib/s3";
import {
  getRegistrationEmailTemplate,
  getLearningPathEmailTemplate,
  getOtpEmailTemplate,
  getPaymentEmailTemplate,
  sendMailWithRetry,
  formatCleanName
} from "../lib/mail";
import multer from "multer";
import { eq, and, gte, lte, desc, sql } from "drizzle-orm";
import {
  db,
  candidatesTable,
  activityTable,
  usersTable,
} from "@workspace/db";
import { hashPassword, findUserByEmail, isStrongPassword, STRONG_PASSWORD_MESSAGE } from "../lib/auth";
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
import nodemailer from "nodemailer";
import { parseCvBuffer } from "../lib/cv-parser";
import { parseCvWithAI } from "../lib/cv-parser-ai";
import { requireAuth, requireRole, requireCandidateAccess } from "../lib/auth";
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});
const router: IRouter = Router();
async function generateCandidateCode() {
  const lastCandidate = await db
    .select({
      candidateCode: candidatesTable.candidateCode,
    })
    .from(candidatesTable)
    .where(sql`candidate_code IS NOT NULL`)
    .orderBy(sql`candidate_code DESC`)
    .limit(1);

  let nextNumber = 1;

  if (
    lastCandidate.length &&
    lastCandidate[0].candidateCode
  ) {
    const match =
      lastCandidate[0].candidateCode.match(/(\d+)$/);

    if (match) {
      nextNumber =
        parseInt(match[1], 10) + 1;
    }
  }

  return `ORN-AI-C-${String(nextNumber).padStart(3, "0")}`;
}

router.get("/candidates", requireAuth, requireRole("recruiter", "admin"), async (req, res): Promise<void> => {
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

  // res.json(ListCandidatesResponse.parse(rows.map(serializeCandidate)));
  // res.json(rows.map(serializeCandidate));

  const data = rows.map(serializeCandidate);

  // const parsed = ListCandidatesResponse.safeParse(data);

  res.json(data);
});

router.post(
  "/candidates",
  requireAuth,
  requireRole("recruiter", "admin"),
  async (req, res): Promise<void> => {
    try {
      const parsed = RegisterCandidateBody.safeParse(req.body);

      console.log("Parsed Request =", parsed);
      console.log("Request Body =", req.body);

      if (!parsed.success) {
        res.status(400).json({
          success: false,
          error: parsed.error.flatten(),
        });
        return;
      }

      if (!isStrongPassword(parsed.data.password)) {
        res.status(400).json({ error: STRONG_PASSWORD_MESSAGE });
        return;
      }

      const submittedSkills =
        parsed.data.skills?.filter((s) => s.trim().length > 0) ?? [];

      const skills =
        submittedSkills.length > 0
          ? submittedSkills.slice(0, 20)
          : pickSkillsFor(parsed.data.targetRole, Date.now());

      const seed = Math.floor(Math.random() * 89) + 1;
      const gender = seed % 2 === 0 ? "men" : "women";
      const avatarUrl =
        gender === "women"
          ? "https://api.dicebear.com/10.x/personas/svg?seed=female"
          : "https://api.dicebear.com/10.x/personas/svg?seed=male";

      // const avatarUrl = `https://randomuser.me/api/portraits/${gender}/${seed}.jpg`;

      const { skills: _ignored, ...rest } = parsed.data;

      // Normalize some fields to match DB schema (arrays)
      const normalized = {
        ...rest,
        careerPreference: Array.isArray((rest as any).careerPreference)
          ? (rest as any).careerPreference
          : rest.careerPreference
            ? [String((rest as any).careerPreference)]
            : [],
        preferredWorkMode: Array.isArray((rest as any).preferredWorkMode)
          ? (rest as any).preferredWorkMode
          : rest.preferredWorkMode
            ? [String((rest as any).preferredWorkMode)]
            : [],
        interestedSkills: Array.isArray((rest as any).interestedSkills)
          ? (rest as any).interestedSkills
          : [],
      };

      console.log("Insert Payload =", {
        ...rest,
        skills,
        avatarUrl,
      });
      const candidateCode = await generateCandidateCode();

      // console.log(
      //   "Generated Candidate Code =",
      //   candidateCode
      // );

      const [row] = await db
        .insert(candidatesTable)
        .values({
          ...normalized,
          candidateCode,
          skills,
          avatarUrl,
        })
        .returning();
      await db.insert(activityTable).values({
        kind: "registration",
        candidateName: row.fullName,
        country: row.country,
        message: `${row.fullName} registered as ${row.targetRole}`,
      });
      const passwordHash = await hashPassword(parsed.data.password);
      //       const html = getOfficialEmailTemplate({
      //         badgeTitle: "Welcome to ORN-AI",
      //         recipientName: row.fullName,
      //         headlineText: `Thank you for registering with us. We are delighted to have you join our growing network of professionals across global markets!
      // <div style="background:#F8FAFC;border:1px solid #CBD5E1;border-left:5px solid #2563EB;border-radius:10px;padding:22px;margin:24px 0;">
      //   <h3 style="margin:0 0 14px 0;color:#0F172A;font-size:17px;font-weight:700;">Your Account Login Credentials</h3>
      //   <table width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;color:#334155;line-height:1.8;">
      //     <tr>
      //       <td style="padding:6px 0;width:150px;font-weight:600;color:#64748B;">Username:</td>
      //       <td style="padding:6px 0;font-weight:700;color:#1E40AF;">${row.fullName}</td>
      //     </tr>
      //     <tr>
      //       <td style="padding:6px 0;width:150px;font-weight:600;color:#64748B;">Email Address:</td>
      //       <td style="padding:6px 0;font-weight:700;color:#1E40AF;">${row.email}</td>
      //     </tr>
      //     <tr>
      //       <td style="padding:6px 0;width:150px;font-weight:600;color:#64748B;">Password:</td>
      //       <td style="padding:6px 0;font-weight:700;color:#1E40AF;">${parsed.data.password}</td>
      //     </tr>
      //   </table>
      // </div>`,
      //         learningPathTitle: "Account Registration & Candidate Portal Access",
      //         learningPathDescription: "ORN-AI is a Talent Conditioning and Career-Readiness Platform supporting job seekers, candidates and consultants through assessment, upskilling, and hands-on learning.",
      //         joinUrl: process.env.FRONTEND_URL || "https://orn-ai.com/",
      //         callToActionText: "Access ORN-AI Portal",
      //       });
      // ============================================
      // SEND REGISTRATION EMAIL - WITH ERROR HANDLING
      // ============================================

      try {
        const html = getRegistrationEmailTemplate({
          recipientName: row.fullName,
          username: row.fullName,
          password: parsed.data.password,
          joinUrl: process.env.FRONTEND_URL || "http://localhost:5173"
        });

        await sendMailWithRetry({
          from: `"ORN-AI" <${process.env.SMTP_USER || "connect@orn-ai.co.uk"}>`,
          to: row.email,
          subject: "Welcome to ORN-AI – Registration Successful",
          html,
        });

        console.log(`✅ Registration email sent to ${row.email}`);
      } catch (mailError) {
        // ✅ Mail fail hua toh sirf log karo, response fail mat karo
        console.error(`❌ Failed to send registration email to ${row.email}:`, mailError);

        // ✅ Option: Store in database that email failed
        await db.insert(activityTable).values({
          kind: "email_failed",
          candidateName: row.fullName,
          country: row.country,
          message: `Registration email failed for ${row.email}: ${mailError instanceof Error ? mailError.message : String(mailError)}`,
        });
      }
      const existingUser = await findUserByEmail(row.email);

      if (!existingUser) {
        await db.insert(usersTable).values({
          email: row.email.toLowerCase(),
          passwordHash,
          fullName: row.fullName,

          role: "candidate",
          candidateId: row.id,

          country: row.country ?? null,
          status: "Active",

          gdprConsentAt: new Date(),
        });
      }

      if (!row) {
        res.status(500).json({
          success: false,
          message: "Failed to create candidate",
        });
        return;
      }

      await db.insert(activityTable).values({
        kind: "registration",
        candidateName: row.fullName,
        country: row.country,
        message: `${row.fullName} registered as ${row.targetRole}`,
      });

      res
        .status(201)
        .json(GetCandidateResponse.parse(serializeCandidate(row)));
    } catch (error: any) {
      console.error("========== CREATE CANDIDATE ERROR ==========");
      console.error(error);
      console.error(error?.cause);
      console.error(error?.stack);

      res.status(500).json({
        success: false,
        message: error?.message,
        detail: error?.cause ?? null,
      });
    }
  },
);

// router.get("/candidates/:id", requireAuth, async (req, res): Promise<void> => {
//   const params = GetCandidateParams.safeParse(req.params);
//   if (!params.success) {
//     res.status(400).json({ error: params.error.message });
//     return;
//   }
//   if (
//     req.user!.role === "candidate" &&
//     req.user!.candidateId !== params.data.id
//   ) {
//     res.status(403).json({ error: "Insufficient permissions" });
//     return;
//   }
//   //const [row] = await db
//   //.select()
//   //.from(candidatesTable)
//   //.where(eq(candidatesTable.id, params.data.id));
//   //if (!row) {
//   //res.status(404).json({ error: "Candidate not found" });
//   //return;
//   //}
//   // res.json(GetCandidateResponse.parse(serializeCandidate(row)));
//   const [row] = await db
//     .select()
//     .from(candidatesTable)
//     .where(eq(candidatesTable.id, params.data.id));

//   if (!row) {
//     res.status(404).json({ error: "Candidate not found" });
//     return;
//   }

//   // 👇 Ye 3 logs add karo
//   // console.log("DB ROW =", row);
//   // console.log("DB englishLevel =", row.englishLevel);

//   const candidate = serializeCandidate(row);

//   // console.log("Serialized =", candidate);
//   // console.log("Serialized englishLevel =", candidate.englishLevel);

//   // 👇 Temporary parse hata do
//   // res.json(candidate);
//   res.json({
//   ...serializeCandidate(row.candidate),
//   candidateCode: row.candidateCode,
// });


// });
router.get(
  "/candidates/:id",
  requireAuth,
  async (req, res): Promise<void> => {
    const params = GetCandidateParams.safeParse(req.params);

    if (!params.success) {
      res.status(400).json({
        error: params.error.message,
      });
      return;
    }

    if (
      req.user!.role === "candidate" &&
      req.user!.candidateId !== params.data.id
    ) {
      res.status(403).json({
        error: "Insufficient permissions",
      });
      return;
    }

    const [row] = await db
      .select()
      .from(candidatesTable)
      .where(eq(candidatesTable.id, params.data.id));

    if (!row) {
      res.status(404).json({
        error: "Candidate not found",
      });
      return;
    }

    // console.log("Candidate Row =", row);
    // console.log(
    //   "Candidate Code =",
    //   row.candidateCode
    // );

    const candidate = serializeCandidate(row);

    res.json({
      ...candidate,

      candidateCode: row.candidateCode ?? null,

      preferredWorkMode:
        row.preferredWorkMode ?? null,

      careerPreference:
        row.careerPreference ?? null,
    });
  }
);
// router.post("/candidates/:id/cv", requireAuth, requireCandidateAccess(), async (req, res): Promise<void> => {
//   const params = UploadCvParams.safeParse(req.params);
//   if (!params.success) {
//     res.status(400).json({ error: params.error.message });
//     return;
//   }
//   const body = UploadCvBody.safeParse(req.body);
//   if (!body.success) {
//     res.status(400).json({ error: body.error.message });
//     return;
//   }
//   console.log("CV Upload Request =", body.data);

//   const [row] = await db
//     .update(candidatesTable)
//     .set({ cv: body.data })
//     .where(eq(candidatesTable.id, params.data.id))
//     .returning();
//   if (!row) {
//     res.status(404).json({ error: "Candidate not found" });
//     return;
//   }
//   res.json(UploadCvResponse.parse(serializeCandidate(row)));
// });
import { processAndSaveCv } from "../lib/cv-processor";

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
      console.error("CV upload and processing error:", err);
      return res.status(500).json({
        error: "Failed to process uploaded CV",
        details: err instanceof Error ? err.message : String(err),
      });
    }
  }
);
export default router;

