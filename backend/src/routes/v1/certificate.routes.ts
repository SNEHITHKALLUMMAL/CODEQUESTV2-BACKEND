import { Router } from "express";
import { certificateController } from "../../controllers/certificate.controller";
import { protect } from "../../middleware/auth.middleware";

export const certificateRouter = Router();

certificateRouter.get("/", protect, certificateController.list);
