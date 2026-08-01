// artifacts\api-server\src\routes\auth.ts
import { Router, type IRouter } from "express";
import nodemailer from "nodemailer";
import { getRegistrationEmailTemplate, getOtpEmailTemplate, sendMailWithRetry } from "../lib/mail";
import { evaluateWithAI } from "../lib/evaluation-full-ai";
import {
  db,
  usersTable,
  candidatesTable,
  type UserRole,
} from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import {
  hashPassword,
  verifyPassword,
  signToken,
  setAuthCookie,
  clearAuthCookie,
  findUserByEmail,
  publicUser,
  requireAuth,
  isStrongPassword,
  STRONG_PASSWORD_MESSAGE,
} from "../lib/auth";
import { recordAudit } from "../lib/audit";
import { logger } from "../lib/logger";

function avatarFor(_name: string): string {
  const seed = Math.floor(Math.random() * 89) + 1;
  const gender = seed % 2 === 0 ? "men" : "women";
  return gender === "women"
    ? "https://api.dicebear.com/10.x/personas/svg?seed=female"
    : "https://api.dicebear.com/10.x/personas/svg?seed=male";
  // return `https://randomuser.me/api/portraits/${gender}/${seed}.jpg`;
}
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
const router: IRouter = Router();

// Registration details arrive from both the public candidate flow and the
// administrator-created user flow. Keep these checks at the API boundary so
// clients cannot bypass them by posting directly to this route.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^\+?[1-9]\d{6,14}$/;

function normalizePhone(value: unknown): string {
  return String(value ?? "").trim().replace(/[\s().-]/g, "");
}

function isValidPhone(value: unknown): boolean {
  const phone = normalizePhone(value);

  return PHONE_PATTERN.test(phone) && !/^(\+?)(\d)\2+$/.test(phone);
}

function isValidEmail(value: string): boolean {
  return value.length <= 254 && EMAIL_PATTERN.test(value);
}

