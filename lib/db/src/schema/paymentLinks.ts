import {
  pgTable,
  uuid,
  text,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";

export const paymentLinksTable = pgTable("payment_links", {
  id: uuid("id").primaryKey().defaultRandom(),

  paymentId: text("payment_id")
    .notNull()
    .unique(),

  // ✅ Add this
  learningPathId: uuid("learning_path_id"),

  courseIds: text("course_ids")
    .array()
    .notNull()
    .default([]),

  amount: numeric("amount", {
    precision: 12,
    scale: 2,
  }).notNull(),

  status: text("status")
    .notNull()
    .default("pending"),

  paymentLink: text("payment_link").notNull(),

  studentName: text("student_name"),
  studentEmail: text("student_email"),
  studentPhone: text("student_phone"),

  razorpayPaymentId: text("razorpay_payment_id"),
  razorpayOrderId: text("razorpay_order_id"),

  createdBy: uuid("created_by"),

  paidAt: timestamp("paid_at", {
    withTimezone: true,
  }),

  expiresAt: timestamp("expires_at", {
    withTimezone: true,
  }),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});