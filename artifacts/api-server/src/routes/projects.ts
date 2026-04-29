import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, candidatesTable, projectsTable } from "@workspace/db";
import { serializeProject } from "../lib/serialize";
import { requireAuth, requireRole, requireCandidateAccess } from "../lib/auth";
import { recordAudit } from "../lib/audit";

const router: IRouter = Router();

router.get("/candidates/:id/projects", requireAuth, requireCandidateAccess(), async (req, res): Promise<void> => {
  const id = req.params.id as string;
  const rows = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.candidateId, id))
    .orderBy(desc(projectsTable.createdAt));
  res.status(200).json(rows.map(serializeProject));
});

router.post(
  "/candidates/:id/projects",
  requireAuth,
  requireRole("recruiter", "admin"),
  async (req, res): Promise<void> => {
    const id = req.params.id as string;
    const body = req.body as Partial<{
      name: string;
      techStack: string[];
      durationWeeks: number;
      startDate: string;
    }>;

    if (
      !body.name ||
      !Array.isArray(body.techStack) ||
      typeof body.durationWeeks !== "number" ||
      !body.startDate
    ) {
      res.status(400).json({ error: "Missing required project fields" });
      return;
    }
    if (body.durationWeeks < 1 || body.durationWeeks > 52) {
      res.status(400).json({ error: "durationWeeks must be 1..52" });
      return;
    }

    const [candidate] = await db
      .select({ id: candidatesTable.id })
      .from(candidatesTable)
      .where(eq(candidatesTable.id, id))
      .limit(1);
    if (!candidate) {
      res.status(404).json({ error: "Candidate not found" });
      return;
    }

    const [row] = await db
      .insert(projectsTable)
      .values({
        candidateId: id,
        name: body.name.trim(),
        techStack: body.techStack.filter((s) => s.trim().length > 0).slice(0, 16),
        durationWeeks: body.durationWeeks,
        status: "in_progress",
        startDate: new Date(body.startDate),
      })
      .returning();

    if (!row) {
      res.status(500).json({ error: "Failed to create project" });
      return;
    }

    await recordAudit(req, {
      action: "project.assign",
      entityType: "project",
      entityId: row.id,
      metadata: {
        candidateId: id,
        name: row.name,
        techStack: row.techStack,
      },
    });

    res.status(201).json(serializeProject(row));
  },
);

router.patch(
  "/projects/:projectId",
  requireAuth,
  requireRole("recruiter", "admin"),
  async (req, res): Promise<void> => {
    const projectId = req.params.projectId as string;
    const body = req.body as Partial<{
      status: "in_progress" | "completed" | "cancelled";
      feedback: string;
      endDate: string;
    }>;

    const updates: Record<string, unknown> = {};
    if (body.status) updates["status"] = body.status;
    if (typeof body.feedback === "string") updates["feedback"] = body.feedback;
    if (body.endDate) updates["endDate"] = new Date(body.endDate);
    if (body.status === "completed" && !body.endDate)
      updates["endDate"] = new Date();

    if (Object.keys(updates).length === 0) {
      res.status(400).json({ error: "No updates supplied" });
      return;
    }

    const [row] = await db
      .update(projectsTable)
      .set(updates)
      .where(eq(projectsTable.id, projectId))
      .returning();

    if (!row) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    // If we just marked a project completed, flag the candidate as
    // industry-ready so recruiters can surface them in the client portfolio.
    if (body.status === "completed") {
      await db
        .update(candidatesTable)
        .set({ isIndustryReady: true })
        .where(eq(candidatesTable.id, row.candidateId));
      await recordAudit(req, {
        action: "candidate.industry_ready",
        entityType: "candidate",
        entityId: row.candidateId,
        metadata: { projectId: row.id },
      });
    }

    await recordAudit(req, {
      action: "project.update",
      entityType: "project",
      entityId: row.id,
      metadata: { status: row.status },
    });

    res.status(200).json(serializeProject(row));
  },
);

export default router;
