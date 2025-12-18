import { Router } from "express";
import { getUserProfile, syncUser } from "../controllers/user.controller.js";
import { requireAuth, verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @openapi
 * /users/profile/{id}:  <-- ADD {id} HERE
 *   get:
 *     summary: Get user profile by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The UUID of the user
 *     responses:
 *       200:
 *         description: Returns user data
 *       404:
 *         description: User not found
 */
router.get("/profile/:id", requireAuth, getUserProfile); // <-- ADD :id HERE
router.post("/sync", requireAuth, syncUser);

// API routes (token-based)
router.get("/api/profile", verifyToken, getUserProfile);

export default router;
