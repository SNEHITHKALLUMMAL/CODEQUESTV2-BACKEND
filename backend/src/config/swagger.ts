import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "CodeQuest LMS API",
      version: "1.0.0",
      description:
        "REST API for CodeQuest LMS — an interactive MERN platform for learning HTML & CSS. " +
        "All endpoints are versioned under /api/v1 and return the standard { success, message, data } envelope.",
    },
    servers: [{ url: "/api/v1", description: "Current environment" }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
      schemas: {
        ApiErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string" },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: { field: { type: "string" }, message: { type: "string" } },
              },
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/**/*.ts", "./dist/routes/**/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
