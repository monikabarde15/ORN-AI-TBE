// artifacts\api-server\src\routes\learning-paths.ts
import { Router, type IRouter } from "express";
import { upload } from "../lib/upload";
import { transporter, getLearningPathEmailTemplate, sendMailWithRetry } from "../lib/mail";
import {
  db,
  learningPathsTable,
  coursesTable,
  paymentLinksTable,
  learningPathEnrollmentsTable,
  usersTable,
} from "@workspace/db";
import { requireAuth, requireRole } from "../lib/auth";
import { and, desc, eq, inArray } from "drizzle-orm";

const router: IRouter =
  Router();

/* =========================================
CREATE LEARNING PATH
========================================= */
router.post(
  "/learning-paths",
  requireAuth,
  requireRole("admin", "recruiter"),
  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
    {
      name: "introVideo",
      maxCount: 1,
    },
  ]),
  async (req, res) => {
    try {
      console.log(
        "FILES =>",
        JSON.stringify(req.files, null, 2)
      );

      const {
        title,
        description,
        paymentLink,
      } = req.body;

      const thumbnailFile =
        (req.files as any)?.thumbnail?.[0];

      const introVideoFile =
        (req.files as any)?.introVideo?.[0];

      const courseIds =
        typeof req.body.courseIds === "string"
          ? JSON.parse(req.body.courseIds)
          : req.body.courseIds || [];

      // Sort course ids so [1,2] and [2,1] are considered same
      const sortedCourseIds = [...courseIds].sort();

      // ==========================
      // Title Duplicate Check
      // ==========================
      const existingTitle = await db
        .select()
        .from(learningPathsTable)
        .where(eq(learningPathsTable.title, title));

      if (existingTitle.length > 0) {
        return res.status(400).json({
          success: false,
          error:
            "Learning Path title already exists.",
        });
      }

      // ==========================
      // CourseIds Duplicate Check
      // ==========================
      const learningPaths = await db
        .select()
        .from(learningPathsTable);

      const duplicateCourses =
        learningPaths.find((item) => {
          const existingCourseIds = [
            ...(item.courseIds || []),
          ].sort();

          return (
            JSON.stringify(existingCourseIds) ===
            JSON.stringify(sortedCourseIds)
          );
        });

      if (duplicateCourses) {
        return res.status(400).json({
          success: false,
          error:
            "Selected course(s) already exist in another Learning Path.",
        });
      }

      // ==========================
      // Create Learning Path
      // ==========================
      const [learningPath] =
        await db
          .insert(learningPathsTable)
          .values({
            title,
            description,
            thumbnail:
              thumbnailFile?.location || "",
            introVideo:
              introVideoFile?.location || "",
            paymentLink,
            courseIds:
              sortedCourseIds,
          })
          .returning();



      res.status(201).json({
        success: true,
        data: learningPath,
      });
    } catch (error) {
      console.log(
        "LEARNING PATH ERROR =>",
        error
      );

      res.status(500).json({
        success: false,
        error:
          "Failed to create learning path",
      });
    }
  }
);
/* =========================================
GET ALL LEARNING PATHS
========================================= */

router.get(
  "/learning-paths",
  requireAuth,
  async (req, res) => {
    try {
      const learningPaths =
        await db
          .select()
          .from(
            learningPathsTable
          )
          .orderBy(
            desc(
              learningPathsTable.createdAt
            )
          );

      const allCourses =
        await db
          .select()
          .from(
            coursesTable
          );

      const data =
        learningPaths.map(
          (path) => ({
            ...path,

            courses:
              allCourses.filter(
                (course) =>
                  path.courseIds?.includes(
                    course.id
                  )
              ),
          })
        );

      res.json({
        success: true,
        count: data.length,
        data,
      });
    } catch (error) {
      console.error(
        "Get Learning Paths Error:",
        error
      );

      res.status(500).json({
        success: false,
        error:
          "Failed to fetch learning paths",
      });
    }
  }
);

/* =========================================
GET SINGLE LEARNING PATH
========================================= */

router.get(
  "/learning-paths/:id",
  requireAuth,
  async (req, res) => {
    try {
      const [learningPath] =
        await db
          .select()
          .from(
            learningPathsTable
          )
          .where(
            eq(
              learningPathsTable.id,
              req.params.id
            )
          );

      if (!learningPath) {
        return res.status(404).json({
          success: false,
          error:
            "Learning Path not found",
        });
      }

      const allCourses =
        await db
          .select()
          .from(
            coursesTable
          );

      const selectedCourses =
        allCourses.filter(
          (course) =>
            learningPath.courseIds?.includes(
              course.id
            )
        );

      res.json({
        success: true,
        data: {
          ...learningPath,
          courses:
            selectedCourses,
        },
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        error:
          "Failed to fetch learning path",
      });
    }
  }
);

/* =========================================
UPDATE LEARNING PATH
========================================= */

