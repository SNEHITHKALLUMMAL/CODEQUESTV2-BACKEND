import "../setupEnv";
import { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken, durationToMs } from "../../src/services/token.service";
import { UserRole } from "../../shared/types/enums";
import jwt from "jsonwebtoken";

describe("token.service", () => {
  it("signs and verifies an access token round-trip", () => {
    const token = signAccessToken({ sub: "user-123", role: UserRole.STUDENT });
    const payload = verifyAccessToken(token);
    expect(payload.sub).toBe("user-123");
    expect(payload.role).toBe(UserRole.STUDENT);
  });

  it("signs and verifies a refresh token round-trip", () => {
    const token = signRefreshToken({ sub: "user-456" });
    const payload = verifyRefreshToken(token);
    expect(payload.sub).toBe("user-456");
  });

  it("rejects a token signed with a different secret", () => {
    const forged = jwt.sign({ sub: "attacker", role: UserRole.ADMIN }, "wrong-secret");
    expect(() => verifyAccessToken(forged)).toThrow();
  });

  it("rejects a malformed token", () => {
    expect(() => verifyAccessToken("not.a.valid.jwt")).toThrow();
  });

  it("rejects an expired access token", () => {
    // Sign with a 1-second expiry using the same secret, then wait it out.
    const shortLived = jwt.sign({ sub: "user-789", role: UserRole.STUDENT }, process.env.JWT_ACCESS_SECRET as string, {
      expiresIn: "1ms",
    });
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(() => verifyAccessToken(shortLived)).toThrow(/expired/i);
        resolve();
      }, 50);
    });
  });

  describe("durationToMs", () => {
    it("converts seconds/minutes/hours/days correctly", () => {
      expect(durationToMs("30s")).toBe(30_000);
      expect(durationToMs("15m")).toBe(15 * 60_000);
      expect(durationToMs("2h")).toBe(2 * 3_600_000);
      expect(durationToMs("7d")).toBe(7 * 86_400_000);
    });

    it("returns 0 for an unparseable duration", () => {
      expect(durationToMs("garbage")).toBe(0);
    });
  });
});
