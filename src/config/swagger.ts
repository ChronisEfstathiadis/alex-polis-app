import swaggerJsdoc from "swagger-jsdoc";
import packageJson from "../../package.json" with { type: "json" };

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Alex Polis API",
      version: packageJson.version as string,
      description: "API documentation for the Alex Polis application",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Development server",
      },
      {
        url: "https://alex-polis-app.vercel.app/api",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/server.ts"], // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options);