router.put(
  "/learning-paths/:id",
  requireAuth,
  requireRole(
    "admin",
    "recruiter"
  ),

  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
    {
      name: "introVideo",
      maxCount: 1,
    },
  ]),

  async (req, res) => {
    try {

      const [existingPath] =
        await db
          .select()
          .from(
            learningPathsTable
          )
          .where(
            eq(
              learningPathsTable.id,
              req.params.id
            )
          );

      if (!existingPath) {
        return res.status(404).json({
          success: false,
          error:
            "Learning Path not found",
        });
      }

      const {
        title,
        description,
        paymentLink,
      } = req.body;

      const thumbnailFile =
        (req.files as any)
          ?.thumbnail?.[0];

      const introVideoFile =
        (req.files as any)
          ?.introVideo?.[0];

      let courseIds =
        existingPath.courseIds || [];

      if (
        req.body.courseIds !==
        undefined
      ) {
        courseIds =
          typeof req.body.courseIds ===
            "string"
            ? JSON.parse(
              req.body.courseIds
            )
            : req.body.courseIds;
      }

      console.log(
        "EXISTING COURSE IDS =>",
        existingPath.courseIds
      );

      console.log(
        "UPDATED COURSE IDS =>",
        courseIds
      );

      const updateData: any = {};

      if (title !== undefined) {
        updateData.title = title;
      }

      if (
        description !== undefined
      ) {
        updateData.description =
          description;
      }

      if (
        paymentLink !== undefined
      ) {
        updateData.paymentLink =
          paymentLink;
      }

      updateData.courseIds =
        courseIds;

      if (
        thumbnailFile?.location
      ) {
        updateData.thumbnail =
          thumbnailFile.location;
      }

      if (
        introVideoFile?.location
      ) {
        updateData.introVideo =
          introVideoFile.location;
      }

      const [learningPath] =
        await db
          .update(
            learningPathsTable
          )
          .set(updateData)
          .where(
            eq(
              learningPathsTable.id,
              req.params.id
            )
          )
          .returning();



      res.json({
        success: true,
        message:
          "Learning Path Updated Successfully",
        data: learningPath,
      });

    } catch (error: any) {

      console.error(
        "UPDATE ERROR =>",
        error
      );

      res.status(500).json({
        success: false,
        error:
          error?.message ||
          "Failed to update learning path",
      });
    }
  }
);
/* =========================================
DELETE LEARNING PATH
========================================= */

router.delete(
  "/learning-paths/:id",
  requireAuth,
  requireRole("admin", "recruiter"),
  async (req, res) => {
    try {
      await db
        .delete(
          learningPathsTable
        )
        .where(
          eq(
            learningPathsTable.id,
            req.params.id
          )
        );

      res.json({
        success: true,
        message:
          "Learning Path Deleted Successfully",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        error:
          "Failed to delete learning path",
      });
    }
  }
);
/* =========================================
TOGGLE LEARNING PATH STATUS
========================================= */

router.patch(
  "/learning-paths/:id/toggle-status",
  requireAuth,
  requireRole("admin", "recruiter"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { isEnabled } = req.body;

      const [learningPath] =
        await db
          .update(learningPathsTable)
          .set({
            isEnabled,
          })
          .where(
            eq(
              learningPathsTable.id,
              id
            )
          )
          .returning();

      if (!learningPath) {
        return res.status(404).json({
          success: false,
          error: "Learning Path not found",
        });
      }

      res.json({
        success: true,
        message: `Learning Path ${isEnabled
          ? "Enabled"
          : "Disabled"
          } Successfully`,
        data: learningPath,
      });
    } catch (error) {
      console.error(
        "TOGGLE STATUS ERROR =>",
        error
      );

      res.status(500).json({
        success: false,
        error:
          "Failed to update learning path status",
      });
    }
  }
);

/* =========================================
GET STUDENT LEARNING PATHS
========================================= */

router.get(
  "/student/learning-pathsnew",
  requireAuth,
  requireRole("candidate"),
  async (req: any, res) => {
    try {
      const studentEmail = req.user.email
        .trim()
        .toLowerCase();

      const userId = req.user.id;

      // ===========================
      // Paid Learning Paths
      // ===========================
      const payments = await db
        .select()
        .from(paymentLinksTable)
        .where(
          and(
            eq(
              paymentLinksTable.studentEmail,
              studentEmail
            ),
            eq(
              paymentLinksTable.status,
              "paid"
            )
          )
        );

      const paidLearningPathIds = [
        ...new Set(
          payments
            .map((p) => p.learningPathId)
            .filter(Boolean)
        ),
      ];

      // ===========================
      // Joined Learning Paths
      // ===========================
      const joinedLearningPaths = await db
        .select()
        .from(learningPathEnrollmentsTable)
        .where(
          eq(
            learningPathEnrollmentsTable.userId,
            userId
          )
        );

      const joinedLearningPathIds = [
        ...new Set(
          joinedLearningPaths
            .map((item) => item.learningPathId)
            .filter(Boolean)
        ),
      ];

      // ===========================
      // All Learning Paths
      // ===========================
      const learningPaths = await db
        .select()
        .from(learningPathsTable);

      // ===========================
      // All Courses
      // ===========================
      const allCourses = await db
        .select()
        .from(coursesTable);

      const result: any[] = [];

      for (const path of learningPaths) {

        const courses = allCourses.filter((course) =>
          path.courseIds?.includes(course.id)
        );

        // Paid?
        const isPurchased =
          paidLearningPathIds.includes(path.id);

        // Joined?
        const isJoined =
          joinedLearningPathIds.includes(path.id);

        // Only show Purchased OR Joined Learning Paths
        if (isPurchased || isJoined) {

          result.push({
            ...path,
            courses,
            isPurchased,
            isJoined,
          });

        }
      }

      return res.json({
        success: true,
        count: result.length,
        data: result,
      });

    } catch (error) {

      console.error(
        "Student Learning Path Error:",
        error
      );

      return res.status(500).json({
        success: false,
        error: "Failed to fetch learning paths",
      });
    }
  }
);
/* =========================================
JOIN LEARNING PATH
========================================= */

