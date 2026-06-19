import { Router, type IRouter } from "express";
import { db, courseCategoriesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

/* =========================================================
   CREATE CATEGORY
========================================================= */
router.post("/course-category/create", async (req, res) => {
  try {
    const { name, description, image, status } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const [category] = await db
      .insert(courseCategoriesTable)
      .values({
        name,
        description,
        image,
        status: status || "Active",
      })
      .returning();

    return res.json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* =========================================================
   GET ALL CATEGORIES
========================================================= */
router.get("/course-category/list", async (_req, res) => {
  try {
    const categories = await db
      .select()
      .from(courseCategoriesTable);

    return res.json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* =========================================================
   GET CATEGORY BY ID
========================================================= */
router.get("/course-category/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const category = await db
      .select()
      .from(courseCategoriesTable)
      .where(eq(courseCategoriesTable.id, id));

    if (!category.length) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.json({
      success: true,
      data: category[0],
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* =========================================================
   UPDATE CATEGORY
========================================================= */
router.put("/course-category/update/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { name, description, image, status } = req.body;

    const [updated] = await db
      .update(courseCategoriesTable)
      .set({
        name,
        description,
        image,
        status,
        updatedAt: new Date(),
      })
      .where(eq(courseCategoriesTable.id, id))
      .returning();

    return res.json({
      success: true,
      message: "Category updated successfully",
      data: updated,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* =========================================================
   DELETE CATEGORY
========================================================= */
router.delete("/course-category/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db
      .delete(courseCategoriesTable)
      .where(eq(courseCategoriesTable.id, id));

    return res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;