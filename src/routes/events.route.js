import { Router } from "express";
import {
  getEventsByUserId,
  getEventById,
  createEvent,
  deleteEvent,
  updateEvent,
} from "../controllers/events.controller.js";
import { requireAuthDev } from "../middlewares/mockAuth.js";

const router = Router();

/**
 * @swagger
 * /events/getEventsByUserId/{userId}:
 *   get:
 *     summary: Get events by user ID
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *       - TestUserAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: The events description
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   start_date:
 *                     type: string
 *                   end_date:
 *                     type: string
 *                   location:
 *                     type: string
 *                   image_url:
 *                     type: string
 *                   category:
 *                     type: string
 *       404:
 *         description: Events not found
 *       400:
 *         description: Invalid user ID
 *       500:
 *         description: Failed to get events
 * /events/getEventById/{eventId}:
 *   get:
 *     summary: Get event by ID
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *       - TestUserAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: The event ID
 *     responses:
 *       200:
 *         description: The event description
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 start_date:
 *                   type: string
 *                 end_date:
 *                   type: string
 *                 location:
 *                   type: string
 *                 image_url:
 *                   type: string
 *                 category:
 *                   type: string
 *       404:
 *         description: Event not found
 *       400:
 *         description: Invalid event ID
 *       500:
 *         description: Failed to get event
 * /events/createEvent:
 *   post:
 *     summary: Create event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *       - TestUserAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               start_date:
 *                 type: string
 *               end_date:
 *                 type: string
 *               location:
 *                 type: string
 *               image_url:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: The event created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *       404:
 *         description: Event not found
 *       400:
 *         description: Invalid event ID
 *       500:
 *         description: Failed to create event
 * /events/deleteEvent/{eventId}:
 *   delete:
 *     summary: Delete event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *       - TestUserAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: The event ID
 *     responses:
 *       200:
 *         description: The event deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *       404:
 *         description: Event not found
 *       400:
 *         description: Invalid event ID
 *       500:
 *         description: Failed to delete event
 * /events/updateEvent/{eventId}:
 *   put:
 *     summary: Update event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *       - TestUserAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: The event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               start_date:
 *                 type: string
 *               end_date:
 *                 type: string
 *               location:
 *                 type: string
 *               image_url:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: The event updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *       404:
 *         description: Event not found
 *       400:
 *         description: Invalid event ID
 *       500:
 *         description: Failed to update event
 */
router.get(
  "/events/getEventsByUserId/:userId",
  requireAuthDev(),
  getEventsByUserId
);
router.get("/events/getEventById/:eventId", requireAuthDev(), getEventById);
router.post("/events/createEvent", requireAuthDev(), createEvent);
router.delete("/events/deleteEvent/:eventId", requireAuthDev(), deleteEvent);
router.put("/events/updateEvent/:eventId", requireAuthDev(), updateEvent);
export default router;