router.post(
  "/learning-paths/:id/join",
  requireAuth,
  requireRole("candidate"),
  async (req: any, res) => {
    try {
      const { id } = req.params;

      // Learning Path Exists
      const [learningPath] = await db
        .select()
        .from(learningPathsTable)
        .where(eq(learningPathsTable.id, id));

      if (!learningPath) {
        return res.status(404).json({
          success: false,
          error: "Learning Path not found",
        });
      }

      // Already Joined
      const [alreadyJoined] = await db
        .select()
        .from(learningPathEnrollmentsTable)
        .where(
          and(
            eq(
              learningPathEnrollmentsTable.learningPathId,
              id
            ),
            eq(
              learningPathEnrollmentsTable.userId,
              req.user.id
            )
          )
        );

      if (alreadyJoined) {
        return res.json({
          success: true,
          alreadyJoined: true,
          message: "Learning Path already joined",
        });
      }

      // Join
      await db.insert(learningPathEnrollmentsTable).values({
        learningPathId: id,
        userId: req.user.id,
        userName: req.user.fullName,
        userEmail: req.user.email,
        status: "joined",
      });

      // Retrieve payment link (from learningPath table or latest paymentLinksTable record)
      let paymentLink = learningPath.paymentLink;
      if (!paymentLink) {
        const [paymentRecord] = await db
          .select()
          .from(paymentLinksTable)
          .where(eq(paymentLinksTable.learningPathId, id))
          .orderBy(desc(paymentLinksTable.createdAt));
        if (paymentRecord) {
          paymentLink = paymentRecord.paymentLink;
        }
      }

      // =========================================
      // SEND LEARNING PATH EMAIL - UPDATED
      // =========================================

      try {
        const recipientEmail = req.user.email;
        const recipientName = req.user.fullName || "Learner";

        if (recipientEmail) {
          // Password fetch karo (optional)
          const [userRecord] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.id, req.user.id));

          // Learning Path Link
          const learningPathLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/recruiter/learning-student-path-list/`;

          // Email Template
          const html = getLearningPathEmailTemplate({
            recipientName: recipientName,
            username: req.user.fullName || recipientName,
            // password: "Your password", // Ya userRecord?.passwordHash agar store hai toh
            learningPathName: learningPath.title,
            learningPathLink: learningPathLink,
            joinUrl: process.env.FRONTEND_URL || "http://localhost:5173"
          });

          await sendMailWithRetry({
            from: `"ORN-AI" <${process.env.SMTP_USER || "connect@orn-ai.co.uk"}>`,
            to: recipientEmail,
            subject: `Your Learning Path is Ready: ${learningPath.title} - ORN-AI`,
            html,
          });

          console.log(`[EMAIL SUCCESS] Sent Learning Path email to ${recipientEmail}`);
        }
      } catch (mailError) {
        console.error("[EMAIL ERROR] Failed to send Learning Path email:", mailError);
      }

      return res.json({
        success: true,
        alreadyJoined: false,
        message: "Learning Path joined successfully",
      });

    } catch (error: any) {
      console.error("JOIN ERROR =>", error);

      return res.status(500).json({
        success: false,
        error: error?.message || "Failed to join learning path",
      });
    }
  }
);
/* =========================================
CHECK JOIN STATUS
========================================= */

router.get(
  "/learning-paths/:id/join-status",
  requireAuth,
  requireRole("candidate"),
  async (req: any, res) => {
    try {
      const { id } = req.params;

      const [joined] = await db
        .select()
        .from(learningPathEnrollmentsTable)
        .where(
          and(
            eq(
              learningPathEnrollmentsTable.learningPathId,
              id
            ),
            eq(
              learningPathEnrollmentsTable.userId,
              req.user.id
            )
          )
        );

      return res.json({
        success: true,
        alreadyJoined: !!joined,
      });

    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: error?.message,
      });
    }
  }
);
export default router;
