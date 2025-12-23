import swaggerJsdoc from "swagger-jsdoc";

const isProduction = process.env.NODE_ENV === "production";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Alex Polis API",
      version: "1.0.0",
      description: "API Documentation for Alex Polis App",
    },
    servers: [
      ...(isProduction
        ? [
            {
              url: "https://alex-polis-app.vercel.app/api",
              description: "Production Server",
            },
          ]
        : [
            {
              url: "http://localhost:3000/api",
              description: "Local Development Server",
            },
          ]),
    ],
    components: {
      securitySchemes: {
        ...(!isProduction
          ? {
              TestUserAuth: {
                type: "apiKey",
                in: "header",
                name: "x-test-user",
                description: "Enter User ID directly for testing (Dev only)",
              },
            }
          : {
              bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
              },
            }),
      },
    },
    security: isProduction ? [{ bearerAuth: [] }] : [{ TestUserAuth: [] }],
  },
  apis: ["./src/routes/*.js", "./server.js"],
};

export const specs = swaggerJsdoc(options);
