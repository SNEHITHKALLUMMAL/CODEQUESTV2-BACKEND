"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), ".env") });
function required(name, fallback) {
    const value = process.env[name] ?? fallback;
    if (value === undefined || value === "") {
        // Fail fast at boot rather than at first use — cheaper to debug.
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}
function optional(name, fallback) {
    return process.env[name] ?? fallback;
}
exports.env = {
    nodeEnv: optional("NODE_ENV", "development"),
    port: parseInt(optional("PORT", "5000"), 10),
    clientUrl: optional("CLIENT_URL", "http://localhost:5173"),
    cookieDomain: optional("COOKIE_DOMAIN", "localhost"),
    mongoUri: required("MONGODB_URI"),
    jwt: {
        accessSecret: required("JWT_ACCESS_SECRET"),
        refreshSecret: required("JWT_REFRESH_SECRET"),
        accessExpires: optional("JWT_ACCESS_EXPIRES", "15m"),
        refreshExpires: optional("JWT_REFRESH_EXPIRES", "7d"),
    },
    cloudinary: {
        cloudName: optional("CLOUDINARY_CLOUD_NAME", ""),
        apiKey: optional("CLOUDINARY_API_KEY", ""),
        apiSecret: optional("CLOUDINARY_API_SECRET", ""),
    },
    smtp: {
        host: optional("SMTP_HOST", ""),
        port: parseInt(optional("SMTP_PORT", "587"), 10),
        user: optional("SMTP_USER", ""),
        pass: optional("SMTP_PASS", ""),
    },
    isProd: optional("NODE_ENV", "development") === "production",
    isTest: optional("NODE_ENV", "development") === "test",
};
//# sourceMappingURL=env.js.map