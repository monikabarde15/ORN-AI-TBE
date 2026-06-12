import { Router, type IRouter } from "express";
import { upload } from "../lib/upload";

import {
  db,
  learningPathsTable,
  coursesTable,
} from "@workspace/db";
import { requireAuth, requireRole } from "../lib/auth";
import { desc, eq } from "drizzle-orm";


const router: IRouter =
  Router();

/* =========================================
CREATE LEARNING PATH
========================================= */

router.post(
  "/learning-paths",
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

      console.log(
        "FILES =>",
        JSON.stringify(
          req.files,
          null,
          2
        )
      );

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

      const courseIds =
        typeof req.body.courseIds ===
        "string"
          ? JSON.parse(
              req.body.courseIds
            )
          : req.body.courseIds ||
            [];

      const [learningPath] =
        await db
          .insert(
            learningPathsTable
          )
          .values({
            title,
            description,

            thumbnail:
              thumbnailFile
                ?.location || "",

            introVideo:
              introVideoFile
                ?.location || "",

            paymentLink,
            courseIds,
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
  async (req, res) => {
    try {
      const {
        title,
        description,
        thumbnail,
        introVideo,
        paymentLink,
      } = req.body;

      const courseIds =
        typeof req.body.courseIds ===
        "string"
          ? JSON.parse(
              req.body.courseIds
            )
          : req.body.courseIds ||
            [];

      const [learningPath] =
        await db
          .update(
            learningPathsTable
          )
          .set({
            title,
            description,
            thumbnail,
            introVideo,
            paymentLink,
            courseIds,
          })
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
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        error:
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
  requireRole("admin"),
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

export default router;
