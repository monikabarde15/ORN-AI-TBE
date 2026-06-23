import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  boolean,
} from "drizzle-orm/pg-core";

export const learningPathsTable =
  pgTable("learning_paths", {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    title: text("title").notNull(),

    description: text("description"),

    thumbnail: text("thumbnail"),

    introVideo: text("intro_video"),

    paymentLink: text("payment_link"),

    courseIds: jsonb("course_ids")
      .$type<string[]>()
      .default([]),
       isEnabled: boolean("is_enabled")
      .default(true)
      .notNull(),

    createdAt: timestamp("created_at")
      .defaultNow(),
  });