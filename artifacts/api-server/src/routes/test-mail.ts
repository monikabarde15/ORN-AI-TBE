import { Router } from "express";
import nodemailer from "nodemailer";

const router = Router();

router.get("/test-mail", async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: "m77496551@gmail.com",
      subject: "ORN-AI SMTP Test",
      text: "SMTP is working successfully.",
    });

    res.json({
      success: true,
      messageId: info.messageId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

export default router;