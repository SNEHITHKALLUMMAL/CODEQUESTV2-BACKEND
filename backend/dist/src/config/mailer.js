"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransporter = getTransporter;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("./env");
const logger_1 = require("../utils/logger");
let transporter = null;
/**
 * Returns a real SMTP transporter if credentials are configured, or null.
 * When null, emailService falls back to logging the email content instead
 * of sending it — so registration/login flows are fully testable in local
 * dev without requiring SMTP credentials.
 */
function getTransporter() {
    if (!env_1.env.smtp.host || !env_1.env.smtp.user)
        return null;
    if (!transporter) {
        transporter = nodemailer_1.default.createTransport({
            host: env_1.env.smtp.host,
            port: env_1.env.smtp.port,
            secure: env_1.env.smtp.port === 465,
            auth: { user: env_1.env.smtp.user, pass: env_1.env.smtp.pass },
        });
        logger_1.logger.info(`SMTP transporter configured for ${env_1.env.smtp.host}`);
    }
    return transporter;
}
//# sourceMappingURL=mailer.js.map