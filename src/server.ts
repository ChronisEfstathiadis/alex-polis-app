import express, { Request, Response, Router } from "express";
import dotenv from "dotenv";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
// Update these imports to include .js
import { auth0Middleware } from "./config/auth0.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import { db } from "./config/database.js";
import { autoSyncUser } from "./middlewares/syncUser.middleware.js";

dotenv.config();
// ... rest of the file

const apiRoutes = Router();
const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";
const SWAGGER_CDN = "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.11.0";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth0 middleware
app.use(auth0Middleware);

// Auto-sync user after Auth0 authentication
app.use(autoSyncUser);

// Swagger middleware
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    // 2. Tell Swagger to load CSS and JS from the CDN
    customCssUrl: `${SWAGGER_CDN}/swagger-ui.css`,
    customJs: [
      `${SWAGGER_CDN}/swagger-ui-bundle.js`,
      `${SWAGGER_CDN}/swagger-ui-standalone-preset.js`,
    ],
    // 3. Optional: Add some custom CSS to fix layout issues on Vercel
    customCss: ".swagger-ui .topbar { display: none }",
  })
);

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.use("/api/v1", apiRoutes);

// Public route
app.get("/", (req: Request, res: Response): void => {
  res.json({
    message: "Welcome to Alex Polis API",
    authenticated: req.oidc?.isAuthenticated() || false,
    user: req.oidc?.user || null,
  });
});

// Protected dashboard route
app.get("/dashboard", async (req: Request, res: Response): Promise<void> => {
  if (!req.oidc.isAuthenticated()) {
    res.redirect("/auth/login");
    return;
  }

  // Auto-sync user to database
  try {
    req.user = req.oidc.user as any;
    // Call syncUser logic inline or import and call it
    const { db } = await import("./config/database.js");
    const { users, insertUserSchema } = await import("./db/schema/user.js");
    const { eq } = await import("drizzle-orm");

    const { sub, email, name } = req.oidc.user as {
      sub: string;
      email: string;
      name: string;
    };
    const validatedData = insertUserSchema.parse({
      auth0Id: sub,
      email: email,
      name: name || null,
      emailVerified: true,
      lastLogin: new Date(),
    });

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.auth0Id, sub))
      .limit(1);

    if (existingUser) {
      await db
        .update(users)
        .set({ lastLogin: new Date() })
        .where(eq(users.auth0Id, sub));
    } else {
      console.log("Creating new user in DB:", validatedData.email); // ADD LOG
      const result = await db.insert(users).values(validatedData).returning(); // ADD .returning()
      console.log("User created successfully:", result[0].id); // ADD LOG
    }
  } catch (error) {
    console.error("CRITICAL: Error syncing user:", error); // UPDATE LOG
  }

  res.json({
    message: "Welcome to your dashboard",
    user: req.oidc.user,
  });
});

// Health check
app.get("/health", async (_req: Request, res: Response): Promise<void> => {
  try {
    await db.execute("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    res.status(500).json({ status: "error", database: "disconnected" });
  }
});

// app.use("/v1/api", apiRoutes);

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🔐 Auth0 login: http://localhost:${PORT}/auth/login`);
  });
}

export default app;
