import {
  pgTable,
  uuid,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const liveSessionsTable = pgTable(
  "live_sessions",
  {
    id: uuid("id")
      .primaryKey()
      .defaultRandom(),

    courseId: text("course_id").notNull(),

    paymentId: text("payment_id").notNull(),

    studentName: text("student_name"),
    studentEmail: text("student_email"),
    studentPhone: text("student_phone"),

    sessionTitle: text("session_title").notNull(),

    trainerName: text("trainer_name"),

    meetingLink: text("meeting_link"),

    sessionDate: text("session_date"),

    startTime: text("start_time"),
    endTime: text("end_time"),

    description: text("description"),

    status: text("status")
      .notNull()
      .default("scheduled"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  }
);