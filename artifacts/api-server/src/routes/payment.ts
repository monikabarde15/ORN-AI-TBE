import { Router, type IRouter } from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import {
  getPaymentEmailTemplate,      // 👈 Payment template
  getLearningPathEmailTemplate,  // 👈 Learning Path template
  sendMailWithRetry,
} from "../lib/mail";
import { db, paymentLinksTable, learningPathsTable, usersTable } from "@workspace/db";
import { coursesTable } from "@workspace/db";
import { requireAuth, requireRole } from "../lib/auth";
import { desc, eq } from "drizzle-orm";

const router: IRouter = Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

/* =========================================
GENERATE PAYMENT LINK
========================================= */

router.post(
  "/payment/generate-link",
  requireAuth,
  requireRole("recruiter", "admin"),
  async (req, res): Promise<void> => {
    try {
      const {
        learningPathId,
        courseIds,
        amount,
        callback_url,
      } = req.body;

      if (!learningPathId) {
        return res.status(400).json({
          error: "learningPathId required",
        });
      }

      if (!Array.isArray(courseIds) || courseIds.length === 0) {
        return res.status(400).json({
          error: "courseIds required",
        });
      }

      if (!amount || Number(amount) <= 0) {
        return res.status(400).json({
          error: "amount required",
        });
      }

      const paymentId = crypto.randomUUID();
      const frontendUrl = process.env.FRONTEND_URL?.replace(/\/$/, "") || "http://localhost:5173";
      const callbackUrl = callback_url || `${frontendUrl}/payment-success/${paymentId}`;

      const link = await razorpay.paymentLink.create({
        amount: Math.round(Number(amount) * 100),
        currency: "INR",
        callback_url: callbackUrl,
        callback_method: "get",
        notes: {
          paymentId,
          learningPathId,
          courseIds: courseIds.join(","),
        },
      });

      const [row] = await db
        .insert(paymentLinksTable)
        .values({
          paymentId,
          learningPathId,
          courseIds,
          amount: amount.toString(),
          paymentLink: link.short_url,
          status: "pending",
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        })
        .returning();

      if (learningPathId) {
        await db
          .update(learningPathsTable)
          .set({ paymentLink: link.short_url })
          .where(eq(learningPathsTable.id, learningPathId));
      }

      // =========================================
      // SEND PAYMENT & LEARNING PATH EMAILS - UPDATED
      // =========================================

      (async () => {
        try {
          let lpTitle = "Learning Path";
          let lpDescription = "";
          if (learningPathId) {
            const [lp] = await db
              .select()
              .from(learningPathsTable)
              .where(eq(learningPathsTable.id, learningPathId));
            if (lp) {
              lpTitle = lp.title;
              lpDescription = lp.description || "";
            }
          }

          let recipients: { email: string; fullName: string }[] = [];

          if (req.body.recipients && Array.isArray(req.body.recipients) && req.body.recipients.length > 0) {
            recipients = req.body.recipients.map((r: any) => ({
              email: (r.email || "").trim().toLowerCase(),
              fullName: r.fullName || "Learner",
            }));
          } else if (req.body.studentEmail || req.body.email) {
            const singleEmail = (req.body.studentEmail || req.body.email).trim().toLowerCase();
            recipients = [{ email: singleEmail, fullName: req.body.studentName || "Learner" }];
          } else {
            recipients = [];
          }

          const joinUrl = learningPathId
            ? `${frontendUrl}/join/${learningPathId}`
            : `${frontendUrl}/learning-paths`;
          const paymentUrl = link.short_url;

          const validRecipients = recipients.filter((r) => r.email);
          const chunkSize = 5;

          for (let i = 0; i < validRecipients.length; i += chunkSize) {
            const chunk = validRecipients.slice(i, i + chunkSize);
            await Promise.all(
              chunk.map(async (recipient) => {
                try {
                  // 👇 Payment Email
                  const paymentHtml = getPaymentEmailTemplate({
                    recipientName: recipient.fullName,
                    amount: amount.toString(),
                    paymentUrl: paymentUrl,
                    invoiceNumber: `INV-${paymentId.slice(0, 8)}`,
                    learningPathName: lpTitle,
                    joinUrl: joinUrl,
                  });

                  await sendMailWithRetry({
                    from: `"ORN-AI" <${process.env.SMTP_USER || "connect@orn-ai.co.uk"}>`,
                    to: recipient.email,
                    subject: `Payment Link Generated: ${lpTitle} - ORN-AI`,
                    html: paymentHtml,
                  });

                  // 👇 Learning Path Email
                  const learningPathHtml = getLearningPathEmailTemplate({
                    recipientName: recipient.fullName,
                    username: recipient.fullName,
                    password: "Your password", // Ya actual password agar store hai toh
                    learningPathName: lpTitle,
                    learningPathLink: joinUrl,
                    joinUrl: frontendUrl,
                  });

                  await sendMailWithRetry({
                    from: `"ORN-AI" <${process.env.SMTP_USER || "connect@orn-ai.co.uk"}>`,
                    to: recipient.email,
                    subject: `Your Learning Path is Ready: ${lpTitle} - ORN-AI`,
                    html: learningPathHtml,
                  });

                  console.log(`[EMAIL SUCCESS] Sent payment & learning path emails to ${recipient.email}`);
                } catch (err) {
                  console.error(`[MAIL ERROR] for ${recipient.email}:`, err);
                }
              })
            );
            await new Promise((r) => setTimeout(r, 20));
          }

          console.log(`[PAYMENT LINK EMAIL] Sent to ${recipients.length} user(s) for learning path ${learningPathId}`);
        } catch (err) {
          console.error("[PAYMENT LINK EMAIL ERROR]", err);
        }
      })();

      return res.status(201).json({
        success: true,
        paymentId: row.paymentId,
        paymentLink: row.paymentLink,
      });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({
        error: error?.error?.description || error?.message || "Failed to generate payment link",
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

      if (typeof amount !== "number" || amount <= 0) {
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
      console.error("CREATE ORDER ERROR =>", error);
      res.status(500).json({
        error: error?.error?.description || error?.message || "Failed to create order",
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

      if (!paymentId || !razorpay_payment_id) {
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
          razorpayPaymentId: razorpay_payment_id,
        })
        .where(eq(paymentLinksTable.paymentId, paymentId))
        .returning();

      if (!payment) {
        return res.status(404).json({
          error: "Payment not found",
        });
      }

      // =========================================
      // SEND PAYMENT SUCCESS EMAIL - UPDATED
      // =========================================

      try {
        const [learningPath] = await db
          .select()
          .from(learningPathsTable)
          .where(eq(learningPathsTable.id, payment.learningPathId));

        const lpTitle = learningPath?.title || "Learning Path";

        const paymentHtml = getPaymentEmailTemplate({
          recipientName: studentName || "Learner",
          amount: payment.amount,
          paymentUrl: payment.paymentLink,
          invoiceNumber: `INV-${paymentId.slice(0, 8)}`,
          learningPathName: lpTitle,
          joinUrl: `${process.env.FRONTEND_URL || "http://localhost:5173"}/join/${payment.learningPathId}`,
        });

        await sendMailWithRetry({
          from: `"ORN-AI" <${process.env.SMTP_USER || "connect@orn-ai.co.uk"}>`,
          to: studentEmail || payment.studentEmail,
          subject: `Payment Confirmation: ${lpTitle} - ORN-AI`,
          html: paymentHtml,
        });

        console.log(`[EMAIL SUCCESS] Payment confirmation sent to ${studentEmail || payment.studentEmail}`);
      } catch (mailError) {
        console.error("[PAYMENT VERIFY EMAIL ERROR]", mailError);
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

/* =========================================
LIST PAYMENTS
========================================= */

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

/* =========================================
GET PAYMENT BY COURSE
========================================= */

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
      const payments = rows.filter((p) => p.courseIds.includes(courseId));

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

/* =========================================
GET MY COURSES BY PAYMENT
========================================= */

router.get(
  "/my-courses/:paymentId",
  async (req, res) => {
    const paymentId = req.params.paymentId;

    const [payment] = await db
      .select()
      .from(paymentLinksTable)
      .where(eq(paymentLinksTable.paymentId, paymentId));

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

/* =========================================
GET STUDENTS COURSES
========================================= */

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

/* =========================================
GET PAYMENT BY ID
========================================= */

router.get(
  "/payment/:paymentId",
  async (req, res) => {
    try {
      const paymentId = req.params.paymentId;

      const [payment] = await db
        .select()
        .from(paymentLinksTable)
        .where(eq(paymentLinksTable.paymentId, paymentId));

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

/* =========================================
SEND PAYMENT & JOIN LINK EMAIL - UPDATED
========================================= */

router.post(
  "/payment/send-link-email",
  requireAuth,
  requireRole("admin", "recruiter"),
  async (req, res): Promise<void> => {
    try {
      const { paymentId, learningPathId, targetEmail } = req.body;

      let paymentLink = "";
      let amount = "";

      if (paymentId) {
        const [payment] = await db
          .select()
          .from(paymentLinksTable)
          .where(eq(paymentLinksTable.paymentId, paymentId));
        if (payment) {
          paymentLink = payment.paymentLink;
          amount = payment.amount;
        }
      }

      if (!paymentLink && learningPathId) {
        const [lp] = await db
          .select()
          .from(learningPathsTable)
          .where(eq(learningPathsTable.id, learningPathId));
        if (lp && lp.paymentLink) {
          paymentLink = lp.paymentLink;
        }
      }

      if (!paymentLink) {
        res.status(400).json({ error: "No payment link found" });
        return;
      }

      let lpTitle = "Learning Path";
      let lpDescription = "";
      if (learningPathId) {
        const [lp] = await db
          .select()
          .from(learningPathsTable)
          .where(eq(learningPathsTable.id, learningPathId));
        if (lp) {
          lpTitle = lp.title;
          lpDescription = lp.description || "";
        }
      }

      let recipients: { email: string; fullName: string }[] = [];
      if (req.body.recipients && Array.isArray(req.body.recipients) && req.body.recipients.length > 0) {
        recipients = req.body.recipients.map((r: any) => ({
          email: (r.email || "").trim().toLowerCase(),
          fullName: r.fullName || "Learner",
        }));
      } else if (targetEmail) {
        recipients = [{ email: targetEmail.trim().toLowerCase(), fullName: "Learner" }];
      } else {
        recipients = [];
      }

      const frontendUrl = process.env.FRONTEND_URL?.replace(/\/$/, "") || "http://localhost:5173";
      const joinUrl = learningPathId
        ? `${frontendUrl}/join/${learningPathId}`
        : `${frontendUrl}/learning-paths`;

      let sentCount = 0;

      for (const recipient of recipients) {
        try {
          // 👇 Payment Email
          const paymentHtml = getPaymentEmailTemplate({
            recipientName: recipient.fullName,
            amount: amount || "0",
            paymentUrl: paymentLink,
            invoiceNumber: `INV-${paymentId?.slice(0, 8) || Date.now().toString().slice(-8)}`,
            learningPathName: lpTitle,
            joinUrl: joinUrl,
          });

          await sendMailWithRetry({
            from: `"ORN-AI" <${process.env.SMTP_USER || "connect@orn-ai.co.uk"}>`,
            to: recipient.email,
            subject: `Payment Link: ${lpTitle} - ORN-AI`,
            html: paymentHtml,
          });

          // 👇 Learning Path Email
          const learningPathHtml = getLearningPathEmailTemplate({
            recipientName: recipient.fullName,
            username: recipient.fullName,
            password: "Your password", // Ya actual password agar store hai toh
            learningPathName: lpTitle,
            learningPathLink: joinUrl,
            joinUrl: frontendUrl,
          });

          await sendMailWithRetry({
            from: `"ORN-AI" <${process.env.SMTP_USER || "connect@orn-ai.co.uk"}>`,
            to: recipient.email,
            subject: `Your Learning Path is Ready: ${lpTitle} - ORN-AI`,
            html: learningPathHtml,
          });

          console.log(`[EMAIL SUCCESS] Sent payment & learning path emails to ${recipient.email}`);
          sentCount++;

          await new Promise((r) => setTimeout(r, 350));
        } catch (mErr) {
          console.error(`[SEND EMAIL ERROR for ${recipient.email}]:`, mErr);
        }
      }

      res.json({
        success: true,
        message: `Payment & Join link emails sent successfully to ${sentCount} user(s).`,
        sentCount,
      });
    } catch (error: any) {
      console.error("SEND LINK EMAIL ERROR =>", error);
      res.status(500).json({ error: error?.message || "Failed to send email" });
    }
  }
);

export default router;