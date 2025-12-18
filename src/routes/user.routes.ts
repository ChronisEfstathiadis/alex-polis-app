import { Router } from "express";
import { getUserProfile, syncUser } from "../controllers/user.controller.js";
import { requireAuth, verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @openapi
 * /users/profile:
 *   get:
 *     summary: Get the profile of the currently logged-in user
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Returns user data
 *       401:
 *         description: Unauthorized
 */
router.get("/profile/:id", requireAuth, getUserProfile);
router.post("/sync", requireAuth, syncUser);

// API routes (token-based)
router.get("/api/profile", verifyToken, getUserProfile);

export default router;
