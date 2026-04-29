import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  customType,
} from "drizzle-orm/pg-core";

const bytea = customType<{ data: Buffer; default: false }>({
  dataType() {
    return "bytea";
  },
});

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
  cvFileBytes: bytea("cv_file_bytes"),
  cvFileName: text("cv_file_name"),
  cvMimeType: text("cv_mime_type"),
  evaluation: jsonb("evaluation"),
  source: text("source").notNull().default("direct"),
  lastRole: text("last_role"),
  domain: text("domain"),
  careerGapMonths: integer("career_gap_months").notNull().default(0),
  isShortlisted: boolean("is_shortlisted").notNull().default(false),
  isClientReady: boolean("is_client_ready").notNull().default(false),
  isIndustryReady: boolean("is_industry_ready").notNull().default(false),
  ownerRecruiterId: uuid("owner_recruiter_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type CandidateRow = typeof candidatesTable.$inferSelect;
export type InsertCandidateRow = typeof candidatesTable.$inferInsert;
export type CandidateSource = "direct" | "recruiter";
