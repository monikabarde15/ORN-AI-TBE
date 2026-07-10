import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export const assessmentQuestionsTable = pgTable(
  "assessment_questions",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    assessmentId: uuid("assessment_id").notNull(),

    question: text("question").notNull(),

    options: jsonb("options").notNull(),

    correctAnswer: integer("correct_answer")
      .notNull()
      .default(0),

    explanation: text("explanation"),

    difficulty: text("difficulty")
      .notNull()
      .default("Easy"),

    marks: integer("marks")
      .notNull()
      .default(1),

    timeLimitSeconds: integer("time_limit_seconds")
      .notNull()
      .default(60),

    status: text("status")
      .notNull()
      .default("Draft"),

    orderNo: integer("order_no")
      .notNull()
      .default(1),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  }
);

export type AssessmentQuestionRow =
  typeof assessmentQuestionsTable.$inferSelect;

export type InsertAssessmentQuestionRow =
  typeof assessmentQuestionsTable.$inferInsert;

export type AssessmentQuestionStatus =
  | "Draft"
  | "Published"
  | "Archived";