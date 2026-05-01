import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT || 587);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;

if (!host || !port || !user || !pass) {
  console.warn("SMTP environment variables are not fully set.");
}

export const mailTransporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465, // true for 465, false for 587/25[web:11]
  auth: {
    user,
    pass,
  },
});

// Simple helper
export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  const from = process.env.SMTP_USER || "no-reply@scholarflux.app";

  const mailOptions = {
    from,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  };

  return mailTransporter.sendMail(mailOptions);
}