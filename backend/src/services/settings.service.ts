import { SiteSetting, DEFAULT_SETTINGS } from "../models/SiteSetting.model";

export const settingsService = {
  async getAll(): Promise<Record<string, string>> {
    const rows = await SiteSetting.find();
    const stored = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return { ...DEFAULT_SETTINGS, ...stored };
  },

  async updateMany(updates: Record<string, string>): Promise<Record<string, string>> {
    await Promise.all(
      Object.entries(updates).map(([key, value]) =>
        SiteSetting.findOneAndUpdate({ key }, { $set: { value } }, { upsert: true })
      )
    );
    return settingsService.getAll();
  },
};
