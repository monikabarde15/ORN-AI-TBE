import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const activityTable = pgTable("activity", {
  id: uuid("id").primaryKey().defaultRandom(),
  kind: text("kind").notNull(),
  candidateName: text("candidate_name").notNull(),
  country: text("country").notNull(),
  message: text("message").notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type ActivityRow = typeof activityTable.$inferSelect;
export type InsertActivityRow = typeof activityTable.$inferInsert;
