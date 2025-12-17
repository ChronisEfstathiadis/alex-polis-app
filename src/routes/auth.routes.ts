import { Router } from "express";
import type { Request, Response } from "express";
import { syncUser } from "../controllers/user.controller.js";

const router = Router();

// Login route (handled by Auth0 middleware)
router.get("/login", (req: Request, res: Response) => {
  res.oidc.login({
    returnTo: "/dashboard",
    authorizationParams: {
      prompt: "login",
    },
  });
});

// Logout route
router.get("/logout", (req: Request, res: Response) => {
  res.oidc.logout({
    returnTo: process.env.BASE_URL,
  });
});

// Callback route (handled automatically by Auth0 middleware)
router.get("/callback", async (req: Request, res: Response) => {
  // Auto-sync user to database after successful Auth0 login
  if (req.oidc.isAuthenticated()) {
    try {
      // Temporarily set req.user for syncUser function
      req.user = req.oidc.user as any;
      await syncUser(req, res);
      // If sync was successful, redirect (syncUser already sent response)
      // If we need to redirect after sync, we need to handle it differently
    } catch (error) {
      console.error("Error syncing user:", error);
      // Still redirect even if sync fails
      return res.redirect("/dashboard");
    }
  }
  res.redirect("/dashboard");
});

// Get current user
router.get("/me", (req: Request, res: Response) => {
  if (req.oidc.isAuthenticated()) {
    res.json(req.oidc.user);
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

export default router;
