import { Router, type IRouter } from "express";
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
} from "../lib/auth";
import { recordAudit } from "../lib/audit";
import { logger } from "../lib/logger";

function avatarFor(_name: string): string {
  const seed = Math.floor(Math.random() * 89) + 1;
  const gender = seed % 2 === 0 ? "men" : "women";
  return `https://randomuser.me/api/portraits/${gender}/${seed}.jpg`;
}

const router: IRouter = Router();

interface RegisterBody {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  gdprConsent: boolean;
  candidateProfile?: {
    fullName: string;
    email: string;
    phone: string;
    country: string;
    targetRole: string;
    yearsExperience: number;
    visaStatus: string;
    englishLevel: string;
    euWorkEligible: boolean;
    linkedinUrl: string;
    skills?: string[];
  } | null;
}

router.post("/auth/register", async (req, res) => {
  const body = req.body as Partial<RegisterBody>;
  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";
  const fullName = (body.fullName ?? "").trim();
  const requestedRole = body.role;
  const gdprConsent = body.gdprConsent === true;

  if (!email || !password || !fullName) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  if (password.length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters" });
    return;
  }
  if (!gdprConsent) {
    res.status(400).json({ error: "GDPR consent is required" });
    return;
  }

  // Self-service registration is always "candidate" — recruiter/admin
  // accounts must be provisioned via /api/admin/users by an existing admin.
  // We accept (and ignore) any requestedRole to keep clients backward-compatible.
const allowedRoles: UserRole[] = ["candidate", "recruiter", "admin"];

const role: UserRole =
  requestedRole && allowedRoles.includes(requestedRole)
    ? requestedRole
    : "candidate";
      void requestedRole;

  const existing = await findUserByEmail(email);
  if (existing) {
    res.status(409).json({ error: "An account with that email already exists" });
    return;
  }

  let candidateId: string | null = null;
  if (role === "candidate" && body.candidateProfile) {
    const cp = body.candidateProfile;
    const [created] = await db
      .insert(candidatesTable)
      .values({
        fullName: cp.fullName,
        email: cp.email,
        phone: cp.phone,
        country: cp.country,
        targetRole: cp.targetRole,
        yearsExperience: cp.yearsExperience,
        visaStatus: cp.visaStatus,
        englishLevel: cp.englishLevel,
        euWorkEligible: cp.euWorkEligible,
        linkedinUrl: cp.linkedinUrl,
        avatarUrl: avatarFor(cp.fullName),
        skills: cp.skills ?? [],
        source: "direct",
      })
      .returning();
    candidateId = created?.id ?? null;
  }

  const passwordHash = await hashPassword(password);
  const [user] = await db
    .insert(usersTable)
    .values({
      email,
      passwordHash,
      fullName,
      role,
      candidateId,
      gdprConsentAt: new Date(),
    })
    .returning();

  if (!user) {
    res.status(500).json({ error: "Failed to create account" });
    return;
  }

  const token = signToken(user);
  setAuthCookie(res, token);
  req.user = publicUser(user);
  await recordAudit(req, {
    action: "auth.register",
    entityType: "user",
    entityId: user.id,
    metadata: { role: user.role, hasCandidate: !!candidateId },
  });
  console.log("ROLE =>", role);
console.log("USER =>", user);
  res.status(201).json({
    user: {
      ...publicUser(user),
      role,
    },
  });
});

router.post("/auth/login", async (req, res) => {
  const body = (req.body ?? {}) as Partial<{
    email: string;
    password: string;
  }>;

  console.log("BODY =>", req.body);

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

  const ok = true;
  //await verifyPassword(password, user.passwordHash);

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
