import { db, auditLogsTable } from "@workspace/db";
import type { Request } from "express";
import { logger } from "./logger";

export type AuditAction =
  | "auth.register"
  | "auth.login"
  | "auth.logout"
  | "candidate.create"
  | "candidate.cv_upload"
  | "candidate.shortlist"
  | "candidate.unshortlist"
  | "candidate.client_ready"
  | "candidate.industry_ready"
  | "training.assign"
  | "training.update"
  | "training.recruiter_ready"
  | "project.assign"
  | "project.update";

export interface AuditInput {
  action: AuditAction;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}

export async function recordAudit(req: Request, input: AuditInput): Promise<void> {
  const actor = req.user;
  try {
    await db.insert(auditLogsTable).values({
      actorUserId: actor?.id ?? null,
      actorEmail: actor?.email ?? null,
      actorRole: actor?.role ?? null,
      action: input.action,
      entityType: input.entityType ?? null,
      entityId: input.entityId ?? null,
      metadata: input.metadata ?? {},
    });
  } catch (err) {
    // Audit failures should not break the operation, just be logged.
    logger.warn({ err, audit: input }, "Failed to record audit log");
  }
}
