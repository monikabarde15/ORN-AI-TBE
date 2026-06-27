import { pgTable, uuid, text, timestamp,boolean } from "drizzle-orm/pg-core";

/*export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull(),
  candidateId: uuid("candidate_id"),
  gdprConsentAt: timestamp("gdpr_consent_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});*/
export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),

  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),

  fullName: text("full_name").notNull(),

  firstName: text("first_name"),
  middleName: text("middle_name"),
  lastName: text("last_name"),

  mobile: text("mobile"),
  username: text("username").unique(),
  employeeId: text("employee_id"),

  role: text("role").notNull(),
  status: text("status").default("Active"),

  company: text("company"),
  department: text("department"),
  designation: text("designation"),

  country: text("country"),
  state: text("state"),
  city: text("city"),

  forcePasswordChange: boolean("force_password_change").default(false),
  sendWelcomeEmail: boolean("send_welcome_email").default(false),
  emailCredentials: boolean("email_credentials").default(false),

  candidateId: uuid("candidate_id"),

  gdprConsentAt: timestamp("gdpr_consent_at", {
    withTimezone: true,
  }),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow().notNull(),
});
export type UserRow = typeof usersTable.$inferSelect;
export type InsertUserRow = typeof usersTable.$inferInsert;
export type UserRole = "candidate" | "recruiter" | "admin";
