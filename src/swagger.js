import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Alex Polis API",
      version: "1.0.0",
      description: "API Documentation for Alex Polis App",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Local Development Server",
      },
      //   {
      //     url: "https://api.alexpolis.com",
      //     description: "Production Server",
      //   },
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
  apis: ["./src/routes/*.js", "./server.js"],
};

export const specs = swaggerJsdoc(options);
