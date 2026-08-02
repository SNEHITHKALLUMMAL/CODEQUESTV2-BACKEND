"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_SETTINGS = exports.SETTINGS_KEYS = exports.SiteSetting = void 0;
const mongoose_1 = require("mongoose");
const siteSettingSchema = new mongoose_1.Schema({
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true, default: "" },
}, { timestamps: { createdAt: false, updatedAt: true } });
exports.SiteSetting = (0, mongoose_1.model)("SiteSetting", siteSettingSchema);
/** Keys the app actually reads. Keeping a canonical list prevents typo'd settings from silently doing nothing. */
exports.SETTINGS_KEYS = {
    SITE_NAME: "site_name",
    SITE_DESCRIPTION: "site_description",
    MAINTENANCE_MODE: "maintenance_mode", // "true" | "false"
    SUPPORT_EMAIL: "support_email",
};
exports.DEFAULT_SETTINGS = {
    [exports.SETTINGS_KEYS.SITE_NAME]: "CodeQuest LMS",
    [exports.SETTINGS_KEYS.SITE_DESCRIPTION]: "Learn HTML & CSS interactively.",
    [exports.SETTINGS_KEYS.MAINTENANCE_MODE]: "false",
    [exports.SETTINGS_KEYS.SUPPORT_EMAIL]: "support@codequest.dev",
};
//# sourceMappingURL=SiteSetting.model.js.map