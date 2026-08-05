import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";
const xssClean = require("xss-clean");
import swaggerUi from "swagger-ui-express";

import { env } from "./config/env";
import { swaggerSpec } from "./config/swagger";
import { v1Router } from "./routes/v1";
import { requestLogger } from "./middleware/requestLogger";
import { generalLimiter } from "./middleware/rateLimiter";
import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";

export function createApp(): Application {
  const app = express();

  app.set("trust proxy", 1);

  app.use(
    helmet({
      contentSecurityPolicy: env.isProd ? undefined : false,
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );
  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    })
  );
  app.use(mongoSanitize());
  app.use(xssClean());
  app.use(hpp());

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cookieParser());

  app.use(compression());

  app.use(requestLogger);

  app.use("/api", generalLimiter);

  if (!env.isProd) {
    app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }

  app.use("/api/v1", v1Router);

  app.get("/", (_req, res) => {
    res.json({ name: "CodeQuest LMS API", status: "running", docs: env.isProd ? undefined : "/api/v1/docs" });
  });

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
