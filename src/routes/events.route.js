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

router.get("/events/user/:userId", requireAuthDev(), getEventsByUserId);
router.get("/events", requireAuthDev(), getAllEvents);
router.get("/events/:eventId", requireAuthDev(), getEventById);
router.post("/events", requireAuthDev(), createEvent);
router.delete("/events/:eventId", requireAuthDev(), deleteEvent);
router.put("/events/:eventId", requireAuthDev(), updateEvent);
export default router;
