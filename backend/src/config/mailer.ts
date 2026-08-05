import nodemailer, { type Transporter } from "nodemailer";
import { env } from "./env";
import { logger } from "../utils/logger";

let transporter: Transporter | null = null;

export function getTransporter(): Transporter | null {
  if (!env.smtp.host || !env.smtp.user) return null;

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.port === 465,
      auth: { user: env.smtp.user, pass: env.smtp.pass },
    });
    logger.info(`SMTP transporter configured for ${env.smtp.host}`);
  }
  return transporter;
}
