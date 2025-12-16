import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { auth0Middleware } from "./config/auth0.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import { db } from "./config/database.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth0 middleware
app.use(auth0Middleware);

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

// Public route
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to Alex Polis API",
    authenticated: req.oidc?.isAuthenticated() || false,
    user: req.oidc?.user || null,
  });
});

// Protected dashboard route
app.get("/dashboard", (req: Request, res: Response) => {
  if (!req.oidc.isAuthenticated()) {
    return res.redirect("/auth/login");
  }
  res.json({
    message: "Welcome to your dashboard",
    user: req.oidc.user,
  });
});

// Health check
app.get("/health", async (req: Request, res: Response) => {
  try {
    await db.execute("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    res.status(500).json({ status: "error", database: "disconnected" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔐 Auth0 login: http://localhost:${PORT}/auth/login`);
});
