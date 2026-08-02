"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.certificateRouter = void 0;
const express_1 = require("express");
const certificate_controller_1 = require("../../controllers/certificate.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
exports.certificateRouter = (0, express_1.Router)();
/**
 * @openapi
 * /certificates:
 *   get:
 *     summary: List the current user's earned certificates
 *     tags: [Certificates]
 *     responses:
 *       200: { description: Certificates }
 */
exports.certificateRouter.get("/", auth_middleware_1.protect, certificate_controller_1.certificateController.list);
//# sourceMappingURL=certificate.routes.js.map