import { Router } from "express";
import { getUserProfile, syncUser } from "../controllers/user.controller.js";
import { requireAuth, verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @openapi
 * /users/profile:
 *   get:
 *     summary: Get the profile of a user by ID
 *     description: Returns the user data for the given ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the user to get the profile of
 *         required: true
 *         schema:
 *           type: string
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
