import morgan, { StreamOptions } from "morgan";
import { logger } from "../utils/logger";
import { env } from "../config/env";

const stream: StreamOptions = {
  write: (message) => logger.info(message.trim()),
};

export const requestLogger = morgan(env.isProd ? "combined" : "dev", { stream });
