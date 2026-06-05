import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { upload } from "../lib/upload";

import {
  db,
  blogsTable,
} from "@workspace/db";

const router: IRouter = Router();

/* ======================================
   CREATE BLOG
====================================== */

router.post(
  "/blog/create",
  upload.fields([
    {
      name: "thumbnailImage",
      maxCount: 1,
    },
  ]),
  async (req, res): Promise<void> => {
    try {
      const body = req.body;

      const thumbnail =
        (req.files as any)
          ?.thumbnailImage?.[0];

      const [blog] = await db
        .insert(blogsTable)
        .values({
          title: body.title,
          description: body.description,
          category: body.category,
          status: body.status || "Draft",

          thumbnail:
            (thumbnail as any)?.location || null,
        })
        .returning();

      res.status(201).json({
        success: true,
        data: blog,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: "Failed to create blog",
      });
    }
  }
);

/* ======================================
   GET ALL BLOGS
====================================== */

router.get(
  "/blogs",
  async (_req, res): Promise<void> => {
    try {
      const blogs = await db
        .select()
        .from(blogsTable)
        .orderBy(desc(blogsTable.createdAt));

      res.json({
        success: true,
        data: blogs,
      });
    } catch (error) {
      console.log("BLOG ERROR =>", error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch blogs",
        error,
      });
    }
  }
);

/* ======================================
   GET SINGLE BLOG
====================================== */

router.get(
  "/blogs/:id",
  async (req, res): Promise<void> => {
    try {
      const { id } = req.params;

      const [blog] = await db
        .select()
        .from(blogsTable)
        .where(eq(blogsTable.id, id));

      if (!blog) {
        res.status(404).json({
          success: false,
          message: "Blog not found",
        });

        return;
      }

      res.json({
        success: true,
        data: blog,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch blog",
      });
    }
  }
);

/* ======================================
   UPDATE BLOG
====================================== */

router.put(
  "/blogs/:id",
  upload.fields([
    {
      name: "thumbnailImage",
      maxCount: 1,
    },
  ]),
  async (req, res): Promise<void> => {
    try {
      const { id } = req.params;

      const body = req.body;

      const thumbnail =
        (req.files as any)
          ?.thumbnailImage?.[0];

      const [existingBlog] = await db
        .select()
        .from(blogsTable)
        .where(eq(blogsTable.id, id));

      if (!existingBlog) {
        res.status(404).json({
          success: false,
          message: "Blog not found",
        });

        return;
      }

      await db
        .update(blogsTable)
        .set({
          title:
            body.title ??
            existingBlog.title,

          description:
            body.description ??
            existingBlog.description,

          category:
            body.category ??
            existingBlog.category,

          status:
            body.status ??
            existingBlog.status,

          ...(thumbnail && {
            thumbnail:
              (thumbnail as any)
                .location,
          }),

          updatedAt: new Date(),
        })
        .where(eq(blogsTable.id, id));

      const [updatedBlog] = await db
        .select()
        .from(blogsTable)
        .where(eq(blogsTable.id, id));

      res.status(200).json({
        success: true,
        message:
          "Blog updated successfully",
        data: updatedBlog,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: "Failed to update blog",
      });
    }
  }
);

/* ======================================
   DELETE BLOG
====================================== */

router.delete(
  "/blogs/:id",
  async (req, res): Promise<void> => {
    try {
      const { id } = req.params;

      await db
        .delete(blogsTable)
        .where(eq(blogsTable.id, id));

      res.json({
        success: true,
        message:
          "Blog deleted successfully",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: "Failed to delete blog",
      });
    }
  }
);

export default router;