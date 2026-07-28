import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  pool: true,
  maxConnections: 1,
  maxMessages: 10,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendMailWithRetry(
  options: nodemailer.SendMailOptions,
  maxRetries = 3,
  retryDelayMs = 5000
) {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await transporter.sendMail(options);
    } catch (err) {
      attempt++;
      if (attempt >= maxRetries) throw err;
      console.warn(`Retry ${attempt}/${maxRetries} after ${retryDelayMs}ms`);
      await new Promise((r) => setTimeout(r, retryDelayMs * attempt));
    }
  }
}

export function formatCleanName(rawName?: string | null): string {
  if (!rawName || typeof rawName !== "string") return "Learner";
  const words = rawName.trim().split(/\s+/);
  const uniqueWords: string[] = [];
  for (const word of words) {
    if (!word) continue;
    const lower = word.toLowerCase();
    if (!uniqueWords.map((w) => w.toLowerCase()).includes(lower)) {
      uniqueWords.push(word);
    }
  }
  const clean = uniqueWords.join(" ");
  if (!clean) return "Learner";
  return clean.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
  );
}

// ============================================
// 1. REGISTRATION EMAIL - Simple (Only Credentials)
// ============================================
interface RegistrationEmailOptions {
  recipientName: string;
  username: string;
  password: string;
  joinUrl?: string;
}

