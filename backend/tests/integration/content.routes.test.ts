import "../setupEnv";
import request from "supertest";
import { createApp } from "../../src/app";
import { signAccessToken } from "../../src/services/token.service";
import { UserRole } from "../../shared/types/enums";

const app = createApp();

describe("GET /api/v1/courses/:slug — param validation", () => {
  it("rejects a slug outside the html|css enum", async () => {
    const res = await request(app).get("/api/v1/courses/python");
    expect(res.status).toBe(400);
  });
});

describe("GET /api/v1/modules/:id — param validation", () => {
  it("rejects a non-ObjectId id", async () => {
    const res = await request(app).get("/api/v1/modules/not-an-id");
    expect(res.status).toBe(400);
  });
});

describe("GET /api/v1/topics/search — query validation", () => {
  it("rejects a missing search query", async () => {
    const res = await request(app).get("/api/v1/topics/search");
    expect(res.status).toBe(400);
  });

  it("rejects a query under 2 characters", async () => {
    const res = await request(app).get("/api/v1/topics/search").query({ q: "a" });
    expect(res.status).toBe(400);
  });
});

describe("Topic completion — requires auth", () => {
  it("rejects an unauthenticated completion request", async () => {
    const res = await request(app).post("/api/v1/topics/64b000000000000000000000/complete");
    expect(res.status).toBe(401);
  });
});

describe("Quiz submission", () => {
  const quizId = "64b000000000000000000000";

  it("rejects submission with no auth", async () => {
    const res = await request(app).post(`/api/v1/quizzes/${quizId}/submit`).send({ answers: [] });
    expect(res.status).toBe(401);
  });

  it("rejects submission with zero answers even when authenticated", async () => {
    const token = signAccessToken({ sub: "64b000000000000000000000", role: UserRole.STUDENT });
    const res = await request(app)
      .post(`/api/v1/quizzes/${quizId}/submit`)
      .set("Authorization", `Bearer ${token}`)
      .send({ answers: [] });
    expect(res.status).toBe(400);
  });

  it("accepts a well-formed submission body and reaches past validation", async () => {
    const token = signAccessToken({ sub: "64b000000000000000000000", role: UserRole.STUDENT });
    const res = await request(app)
      .post(`/api/v1/quizzes/${quizId}/submit`)
      .set("Authorization", `Bearer ${token}`)
      .send({ answers: [{ questionId: "64b000000000000000000001", submittedAnswer: "x" }] });
    // Validation passes; without a DB the quiz itself can't be found/graded,
    // but it must not be a 400 (validation error) or 401/403 (auth error).
    expect(res.status).not.toBe(400);
    expect(res.status).not.toBe(401);
    expect(res.status).not.toBe(403);
  });
});

describe("Admin topic management — new in this change", () => {
  const adminToken = () => {
    // Lazily require to avoid re-importing at module top for this appended block.
    const { signAccessToken } = require("../../src/services/token.service");
    const { UserRole } = require("../../shared/types/enums");
    return signAccessToken({ sub: "64b000000000000000000000", role: UserRole.ADMIN });
  };

  it("rejects an unauthenticated request to fetch a single topic", async () => {
    const res = await request(app).get("/api/v1/admin/topics/64b000000000000000000000");
    expect(res.status).toBe(401);
  });

  it("validates the id param on GET /admin/topics/:id", async () => {
    const res = await request(app)
      .get("/api/v1/admin/topics/not-an-id")
      .set("Authorization", `Bearer ${adminToken()}`);
    expect(res.status).toBe(400);
  });

  it("rejects topic creation with a missing title/content (validation)", async () => {
    const res = await request(app)
      .post("/api/v1/admin/topics")
      .set("Authorization", `Bearer ${adminToken()}`)
      .send({ moduleId: "64b000000000000000000000", courseId: "64b000000000000000000000", slug: "x" });
    expect(res.status).toBe(400);
    const fields = res.body.errors.map((e: { field: string }) => e.field);
    expect(fields).toEqual(expect.arrayContaining(["title", "content"]));
  });

  it("rejects a non-numeric estimatedMinutes", async () => {
    const res = await request(app)
      .post("/api/v1/admin/topics")
      .set("Authorization", `Bearer ${adminToken()}`)
      .send({
        moduleId: "64b000000000000000000000",
        courseId: "64b000000000000000000000",
        title: "Test Topic",
        slug: "test-topic",
        content: "<p>Hello</p>",
        estimatedMinutes: "not-a-number",
      });
    expect(res.status).toBe(400);
  });

  it("accepts a well-formed topic creation payload and reaches past validation (auth + admin role required)", async () => {
    const res = await request(app)
      .post("/api/v1/admin/topics")
      .set("Authorization", `Bearer ${adminToken()}`)
      .send({
        moduleId: "64b000000000000000000000",
        courseId: "64b000000000000000000000",
        title: "Test Topic",
        slug: "test-topic",
        content: "<p>Hello</p>",
        estimatedMinutes: 5,
      });
    // No DB in this test run, so it can't persist — but it must not be a 400/401/403.
    expect(res.status).not.toBe(400);
    expect(res.status).not.toBe(401);
    expect(res.status).not.toBe(403);
  });

  it("rejects a student token from creating a topic (RBAC)", async () => {
    const { signAccessToken } = require("../../src/services/token.service");
    const { UserRole } = require("../../shared/types/enums");
    const studentToken = signAccessToken({ sub: "64b000000000000000000000", role: UserRole.STUDENT });
    const res = await request(app)
      .post("/api/v1/admin/topics")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ moduleId: "x", courseId: "x", title: "x", slug: "x", content: "x" });
    expect(res.status).toBe(403);
  });
});
