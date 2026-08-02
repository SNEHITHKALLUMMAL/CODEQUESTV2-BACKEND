"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const db_1 = require("./config/db");
const env_1 = require("./config/env");
const logger_1 = require("./utils/logger");
async function bootstrap() {
    await (0, db_1.connectDB)();
    const app = (0, app_1.createApp)();
    const server = app.listen(env_1.env.port, () => {
        logger_1.logger.info(`CodeQuest LMS API listening on port ${env_1.env.port} [${env_1.env.nodeEnv}]`);
        if (!env_1.env.isProd) {
            logger_1.logger.info(`Swagger docs: http://localhost:${env_1.env.port}/api/v1/docs`);
        }
    });
    const shutdown = async (signal) => {
        logger_1.logger.info(`${signal} received: shutting down gracefully`);
        server.close(async () => {
            await (0, db_1.disconnectDB)();
            logger_1.logger.info("Shutdown complete");
            process.exit(0);
        });
        // Force-exit if graceful shutdown hangs
        setTimeout(() => process.exit(1), 10_000).unref();
    };
    process.on("SIGTERM", () => void shutdown("SIGTERM"));
    process.on("SIGINT", () => void shutdown("SIGINT"));
    process.on("unhandledRejection", (reason) => {
        logger_1.logger.error(`Unhandled Rejection: ${reason}`);
    });
    process.on("uncaughtException", (err) => {
        logger_1.logger.error(`Uncaught Exception: ${err.stack || err.message}`);
        process.exit(1);
    });
}
bootstrap().catch((err) => {
    logger_1.logger.error(`Failed to start server: ${err.stack || err.message}`);
    process.exit(1);
});
//# sourceMappingURL=server.js.map