async function generateCandidateCode(): Promise<string> {
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
async function generateEmployeeId(): Promise<string> {
  const lastEmployee = await db
    .select({
      employeeId: usersTable.employeeId,
    })
    .from(usersTable)
    .where(sql`employee_id IS NOT NULL`)
    .orderBy(sql`employee_id DESC`)
    .limit(1);

  let nextNumber = 1;

  if (
    lastEmployee.length &&
    lastEmployee[0].employeeId
  ) {
    const match =
      lastEmployee[0].employeeId.match(/(\d+)$/);

    if (match) {
      nextNumber =
        parseInt(match[1], 10) + 1;
    }
  }

  return `ORN-AI-E-${String(nextNumber).padStart(3, "0")}`;
}
interface RegisterBody {
  createdByAdmin: boolean;
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  gdprConsent: boolean;

  firstName?: string;
  middleName?: string;
  lastName?: string;

  phone?: string;
  mobile?: string;
  username?: string;
  employeeId?: string;

  company?: string;
  department?: string;
  designation?: string;
  currentLocation?: string;
  country?: string;
  state?: string;
  city?: string;

  status?: "Active" | "Inactive";

  sendWelcomeEmail?: boolean;
  forcePasswordChange?: boolean;
  emailCredentials?: boolean;

  candidateProfile?: {
    fullName: string;
    email: string;
    phone: string;
    currentLocation?: string;
    city?: string;
    country: string;

    targetRole?: string;
    currentRole?: string;
    preferredRole?: string;

    yearsExperience?: number;
    yearsOfExperience?: string | number;

    visaStatus?: string;

    englishLevel?: string;

    euWorkEligible?: boolean;

    linkedinUrl?: string;

    skills?: string[];
    languagesKnown?: string[];
    interestedSkills?: string[];

    availability?: string;
    careerPreference?: string | string[];
    expectedSalary?: string;
    preferredWorkMode?: string | string[];

    // Future compatibility
    [key: string]: unknown;
  } | null;
}

// router.post("/auth/register", async (req, res) => {
//   try {
//     const body = req.body as Partial<RegisterBody>;
//     const createdByAdmin = body.createdByAdmin === true;
//     const email = (body.email ?? "").trim().toLowerCase();
//     const password = body.password ?? "";

//     const fullName = (body.fullName ?? "").trim();
//     const gdprConsent = body.gdprConsent === true;
//     const requestedRole = body.role as unknown as UserRole | undefined;

//     if (!isValidEmail(email)) {
//       return res.status(400).json({
//         error: "Please provide a valid email address",
//       });
//     }

//     if (!isStrongPassword(password)) {
//       return res.status(400).json({
//         error: STRONG_PASSWORD_MESSAGE,
//       });
//     }

//     if (!gdprConsent) {
//       return res.status(400).json({
//         error: "GDPR consent is required",
//       });
//     }

//     const allowedRoles: UserRole[] = [
//       "candidate",
//       "recruiter",
//       "instructor",
//       "mentor",
//       "content_manager",
//       "admin",
//       "super_admin",
//     ];

//     const role: UserRole =
//       requestedRole && allowedRoles.includes(requestedRole)
//         ? requestedRole
//         : "candidate";

//     if (role !== "candidate" && !isValidPhone(body.mobile)) {
//       return res.status(400).json({
//         error: "Please provide a valid phone number with 7 to 15 digits",
//       });
//     }

//     const existing = await findUserByEmail(email);

//     if (existing) {
//       return res.status(409).json({
//         error: "An account with that email already exists",
//       });
//     }

//     let candidateId: string | null = null;
//     let candidateCode: string | null = null;  

//     if (role === "candidate") {
//       const rawProfile = body.candidateProfile;
//       const cp = rawProfile
//         ? rawProfile
//         : {
//             fullName: body.fullName ?? fullName,
//             email: body.email ?? email,
//             phone: body.phone ?? "",
//             currentLocation: body.currentLocation,
//             city: body.city,
//             currentRole: body.currentRole,
//             preferredRole: body.preferredRole,
//             country: body.country,
//             targetRole: body.targetRole,
//             yearsExperience: body.yearsExperience,
//             yearsOfExperience: body.yearsOfExperience,
//             visaStatus: body.visaStatus,
//             englishLevel: body.englishLevel,
//             euWorkEligible: body.euWorkEligible,
//             linkedinUrl: body.linkedinUrl,
//             skills: body.skills,
//             languagesKnown: body.languagesKnown,
//             interestedSkills: body.interestedSkills,
//             availability: body.availability,
//             careerPreference: body.careerPreference,
//             expectedSalary: body.expectedSalary,
//             preferredWorkMode: body.preferredWorkMode,
//           };

//       if (cp) {
//         const profileEmail = String(cp.email ?? "").trim().toLowerCase();
//         const phone = normalizePhone(cp.phone);

//         if (!isValidEmail(profileEmail) || profileEmail !== email) {
//           return res.status(400).json({
//             error: "Candidate email must be a valid address matching the account email",
//           });
//         }

//         if (!isValidPhone(phone)) {
//           return res.status(400).json({
//             error: "Please provide a valid phone number with 7 to 15 digits",
//           });
//         }

//         const englishLevelMap: Record<
//           string,
//           "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
//         > = {
//           Beginner: "A1",
//           Elementary: "A2",
//           Intermediate: "B1",
//           UpperIntermediate: "B2",
//           Advanced: "C1",
//           Fluent: "C2",
//           A1: "A1",
//           A2: "A2",
//           B1: "B1",
//           B2: "B2",
//           C1: "C1",
//           C2: "C2",
//         };

//         let yearsExperience = 0;

//         if (typeof cp.yearsExperience === "number") {
//           yearsExperience = cp.yearsExperience;
//         } else if (cp.yearsOfExperience) {
//           yearsExperience =
//             parseInt(String(cp.yearsOfExperience).split("-")[0], 10) || 0;
//         }

//         candidateCode = await generateCandidateCode();

//         const [created] = await db
//           .insert(candidatesTable)
//           .values({
//             candidateCode,
//             fullName: cp.fullName ?? fullName,
//             email: profileEmail,
//             phone,
//             currentLocation: (cp.currentLocation as string) ?? "",
//             city: (cp as any).city ?? "",
//             currentRole: cp.currentRole ?? "",
//             preferredRole: cp.preferredRole ?? "",
//             country: cp.country ?? "",
//             targetRole:
//               cp.targetRole ??
//               cp.currentRole ??
//               cp.preferredRole ??
//               "Unknown",
//             yearsExperience,
//             expectedSalary: cp.expectedSalary ?? "",
//             availability: cp.availability ?? "",
//             careerPreference: Array.isArray(cp.careerPreference)
//               ? (cp.careerPreference as string[])
//               : cp.careerPreference
//               ? [String(cp.careerPreference)]
//               : [],
//             preferredWorkMode: Array.isArray(cp.preferredWorkMode)
//               ? (cp.preferredWorkMode as string[])
//               : cp.preferredWorkMode
//               ? [String(cp.preferredWorkMode)]
//               : [],
//             interestedSkills: Array.isArray((cp as any).interestedSkills)
//               ? (cp as any).interestedSkills
//               : [],
//             visaStatus: cp.visaStatus ?? "requires_sponsorship",
//             englishLevel:
//               englishLevelMap[cp.englishLevel ?? ""] ?? "B1",
//             euWorkEligible: cp.euWorkEligible ?? false,
//             linkedinUrl: cp.linkedinUrl ?? "",
//             languagesKnown: Array.isArray((cp as any).languagesKnown)
//               ? (cp as any).languagesKnown
//               : [],
//             avatarUrl: avatarFor(cp.fullName ?? fullName),
//             skills: cp.skills ?? [],
//             source: "direct",
//           })
//           .returning();

//         candidateId = created.id;
//       }
//     }

//     const passwordHash = await hashPassword(password);
//     let employeeId: string | null = null;

// if (role !== "candidate") {
//   employeeId = await generateEmployeeId();
// }


//     /* const [user] = await db
//        .insert(usersTable)
//        .values({
//          email,
//          passwordHash,
//          fullName,
//          role,
//          candidateId,
//          gdprConsentAt: new Date(),
//        })
//        .returning();*/

//     if (body.username) {
//       const existingUsername = await db
//         .select()
//         .from(usersTable)
//         .where(eq(usersTable.username, body.username))
//         .limit(1);

//       if (existingUsername.length > 0) {
//         return res.status(409).json({
//           error: "Username already exists",
//         });
//       }
//     }
//     const [user] = await db
//   .insert(usersTable)
//   .values({
//     email,
//     passwordHash,
//     fullName,
//     candidateId,

//     firstName: body.firstName ?? null,
//     middleName: body.middleName ?? null,
//     lastName: body.lastName ?? null,

//     mobile: body.mobile ? normalizePhone(body.mobile) : null,
//     username: body.username ?? null,
//     employeeId,

//     role,
//     status: body.status ?? "Active",

//     company: body.company ?? null,
//     department: body.department ?? null,
//     designation: body.designation ?? null,

//     country: body.country ?? null,
//     state: body.state ?? null,
//     city: body.city ?? null,

//     forcePasswordChange:
//       body.forcePasswordChange ?? false,

//     sendWelcomeEmail:
//       body.sendWelcomeEmail ?? false,

//     emailCredentials:
//       body.emailCredentials ?? false,

//     gdprConsentAt: new Date(),
//   })
//   .returning();
//     if (!user) {
//       return res.status(500).json({
//         error: "Failed to create account",
//       });
//     }

//     /*const token = signToken(user);

//     setAuthCookie(res, token);

//     req.user = publicUser(user);*/
//     if (!createdByAdmin) {
//       const token = signToken(user);

//       setAuthCookie(res, token);

//       req.user = publicUser(user);
//     }

//     await recordAudit(req, {
//       action: "auth.register",
//       entityType: "user",
//       entityId: user.id,
//       metadata: {
//         role: user.role,
//         hasCandidate: !!candidateId,
//       },
//     });

//     // console.log("ROLE =>", role);
//     // console.log("USER =>", user);

//     return res.status(201).json({
//         user: {
//           ...publicUser(user),
//           role,
//           candidateId,
//           candidateCode,
//         },
//       });
//   }catch (err: any) {
//       console.error("=========== REGISTER ERROR ===========");
//       console.dir(err, { depth: null });

//       const pg = err?.cause ?? err;

//       return res.status(500).json({
//         error: pg?.message || "Failed to create account",
//         code: pg?.code,
//         detail: pg?.detail,
//         constraint: pg?.constraint,
//         table: pg?.table,
//         column: pg?.column,
//       });
//     }
// });

router.post("/auth/register", async (req, res) => {

  try {

    const body = req.body as Partial<RegisterBody>;


    const email =
      (body.email ?? "")
        .trim()
        .toLowerCase();


    const password =
      body.password ?? "";


    const fullName =
      (body.fullName ?? "").trim();


    if (!isValidEmail(email)) {
      return res.status(400).json({
        error: "Invalid email"
      });
    }


    if (!isStrongPassword(password)) {
      return res.status(400).json({
        error: STRONG_PASSWORD_MESSAGE
      });
    }


    if (body.gdprConsent !== true) {
      return res.status(400).json({
        error: "GDPR consent required"
      });
    }



    const role: UserRole =
      [
        "candidate",
        "recruiter",
        "instructor",
        "mentor",
        "content_manager",
        "admin",
        "super_admin"
      ].includes(body.role as any)
        ?
        body.role as UserRole
        :
        "candidate";



    const existing =
      await findUserByEmail(email);


    if (existing) {
      return res.status(409).json({
        error: "Email already exists"
      });
    }



    let candidateId: string | null = null;
    let candidateCode: string | null = null;



    // =====================
    // CREATE CANDIDATE
    // =====================

    if (role === "candidate") {


      const cp =
        body.candidateProfile;



      if (cp) {


        const phone =
          normalizePhone(cp.phone);



        if (!isValidPhone(phone)) {
          return res.status(400).json({
            error: "Invalid phone"
          });
        }



        candidateCode =
          await generateCandidateCode();



        const [candidate] =
          await db.insert(candidatesTable)
            .values({


              candidateCode,


              fullName:
                cp.fullName ?? fullName,


              email,


              phone,


              currentLocation:
                cp.currentLocation ?? "",


              city:
                cp.city ?? "",


              currentRole:
                cp.currentRole ?? "",


              preferredRole:
                cp.preferredRole ?? "",


              country:
                cp.country ?? "",


              targetRole:
                cp.targetRole ??
                cp.currentRole ??
                "Unknown",



              yearsExperience:
                Number.isFinite(
                  Number(cp.yearsExperience)
                )
                  ?
                  Number(cp.yearsExperience)
                  :
                  0,



              visaStatus:
                cp.visaStatus ??
                "requires_sponsorship",



              englishLevel:
                cp.englishLevel ??
                "B1",



              euWorkEligible:
                cp.euWorkEligible === true,



              linkedinUrl:
                cp.linkedinUrl ?? "",



              avatarUrl:
                avatarFor(fullName),



              skills:
                Array.isArray(cp.skills)
                  ?
                  cp.skills
                  :
                  [],



              languagesKnown:
                Array.isArray(cp.languagesKnown)
                  ?
                  cp.languagesKnown
                  :
                  [],



              interestedSkills:
                Array.isArray(cp.interestedSkills)
                  ?
                  cp.interestedSkills
                  :
                  [],



              expectedSalary:
                cp.expectedSalary ?? "",



              availability:
                cp.availability ?? "",



              careerPreference:
                Array.isArray(cp.careerPreference)
                  ?
                  cp.careerPreference
                  :
                  [],



              preferredWorkMode:
                Array.isArray(cp.preferredWorkMode)
                  ?
                  cp.preferredWorkMode
                  :
                  [],



              source: "direct"


            })
            .returning();



        candidateId =
          candidate.id;


      }

    }



    // =====================
    // OTP
    // =====================


    const otp =
      Math.floor(
        100000 +
        Math.random() * 900000
      )
        .toString();



    const otpExpiry =
      new Date(
        Date.now() + 10 * 60 * 1000
      );



    const passwordHash =
      await hashPassword(password);



    let employeeId = null;


    if (role !== "candidate") {
      employeeId =
        await generateEmployeeId();
    }




    // =====================
    // CREATE USER
    // =====================


    const [user] =
      await db.insert(usersTable)
        .values({

          email,

          passwordHash,

          fullName,


          candidateId,


          role,


          employeeId,


          emailOtp:
            otp,


          emailOtpExpiry:
            otpExpiry,


          isEmailVerified: false,


          mobile:
            body.mobile
              ?
              normalizePhone(body.mobile)
              :
              null,


          username:
            body.username ?? null,


          status: "Active",


          gdprConsentAt:
            new Date()

        })
        .returning();





    // =====================
    // SEND OTP EMAIL
    // =====================

    // const html = getOtpEmailTemplate(otp, fullName);
    const html = getOtpEmailTemplate({
      otp: otp,
      recipientName: fullName
    });
    await sendMailWithRetry({
      from: `"ORN-AI" <${process.env.SMTP_USER || "connect@orn-ai.co.uk"}>`,
      to: email,
      subject: "ORN-AI Email Verification OTP",
      html,
    });

    const registrationHtml = getRegistrationEmailTemplate({
      recipientName: fullName,
      username: fullName,
      password: password, // Plain password jo user ne diya hai
      joinUrl: process.env.FRONTEND_URL || "http://localhost:5173"
    });

    await sendMailWithRetry({
      from: `"ORN-AI" <${process.env.SMTP_USER || "connect@orn-ai.co.uk"}>`,
      to: email,
      subject: "Welcome to ORN-AI – Registration Successful",
      html: registrationHtml,
    });


    const token = signToken(user);

    setAuthCookie(res, token);

    req.user = publicUser(user);

    return res.status(201).json({

      success: true,

      message:
        "Registration successful. OTP sent",

      email,

      candidateCode,
      candidateId,

    });



  } catch (err: any) {

    console.log(err);


    return res.status(500).json({

      error:
        err.message ||
        "Registration failed"

    });


  }


});
router.post("/auth/resend-otp", async (req, res) => {
  try {
    const email = (req.body.email || "").trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ error: "Email already verified" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await db
      .update(usersTable)
      .set({
        emailOtp: otp,
        emailOtpExpiry: otpExpiry,
      })
      .where(eq(usersTable.id, user.id));

    const html = getOtpEmailTemplate(otp, user.fullName);

    await sendMailWithRetry({
      from: `"ORN-AI" <${process.env.SMTP_USER || "connect@orn-ai.co.uk"}>`,
      to: email,
      subject: "ORN-AI Email Verification OTP",
      html,
    });

    return res.json({
      success: true,
      message: "New OTP sent successfully",
    });
  } catch (err: any) {
    console.error("RESEND OTP ERROR =>", err);
    return res.status(500).json({
      error: err?.message || "Failed to resend OTP",
    });
  }
});

router.post("/auth/verify-email", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await findUserByEmail(
      email.trim().toLowerCase()
    );

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        error: "Email already verified",
      });
    }

    if (user.emailOtp !== otp) {
      return res.status(400).json({
        error: "Invalid OTP",
      });
    }

    if (
      !user.emailOtpExpiry ||
      new Date() > user.emailOtpExpiry
    ) {
      return res.status(400).json({
        error: "OTP expired",
      });
    }

    await db
      .update(usersTable)
      .set({
        isEmailVerified: true,
        emailOtp: null,
        emailOtpExpiry: null,
      })
      .where(eq(usersTable.id, user.id));

    let candidateId = user.candidateId;

    if (candidateId) {
      const [candidate] = await db
        .select()
        .from(candidatesTable)
        .where(eq(candidatesTable.id, candidateId));

      if (
        candidate &&
        candidate.cv &&
        !candidate.evaluation
      ) {
        try {
          console.log("====================================");
          console.log("AI EVALUATION INPUT");
          console.log("====================================");

          console.log("Candidate ID:", candidate.id);
          console.log("Name:", candidate.fullName);
          console.log("Email:", candidate.email);
          console.log("Target Role:", candidate.targetRole);
          console.log("Skills:", candidate.skills);
          console.log("Years Experience:", candidate.yearsExperience);

          console.log("CV DATA:");
          console.dir(candidate.cv, { depth: null });

          console.log(
            "CV JSON:",
            JSON.stringify(candidate.cv, null, 2)
          );

          const result = await evaluateWithAI({
            id: candidate.id,
            fullName: candidate.fullName,
            email: candidate.email,
            englishLevel: candidate.englishLevel,
            visaStatus: candidate.visaStatus,
            yearsExperience: candidate.yearsExperience,
            euWorkEligible: candidate.euWorkEligible,
            targetRole: candidate.targetRole,
            country: candidate.country,
            skills: candidate.skills,
            careerGapMonths: candidate.careerGapMonths ?? 0,
            cv: candidate.cv as any,
            resumeText: (candidate.cv as any)?.rawText ?? null,
            resumeAnalysis: (candidate.cv as any)?.resumeAnalysis ?? null,
          });
          await db
            .update(candidatesTable)
            .set({
              evaluation: result,
            })
            .where(eq(candidatesTable.id, candidate.id));
        } catch (e) {
          console.error(
            "AI Evaluation Failed:",
            e
          );
        }
      }
    }

    const token = signToken(user);

    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      candidateId,
    });
  } catch (err: any) {
    console.error(err);

    return res.status(500).json({
      error: err.message,
    });
  }
});
router.post("/auth/login", async (req, res) => {
  const body = (req.body ?? {}) as Partial<{
    email: string;
    password: string;
  }>;

  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";

  if (!email || !password) {
    return res.status(400).json({
      error: "Email and password are required",
    });
  }

  const user = await findUserByEmail(email);

  if (!user) {
    return res.status(401).json({
      error: "Invalid credentials",
    });
  }

  const ok = await verifyPassword(password, user.passwordHash);

  if (!ok) {
    return res.status(401).json({
      error: "Invalid credentials",
    });
  }

  const token = signToken(user);

  setAuthCookie(res, token);

  req.user = publicUser(user);

  await recordAudit(req, {
    action: "auth.login",
    entityType: "user",
    entityId: user.id,
  });

  return res.status(200).json({
    user: publicUser(user),
  });
});

