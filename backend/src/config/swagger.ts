import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CaptureGet API",
      version: "1.0.0",
      description: "API documentation for the CaptureGet recruitment platform",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local development server",
      },
    ],
  },
  apis: ["./src/company/routes/*.ts"], // 📝 Scans route files for Swagger docs
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
