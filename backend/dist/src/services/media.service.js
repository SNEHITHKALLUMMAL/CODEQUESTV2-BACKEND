"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaService = void 0;
const cloudinary_1 = require("../config/cloudinary");
const logger_1 = require("../utils/logger");
const ApiError_1 = require("../utils/ApiError");
exports.mediaService = {
    async uploadImage(file) {
        if (!file)
            throw ApiError_1.ApiError.badRequest("No file provided");
        const cloudinary = (0, cloudinary_1.getCloudinary)();
        if (!cloudinary) {
            logger_1.logger.info(`[media:dev-fallback] Uploaded ${file.originalname} (${file.size} bytes) as a data URL (Cloudinary not configured)`);
            return { url: `data:${file.mimetype};base64,${file.buffer.toString("base64")}` };
        }
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({ folder: "codequest/media", resource_type: "image" }, (error, uploadResult) => {
                if (error || !uploadResult)
                    return reject(error);
                resolve(uploadResult);
            });
            stream.end(file.buffer);
        });
        return { url: result.secure_url };
    },
};
//# sourceMappingURL=media.service.js.map