import { registerSchema, loginSchema, resetPasswordSchema } from "../../src/validators/auth.validators";

describe("registerSchema", () => {
  it("accepts a valid registration payload", () => {
    const result = registerSchema.safeParse({ name: "Ada Lovelace", email: "ada@example.com", password: "StrongPass1" });
    expect(result.success).toBe(true);
  });

  it("rejects a password with no uppercase letter", () => {
    const result = registerSchema.safeParse({ name: "Ada", email: "ada@example.com", password: "weakpass1" });
    expect(result.success).toBe(false);
  });

  it("rejects a password with no number", () => {
    const result = registerSchema.safeParse({ name: "Ada", email: "ada@example.com", password: "WeakPassword" });
    expect(result.success).toBe(false);
  });

  it("rejects a password under 8 characters", () => {
    const result = registerSchema.safeParse({ name: "Ada", email: "ada@example.com", password: "Sh0rt" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = registerSchema.safeParse({ name: "Ada", email: "not-an-email", password: "StrongPass1" });
    expect(result.success).toBe(false);
  });

  it("lowercases and trims the email", () => {
    const result = registerSchema.safeParse({ name: "Ada", email: "  ADA@Example.com  ", password: "StrongPass1" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.email).toBe("ada@example.com");
  });

  it("rejects a name under 2 characters", () => {
    const result = registerSchema.safeParse({ name: "A", email: "ada@example.com", password: "StrongPass1" });
    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("accepts any non-empty password (no strength check on login)", () => {
    const result = loginSchema.safeParse({ email: "ada@example.com", password: "x" });
    expect(result.success).toBe(true);
  });

  it("rejects an empty password", () => {
    const result = loginSchema.safeParse({ email: "ada@example.com", password: "" });
    expect(result.success).toBe(false);
  });
});

describe("resetPasswordSchema", () => {
  it("requires a token of reasonable length", () => {
    const result = resetPasswordSchema.safeParse({ token: "short", newPassword: "StrongPass1" });
    expect(result.success).toBe(false);
  });

  it("accepts a valid token and strong password", () => {
    const result = resetPasswordSchema.safeParse({ token: "a".repeat(64), newPassword: "StrongPass1" });
    expect(result.success).toBe(true);
  });
});
