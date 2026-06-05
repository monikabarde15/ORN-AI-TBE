
import {
  pgTable,
  uuid,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const blogsTable = pgTable("blogs", {
  id: uuid("id")
    .primaryKey()
    .defaultRandom(),

  title: text("title").notNull(),

  description: text("description").notNull(),

  category: text("category"),

  thumbnail: text("thumbnail"),

  status: text("status")
    .notNull()
    .default("Draft"),

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

/* =========================================
   TYPES
========================================= */

export type BlogRow =
  typeof blogsTable.$inferSelect;

export type InsertBlogRow =
  typeof blogsTable.$inferInsert;