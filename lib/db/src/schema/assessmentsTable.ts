import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const assessmentsTable = pgTable("assessments", {
  id: uuid("id").primaryKey().defaultRandom(),

  assessmentName: text("assessment_name").notNull(),

  targetRole: text("target_role").notNull(),

  category: text("category").notNull(),

  difficulty: text("difficulty").notNull().default("Easy"),

  passingPercentage: integer("passing_percentage")
    .notNull()
    .default(70),

  durationMinutes: integer("duration_minutes")
    .notNull()
    .default(45),

  instructions: text("instructions"),

  description: text("description"),

  status: text("status").notNull().default("Draft"),

  createdBy: uuid("created_by"),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});

export type AssessmentRow =
  typeof assessmentsTable.$inferSelect;

export type InsertAssessmentRow =
  typeof assessmentsTable.$inferInsert;

export type AssessmentStatus =
  | "Draft"
  | "Published"
  | "Archived";