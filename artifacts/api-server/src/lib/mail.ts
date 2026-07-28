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

/**
 * Sends mail with automatic retry for transient SMTP connection rate-limits (e.g. 421 code).
 */
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

      console.warn(
        `Retry ${attempt}/${maxRetries} after ${retryDelayMs}ms`
      );

      await new Promise((r) =>
        setTimeout(r, retryDelayMs * attempt)
      );
    }
  }
}

/**
 * Format and deduplicate repeated words in full names.
 * Example: "MONIKA MONIKA BARDE MONIKA MONIKA BARDE" -> "Monika Barde"
 */
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

interface EmailTemplateOptions {
  badgeTitle?: string;
  recipientName?: string;
  headlineText: string;
  learningPathTitle: string;
  learningPathDescription?: string;
  amount?: string;
  joinUrl?: string;
  paymentUrl?: string;
  callToActionText?: string;
  logoUrl?: string;
}

/**
 * Official Corporate Email Template for ORN-AI Platform
 */
// export function getOfficialEmailTemplate(options: EmailTemplateOptions): string {
//   const cleanName = formatCleanName(options.recipientName);
//   const year = new Date().getFullYear();
//   const frontendUrl =
//     process.env.FRONTEND_URL?.replace(/\/$/, "") ||
//     "http://localhost:5173";
//   const logoSrc = options.logoUrl || `${frontendUrl}/logo.jpg`;

//   return `
// <!DOCTYPE html>
// <html>
// <head>
// <meta charset="UTF-8">
// <meta name="viewport" content="width=device-width, initial-scale=1.0">
// <title>ORN-AI Notification</title>
// </head>
// <body style="margin:0;padding:0;background-color:#F8FAFC;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
// <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F8FAFC;padding:40px 15px;">
// <tr>
// <td align="center">
// <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 10px 25px -5px rgba(15,23,42,0.08), 0 8px 10px -6px rgba(15,23,42,0.04);border:1px solid #E2E8F0;">

//   <!-- Header Banner with Logo -->
//   <tr>
//     <td style="background:linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #2563EB 100%);padding:32px 40px;text-align:center;">
//       <table width="100%" cellpadding="0" cellspacing="0">
//         <tr>
//           <td align="center">
//             <div style="background-color:#FFFFFF;display:inline-block;padding:8px 18px;border-radius:12px;box-shadow:0 4px 14px rgba(0,0,0,0.25);margin-bottom:12px;">
//               <img src="${logoSrc}" alt="ORN-AI Logo" style="height:46px;width:auto;display:block;border-radius:4px;" />
//             </div>
//             <h1 style="margin:0;color:#FFFFFF;font-size:24px;font-weight:700;letter-spacing:-0.5px;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
//               ORN<span style="color:#60A5FA;">-AI</span>
//             </h1>
//             <p style="margin:4px 0 0 0;color:#93C5FD;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">
//               Talent Infrastructure Platform
//             </p>
//           </td>
//         </tr>
//       </table>
//     </td>
//   </tr>

//   <!-- Main Body -->
//   <tr>
//     <td style="padding:40px 40px 32px 40px;">

//       <!-- Greeting -->
//       <p style="margin:0 0 16px 0;font-size:18px;font-weight:600;color:#0F172A;line-height:1.4;">
//         Dear ${cleanName},
//       </p>

//       <p style="margin:0 0 24px 0;font-size:15px;color:#475569;line-height:1.7;">
//         ${options.headlineText}
//       </p>

//       <!-- Announcement Card -->
//       <div style="background-color:#F8FAFC;border:1px solid #E2E8F0;border-left:4px solid #2563EB;border-radius:8px;padding:20px;margin-bottom:28px;">
//         ${
//           options.badgeTitle
//             ? `<span style="display:inline-block;background-color:#DBEAFE;color:#1E40AF;font-size:11px;font-weight:700;padding:4px 10px;border-radius:4px;letter-spacing:0.5px;text-transform:uppercase;margin-bottom:10px;">${options.badgeTitle}</span>`
//             : ""
//         }
//         <h2 style="margin:6px 0 8px 0;font-size:20px;font-weight:700;color:#0F172A;line-height:1.3;">
//           ${options.learningPathTitle}
//         </h2>
//         ${
//           options.learningPathDescription
//             ? `<p style="margin:0;font-size:14px;color:#64748B;line-height:1.6;">${options.learningPathDescription}</p>`
//             : ""
//         }
//         ${
//           options.amount
//             ? `<p style="margin:10px 0 0 0;font-size:14px;font-weight:700;color:#1E40AF;">Price: ₹${options.amount}</p>`
//             : ""
//         }
//       </div>

