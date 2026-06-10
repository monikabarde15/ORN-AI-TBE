import { Router, type IRouter } from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import { db, paymentLinksTable } from "@workspace/db";
import { coursesTable } from "@workspace/db";

import { requireAuth, requireRole } from "../lib/auth";
import { desc, eq } from "drizzle-orm";
const router: IRouter = Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

router.post(
  "/payment/generate-link",
  requireAuth,
  requireRole("recruiter", "admin"),
  async (req, res): Promise<void> => {
    try {
      const { courseIds, amount } = req.body;

      if (!Array.isArray(courseIds) || courseIds.length === 0) {
        res.status(400).json({ error: "courseIds required" });
        return;
      }

      if (!amount || amount <= 0) {
        res.status(400).json({ error: "amount required" });
        return;
      }

      const paymentId = crypto.randomUUID();

    const link = await razorpay.paymentLink.create({
        amount: Math.round(amount * 100),
        currency: "INR",

        callback_url:
          `${process.env.FRONTEND_URL}/payment-success/${paymentId}`,

        callback_method: "get",

        notes: {
          paymentId,
          courseIds: courseIds.join(","),
        },
      });

      const [row] = await db
        .insert(paymentLinksTable)
        .values({
          paymentId,
          courseIds,
          amount: amount.toString(),
          paymentLink: link.short_url,
          status: "pending",
          expiresAt: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ),
        })
        .returning();

      res.status(201).json({
        success: true,
        paymentId: row.paymentId,
        paymentLink: row.paymentLink,
      });
    } catch (error: any) {
      console.error(error);

      res.status(500).json({
        error:
          error?.error?.description ||
          error?.message ||
          "Failed to generate payment link",
      });
    }
  }
);


/* =========================================
CREATE ORDER
========================================= */

router.post(
"/payment/create-order",
requireAuth,
async (req, res): Promise<void> => {
try {
const { amount } = req.body;

  if (
    typeof amount !== "number" ||
    amount <= 0
  ) {
    res.status(400).json({
      error: "Invalid amount",
    });
    return;
  }

  const order = await razorpay.orders.create({
    amount: Math.round(amount * 100),
    currency: "INR",
    receipt: crypto.randomUUID(),
  });

  res.status(200).json({
    success: true,
    order_id: order.id,
    amount: order.amount,
    currency: order.currency,
    key_id: process.env.RAZORPAY_KEY_ID,
  });
} catch (error: any) {
  console.error(
    "CREATE ORDER ERROR =>",
    error
  );

  res.status(500).json({
    error:
      error?.error?.description ||
      error?.message ||
      "Failed to create order",
  });
}

}
);

/* =========================================
VERIFY PAYMENT
========================================= */

router.post(
  "/payment/verify",
  requireAuth,
  async (req, res): Promise<void> => {
    try {
      const {
        paymentId,
        studentName,
        studentEmail,
        studentPhone,
        razorpay_payment_id,
        razorpay_signature,
      } = req.body;

      if (
        !paymentId ||
        !razorpay_payment_id
      ) {
        return res.status(400).json({
          error: "Missing payment details",
        });
      }

      const [payment] = await db
        .update(paymentLinksTable)
        .set({
          status: "paid",
          paidAt: new Date(),

          studentName,
          studentEmail,
          studentPhone,

          razorpayPaymentId:
            razorpay_payment_id,
        })
        .where(
          eq(
            paymentLinksTable.paymentId,
            paymentId
          )
        )
        .returning();

      if (!payment) {
        return res.status(404).json({
          error: "Payment not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Payment verified",
        payment,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Verification failed",
      });
    }
  }
);

router.get(
  "/payment/list",
  requireAuth,
  requireRole("admin", "recruiter"),
  async (req, res): Promise<void> => {
    try {
      const rows = await db
        .select()
        .from(paymentLinksTable)
        .orderBy(desc(paymentLinksTable.createdAt));

      res.status(200).json({
        success: true,
        payments: rows,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Failed to fetch payments",
      });
    }
  }
);

router.get(
  "/payment/course/:courseId",
  requireAuth,
  requireRole("admin", "recruiter"),
  async (req, res): Promise<void> => {
    try {
      const courseId = req.params.courseId;

      const rows = await db
        .select()
        .from(paymentLinksTable);

      const payments = rows.filter((p) =>
        p.courseIds.includes(courseId)
      );

      res.status(200).json({
        success: true,
        payments,
      });
    } catch (error) {
      res.status(500).json({
        error: "Failed to fetch course payments",
      });
    }
  }
);
router.get(
  "/my-courses/:paymentId",
  async (req, res) => {
    const paymentId = req.params.paymentId;

    const [payment] = await db
      .select()
      .from(paymentLinksTable)
      .where(
        eq(
          paymentLinksTable.paymentId,
          paymentId
        )
      );

    if (!payment) {
      return res.status(404).json({
        error: "Payment not found",
      });
    }

    res.json({
      success: true,
      courses: payment.courseIds,
    });
  }
);
router.get(
  "/payment/students-courses",
  requireAuth,
  requireRole("admin", "recruiter"),
  async (req, res) => {
    try {
      const payments = await db
        .select()
        .from(paymentLinksTable);

      const result = [];

      for (const payment of payments) {
        const allCourses = await db
          .select()
          .from(coursesTable);

        const courses = allCourses.filter((c) =>
          payment.courseIds.includes(c.id)
        );

        result.push({
          paymentId: payment.paymentId,
          studentName: payment.studentName,
          studentEmail: payment.studentEmail,
          studentPhone: payment.studentPhone,
          amount: payment.amount,
          status: payment.status,
          courses,
        });
      }

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Failed to fetch data",
      });
    }
  }
);
router.get(
  "/payment/:paymentId",
  async (req, res) => {
    try {
      const paymentId = req.params.paymentId;

      const [payment] = await db
        .select()
        .from(paymentLinksTable)
        .where(
          eq(
            paymentLinksTable.paymentId,
            paymentId
          )
        );

      if (!payment) {
        return res.status(404).json({
          error: "Payment not found",
        });
      }

      res.json({
        success: true,
        payment,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Failed to fetch payment",
      });
    }
  }
);

export default router;
