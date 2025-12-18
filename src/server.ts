import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { auth0Middleware } from "./config/auth0.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import { db } from "./config/database.js";
import { autoSyncUser } from "./middlewares/syncUser.middleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth0 middleware
app.use(auth0Middleware);

// Auto-sync user after Auth0 authentication
app.use(autoSyncUser);

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

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
      await db.insert(users).values(validatedData);
    }
  } catch (error) {
    console.error("Error syncing user:", error);
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

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🔐 Auth0 login: http://localhost:${PORT}/auth/login`);
  });
}

export default app;
