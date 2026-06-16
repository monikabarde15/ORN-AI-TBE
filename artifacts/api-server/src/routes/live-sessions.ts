import { Router, type IRouter } from "express";
import { sql } from "drizzle-orm";
import { desc } from "drizzle-orm";

import {
  paymentLinksTable,
  learningPathsTable
} from "@workspace/db";


import {
  db,
  liveSessionsTable,
  coursesTable,
} from "@workspace/db";
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
    } catch (error: any) {

  console.log(
    "CREATE SESSION ERROR =>",
    error
  );

  return res.status(500).json({
    error: "Failed to create live session",
    details: error?.message,
  });
}
  }
);
router.post(
  "/learning-path-students",
  requireAuth,
  async (req, res) => {
    try {
      const { courseIds } = req.body;

      if (!Array.isArray(courseIds)) {
        return res.status(400).json({
          success: false,
        });
      }

      const allStudents = await db
        .select()
        .from(paymentLinksTable)
        .where(
          eq(paymentLinksTable.status, "paid")
        );

      const students = allStudents.filter(
        (student) =>
          student.courseIds?.some(
            (courseId) =>
              courseIds.includes(courseId)
          )
      );

      return res.json({
        success: true,
        data: students,
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch students",
      });
    }
  }
);
router.get(
  "/learning-path-students",
  requireAuth,
  async (req, res) => {

    const students = await db
      .select()
      .from(paymentLinksTable);

    return res.json({
      success: true,
      data: students,
    });
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
        .orderBy(
          desc(liveSessionsTable.createdAt)
        );

      const learningPaths = await db
        .select()
        .from(learningPathsTable);

      const data = sessions.map(
        (session) => {
          const learningPath =
            learningPaths.find((lp) =>
              lp.courseIds?.includes(
                session.courseId
              )
            );

          return {
            ...session,

            learningPath: learningPath
              ? {
                  id: learningPath.id,
                  title:
                    learningPath.title,
                  description:
                    learningPath.description,
                  image:
                    learningPath.thumbnail,
                  paymentLink:
                    learningPath.paymentLink,
                  introVideo:
                    learningPath.introVideo,
                  courseIds:
                    learningPath.courseIds,
                }
              : null,
          };
        }
      );

      return res.status(200).json({
        success: true,
        count: data.length,
        data,
      });
    } catch (error) {
      console.log(
        "LIVE SESSION ERROR =>",
        error
      );

      return res.status(500).json({
        success: false,
        error:
          "Failed to fetch sessions",
      });
    }
  }
);
router.get(
  "/live-sessions/student/:email",
  requireAuth,
  async (req, res) => {
    try {
      const { email } = req.params;

      const sessions = await db
        .select()
        .from(liveSessionsTable)
        .where(
          eq(
            liveSessionsTable.studentEmail,
            email
          )
        );

      const learningPaths = await db
        .select()
        .from(learningPathsTable);

      const courses = await db
        .select()
        .from(coursesTable);

      const data = sessions.map(
        (session) => {
          const learningPath =
            learningPaths.find((lp) =>
              lp.courseIds?.includes(
                session.courseId
              )
            );

          const learningPathCourses =
            learningPath
              ? courses.filter((course) =>
                  learningPath.courseIds?.includes(
                    course.id
                  )
                )
              : [];

          return {
            ...session,

            learningPath: learningPath
              ? {
                  id: learningPath.id,

                  title:
                    learningPath.title,

                  description:
                    learningPath.description,

                  image:
                    learningPath.thumbnail,

                  introVideo:
                    learningPath.introVideo,

                  paymentLink:
                    learningPath.paymentLink,

                  totalCourses:
                    learningPath.courseIds
                      ?.length || 0,

                  courseIds:
                    learningPath.courseIds,

                  courses:
                    learningPathCourses.map(
                      (course) => ({
                        id: course.id,
                        title:
                          course.title,

                        description:
                          course.description,

                        thumbnail:
                          course.thumbnail,
                      })
                    ),
                }
              : null,
          };
        }
      );

      return res.json({
        success: true,
        count: data.length,
        data,
      });
    } catch (error) {
      console.log(
        "STUDENT LIVE SESSION ERROR =>",
        error
      );

      return res.status(500).json({
        success: false,
        error:
          "Failed to fetch student sessions",
      });
    }
  }
);
router.get(
  "/student/learning-paths",
  requireAuth,
  async (req, res) => {
    try {
      // logged in user
      const user = req.user;

      const paymentLinks = await db
        .select()
        .from(paymentLinksTable)
        .where(
          eq(
            paymentLinksTable.studentEmail,
            user.email
          )
        );

      const learningPaths =
        await db
          .select()
          .from(
            learningPathsTable
          );

      const courses = await db
        .select()
        .from(coursesTable);

      const sessions = await db
        .select()
        .from(
          liveSessionsTable
        )
        .where(
          eq(
            liveSessionsTable.studentEmail,
            user.email
          )
        );

      const data =
        learningPaths
          .filter((lp) =>
            paymentLinks.some(
              (payment) =>
                payment.courseIds?.some(
                  (courseId) =>
                    lp.courseIds?.includes(
                      courseId
                    )
                )
            )
          )
          .map((lp) => {
            const lpCourses =
              courses.filter(
                (course) =>
                  lp.courseIds?.includes(
                    course.id
                  )
              );

            const lpSessions =
              sessions.filter(
                (session) =>
                  lp.courseIds?.includes(
                    session.courseId
                  )
              );

            return {
              id: lp.id,

              title: lp.title,

              description:
                lp.description,

              image:
                lp.thumbnail,

              introVideo:
                lp.introVideo,

              trainerName:
                lpSessions[0]
                  ?.trainerName ||
                "Trainer",

              courses:
                lpCourses.map(
                  (course) => ({
                    id: course.id,
                    title:
                      course.title,
                    description:
                      course.description,
                    thumbnail:
                      course.thumbnail,
                    videoUrl:
                      course.videoUrl,
                  })
                ),

              sessions:
                lpSessions.map(
                  (session) => ({
                    id: session.id,
                    title:
                      session.sessionTitle,
                    date:
                      session.sessionDate,
                    time: `${session.startTime} - ${session.endTime}`,
                    link:
                      session.meetingLink,
                    trainerName:
                      session.trainerName,
                    description:
                      session.description,
                  })
                ),
            };
          });

      return res.json({
        success: true,
        data,
      });
    } catch (error) {
      console.log(
        "STUDENT LEARNING PATH ERROR",
        error
      );

      return res.status(500).json({
        success: false,
        error:
          "Failed to load learning paths",
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