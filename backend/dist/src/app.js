"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const hpp_1 = __importDefault(require("hpp"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
// xss-clean has no type declarations; safe to require untyped here.
const xssClean = require("xss-clean");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const env_1 = require("./config/env");
const swagger_1 = require("./config/swagger");
const v1_1 = require("./routes/v1");
const requestLogger_1 = require("./middleware/requestLogger");
const rateLimiter_1 = require("./middleware/rateLimiter");
const notFound_1 = require("./middleware/notFound");
const errorHandler_1 = require("./middleware/errorHandler");
function createApp() {
    const app = (0, express_1.default)();
    // Render/Vercel sit behind a proxy; needed for correct client IPs (rate limiting, logging).
    app.set("trust proxy", 1);
    // --- Security ---
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: env_1.env.isProd ? undefined : false, // relaxed CSP in dev for Swagger UI
        crossOriginResourcePolicy: { policy: "cross-origin" },
    }));
    app.use((0, cors_1.default)({
        origin: env_1.env.clientUrl,
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    }));
    app.use((0, express_mongo_sanitize_1.default)()); // strips $/. operators from user input -> blocks NoSQL injection
    app.use(xssClean()); // sanitizes user input against XSS payloads
    app.use((0, hpp_1.default)()); // guards against HTTP parameter pollution
    // --- Parsing ---
    app.use(express_1.default.json({ limit: "1mb" }));
    app.use(express_1.default.urlencoded({ extended: true, limit: "1mb" }));
    app.use((0, cookie_parser_1.default)());
    // --- Performance ---
    app.use((0, compression_1.default)());
    // --- Observability ---
    app.use(requestLogger_1.requestLogger);
    // --- Rate limiting (general; stricter limiters applied per-route in later phases) ---
    app.use("/api", rateLimiter_1.generalLimiter);
    // --- API docs (disabled in production for security-through-reduced-surface) ---
    if (!env_1.env.isProd) {
        app.use("/api/v1/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
    }
    // --- Routes ---
    app.use("/api/v1", v1_1.v1Router);
    app.get("/", (_req, res) => {
        res.json({ name: "CodeQuest LMS API", status: "running", docs: env_1.env.isProd ? undefined : "/api/v1/docs" });
    });
    // --- 404 + error handling (must be last, in this order) ---
    app.use(notFound_1.notFound);
    app.use(errorHandler_1.errorHandler);
    return app;
}
//# sourceMappingURL=app.js.map