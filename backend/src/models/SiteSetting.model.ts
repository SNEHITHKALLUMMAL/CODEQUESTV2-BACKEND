import { Schema, model, Document } from "mongoose";

export interface ISiteSetting extends Document {
  key: string;
  value: string;
  updatedAt: Date;
}

const siteSettingSchema = new Schema<ISiteSetting>(
  {
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true, default: "" },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

export const SiteSetting = model<ISiteSetting>("SiteSetting", siteSettingSchema);

export const SETTINGS_KEYS = {
  SITE_NAME: "site_name",
  SITE_DESCRIPTION: "site_description",
  MAINTENANCE_MODE: "maintenance_mode",
  SUPPORT_EMAIL: "support_email",
} as const;

export const DEFAULT_SETTINGS: Record<string, string> = {
  [SETTINGS_KEYS.SITE_NAME]: "CodeQuest LMS",
  [SETTINGS_KEYS.SITE_DESCRIPTION]: "Learn HTML & CSS interactively.",
  [SETTINGS_KEYS.MAINTENANCE_MODE]: "false",
  [SETTINGS_KEYS.SUPPORT_EMAIL]: "support@codequest.dev",
};
