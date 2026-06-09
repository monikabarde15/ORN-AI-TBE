import { Router, type IRouter } from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import { db, paymentLinksTable } from "@workspace/db";
import { requireAuth, requireRole } from "../lib/auth";
import { desc } from "drizzle-orm";

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
  description: "Learning Path Payment",

  notify: {
    sms: false,
    email: false,
  },

  reminder_enable: false,

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
razorpay_order_id,
razorpay_payment_id,
razorpay_signature,
} = req.body;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature
  ) {
    res.status(400).json({
      error: "Missing payment details",
    });
    return;
  }

  const body =
    razorpay_order_id +
    "|" +
    razorpay_payment_id;

  const expectedSignature =
    crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET!
      )
      .update(body)
      .digest("hex");

  const isValid =
    expectedSignature ===
    razorpay_signature;

  if (!isValid) {
    res.status(400).json({
      success: false,
      error: "Invalid signature",
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Payment verified",
  });
} catch (error: any) {
  console.error(
    "VERIFY ERROR =>",
    error
  );

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
export default router;
