import { Router } from "express";
import { getUserProfile, syncUser } from "../controllers/user.controller";
import { requireAuth, verifyToken } from "../middlewares/auth.middleware";

const router = Router();

// Protected routes (session-based)
router.get("/profile", requireAuth, getUserProfile);
router.post("/sync", requireAuth, syncUser);

// API routes (token-based)
router.get("/api/profile", verifyToken, getUserProfile);

export default router;