router.put("/auth/change-password", requireAuth, async (req, res) => {
  try {
    const newPassword =
      typeof req.body?.newPassword === "string"
        ? req.body.newPassword
        : typeof req.body?.password === "string"
          ? req.body.password
          : "";

    const targetUserId =
      typeof req.body?.userId === "string"
        ? req.body.userId
        : req.user?.id;

    if (!targetUserId) {
      return res.status(400).json({
        success: false,
        error: "User ID is required",
      });
    }

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        error: "New password is required",
      });
    }

    if (req.user?.role !== "admin" && req.user?.role !== "super_admin" && req.user?.id !== targetUserId) {
      return res.status(403).json({
        success: false,
        error: "You can only change your own password",
      });
    }

    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({
        success: false,
        error: STRONG_PASSWORD_MESSAGE,
      });
    }

    const passwordHash = await hashPassword(newPassword);
    const [updatedUser] = await db
      .update(usersTable)
      .set({ passwordHash })
      .where(eq(usersTable.id, targetUserId))
      .returning({ id: usersTable.id });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    return res.json({
      success: true,
      message: "Password changed successfully",
      userId: targetUserId,
    });
  } catch (error: any) {
    console.error("CHANGE PASSWORD ERROR", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Unable to update password",
    });
  }
});

router.post("/auth/logout", async (req, res) => {
  if (req.user) {
    await recordAudit(req, {
      action: "auth.logout",
      entityType: "user",
      entityId: req.user.id,
    });
  }
  clearAuthCookie(res);
  res.status(204).end();
});

router.get("/auth/me", (req, res) => {
  res.status(200).json(req.user ?? null);
});

// Convenience: allow a logged-in candidate to refresh their candidateId link
// in case they upgraded from a recruiter-created profile.
router.post("/auth/link-candidate", requireAuth, async (req, res) => {
  const user = req.user!;
  if (user.role !== "candidate") {
    res.status(403).json({ error: "Only candidates can link a profile" });
    return;
  }
  const candidateId = (req.body as { candidateId?: string }).candidateId;
  if (!candidateId) {
    res.status(400).json({ error: "candidateId is required" });
    return;
  }
  await db
    .update(usersTable)
    .set({ candidateId })
    .where(eq(usersTable.id, user.id));
  res.status(200).json({ ok: true });
});

// Internal helper: silence linter about unused sql import while keeping the
// drizzle helper available for future filters.
void sql;
void logger;

export default router;
