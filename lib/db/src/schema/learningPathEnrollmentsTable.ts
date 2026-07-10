import {
  pgTable,
  uuid,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const learningPathEnrollmentsTable = pgTable(
  "learning_path_enrollments",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    learningPathId: uuid("learning_path_id")
      .notNull(),

    userId: uuid("user_id")
      .notNull(),

    userName: text("user_name"),

    userEmail: text("user_email"),

    status: text("status")
      .default("joined")
      .notNull(),

    joinedAt: timestamp("joined_at")
      .defaultNow()
      .notNull(),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),
  }
);