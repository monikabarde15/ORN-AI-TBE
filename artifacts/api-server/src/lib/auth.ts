import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db, usersTable, type UserRow, type UserRole } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import type { Request, Response, NextFunction, RequestHandler } from "express";
import { logger } from "./logger";

const SECRET = process.env["SESSION_SECRET"];
if (!SECRET) {
  throw new Error("SESSION_SECRET env var is required");
}

const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days
export const AUTH_COOKIE = "orn_session";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  candidateId: string | null;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

interface TokenPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(
  plain: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function signToken(user: Pick<UserRow, "id" | "email" | "role">): string {
  const payload: TokenPayload = {
    sub: user.id,
    email: user.email,
    role: user.role as UserRole,
  };
  return jwt.sign(payload, SECRET as string, { expiresIn: TOKEN_TTL_SECONDS });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, SECRET as string) as TokenPayload;
  } catch {
    return null;
  }
}

export function setAuthCookie(res: Response, token: string): void {
  res.cookie(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env["NODE_ENV"] === "production",
    maxAge: TOKEN_TTL_SECONDS * 1000,
    path: "/",
  });
}

export function clearAuthCookie(res: Response): void {
  res.clearCookie(AUTH_COOKIE, { path: "/" });
}

function extractToken(req: Request): string | null {
  const cookieToken = (req as Request & { cookies?: Record<string, string> })
    .cookies?.[AUTH_COOKIE];
  if (cookieToken) return cookieToken;
  const auth = req.header("authorization");
  if (auth && auth.toLowerCase().startsWith("bearer ")) {
    return auth.slice(7).trim();
  }
  return null;
}

async function loadUser(userId: string): Promise<AuthUser | null> {
  const [row] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1);
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    fullName: row.fullName,
    role: row.role as UserRole,
    candidateId: row.candidateId ?? null,
  };
}

/**
 * Soft-attach the current user if a valid token is present, but never reject.
 * Use on routes that have anonymous + authenticated behaviour.
 */
export const attachUser: RequestHandler = async (req, _res, next) => {
  const token = extractToken(req);
  if (!token) return next();
  const payload = verifyToken(token);
  if (!payload) return next();
  try {
    const user = await loadUser(payload.sub);
    if (user) req.user = user;
  } catch (err) {
    logger.warn({ err }, "attachUser: failed to load session user");
  }
  next();
};

export const requireAuth: RequestHandler = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  next();
};

export function requireRole(...roles: UserRole[]): RequestHandler {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: "Insufficient permissions" });
      return;
    }
    next();
  };
}

/**
 * Authorize candidate-scoped routes. Recruiters/admins always pass; a
 * "candidate" role only passes if the URL's :id matches their own
 * `candidateId`. Param name defaults to `id`.
 */
export function requireCandidateAccess(paramName = "id"): RequestHandler {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }
    if (req.user.role === "admin" || req.user.role === "recruiter") {
      next();
      return;
    }
    const id = req.params[paramName];
    if (!id || req.user.candidateId !== id) {
      res.status(403).json({ error: "Insufficient permissions" });
      return;
    }
    next();
  };
}

export async function findUserByEmail(email: string): Promise<UserRow | null> {
  const [row] = await db
    .select()
    .from(usersTable)
    .where(sql`lower(${usersTable.email}) = lower(${email})`)
    .limit(1);
  return row ?? null;
}

export function publicUser(row: UserRow): AuthUser {
  return {
    id: row.id,
    email: row.email,
    fullName: row.fullName,
    role: row.role as UserRole,
    candidateId: row.candidateId ?? null,
  };
}
