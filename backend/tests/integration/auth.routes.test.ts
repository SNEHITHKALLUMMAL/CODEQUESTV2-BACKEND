import "../setupEnv";
import request from "supertest";
import { createApp } from "../../src/app";
import { signAccessToken } from "../../src/services/token.service";
import { UserRole } from "../../../shared/types/enums";

const app = createApp();

describe("POST /api/v1/auth/register — validation", () => {
  it("rejects a request with an invalid email and weak password", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ name: "A", email: "not-an-email", password: "weak" });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    const fields = res.body.errors.map((e: { field: string }) => e.field);
    expect(fields).toEqual(expect.arrayContaining(["name", "email", "password"]));
  });
});

describe("POST /api/v1/auth/login — validation", () => {
  it("rejects an empty password", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({ email: "ada@example.com", password: "" });
    expect(res.status).toBe(400);
  });
});

describe("GET /api/v1/auth/me — authentication guard", () => {
  it("rejects requests with no token", async () => {
    const res = await request(app).get("/api/v1/auth/me");
    expect(res.status).toBe(401);
  });

  it("rejects requests with a malformed token", async () => {
    const res = await request(app).get("/api/v1/auth/me").set("Authorization", "Bearer not-a-real-token");
    expect(res.status).toBe(401);
  });

  it("accepts a validly-signed token and passes through the auth middleware", async () => {
    const token = signAccessToken({ sub: "64b000000000000000000000", role: UserRole.STUDENT });
    const res = await request(app).get("/api/v1/auth/me").set("Authorization", `Bearer ${token}`);
    // No DB in this test run, so it can't find the user — but critically it
    // must NOT be 401, proving the token itself was accepted by `protect`.
    expect(res.status).not.toBe(401);
  });
});

describe("Admin routes — role-based access control", () => {
  it("rejects an unauthenticated request", async () => {
    const res = await request(app).get("/api/v1/admin/analytics/overview");
    expect(res.status).toBe(401);
  });

  it("rejects a valid token belonging to a non-admin role", async () => {
    const studentToken = signAccessToken({ sub: "64b000000000000000000000", role: UserRole.STUDENT });
    const res = await request(app)
      .get("/api/v1/admin/analytics/overview")
      .set("Authorization", `Bearer ${studentToken}`);
    expect(res.status).toBe(403);
  });

  it("passes an admin token through the RBAC gate", async () => {
    const adminToken = signAccessToken({ sub: "64b000000000000000000000", role: UserRole.ADMIN });
    const res = await request(app)
      .get("/api/v1/admin/analytics/overview")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).not.toBe(401);
    expect(res.status).not.toBe(403);
  });

  it("validates admin course creation payloads", async () => {
    const adminToken = signAccessToken({ sub: "64b000000000000000000000", role: UserRole.ADMIN });
    const res = await request(app)
      .post("/api/v1/admin/courses")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ title: "X", slug: "python", description: "short" });
    expect(res.status).toBe(400);
    const fields = res.body.errors.map((e: { field: string }) => e.field);
    expect(fields).toEqual(expect.arrayContaining(["title", "slug", "description"]));
  });
});