export function getRegistrationEmailTemplate(
  options: RegistrationEmailOptions
): string {
  const cleanName = formatCleanName(options.recipientName);
  const year = new Date().getFullYear();
  const frontendUrl = process.env.FRONTEND_URL?.replace(/\/$/, "") || "http://localhost:5173";
  const portalLink = options.joinUrl || frontendUrl;
  const logoSrc = `https://orn-ai.com/assets/logo-kXDOLpgf.jpg`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Welcome to ORN-AI</title>
</head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:40px 15px;">
<tr>
<td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #E2E8F0;box-shadow:0 10px 30px rgba(15,23,42,.08);">

<!-- HEADER -->
<tr>
<td style="background:linear-gradient(135deg,#0F172A,#1D4ED8);padding:35px;text-align:center;">
<div style="display:inline-block;background:#fff;padding:10px 20px;border-radius:12px;margin-bottom:12px;">
<img src="${logoSrc}" alt="ORN-AI" style="height:42px;">
</div>
<h1 style="margin:0;color:#fff;font-size:26px;font-weight:700;">
ORN<span style="color:#93C5FD;">-AI</span>
</h1>
<p style="margin-top:4px;color:#CBD5E1;font-size:11px;letter-spacing:2px;text-transform:uppercase;">
Talent Infrastructure Platform
</p>
</td>
</tr>

<!-- BODY -->
<tr>
<td style="padding:35px 40px;">

<p style="margin:0 0 16px 0;font-size:17px;font-weight:600;color:#0F172A;">
Dear ${cleanName},
</p>

<p style="font-size:15px;line-height:1.7;color:#475569;margin-bottom:24px;">
Thank you for registering with us. We are delighted to have you join our growing network of professionals across global markets!
</p>

<!-- CREDENTIALS -->
<div style="background:#F8FAFC;border:1px solid #CBD5E1;border-left:4px solid #2563EB;border-radius:8px;padding:20px 24px;margin:20px 0 24px 0;">
  <h3 style="margin:0 0 12px 0;color:#0F172A;font-size:16px;font-weight:700;">Your Account Login Credentials</h3>
  <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#334155;line-height:2;">
    <tr>
      <td style="padding:2px 0;width:120px;font-weight:600;color:#64748B;">Username:</td>
      <td style="padding:2px 0;font-weight:700;color:#1E40AF;">${options.username}</td>
    </tr>
    <tr>
      <td style="padding:2px 0;width:120px;font-weight:600;color:#64748B;">Password:</td>
      <td style="padding:2px 0;font-weight:700;color:#1E40AF;">${options.password}</td>
    </tr>
  </table>
</div>

<p style="font-size:14px;color:#475569;margin:0 0 4px 0;">
<strong>Portal Link:</strong> 
<a href="${portalLink}" style="color:#2563EB;font-weight:600;text-decoration:none;">${portalLink}</a>
</p>
<p style="font-size:13px;color:#64748B;margin:0 0 24px 0;">
Sign in with your registered email ID and the password above.
</p>

<p style="font-size:15px;color:#475569;margin:0 0 4px 0;">Welcome to ORN-AI!</p>

<p style="font-size:14px;color:#475569;margin-top:28px;line-height:1.6;">
Kind regards,<br><br>
<strong style="color:#0F172A;">Chandra Reddy</strong><br>
Founder & CEO<br>
ORN-AI
</p>

<hr style="margin:28px 0 20px 0;border:none;border-top:1px solid #E2E8F0;">
<p style="font-size:12px;color:#94A3B8;line-height:1.6;text-align:center;margin:0;">
© ${year} ORN-AI. All rights reserved.<br>
Contact: <a href="mailto:chandral@orn.ai.co.uk" style="color:#94A3B8;text-decoration:none;">chandral@orn.ai.co.uk</a>
</p>

</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`;
}

// ============================================
// 2. LEARNING PATH EMAIL - Full Details
// ============================================
interface LearningPathEmailOptions {
  recipientName: string;
  username: string;
  // password: string;
  learningPathName: string;
  learningPathLink?: string;
  joinUrl?: string;
}

export function getLearningPathEmailTemplate(
  options: LearningPathEmailOptions
): string {
  const cleanName = formatCleanName(options.recipientName);
  const year = new Date().getFullYear();
  const frontendUrl = process.env.FRONTEND_URL?.replace(/\/$/, "") || "http://localhost:5173";
  const portalLink = options.joinUrl || frontendUrl;
  const learningPathLink = options.learningPathLink || portalLink;
  const learningPathName = options.learningPathName || "Your Learning Path";
  const logoSrc = `https://orn-ai.com/assets/logo-kXDOLpgf.jpg`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Your Learning Path is Ready</title>
</head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:40px 15px;">
<tr>
<td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #E2E8F0;box-shadow:0 10px 30px rgba(15,23,42,.08);">

<!-- HEADER -->
<tr>
<td style="background:linear-gradient(135deg,#0F172A,#1D4ED8);padding:35px;text-align:center;">
<div style="display:inline-block;background:#fff;padding:10px 20px;border-radius:12px;margin-bottom:12px;">
<img src="${logoSrc}" alt="ORN-AI" style="height:42px;">
</div>
<h1 style="margin:0;color:#fff;font-size:26px;font-weight:700;">
ORN<span style="color:#93C5FD;">-AI</span>
</h1>
<p style="margin-top:4px;color:#CBD5E1;font-size:11px;letter-spacing:2px;text-transform:uppercase;">
Talent Infrastructure Platform
</p>
</td>
</tr>

<!-- BODY -->
<tr>
<td style="padding:35px 40px;">

<p style="margin:0 0 16px 0;font-size:17px;font-weight:600;color:#0F172A;">
Dear ${cleanName},
</p>

<p style="font-size:15px;line-height:1.7;color:#475569;margin-bottom:12px;">
Your learning path <strong>${learningPathName}</strong> is now available!
</p>
<p style="font-size:15px;line-height:1.7;color:#475569;margin-bottom:20px;">
Click the link below to access your learning path and start your journey.
</p>

<!-- Learning Path Access -->
<div style="background:#EFF6FF;border:1px solid #DBEAFE;border-radius:8px;padding:20px;margin:20px 0;">
  <h2 style="margin:0 0 12px 0;color:#0F172A;font-size:18px;">Access Your Learning Path</h2>
  <p style="margin:0 0 8px 0;font-size:14px;color:#475569;">
    <strong>Portal Link</strong>
  </p>
  <p style="margin:0 0 16px 0;">
    <a href="${portalLink}" style="color:#2563EB;font-weight:600;text-decoration:none;">${portalLink}</a>
  </p>
  <div style="text-align:center;margin:16px 0;">
    <a href="${learningPathLink}" 
       style="display:inline-block;background:#2563EB;color:#ffffff;text-decoration:none;padding:12px 32px;border-radius:6px;font-size:15px;font-weight:600;">
      Access Learning Path →
    </a>
  </div>
</div>

<!-- Getting Started -->
<h2 style="font-size:18px;color:#0F172A;margin:30px 0 12px 0;">Getting Started</h2>
<ol style="padding-left:22px;color:#475569;font-size:14px;line-height:2.2;">
  <li>Click the portal link.</li>
  <li>Sign in with your registered email ID.</li>
  <li>Verify using the CAPTCHA.</li>
  <li>Open <strong>My Learning Paths</strong> and select <strong>${learningPathName}</strong>.</li>
</ol>

<!-- Learning Path Includes -->
<h2 style="font-size:18px;color:#0F172A;margin:30px 0 12px 0;">Your Learning Path Includes</h2>
<ul style="padding-left:22px;color:#475569;font-size:14px;line-height:2.2;">
  <li>Structured learning modules</li>
  <li>Video lessons and study materials</li>
  <li>Practical exercises and assessments</li>
  <li>AI-powered learning support</li>
  <li>Progress tracking</li>
  <li>Live sessions (where applicable)</li>
  <li>Completion certificate</li>
</ul>

<!-- Career Benefits -->
<div style="margin:30px 0;background:#EFF6FF;border-left:4px solid #2563EB;padding:20px 24px;border-radius:8px;">
  <h2 style="margin:0 0 8px 0;color:#0F172A;font-size:18px;">Career Benefits</h2>
  <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 12px 0;">
    Completing your learning path helps you become eligible for ORN-AI career services, including:
  </p>
  <ul style="padding-left:22px;color:#475569;font-size:14px;line-height:2.2;margin:0;">
    <li>Skills assessment</li>
    <li>CV enhancement</li>
    <li>Interview preparation</li>
    <li>Career guidance</li>
    <li>Live project opportunities</li>
    <li>Relevant job recommendations</li>
  </ul>
</div>

<!-- Need Help -->
<h2 style="font-size:18px;color:#0F172A;margin:30px 0 8px 0;">Need Help?</h2>
<p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 4px 0;">
  For any support with your learning path or account, contact us at:
</p>
<p style="font-size:14px;margin:0 0 24px 0;">
  <strong>Email:</strong> 
  <a href="mailto:chandral@orn.ai.co.uk" style="color:#2563EB;text-decoration:none;">chandral@orn.ai.co.uk</a>
</p>

<p style="font-size:15px;color:#475569;margin:0 0 4px 0;">
  We wish you success in your learning journey and look forward to supporting your career growth.
</p>
<p style="font-size:15px;color:#475569;margin:16px 0 4px 0;">Welcome to ORN-AI!</p>

<p style="font-size:14px;color:#475569;margin-top:28px;line-height:1.6;">
Kind regards,<br><br>
<strong style="color:#0F172A;">Chandra Reddy</strong><br>
Founder & CEO<br>
ORN-AI<br>
<a href="mailto:chandral@orn.ai.co.uk" style="color:#2563EB;text-decoration:none;">chandral@orn.ai.co.uk</a>
</p>

<hr style="margin:28px 0 20px 0;border:none;border-top:1px solid #E2E8F0;">

<!-- Privacy Notice -->
<p style="font-size:12px;color:#64748B;line-height:1.6;text-align:center;margin:0;">
<strong>Privacy Notice</strong><br><br>
Your personal information and learning records are securely processed in accordance with GDPR.
ORN-AI uses your data only to deliver learning, career development, and job opportunity services based on your consent.
<br><br>
© ${year} ORN-AI. All rights reserved.
</p>

</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`;
}

// ============================================
// 3. OTP EMAIL - Verification Code
// ============================================
interface OtpEmailOptions {
  recipientName?: string;
  otp: string;
}

export function getOtpEmailTemplate(
  options: OtpEmailOptions
): string {
  const cleanName = formatCleanName(options.recipientName);
  const year = new Date().getFullYear();
  const logoSrc = `https://orn-ai.com/assets/logo-kXDOLpgf.jpg`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>ORN-AI Verification Code</title>
</head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:40px 15px;">
<tr>
<td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #E2E8F0;box-shadow:0 10px 30px rgba(15,23,42,.08);">

<!-- HEADER -->
<tr>
<td style="background:linear-gradient(135deg,#0F172A,#1D4ED8);padding:35px;text-align:center;">
<div style="display:inline-block;background:#fff;padding:10px 20px;border-radius:12px;margin-bottom:12px;">
<img src="${logoSrc}" alt="ORN-AI" style="height:42px;">
</div>
<h1 style="margin:0;color:#fff;font-size:26px;font-weight:700;">
ORN<span style="color:#93C5FD;">-AI</span>
</h1>
<p style="margin-top:4px;color:#CBD5E1;font-size:11px;letter-spacing:2px;text-transform:uppercase;">
Talent Infrastructure Platform
</p>
</td>
</tr>

<!-- BODY -->
<tr>
<td style="padding:35px 40px;">

<p style="margin:0 0 16px 0;font-size:17px;font-weight:600;color:#0F172A;">
Dear ${cleanName},
</p>

<p style="font-size:15px;line-height:1.7;color:#475569;margin-bottom:20px;">
Thank you for choosing <strong>ORN-AI</strong>! To verify your email address and proceed with registration, please enter the One-Time Password (OTP) verification code below:
</p>

<div style="text-align:center;margin:30px 0;">
<div style="display:inline-block;padding:18px 40px;background:#EFF6FF;border:2px dashed #2563EB;border-radius:12px;font-size:38px;font-weight:bold;letter-spacing:12px;color:#1E40AF;font-family:monospace;">
${options.otp}
</div>
</div>

<p style="font-size:14px;color:#64748B;text-align:center;margin-bottom:20px;">
This OTP code is valid for <strong>10 minutes</strong>. Please do not share this code with anyone.
</p>

<hr style="margin:30px 0;border:none;border-top:1px solid #E2E8F0;">

<p style="font-size:13px;color:#64748B;text-align:center;">
If you did not request this email verification, please ignore this email or contact support at 
<a href="mailto:chandral@orn.ai.co.uk" style="color:#2563EB;text-decoration:none;">chandral@orn.ai.co.uk</a>.
</p>

<p style="margin-top:25px;color:#475569;font-size:14px;line-height:1.6;">
Kind regards,<br>
<strong style="color:#0F172A;">ORN-AI Team</strong>
</p>

</td>
</tr>

<!-- FOOTER -->
<tr>
<td style="background:#F1F5F9;padding:20px;text-align:center;border-top:1px solid #E2E8F0;">
<p style="margin:0;font-size:12px;color:#94A3B8;line-height:1.6;">
© ${year} ORN-AI. All rights reserved.<br>
This is an automated verification email from ORN-AI.
</p>
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`;
}

// ============================================
// 4. PAYMENT/INVOICE EMAIL
// ============================================
interface PaymentEmailOptions {
  recipientName: string;
  amount: string;
  paymentUrl: string;
  invoiceNumber?: string;
  joinUrl?: string;
  learningPathName?: string;
}

// mail.ts - Payment Email Template

export function getPaymentEmailTemplate(
  options: {
    recipientName: string;
    amount: string;  // ✅ String hi lena hai
    paymentUrl: string;
    invoiceNumber?: string;
    learningPathName?: string;
    joinUrl?: string;
  }
): string {
  const cleanName = formatCleanName(options.recipientName);
  const year = new Date().getFullYear();
  const logoSrc = `https://orn-ai.com/assets/logo-kXDOLpgf.jpg`;
  const invoiceNumber = options.invoiceNumber || `INV-${Date.now().toString().slice(-8)}`;
  const learningPathName = options.learningPathName || "Your Learning Path";
  const portalLink = options.joinUrl || process.env.FRONTEND_URL || "http://localhost:5173";
  const amount = options.amount || "0";

  // ✅ Ensure amount is properly formatted
  const formattedAmount = amount.includes('.') ? amount : `${amount}.00`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Payment Confirmation - ORN-AI</title>
</head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:40px 15px;">
<tr>
<td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #E2E8F0;box-shadow:0 10px 30px rgba(15,23,42,.08);">

<!-- HEADER -->
<tr>
<td style="background:linear-gradient(135deg,#0F172A,#1D4ED8);padding:35px;text-align:center;">
<div style="display:inline-block;background:#fff;padding:10px 20px;border-radius:12px;margin-bottom:12px;">
<img src="${logoSrc}" alt="ORN-AI" style="height:42px;">
</div>
<h1 style="margin:0;color:#fff;font-size:26px;font-weight:700;">
ORN<span style="color:#93C5FD;">-AI</span>
</h1>
<p style="margin-top:4px;color:#CBD5E1;font-size:11px;letter-spacing:2px;text-transform:uppercase;">
Talent Infrastructure Platform
</p>
</td>
</tr>

<!-- BODY -->
<tr>
<td style="padding:35px 40px;">

<p style="margin:0 0 16px 0;font-size:17px;font-weight:600;color:#0F172A;">
Dear ${cleanName},
</p>

<p style="font-size:15px;line-height:1.7;color:#475569;margin-bottom:16px;">
Thank you for your payment. Your enrollment for <strong>${learningPathName}</strong> has been confirmed.
</p>



<!-- Access Button -->
<div style="text-align:center;margin:24px 0;">
  <a href="${portalLink}" 
     style="display:inline-block;background:#2563EB;color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:8px;font-size:16px;font-weight:600;">
    Access Your Learning Path →
  </a>
</div>

<p style="font-size:14px;color:#64748B;text-align:center;margin:0 0 20px 0;">
  Or use this direct link: <a href="${portalLink}" style="color:#2563EB;text-decoration:none;">${portalLink}</a>
</p>

<hr style="margin:30px 0;border:none;border-top:1px solid #E2E8F0;">

<p style="font-size:14px;color:#475569;line-height:1.6;margin:0 0 4px 0;">
If you have any questions regarding your payment or learning path, contact us at:
</p>
<p style="font-size:14px;margin:0 0 24px 0;">
<strong>Email:</strong> <a href="mailto:chandral@orn.ai.co.uk" style="color:#2563EB;text-decoration:none;">chandral@orn.ai.co.uk</a>
</p>

<p style="font-size:14px;color:#475569;margin-top:28px;line-height:1.6;">
Kind regards,<br><br>
<strong style="color:#0F172A;">Chandra Reddy</strong><br>
Founder & CEO<br>
ORN-AI
</p>

<hr style="margin:28px 0 20px 0;border:none;border-top:1px solid #E2E8F0;">

<!-- Footer -->
<p style="font-size:12px;color:#94A3B8;line-height:1.6;text-align:center;margin:0;">
© ${year} ORN-AI. All rights reserved.<br>
This is an automated payment confirmation email from ORN-AI.
</p>

</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`;
}