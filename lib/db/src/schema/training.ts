import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

/**
 * Training assignments are the "career transformation" stage of the ORN-AI
 * pipeline. They sit between AI evaluation and recruiter readiness.
 *
 * The trainer/program catalog itself lives in code (see
 * `artifacts/api-server/src/lib/training-catalog.ts`) — only the *assignment*
 * (which candidate is on which path, what progress) is persisted here.
 */
export const trainingAssignmentsTable = pgTable("training_assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  candidateId: uuid("candidate_id").notNull(),
  // 'needs_upskilling' | 'needs_reskilling'
  assessmentCategory: text("assessment_category").notNull(),
  // 'upskilling' | 'reskilling'
  trainingType: text("training_type").notNull(),
  programId: text("program_id").notNull(),
  programName: text("program_name").notNull(),
  recommendedPath: text("recommended_path").notNull(),
  deliveryMode: text("delivery_mode").notNull().default("hybrid"),
  trainerId: text("trainer_id").notNull(),
  trainerName: text("trainer_name").notNull(),
  // jsonb arrays of { id, title, durationMinutes, status }
  modules: jsonb("modules").notNull(),
  // jsonb arrays of { id, title, scheduledFor, trainer, status }
  liveSessions: jsonb("live_sessions").notNull(),
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  targetCompletionDate: timestamp("target_completion_date", {
    withTimezone: true,
  }).notNull(),
  // one of the 7 statuses
  status: text("status").notNull().default("not_started"),
  progressPct: integer("progress_pct").notNull().default(0),
  finalReadinessNote: text("final_readiness_note"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type TrainingAssignmentRow =
  typeof trainingAssignmentsTable.$inferSelect;
export type InsertTrainingAssignmentRow =
  typeof trainingAssignmentsTable.$inferInsert;
