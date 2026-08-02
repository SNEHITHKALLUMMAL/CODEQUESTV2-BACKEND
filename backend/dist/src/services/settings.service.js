"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsService = void 0;
const SiteSetting_model_1 = require("../models/SiteSetting.model");
exports.settingsService = {
    async getAll() {
        const rows = await SiteSetting_model_1.SiteSetting.find();
        const stored = Object.fromEntries(rows.map((r) => [r.key, r.value]));
        return { ...SiteSetting_model_1.DEFAULT_SETTINGS, ...stored };
    },
    async updateMany(updates) {
        await Promise.all(Object.entries(updates).map(([key, value]) => SiteSetting_model_1.SiteSetting.findOneAndUpdate({ key }, { $set: { value } }, { upsert: true })));
        return exports.settingsService.getAll();
    },
};
//# sourceMappingURL=settings.service.js.map