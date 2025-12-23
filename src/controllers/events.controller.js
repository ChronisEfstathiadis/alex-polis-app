import { db } from "../db.js";
import { events } from "../models/events.js";
import { eq } from "drizzle-orm";

export const getEventsByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const events = await db
      .select()
      .from(events)
      .where(eq(events.user_id, userId));
    res.json(events);
  } catch (error) {
    if (userId.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    if (events.length === 0) {
      return res.status(404).json({ error: "Events not found" });
    }
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    res.status(500).json({ error: error.message });
  }
};

export const getEventById = async (req, res) => {
  const { eventId } = req.params;
  try {
    const event = await db.select().from(events).where(eq(events.id, eventId));
    res.json(event);
  } catch (error) {
    if (eventId.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    if (!eventId) {
      return res.status(400).json({ error: "Event ID is required" });
    }
    res.status(500).json({ error: error.message });
  }
};

export const createEvent = async (req, res) => {
  const { userId } = req.auth;

  const { title, description, location, image_url, category } = req.body;

  // Defaults: Start now, end in 2 hours
  const start_date = new Date();
  const end_date = new Date(new Date().getTime() + 2 * 60 * 60 * 1000);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: User not found" });
  }

  try {
    const event = await db.insert(events).values({
      user_id: userId,
      title,
      description,
      start_date,
      end_date,
      location,
      image_url,
      category,
    });
    res.json(event);
  } catch (error) {
    if (title.length > 100 || title.length < 3) {
      return res
        .status(400)
        .json({ error: "Title must be between 3 and 100 characters" });
    }
    if (description.length > 1000 || description.length < 10) {
      return res
        .status(400)
        .json({ error: "Description must be between 10 and 1000 characters" });
    }
    if (location.length > 100 || location.length < 3) {
      return res
        .status(400)
        .json({ error: "Location must be between 3 and 100 characters" });
    }
    if (category.length > 50 || category.length < 3) {
      return res
        .status(400)
        .json({ error: "Category must be between 3 and 50 characters" });
    }
    if (image_url.length > 200 || image_url.length < 10) {
      return res
        .status(400)
        .json({ error: "Image URL must be between 10 and 200 characters" });
    }
    if (start_date > end_date) {
      return res
        .status(400)
        .json({ error: "Start date must be before end date" });
    }
    if (image_url.includes(" ")) {
      return res
        .status(400)
        .json({ error: "Image URL must not contain spaces" });
    }
    // if (image_url.includes("http://") || image_url.includes("https://")) {
    //   return res
    //     .status(400)
    //     .json({ error: "Image URL must not contain http or https" });
    // }
    if (image_url.includes("www.")) {
      return res.status(400).json({ error: "Image URL must not contain www." });
    }
    // if (image_url.includes(".")) {
    //   return res
    //     .status(400)
    //     .json({ error: "Image URL must contain a valid domain" });
    // }
    res.status(500).json({ error: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  const { eventId } = req.params;
  try {
    const event = await db.delete(events).where(eq(events.id, eventId));
    res.json(event);
  } catch (error) {
    if (eventId.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    if (!eventId) {
      return res.status(400).json({ error: "Event ID is required" });
    }
    res.status(500).json({ error: error.message });
  }
};

export const updateEvent = async (req, res) => {
  const { eventId } = req.params;

  // Debug log
  console.log("Update Body:", req.body);
  console.log("Content-Type:", req.headers["content-type"]);

  if (!req.body) {
    return res.status(400).json({ error: "Request body is missing" });
  }

  const {
    title,
    description,
    start_date,
    end_date,
    location,
    image_url,
    category,
  } = req.body;
  try {
    const event = await db
      .update(events)
      .set({
        title,
        description,
        start_date: new Date(start_date), // Convert string to Date
        end_date: new Date(end_date), // Convert string to Date
        location,
        image_url,
        category,
      })
      .where(eq(events.id, eventId));
    res.json(event);
  } catch (error) {
    if (title.length > 100 || title.length < 3) {
      return res
        .status(400)
        .json({ error: "Title must be between 3 and 100 characters" });
    }
    if (description.length > 1000 || description.length < 10) {
      return res
        .status(400)
        .json({ error: "Description must be between 10 and 1000 characters" });
    }
    if (location.length > 100 || location.length < 3) {
      return res
        .status(400)
        .json({ error: "Location must be between 3 and 100 characters" });
    }
    if (category.length > 50 || category.length < 3) {
      return res
        .status(400)
        .json({ error: "Category must be between 3 and 50 characters" });
    }
    if (image_url.length > 200 || image_url.length < 10) {
      return res
        .status(400)
        .json({ error: "Image URL must be between 10 and 200 characters" });
    }
    if (start_date > end_date) {
      return res
        .status(400)
        .json({ error: "Start date must be before end date" });
    }
    if (start_date < new Date()) {
      return res
        .status(400)
        .json({ error: "Start date must be in the future" });
    }
    if (end_date < new Date()) {
      return res.status(400).json({ error: "End date must be in the future" });
    }
    if (image_url.includes(" ")) {
      return res
        .status(400)
        .json({ error: "Image URL must not contain spaces" });
    }
    // if (image_url.includes("http://") || image_url.includes("https://")) {
    //   return res
    //     .status(400)
    //     .json({ error: "Image URL must not contain http or https" });
    // }
    if (image_url.includes("www.")) {
      return res.status(400).json({ error: "Image URL must not contain www." });
    }
    // if (image_url.includes(".")) {
    //   return res
    //     .status(400)
    //     .json({ error: "Image URL must contain a valid domain" });
    // }
    res.status(500).json({ error: error.message });
  }
};
