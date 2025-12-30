import { Router } from "express";
import {
  getAllPlaces,
  getPlaceById,
  createPlace,
  deletePlace,
  updatePlace,
} from "../controllers/places.controller.js";
import { requireAuthDev } from "../middlewares/mockAuth.js";

const router = Router();

/**

* @swagger
 * /places/get-all-places:
 *   summary: Get all places
 *   tags: [Places]
 *   security:
 *     - bearerAuth: []
 *     - TestUserAuth: []
 *   responses:
 *     200:
 *       description: The places description
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 id:
 *   get:
 *     summary: Get all places
 *     tags: [Places]
 *     security:
 *       - bearerAuth: []
 *       - TestUserAuth: []
 *     responses:
 *       200:
 *         description: The places description
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   image_url:
 *                     type: string
 *       404:
 *         description: Places not found
 *       500:
 *         description: Failed to get places
 * /places/get-place-by-id/{id}:
 *   get:
 *     summary: Get place by ID
 *     tags: [Places]
 *     security:
 *       - bearerAuth: []
 *       - TestUserAuth: []
 *     responses:
 *       200:
 *         description: The place description
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   image_url:
 *                     type: string
 *       404:
 *         description: Place not found
 *       500:
 *         description: Failed to get place
 * /places/create-place:
 *   post:
 *     summary: Create place
 *     tags: [Places]
 *     security:
 *       - bearerAuth: []
 *       - TestUserAuth: []
 *     responses:
 *       200:
 *         description: The place description
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 image_url:
 *                   type: string
 *       404:
 *         description: Place not found
 *       500:
 *         description: Failed to get place
 * 
 * /places/delete-place/{id}:
 *   delete:
 *     summary: Delete place
 *     tags: [Places]
 *     security:
 *       - bearerAuth: []
 *       - TestUserAuth: []
 *     responses:
 *       200:
 *         description: The place description
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *       404:
 *         description: Place not found
 *       500:
 *         description: Failed to delete place
 * 
 * 
 * /places/update-place/{id}:
 *   put:
 *     summary: Update place
 *     tags: [Places]
 *     security:
 *       - bearerAuth: []
 *       - TestUserAuth: []
 *     responses:
 *       200:
 *         description: The place description
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 image_url:
 *                   type: string
 *       404:
 *         description: Place not found
 *       500:
 *         description: Failed to get place
 * */
router.get("/places/get-all-places", requireAuthDev(), getAllPlaces);
router.get("/places/get-place-by-id/:id", requireAuthDev(), getPlaceById);
router.post("/places/create-place", requireAuthDev(), createPlace);
router.delete("/places/delete-place/:id", requireAuthDev(), deletePlace);
router.put("/places/update-place/:id", requireAuthDev(), updatePlace);
export default router;
