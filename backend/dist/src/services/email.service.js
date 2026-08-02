"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
const mailer_1 = require("../config/mailer");
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
async function sendMail(input) {
    const transporter = (0, mailer_1.getTransporter)();
    if (!transporter) {
        // Dev fallback: no SMTP configured -> log the email instead of failing the request.
        logger_1.logger.info(`[email:dev-fallback] To: ${input.to} | Subject: ${input.subject}\n${input.text}`);
        return;
    }
    await transporter.sendMail({
        from: `"CodeQuest LMS" <${env_1.env.smtp.user}>`,
        to: input.to,
        subject: input.subject,
        html: input.html,
        text: input.text,
    });
}
function wrapTemplate(title, bodyHtml) {
    return `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;">
      <h2 style="color:#12142b;">${title}</h2>
      ${bodyHtml}
      <p style="color:#8a8fae;font-size:12px;margin-top:32px;">CodeQuest LMS — learn HTML & CSS interactively.</p>
    </div>
  `;
}
exports.emailService = {
    async sendVerificationEmail(to, name, rawToken) {
        const link = `${env_1.env.clientUrl}/verify-email/${rawToken}`;
        await sendMail({
            to,
            subject: "Verify your CodeQuest LMS account",
            text: `Hi ${name}, verify your email: ${link} (expires in 24 hours)`,
            html: wrapTemplate("Verify your email", `<p>Hi ${name}, welcome to CodeQuest LMS! Please confirm your email address:</p>
         <p><a href="${link}" style="background:#12142b;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;">Verify email</a></p>
         <p>This link expires in 24 hours. If you didn't create this account, you can ignore this email.</p>`),
        });
    },
    async sendPasswordResetEmail(to, name, rawToken) {
        const link = `${env_1.env.clientUrl}/reset-password/${rawToken}`;
        await sendMail({
            to,
            subject: "Reset your CodeQuest LMS password",
            text: `Hi ${name}, reset your password: ${link} (expires in 1 hour)`,
            html: wrapTemplate("Reset your password", `<p>Hi ${name}, we received a request to reset your password.</p>
         <p><a href="${link}" style="background:#12142b;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;">Reset password</a></p>
         <p>This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>`),
        });
    },
};
//# sourceMappingURL=email.service.js.map