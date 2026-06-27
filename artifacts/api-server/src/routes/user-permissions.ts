import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import {
  db,
  usersTable,
  userPermissionsTable,
} from "@workspace/db";
const router: IRouter = Router();

router.get("/users", async (_req, res) => {
  try {
    const users = await db
      .select({
        id: usersTable.id,
        fullName: usersTable.fullName,
        email: usersTable.email,
        role: usersTable.role,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable);

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get Users Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
});
router.get(
  "/user-permissions/:userId",
  async (req, res) => {
    try {
      const { userId } = req.params;

      // console.log("userId =>", userId);
      // console.log("table =>", userPermissionsTable);

      const permissions = await db
        .select()
        .from(userPermissionsTable)
        .where(
          eq(userPermissionsTable.userId, userId)
        );

      return res.json({
        success: true,
        permissions,
      });
    } catch (error: any) {
      console.error(
        "FULL ERROR ==================="
      );
      console.error(error);
      console.error(error?.message);
      console.error(error?.stack);

      return res.status(500).json({
        success: false,
        error: error?.message,
      });
    }
  }
);
router.post(
  "/user-permissions",
  async (req, res) => {
    try {
      const { userId, permissions } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID required",
        });
      }

      // Purani permissions delete
      await db
        .delete(userPermissionsTable)
        .where(
          eq(
            userPermissionsTable.userId,
            userId
          )
        );

      // Nayi permissions insert
      if (
        permissions &&
        permissions.length > 0
      ) {
        await db
          .insert(userPermissionsTable)
          .values(
            permissions.map((item: any) => ({
              userId,
              moduleName:
                item.moduleName,
              canView:
                item.canView,
              canAdd:
                item.canAdd,
              canEdit:
                item.canEdit,
              canDelete:
                item.canDelete,
            }))
          );
      }

      return res.json({
        success: true,
        message:
          "Permissions saved successfully",
      });
    } catch (error: any) {
      console.error(
        "SAVE PERMISSION ERROR",
        error
      );

      return res.status(500).json({
        success: false,
        error: error?.message,
      });
    }
  }
);
export default router;