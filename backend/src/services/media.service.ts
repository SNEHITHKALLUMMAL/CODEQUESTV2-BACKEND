import { getCloudinary } from "../config/cloudinary";
import { logger } from "../utils/logger";
import { ApiError } from "../utils/ApiError";

export const mediaService = {
  async uploadImage(file: Express.Multer.File): Promise<{ url: string }> {
    if (!file) throw ApiError.badRequest("No file provided");

    const cloudinary = getCloudinary();

    if (!cloudinary) {
      logger.info(`[media:dev-fallback] Uploaded ${file.originalname} (${file.size} bytes) as a data URL (Cloudinary not configured)`);
      return { url: `data:${file.mimetype};base64,${file.buffer.toString("base64")}` };
    }

    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "codequest/media", resource_type: "image" },
        (error, uploadResult) => {
          if (error || !uploadResult) return reject(error);
          resolve(uploadResult as { secure_url: string });
        }
      );
      stream.end(file.buffer);
    });

    return { url: result.secure_url };
  },
};
