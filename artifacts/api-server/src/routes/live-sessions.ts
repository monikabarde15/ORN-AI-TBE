import { Router, type IRouter } from "express";
import { db, liveSessionsTable } from "@workspace/db";
import { requireAuth, requireRole } from "../lib/auth";
import { desc, eq } from "drizzle-orm";

const router: IRouter = Router();

/* =========================================
CREATE LIVE SESSION
========================================= */

router.post(
  "/live-sessions",
  requireAuth,
  requireRole("admin", "recruiter"),
  async (req, res) => {
    try {
      const {
        courseId,
        paymentId,
        studentName,
        studentEmail,
        studentPhone,
        sessionTitle,
        trainerName,
        meetingLink,
        sessionDate,
        startTime,
        endTime,
        description,
      } = req.body;

      const [session] = await db
        .insert(liveSessionsTable)
        .values({
          courseId,
          paymentId,
          studentName,
          studentEmail,
          studentPhone,
          sessionTitle,
          trainerName,
          meetingLink,
          sessionDate,
          startTime,
          endTime,
          description,
          status: "scheduled",
        })
        .returning();

      res.status(201).json({
        success: true,
        session,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Failed to create live session",
      });
    }
  }
);

/* =========================================
GET ALL SESSIONS
========================================= */

router.get(
  "/live-sessions",
  requireAuth,
  async (req, res) => {
    try {
      const sessions = await db
        .select()
        .from(liveSessionsTable)
        .orderBy(desc(liveSessionsTable.createdAt));

      res.json({
        success: true,
        data: sessions,
      });
    } catch (error) {
      res.status(500).json({
        error: "Failed to fetch sessions",
      });
    }
  }
);

/* =========================================
GET SINGLE SESSION
========================================= */

router.get(
  "/live-sessions/:id",
  requireAuth,
  async (req, res) => {
    try {
      const [session] = await db
        .select()
        .from(liveSessionsTable)
        .where(
          eq(
            liveSessionsTable.id,
            req.params.id
          )
        );

      if (!session) {
        return res.status(404).json({
          error: "Session not found",
        });
      }

      res.json({
        success: true,
        session,
      });
    } catch (error) {
      res.status(500).json({
        error: "Failed to fetch session",
      });
    }
  }
);

/* =========================================
UPDATE SESSION
========================================= */

router.put(
  "/live-sessions/:id",
  requireAuth,
  requireRole("admin", "recruiter"),
  async (req, res) => {
    try {
      const [session] = await db
        .update(liveSessionsTable)
        .set(req.body)
        .where(
          eq(
            liveSessionsTable.id,
            req.params.id
          )
        )
        .returning();

      res.json({
        success: true,
        session,
      });
    } catch (error) {
      res.status(500).json({
        error: "Failed to update session",
      });
    }
  }
);

/* =========================================
DELETE SESSION
========================================= */

router.delete(
  "/live-sessions/:id",
  requireAuth,
  requireRole("admin"),
  async (req, res) => {
    try {
      await db
        .delete(liveSessionsTable)
        .where(
          eq(
            liveSessionsTable.id,
            req.params.id
          )
        );

      res.json({
        success: true,
        message: "Session deleted",
      });
    } catch (error) {
      res.status(500).json({
        error: "Failed to delete session",
      });
    }
  }
);

/* =========================================
STUDENT SESSIONS
========================================= */

router.get(
  "/live-sessions/student/:email",
  requireAuth,
  async (req, res) => {
    try {
      const sessions = await db
        .select()
        .from(liveSessionsTable)
        .where(
          eq(
            liveSessionsTable.studentEmail,
            req.params.email
          )
        );

      res.json({
        success: true,
        data: sessions,
      });
    } catch (error) {
      res.status(500).json({
        error: "Failed to fetch student sessions",
      });
    }
  }
);

/* =========================================
COURSE SESSIONS
========================================= */

router.get(
  "/live-sessions/course/:courseId",
  requireAuth,
  async (req, res) => {
    try {
      const sessions = await db
        .select()
        .from(liveSessionsTable)
        .where(
          eq(
            liveSessionsTable.courseId,
            req.params.courseId
          )
        );

      res.json({
        success: true,
        data: sessions,
      });
    } catch (error) {
      res.status(500).json({
        error: "Failed to fetch course sessions",
      });
    }
  }
);

export default router;