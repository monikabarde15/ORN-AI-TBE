import { Router, type IRouter } from "express";
import { db, assignmentsTable, coursesTable, candidatesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth, requireRole } from "../lib/auth";

const router: IRouter = Router();

/* ======================================================
   LIST ALL ASSIGNMENTS
====================================================== */
router.get("/assignments", async (_req, res): Promise<void> => {
  try {
    const rows = await db
      .select()
      .from(assignmentsTable)
      .orderBy(desc(assignmentsTable.createdAt));

    // Seed default assignments if table is empty so data appears immediately
    if (rows.length === 0) {
      const defaultAssignments = [
        {
          title: "AWS CloudFormation & CI/CD Pipeline Deployment Lab",
          description: "Implement automated infrastructure provisioning using CloudFormation templates and CodePipeline.",
          courseName: "DevOps with AWS",
          targetRole: "AWS cloud/Devops engineer",
          category: "Cloud & DevOps",
          difficulty: "Medium",
          totalMarks: 100,
          passingMarks: 70,
          status: "Published",
          instructions: "Clone repository, deploy stacks, and submit your GitHub repo URL.",
        },
        {
          title: "Docker Containerization & Kubernetes Microservices Lab",
          description: "Containerize Python/Node services and configure Kubernetes manifests with ingress and autoscaling.",
          courseName: "DevOps with AWS",
          targetRole: "AWS cloud/Devops engineer",
          category: "Containerization",
          difficulty: "Hard",
          totalMarks: 100,
          passingMarks: 75,
          status: "Published",
          instructions: "Build Docker images, test locally with Minikube, and provide cluster status output.",
        },
        {
          title: "SOC Analyst Incident Response & Log Analysis",
          description: "Analyze SIEM logs, detect brute-force attacks, and document incident response report.",
          courseName: "SOC Analyst",
          targetRole: "SOC Analyst",
          category: "Cyber Security",
          difficulty: "Medium",
          totalMarks: 100,
          passingMarks: 70,
          status: "Published",
          instructions: "Download log archive, perform triage, and fill the SOC response template.",
        },
      ];

      for (const item of defaultAssignments) {
        await db.insert(assignmentsTable).values(item);
      }

      const freshRows = await db
        .select()
        .from(assignmentsTable)
        .orderBy(desc(assignmentsTable.createdAt));

      res.json({
        success: true,
        data: freshRows,
        assignments: freshRows,
      });
      return;
    }

    res.json({
      success: true,
      data: rows,
      assignments: rows,
    });
  } catch (error: any) {
    console.error("GET ASSIGNMENTS ERROR:", error);
    res.status(500).json({ success: false, message: error?.message || "Failed to load assignments" });
  }
});

/* ======================================================
   CREATE / PUBLISH ASSIGNMENT
====================================================== */
router.post("/assignments", async (req, res): Promise<void> => {
  try {
    const {
      title,
      description,
      courseId,
      courseName,
      candidateId,
      targetRole,
      category,
      difficulty,
      totalMarks,
      passingMarks,
      dueDate,
      instructions,
      status,
      questions,
      attachments,
    } = req.body;

    if (!title) {
      res.status(400).json({ success: false, message: "Assignment title is required" });
      return;
    }

    let finalCourseName = courseName;
    if (courseId && !finalCourseName) {
      const [c] = await db.select().from(coursesTable).where(eq(coursesTable.id, courseId)).limit(1);
      if (c) finalCourseName = c.courseName;
    }

    const [created] = await db
      .insert(assignmentsTable)
      .values({
        title,
        description,
        courseId: courseId || null,
        courseName: finalCourseName || "General Assignment",
        candidateId: candidateId || null,
        targetRole: targetRole || null,
        category: category || "General",
        difficulty: difficulty || "Medium",
        totalMarks: Number(totalMarks) || 100,
        passingMarks: Number(passingMarks) || 70,
        dueDate: dueDate ? new Date(dueDate) : null,
        instructions,
        status: status || "Published",
        questions: questions || [],
        attachments: attachments || [],
      })
      .returning();

    res.status(201).json({
      success: true,
      message: "Assignment published successfully",
      assignment: created,
      data: created,
    });
  } catch (error: any) {
    console.error("CREATE ASSIGNMENT ERROR:", error);
    res.status(500).json({ success: false, message: error?.message || "Failed to publish assignment" });
  }
});

/* ======================================================
   GET ONE ASSIGNMENT
====================================================== */
router.get("/assignments/:id", async (req, res): Promise<void> => {
  try {
    const [row] = await db
      .select()
      .from(assignmentsTable)
      .where(eq(assignmentsTable.id, req.params.id))
      .limit(1);

    if (!row) {
      res.status(404).json({ success: false, message: "Assignment not found" });
      return;
    }

    res.json({
      success: true,
      assignment: row,
      data: row,
    });
  } catch (error: any) {
    console.error("GET ASSIGNMENT ERROR:", error);
    res.status(500).json({ success: false, message: error?.message || "Failed to load assignment" });
  }
});

/* ======================================================
   UPDATE ASSIGNMENT
====================================================== */
router.put("/assignments/:id", async (req, res): Promise<void> => {
  try {
    const {
      title,
      description,
      courseId,
      courseName,
      targetRole,
      category,
      difficulty,
      totalMarks,
      passingMarks,
      dueDate,
      instructions,
      status,
      questions,
    } = req.body;

    const [updated] = await db
      .update(assignmentsTable)
      .set({
        title,
        description,
        courseId: courseId || null,
        courseName,
        targetRole,
        category,
        difficulty,
        totalMarks: totalMarks ? Number(totalMarks) : undefined,
        passingMarks: passingMarks ? Number(passingMarks) : undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        instructions,
        status,
        questions,
        updatedAt: new Date(),
      })
      .where(eq(assignmentsTable.id, req.params.id))
      .returning();

    if (!updated) {
      res.status(404).json({ success: false, message: "Assignment not found" });
      return;
    }

    res.json({
      success: true,
      message: "Assignment updated successfully",
      assignment: updated,
      data: updated,
    });
  } catch (error: any) {
    console.error("UPDATE ASSIGNMENT ERROR:", error);
    res.status(500).json({ success: false, message: error?.message || "Failed to update assignment" });
  }
});

/* ======================================================
   DELETE ASSIGNMENT
====================================================== */
router.delete("/assignments/:id", async (req, res): Promise<void> => {
  try {
    await db.delete(assignmentsTable).where(eq(assignmentsTable.id, req.params.id));
    res.json({ success: true, message: "Assignment deleted successfully" });
  } catch (error: any) {
    console.error("DELETE ASSIGNMENT ERROR:", error);
    res.status(500).json({ success: false, message: error?.message || "Failed to delete assignment" });
  }
});

export default router;
