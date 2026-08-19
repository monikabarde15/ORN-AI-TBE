import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export const assignmentsTable = pgTable("assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  courseId: uuid("course_id"),
  courseName: text("course_name"),
  candidateId: uuid("candidate_id"),
  targetRole: text("target_role"),
  category: text("category"),
  difficulty: text("difficulty").notNull().default("Medium"),
  totalMarks: integer("total_marks").notNull().default(100),
  passingMarks: integer("passing_marks").notNull().default(70),
  dueDate: timestamp("due_date", { withTimezone: true }),
  instructions: text("instructions"),
  status: text("status").notNull().default("Published"),
  questions: jsonb("questions"),
  attachments: jsonb("attachments"),
  createdBy: uuid("created_by"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type AssignmentRow = typeof assignmentsTable.$inferSelect;
export type InsertAssignmentRow = typeof assignmentsTable.$inferInsert;
