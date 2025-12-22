import express, { Request, Response } from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import { handleClerkWebhook } from "./api/webHooks";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS - must be first
app.use(cors());

// Clerk Webhook route - MUST come before express.json()
// This route needs the raw body for signature verification
app.post(
  "/api/webhooks/clerk",
  express.raw({ type: "application/json" }),
  handleClerkWebhook
);

// Standard body parsers for all other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Setup
const SWAGGER_CDN = "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.11.0";
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCssUrl: `${SWAGGER_CDN}/swagger-ui.css`,
    customJs: [
      `${SWAGGER_CDN}/swagger-ui-bundle.js`,
      `${SWAGGER_CDN}/swagger-ui-standalone-preset.js`,
    ],
  })
);

app.use("/api/users", userRoutes);

app.get("/", (req: Request, res: Response): void => {
  res.json({ message: "Welcome to Alex Polis API with Clerk" });
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(
      `📝 Clerk webhook endpoint: http://localhost:${PORT}/api/webhooks/clerk`
    );
  });
}

export default app;
