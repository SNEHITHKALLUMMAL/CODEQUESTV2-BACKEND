"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCloudinary = getCloudinary;
const cloudinary_1 = require("cloudinary");
const env_1 = require("./env");
let configured = false;
/** Returns a configured Cloudinary client, or null if no credentials are set (dev fallback). */
function getCloudinary() {
    if (!env_1.env.cloudinary.cloudName || !env_1.env.cloudinary.apiKey || !env_1.env.cloudinary.apiSecret) {
        return null;
    }
    if (!configured) {
        cloudinary_1.v2.config({
            cloud_name: env_1.env.cloudinary.cloudName,
            api_key: env_1.env.cloudinary.apiKey,
            api_secret: env_1.env.cloudinary.apiSecret,
            secure: true,
        });
        configured = true;
    }
    return cloudinary_1.v2;
}
//# sourceMappingURL=cloudinary.js.map