//       <!-- CTA Buttons -->
//       ${
//         options.joinUrl || options.paymentUrl
//           ? `
//       <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
//         <tr>
//           <td align="center">
//             ${
//               options.joinUrl
//                 ? `<a href="${options.joinUrl}" target="_blank" style="display:inline-block;background:linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);color:#FFFFFF;font-size:15px;font-weight:600;text-decoration:none;padding:14px 28px;border-radius:8px;box-shadow:0 4px 12px rgba(37,99,235,0.25);margin:5px;">${options.callToActionText || "Join Learning Path"} &rarr;</a>`
//                 : ""
//             }
//             ${
//               options.paymentUrl
//                 ? `<a href="${options.paymentUrl}" target="_blank" style="display:inline-block;background:#0F172A;color:#FFFFFF;font-size:15px;font-weight:600;text-decoration:none;padding:14px 28px;border-radius:8px;box-shadow:0 4px 12px rgba(15,23,42,0.15);margin:5px;">Pay Now &rarr;</a>`
//                 : ""
//             }
//           </td>
//         </tr>
//       </table>
//       `
//           : ""
//       }

//       ${
//         options.paymentUrl
//           ? `
//       <div style="background-color:#EFF6FF;border:1px dashed #BFDBFE;border-radius:8px;padding:14px;text-align:center;margin-bottom:28px;">
//         <p style="margin:0 0 4px 0;font-size:12px;font-weight:600;color:#1E40AF;">Direct Payment URL:</p>
//         <a href="${options.paymentUrl}" target="_blank" style="font-size:13px;color:#2563EB;word-break:break-all;font-weight:500;text-decoration:underline;">${options.paymentUrl}</a>
//       </div>
//       `
//           : ""
//       }

//       <hr style="border:none;border-top:1px solid #E2E8F0;margin:32px 0 24px 0;">

//       <!-- Support Info -->
//       <table width="100%" cellpadding="0" cellspacing="0">
//         <tr>
//           <td style="font-size:13px;color:#64748B;line-height:1.6;">
//             <strong>Need assistance?</strong> Contact our support team:
//             <br>
//             🌐 <a href="https://orn-ai.com/" style="color:#2563EB;text-decoration:none;">https://orn-ai.com/</a> &nbsp;|&nbsp;
//             📧 <a href="mailto:connect@orn-ai.co.uk" style="color:#2563EB;text-decoration:none;">connect@orn-ai.co.uk</a>
//           </td>
//         </tr>
//       </table>

//       <p style="margin:24px 0 0 0;font-size:14px;color:#475569;line-height:1.5;">
//         Kind Regards,<br>
//         <strong style="color:#0F172A;">ORN-AI Team</strong>
//       </p>

//     </td>
//   </tr>

//   <!-- Footer -->
//   <tr>
//     <td style="background-color:#F1F5F9;padding:20px 40px;text-align:center;border-top:1px solid #E2E8F0;">
//       <p style="margin:0;font-size:12px;color:#94A3B8;line-height:1.5;">
//         &copy; ${year} ORN-AI. All rights reserved.<br>
//         This is an automated notification from ORN-AI Platform.
//       </p>
//     </td>
//   </tr>

