import { ApiError } from "../../src/utils/ApiError";

describe("ApiError", () => {
  it("badRequest produces a 400 with the given message and field errors", () => {
    const err = ApiError.badRequest("Bad input", [{ field: "email", message: "Invalid" }]);
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe("Bad input");
    expect(err.errors).toEqual([{ field: "email", message: "Invalid" }]);
    expect(err.isOperational).toBe(true);
  });

  it("unauthorized produces a 401", () => {
    expect(ApiError.unauthorized().statusCode).toBe(401);
  });

  it("forbidden produces a 403", () => {
    expect(ApiError.forbidden().statusCode).toBe(403);
  });

  it("notFound produces a 404", () => {
    expect(ApiError.notFound().statusCode).toBe(404);
  });

  it("conflict produces a 409", () => {
    expect(ApiError.conflict().statusCode).toBe(409);
  });

  it("tooManyRequests produces a 429", () => {
    expect(ApiError.tooManyRequests().statusCode).toBe(429);
  });

  it("internal produces a 500 and is marked non-operational", () => {
    const err = ApiError.internal();
    expect(err.statusCode).toBe(500);
    expect(err.isOperational).toBe(false);
  });

  it("is a real Error instance (works with try/catch and instanceof)", () => {
    const err = ApiError.badRequest();
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(ApiError);
  });
});
