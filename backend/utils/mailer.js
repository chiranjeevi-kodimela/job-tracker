const nodemailer = require("nodemailer");

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;
  if (!process.env.SMTP_HOST) return null;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });

  return transporter;
};

const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (ch) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        ch
      ],
  );

const sendPasswordResetEmail = async ({ to, name, resetUrl }) => {
  const mailTransporter = getTransporter();

  if (!mailTransporter) {
    if (process.env.NODE_ENV === "production") {
      console.warn("SMTP is not configured - password reset email not sent.");
    } else {
      // Development convenience: no SMTP set up, so print the link instead.
      console.log(`[mailer] Password reset link for ${to}: ${resetUrl}`);
    }
    return { delivered: false };
  }

  const safeName = escapeHtml(name || "there");

  await mailTransporter.sendMail({
    from: process.env.MAIL_FROM || "Job Tracker <no-reply@jobtracker.local>",
    to,
    subject: "Reset your Job Tracker password",
    text: `Hi ${name || "there"},\n\nUse the link below to reset your password. It expires in 1 hour.\n\n${resetUrl}\n\nIf you didn't request this, you can ignore this email.`,
    html: `<p>Hi ${safeName},</p><p>Use the link below to reset your password. It expires in 1 hour.</p><p><a href="${escapeHtml(resetUrl)}">Reset password</a></p><p>If you didn't request this, you can ignore this email.</p>`,
  });

  return { delivered: true };
};

module.exports = { sendPasswordResetEmail };
