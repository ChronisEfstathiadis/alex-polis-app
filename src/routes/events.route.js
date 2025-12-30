import { Router } from "express";
import {
  getAllEvents,
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
 * /events/get-all-events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *       - TestUserAuth: []
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
 *       500:
 *         description: Failed to get events
 * /events/get-events-by-user-id/{userId}:
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
 * /events/get-event-by-id/{eventId}:
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
 * /events/create-event:
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
 * /events/delete-event/{eventId}:
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
 * /events/update-event/{eventId}:
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
  "/events/get-events-by-user-id/:userId",
  requireAuthDev(),
  getEventsByUserId
);
router.get("/events/get-all-events", requireAuthDev(), getAllEvents);
router.get("/events/get-event-by-id/:eventId", requireAuthDev(), getEventById);
router.post("/events/create-event", requireAuthDev(), createEvent);
router.delete("/events/delete-event/:eventId", requireAuthDev(), deleteEvent);
router.put("/events/update-event/:eventId", requireAuthDev(), updateEvent);
export default router;
