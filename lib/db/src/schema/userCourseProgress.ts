import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export const userCourseProgressTable = pgTable("user_course_progress", {
  id: uuid("id").primaryKey().defaultRandom(),

  userId: text("user_id").notNull(),

  courseId: text("course_id").notNull(),

  completedLessons: jsonb("completed_lessons").notNull().default({}),

  completedQuizzes: jsonb("completed_quizzes").notNull().default({}),

  lessonPositions: jsonb("lesson_positions").notNull().default({}),

  lastActiveLessonId: text("last_active_lesson_id"),

  lastContentMode: text("last_content_mode"),

  finalAssessment: jsonb("final_assessment"),

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

export type UserCourseProgressRow =
  typeof userCourseProgressTable.$inferSelect;

export type InsertUserCourseProgressRow =
  typeof userCourseProgressTable.$inferInsert;
