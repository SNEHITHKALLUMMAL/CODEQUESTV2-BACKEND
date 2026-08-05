import { generateSecureToken, hashToken } from "../../src/utils/tokenGenerator";

describe("tokenGenerator", () => {
  it("generates a raw token and a matching SHA-256 hash", () => {
    const { raw, hash } = generateSecureToken();
    expect(raw).toHaveLength(64); // 32 bytes -> 64 hex chars
    expect(hash).toHaveLength(64); // SHA-256 -> 64 hex chars
    expect(hashToken(raw)).toBe(hash);
  });

  it("generates different tokens on every call", () => {
    const a = generateSecureToken();
    const b = generateSecureToken();
    expect(a.raw).not.toBe(b.raw);
    expect(a.hash).not.toBe(b.hash);
  });

  it("hashToken is deterministic", () => {
    expect(hashToken("same-input")).toBe(hashToken("same-input"));
  });

  it("hashToken produces different output for different input", () => {
    expect(hashToken("input-a")).not.toBe(hashToken("input-b"));
  });

  it("the raw token cannot be recovered from the hash (one-way)", () => {
    const { raw, hash } = generateSecureToken();
    expect(hash).not.toContain(raw);
  });
});
