import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export const candidatesTable = pgTable("candidates", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  country: text("country").notNull(),
  targetRole: text("target_role").notNull(),
  yearsExperience: integer("years_experience").notNull(),
  visaStatus: text("visa_status").notNull(),
  englishLevel: text("english_level").notNull(),
  euWorkEligible: boolean("eu_work_eligible").notNull(),
  linkedinUrl: text("linkedin_url").notNull(),
  avatarUrl: text("avatar_url").notNull(),
  skills: text("skills").array().notNull().default([]),
  cv: jsonb("cv"),
  evaluation: jsonb("evaluation"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type CandidateRow = typeof candidatesTable.$inferSelect;
export type InsertCandidateRow = typeof candidatesTable.$inferInsert;
