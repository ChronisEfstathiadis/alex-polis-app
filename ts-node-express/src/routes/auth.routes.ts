import { Router } from "express";
import type { Request, Response } from "express";
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
router.get("/callback", (req: Request, res: Response) => {
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
