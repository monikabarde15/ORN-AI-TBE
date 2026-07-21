import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import {
  db,
  usersTable,
  userPermissionsTable,
  candidatesTable,
} from "@workspace/db";
import { hashPassword, isStrongPassword, STRONG_PASSWORD_MESSAGE } from "../lib/auth";
import { requireAuth } from "../lib/auth";
const router: IRouter = Router();

router.get("/users", async (_req, res) => {
  try {
    const users = await db
      .select({
        id: usersTable.id,

        fullName: usersTable.fullName,
        firstName: usersTable.firstName,
        middleName: usersTable.middleName,
        lastName: usersTable.lastName,

        email: usersTable.email,
        mobile: usersTable.mobile,

        username: usersTable.username,
        employeeId: usersTable.employeeId,

        role: usersTable.role,
        status: usersTable.status,

        company: usersTable.company,
        department: usersTable.department,
        designation: usersTable.designation,

        country: usersTable.country,
        state: usersTable.state,
        city: usersTable.city,

        candidateId: usersTable.candidateId,
        candidateCode: candidatesTable.candidateCode,

        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .leftJoin(candidatesTable, eq(usersTable.candidateId, candidatesTable.id));

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get Users Error:", error);

    return res.status(500).json({
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
router.get("/users/:id", async (req, res) => {
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.params.id));
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    const candidate = user.candidateId
      ? (await db.select().from(candidatesTable).where(eq(candidatesTable.id, user.candidateId)))[0]
      : (await db.select().from(candidatesTable).where(eq(candidatesTable.email, user.email)))[0];
    return res.json({ success: true, user: { ...user, candidate } });
  } catch (error) {
    console.error("Get User Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch user" });
  }
});

router.put("/users/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const {
      firstName,
      middleName,
      lastName,
      email,
      mobile,
      username,
      employeeId,
      role,
      status,
      company,
      department,
      designation,
      country,
      state,
      city,
      candidateProfile,
      password,
    } = req.body;

    const fullName = `${firstName ?? ""} ${middleName ?? ""} ${lastName ?? ""}`
      .replace(/\s+/g, " ")
      .trim();

    const [existingUser] = await db.select().from(usersTable).where(eq(usersTable.id, id));
    if (!existingUser) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    const isPrivileged = req.user?.role === "admin" || String(req.user?.role) === "super_admin";
    if (role && role !== existingUser.role && !isPrivileged) {
      return res.status(403).json({ success: false, error: "Only an admin can change user roles" });
    }
    const safeRole = req.user?.id === id && !isPrivileged ? existingUser.role : role;
    if (password && !isStrongPassword(password)) {
      return res.status(400).json({ success: false, error: STRONG_PASSWORD_MESSAGE });
    }
    const passwordHash = password ? await hashPassword(password) : undefined;
    const [updatedUser] = await db
      .update(usersTable)
      .set({
        firstName,
        middleName,
        lastName,
        fullName,

        email,
        mobile: mobile ?? candidateProfile?.phone,

        username,
        employeeId,

        role: safeRole,
        status,

        company,
        department,
        designation,

        country,
        state,
        city,
        ...(passwordHash ? { passwordHash } : {}),
      })
      .where(eq(usersTable.id, id))
      .returning();

    // Keep the linked candidate profile in sync when a candidate is edited
    // from the user-management modal.
    if (candidateProfile) {
      const candidate = updatedUser.candidateId
        ? (await db.select().from(candidatesTable).where(eq(candidatesTable.id, updatedUser.candidateId)))[0]
        : (await db.select().from(candidatesTable).where(eq(candidatesTable.email, updatedUser.email)))[0];

      if (candidate) {
        await db.update(candidatesTable).set({
          fullName: candidateProfile.fullName || fullName || candidate.fullName,
          email: candidateProfile.email || email || candidate.email,
          phone: candidateProfile.phone ?? mobile ?? candidate.phone,
          country: candidateProfile.country ?? country ?? candidate.country,
          city: candidateProfile.city ?? city ?? candidate.city,
          currentLocation: candidateProfile.currentLocation ?? candidate.currentLocation,
          currentRole: candidateProfile.currentRole ?? candidate.currentRole,
          preferredRole: candidateProfile.preferredRole ?? candidate.preferredRole,
          targetRole: candidateProfile.targetRole ?? candidate.targetRole,
          yearsExperience: candidateProfile.yearsExperience ?? candidate.yearsExperience,
          visaStatus: candidateProfile.visaStatus ?? candidate.visaStatus,
          englishLevel: candidateProfile.englishLevel ?? candidate.englishLevel,
          euWorkEligible: candidateProfile.euWorkEligible ?? candidate.euWorkEligible,
          linkedinUrl: candidateProfile.linkedinUrl ?? candidate.linkedinUrl,
          skills: candidateProfile.skills ?? candidate.skills,
          interestedSkills: candidateProfile.interestedSkills ?? candidate.interestedSkills,
          languagesKnown: candidateProfile.languagesKnown ?? candidate.languagesKnown,
          careerPreference: candidateProfile.careerPreference ?? candidate.careerPreference,
          preferredWorkMode: candidateProfile.preferredWorkMode ?? candidate.preferredWorkMode,
          expectedSalary: candidateProfile.expectedSalary ?? candidate.expectedSalary,
          availability: candidateProfile.availability ?? candidate.availability,
        }).where(eq(candidatesTable.id, candidate.id));
      }
    }

    return res.json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("UPDATE USER ERROR", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Delete permissions first
    await db
      .delete(userPermissionsTable)
      .where(eq(userPermissionsTable.userId, id));

    // Delete user
    await db
      .delete(usersTable)
      .where(eq(usersTable.id, id));

    return res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    console.error("DELETE USER ERROR", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
export default router;
