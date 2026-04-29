import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";

export const projectsTable = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  candidateId: uuid("candidate_id").notNull(),
  name: text("name").notNull(),
  techStack: text("tech_stack").array().notNull().default([]),
  durationWeeks: integer("duration_weeks").notNull(),
  status: text("status").notNull().default("in_progress"),
  feedback: text("feedback"),
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  endDate: timestamp("end_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type ProjectRow = typeof projectsTable.$inferSelect;
export type InsertProjectRow = typeof projectsTable.$inferInsert;
export type ProjectStatus = "in_progress" | "completed" | "cancelled";