// </table>
// </td>
// </tr>
// </table>
// </body>
// </html>
//   `;
// }
export function getOtpEmailTemplate(
  otp: string,
  recipientName?: string
): string {
  const cleanName = formatCleanName(recipientName);
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
<tr>
<td style="background:linear-gradient(135deg,#0F172A,#1D4ED8);padding:40px;text-align:center;">
<div style="display:inline-block;background:#fff;padding:10px 20px;border-radius:12px;margin-bottom:16px;">
<img src="${logoSrc}" alt="ORN-AI" style="height:48px;">
</div>
<h1 style="margin:0;color:#fff;font-size:28px;font-weight:700;">
ORN<span style="color:#93C5FD;">-AI</span>
</h1>
<p style="margin-top:8px;color:#CBD5E1;font-size:12px;letter-spacing:2px;text-transform:uppercase;">
Talent Infrastructure Platform
</p>
</td>
</tr>
<tr>
<td style="padding:40px;">
<p style="margin:0 0 20px;font-size:18px;font-weight:600;color:#0F172A;">
Dear ${cleanName},
</p>
<p style="font-size:15px;line-height:1.8;color:#475569;">
Thank you for choosing <strong>ORN-AI</strong>! To verify your email address and proceed with registration, please enter the One-Time Password (OTP) verification code below:
</p>

<div style="text-align:center;margin:30px 0;">
<div style="display:inline-block;padding:18px 40px;background:#EFF6FF;border:2px dashed #2563EB;border-radius:12px;font-size:38px;font-weight:bold;letter-spacing:12px;color:#1E40AF;">
${otp}
</div>
</div>

<p style="font-size:14px;color:#64748B;text-align:center;margin-bottom:30px;">
This OTP code is valid for <strong>10 minutes</strong>. Please do not share this code with anyone.
</p>

<hr style="margin:30px 0;border:none;border-top:1px solid #E2E8F0;">

<p style="font-size:13px;color:#64748B;">
If you did not request this email verification, please ignore this email or contact support at <a href="mailto:chandra@orn-ai.co.uk" style="color:#2563EB;text-decoration:none;">chandra@orn-ai.co.uk</a>.
</p>

<p style="margin-top:25px;color:#475569;font-size:15px;line-height:1.8;">
Kind regards,<br>
<strong style="color:#0F172A;">ORN-AI Team</strong>
</p>
</td>
</tr>
<tr>
<td style="background:#F1F5F9;padding:25px;text-align:center;border-top:1px solid #E2E8F0;">
<p style="margin:0;font-size:12px;color:#94A3B8;line-height:1.8;">
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
</html>
  `;
}

export function getOfficialEmailTemplate(
  options: EmailTemplateOptions
): string {
  const cleanName = formatCleanName(options.recipientName);
  const year = new Date().getFullYear();

  const frontendUrl =
    process.env.FRONTEND_URL?.replace(/\/$/, "") ||
    "http://localhost:5173";

  const logoSrc = `https://orn-ai.com/assets/logo-kXDOLpgf.jpg`;//options.logoUrl || `${frontendUrl}/logo.jpg`;

  const portalLink = options.joinUrl || frontendUrl;
  const learningPath = options.learningPathTitle || "Your Learning Path";

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
<td style="background:linear-gradient(135deg,#0F172A,#1D4ED8);padding:40px;text-align:center;">

<div style="display:inline-block;background:#fff;padding:10px 20px;border-radius:12px;margin-bottom:16px;">
<img src="${logoSrc}" alt="ORN-AI" style="height:48px;">
</div>

<h1 style="margin:0;color:#fff;font-size:28px;font-weight:700;">
ORN<span style="color:#93C5FD;">-AI</span>
</h1>

<p style="margin-top:8px;color:#CBD5E1;font-size:12px;letter-spacing:2px;text-transform:uppercase;">
Talent Infrastructure Platform
</p>

</td>
</tr>

<!-- BODY -->
<tr>
<td style="padding:40px;">

<p style="margin:0 0 20px;font-size:18px;font-weight:600;color:#0F172A;">
Dear ${cleanName},
</p>

<p style="font-size:15px;line-height:1.8;color:#475569;">
Welcome to your <strong>ORN-AI Learning Journey!</strong>
</p>

<p style="font-size:15px;line-height:1.8;color:#475569;">
Thank you for enrolling in
<strong>${learningPath}</strong>.
We're excited to support your learning, skill development, and career growth.
</p>

<!-- Portal -->
<div style="margin:35px 0;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:10px;padding:25px;">

<h2 style="margin:0 0 18px;color:#0F172A;font-size:20px;">
Access Your Learning Path
</h2>

<p style="margin:0;font-size:15px;color:#334155;">
<strong>Portal Link</strong>
</p>

<p style="margin-top:10px;">
<a href="${portalLink}"
style="color:#2563EB;font-weight:600;text-decoration:none;">
${portalLink}
</a>
</p>

</div>

<!-- CTA -->

<div style="text-align:center;margin:35px 0;">

<a href="${portalLink}"
style="
display:inline-block;
background:#2563EB;
color:#ffffff;
text-decoration:none;
padding:15px 32px;
border-radius:8px;
font-size:15px;
font-weight:600;
">
Access Learning Path →
</a>

</div>

<!-- Getting Started -->

<h2 style="font-size:20px;color:#0F172A;margin-bottom:15px;">
Getting Started
</h2>

<ol style="padding-left:22px;color:#475569;font-size:15px;line-height:2;">
<li>Click the portal link.</li>
<li>Sign in with your registered Gmail ID.</li>
<li>Verify using the OTP (if prompted).</li>
<li>Open <strong>My Learning Paths</strong> and select
<strong>${learningPath}</strong>.</li>
</ol>

<!-- Includes -->

<h2 style="font-size:20px;color:#0F172A;margin-top:40px;">
Your Learning Path Includes
</h2>

<ul style="padding-left:22px;color:#475569;font-size:15px;line-height:2;">
<li>Structured learning modules</li>
<li>Video lessons and study materials</li>
<li>Practical exercises and assessments</li>
<li>AI-powered learning support</li>
<li>Progress tracking</li>
<li>Live sessions (where applicable)</li>
<li>Completion certificate</li>
</ul>

<!-- Benefits -->

<div style="margin-top:35px;background:#EFF6FF;border-left:5px solid #2563EB;padding:25px;border-radius:10px;">

<h2 style="margin-top:0;color:#0F172A;font-size:20px;">
Career Benefits
</h2>

<p style="color:#475569;font-size:15px;line-height:1.8;">
Completing your learning path helps you become eligible for ORN-AI career services, including:
</p>

<ul style="padding-left:22px;color:#475569;font-size:15px;line-height:2;">
<li>Skills assessment</li>
<li>CV enhancement</li>
<li>Interview preparation</li>
<li>Career guidance</li>
<li>Live project opportunities</li>
<li>Relevant job recommendations</li>
</ul>

</div>

<!-- Help -->

<h2 style="margin-top:40px;color:#0F172A;font-size:20px;">
Need Help?
</h2>

<p style="color:#475569;font-size:15px;line-height:1.8;">
For any support with your learning path or account, contact us at:
</p>

<p style="font-size:15px;">
<strong>Email:</strong>
<a href="mailto:chandra@orn-ai.co.uk"
style="color:#2563EB;text-decoration:none;">
chandra@orn-ai.co.uk
</a>
</p>

<p style="margin-top:30px;color:#475569;font-size:15px;line-height:1.8;">
We wish you success in your learning journey and look forward to supporting your career growth.
</p>

<p style="font-size:15px;color:#475569;">
Welcome to ORN-AI!
</p>

<p style="margin-top:30px;color:#475569;font-size:15px;line-height:1.8;">
Kind regards,
<br><br>

<strong style="color:#0F172A;">
Chandra Reddy
</strong>
<br>

Founder & CEO
<br>

ORN-AI
<br>

<a href="mailto:chandra@orn-ai.co.uk"
style="color:#2563EB;text-decoration:none;">
chandra@orn-ai.co.uk
</a>

</p>

<hr style="margin:40px 0;border:none;border-top:1px solid #E2E8F0;">

<p style="font-size:12px;color:#64748B;line-height:1.8;">
<strong>Privacy Notice</strong><br><br>

Your personal information and learning records are securely processed in accordance with GDPR.
ORN-AI uses your data only to deliver learning, career development, and job opportunity services based on your consent.

</p>

</td>
</tr>

<!-- FOOTER -->

<tr>
<td style="background:#F1F5F9;padding:25px;text-align:center;border-top:1px solid #E2E8F0;">

<p style="margin:0;font-size:12px;color:#94A3B8;line-height:1.8;">
© ${year} ORN-AI. All rights reserved.
<br>
This is an automated email from ORN-AI.
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;
}