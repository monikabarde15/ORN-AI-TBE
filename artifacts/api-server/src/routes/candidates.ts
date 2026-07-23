// artifacts\api-server\src\routes\candidates.ts
import { Router, type IRouter } from "express";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../lib/s3";
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

import { requireAuth, requireRole, requireCandidateAccess } from "../lib/auth";
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,

  auth:{
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
          await transporter.sendMail({
  from: `"ORN-AI" <${process.env.SMTP_USER}>`,
  to: row.email,
  subject: "Welcome to ORN-AI – Registration Successful",
  html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Welcome to ORN-AI</title>
</head>

<body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:40px 0;">
<tr>
<td align="center">

<table width="700" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #e5e5e5;">

<tr>
<td style="background:#163c7a;padding:30px;text-align:center;">
<h1 style="margin:0;color:#ffffff;font-size:30px;">
Welcome to ORN-AI
</h1>
</td>
</tr>

<tr>
<td style="padding:40px;">

<p style="font-size:16px;color:#333;">
Dear <strong>${row.fullName}</strong>,
</p>

<p style="font-size:15px;color:#555;line-height:1.8;">
Thank you for registering with us. We are delighted to have you join our growing network of professionals across the UK, Europe and global markets.
</p>

<p style="font-size:15px;color:#555;line-height:1.8;">
<strong>ORN-AI</strong> is a Talent Conditioning and Career-Readiness Platform that supports job seekers, active candidates and consultants through assessment, upskilling, hands-on learning and career opportunities.
</p>

<p style="font-size:15px;color:#555;line-height:1.8;">
Your initial registration has been completed, and your account is now ready for activation.
</p>

<hr style="margin:35px 0;border:none;border-top:1px solid #e5e5e5;">

<h2 style="color:#163c7a;margin-top:0;">
Access Your ORN-AI Portal
</h2>

<p style="font-size:15px;color:#555;">
Click the button below to access your ORN-AI Candidate Portal.
</p>

<div style="text-align:center;margin:30px 0;">

<a href="https://orn-ai.com/"
style="background:#2563eb;
color:#ffffff;
padding:14px 30px;
text-decoration:none;
border-radius:6px;
display:inline-block;
font-weight:bold;
font-size:15px;">
Access ORN-AI Portal
</a>

</div>

<p style="font-size:14px;color:#666;">
If the button above does not work, copy and paste this URL into your browser:
</p>

<p>
<a href="https://orn-ai.com/" style="color:#2563eb;">
https://orn-ai.com/
</a>
</p>

<hr style="margin:35px 0;border:none;border-top:1px solid #e5e5e5;">

<h2 style="color:#163c7a;">
How to Activate Your Account
</h2>

<ol style="color:#555;line-height:2;">
<li>Click the portal link above.</li>
<li>Sign in using your registered email address.</li>
<li>Enter the One-Time Password (OTP) sent to your email.</li>
<li>Access your ORN-AI Candidate Dashboard.</li>
</ol>

<hr style="margin:35px 0;border:none;border-top:1px solid #e5e5e5;">

<h2 style="color:#163c7a;">
Your Login Details
</h2>

<table cellpadding="8" cellspacing="0" width="100%" style="border-collapse:collapse;border:1px solid #ddd;">

<tr style="background:#f8fafc;">
<td width="180"><strong>Email</strong></td>
<td>${row.email}</td>
</tr>

<tr>
<td><strong>Password</strong></td>
<td>${parsed.data.password}</td>
</tr>

</table>

<hr style="margin:35px 0;border:none;border-top:1px solid #e5e5e5;">

<h2 style="color:#163c7a;">
Verify Your Profile
</h2>

<p style="color:#555;line-height:1.8;">
Once logged in, please review and confirm your profile information, including:
</p>

<ul style="color:#555;line-height:2;">
<li>Contact details</li>
<li>Professional experience</li>
<li>Skills and certifications</li>
<li>Career preferences</li>
<li>Availability status</li>
</ul>

<p style="color:#555;">
You may update any information before proceeding.
</p>

<hr style="margin:35px 0;border:none;border-top:1px solid #e5e5e5;">

<h2 style="color:#163c7a;">
Complete Your GDPR Consent
</h2>

<p style="color:#555;line-height:1.8;">
To activate your account and enable ORN-AI services, please review and provide your consent to our GDPR Privacy & Data Processing Policy.
</p>

<p style="color:#555;">
Once consent is provided, your profile will become eligible for:
</p>

<ul style="color:#555;line-height:2;">
<li>Career Readiness Assessment</li>
<li>Job-ready Conditioning & Upskilling</li>
<li>Access to Learning Resources</li>
<li>Live Project Opportunities</li>
<li>Interview Readiness Support</li>
<li>Relevant Customer Opportunities</li>
</ul>

<p style="color:#555;line-height:1.8;">
Please note that your profile remains under your control at all times. Your CV, personal details and contact information will never be shared with any customer without your approval for a specific opportunity.
</p>

<hr style="margin:35px 0;border:none;border-top:1px solid #e5e5e5;">

<h2 style="color:#163c7a;">
Need Assistance?
</h2>

<p style="color:#555;line-height:1.8;">
If you have any questions or require assistance, our support team will be happy to help.
</p>

<p style="line-height:2;">
🌐 Website:
<a href="https://orn-ai.com/" style="color:#2563eb;">
https://orn-ai.com/
</a>
</p>

<p style="line-height:2;">
📧 Email:
<a href="mailto:connect@orn-ai.co.uk" style="color:#2563eb;">
connect@orn-ai.co.uk
</a>
</p>

<p style="color:#555;line-height:1.8;">
We look forward to supporting you throughout your career journey.
</p>

<p style="margin-top:35px;color:#555;">
Kind Regards,<br><br>

<strong style="font-size:16px;">
ORN-AI Team
</strong>
</p>

</td>
</tr>

<tr>
<td style="background:#163c7a;padding:20px;text-align:center;color:#ffffff;font-size:13px;">

© ${new Date().getFullYear()} ORN-AI. All Rights Reserved.
<br><br>

<a href="https://orn-ai.com/"
style="color:#ffffff;text-decoration:none;">
https://orn-ai.com/
</a>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`,
});
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

    const key =
      `resume/${candidateId}/${Date.now()}-${req.file.originalname}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      })
    );

    const fileUrl =
      `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    console.log("S3 URL =", fileUrl);

    const [candidate] = await db
      .update(candidatesTable)
      .set({
        cv: {
          fileName: req.file.originalname,
          key,
          url: fileUrl,
        },
      })
      .where(eq(candidatesTable.id, candidateId))
      .returning();

    return res.json({
      success: true,
      cv: candidate.cv,
    });
  }
);
export default router;
