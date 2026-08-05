import "../setupEnv";
import request from "supertest";
import { createApp } from "../../src/app";

const app = createApp();

describe("GET /api/v1/health", () => {
  it("returns 200 with service status", async () => {
    const res = await request(app).get("/api/v1/health");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe("ok");
    expect(["connected", "disconnected", "connecting", "disconnecting"]).toContain(res.body.data.database);
  });
});

describe("unmatched routes", () => {
  it("returns a 404 in the standard error envelope", async () => {
    const res = await request(app).get("/api/v1/this-route-does-not-exist");
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/route not found/i);
  });
});

describe("security headers", () => {
  it("sets helmet security headers", async () => {
    const res = await request(app).get("/api/v1/health");
    expect(res.headers["x-content-type-options"]).toBe("nosniff");
  });
});
