import { getTransporter } from "../config/mailer";
import { env } from "../config/env";
import { logger } from "../utils/logger";

interface SendMailInput {
  to: string;
  subject: string;
  html: string;
  text: string;
}

async function sendMail(input: SendMailInput): Promise<void> {
  const transporter = getTransporter();

  if (!transporter) {
    logger.info(`[email:dev-fallback] To: ${input.to} | Subject: ${input.subject}\n${input.text}`);
    return;
  }

  await transporter.sendMail({
    from: `"CodeQuest LMS" <${env.smtp.user}>`,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
  });
}

function wrapTemplate(title: string, bodyHtml: string): string {
  return `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;">
      <h2 style="color:#12142b;">${title}</h2>
      ${bodyHtml}
      <p style="color:#8a8fae;font-size:12px;margin-top:32px;">CodeQuest LMS — learn HTML & CSS interactively.</p>
    </div>
  `;
}

export const emailService = {
  async sendVerificationEmail(to: string, name: string, rawToken: string): Promise<void> {
    const link = `${env.clientUrl}/verify-email/${rawToken}`;
    await sendMail({
      to,
      subject: "Verify your CodeQuest LMS account",
      text: `Hi ${name}, verify your email: ${link} (expires in 24 hours)`,
      html: wrapTemplate(
        "Verify your email",
        `<p>Hi ${name}, welcome to CodeQuest LMS! Please confirm your email address:</p>
         <p><a href="${link}" style="background:#12142b;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;">Verify email</a></p>
         <p>This link expires in 24 hours. If you didn't create this account, you can ignore this email.</p>`
      ),
    });
  },

  async sendPasswordResetEmail(to: string, name: string, rawToken: string): Promise<void> {
    const link = `${env.clientUrl}/reset-password/${rawToken}`;
    await sendMail({
      to,
      subject: "Reset your CodeQuest LMS password",
      text: `Hi ${name}, reset your password: ${link} (expires in 1 hour)`,
      html: wrapTemplate(
        "Reset your password",
        `<p>Hi ${name}, we received a request to reset your password.</p>
         <p><a href="${link}" style="background:#12142b;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;">Reset password</a></p>
         <p>This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>`
      ),
    });
  },
};
