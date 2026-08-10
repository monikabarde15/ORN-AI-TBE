import {
    pgTable,
    uuid,
    text,
    timestamp,
    jsonb,
    integer,
    uniqueIndex,
} from "drizzle-orm/pg-core";

// ======================================================
// COURSE PROGRESS TABLE
// ======================================================

export const courseProgressTable = pgTable(
    "course_progress",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        userId: uuid("user_id").notNull(),
        courseId: uuid("course_id").notNull(),
        // ✅ progressData: jsonb("progress_data").notNull(),  <-- ISKO COMPLETELY HATA DIYA HAI
        completedLessons: jsonb("completed_lessons").default({}),
        completedQuizzes: jsonb("completed_quizzes").default({}),
        lessonPositions: jsonb("lesson_positions").default({}),
        lessonScores: jsonb("lesson_scores").default({}),
        quizScores: jsonb("quiz_scores").default({}),
        totalScore: integer("total_score").default(0),
        finalAssessment: jsonb("final_assessment"),
        updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    (table) => ({
        userIdCourseIdIdx: uniqueIndex("user_course_idx").on(
            table.userId,
            table.courseId
        ),
    })
);