import crypto from "crypto";

export interface GeneratedToken {
  raw: string;
  hash: string;
}

export function generateSecureToken(bytes = 32): GeneratedToken {
  const raw = crypto.randomBytes(bytes).toString("hex");
  const hash = crypto.createHash("sha256").update(raw).digest("hex");
  return { raw, hash };
}

export function hashToken(raw: string): string {
  return crypto.createHash("sha256").update(raw).digest("hex");
}
