import { db } from "../db.js";
import { events } from "../models/events.js";
import { eq } from "drizzle-orm";

const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split("/");
  return new Date(year, month - 1, day);
};

const isValidDateFormat = (dateStr) => {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  return regex.test(dateStr);
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await db.select().from(events);
    res.json(events);
  } catch (error) {
    if (events.length === 0) {
      return res.status(404).json({ error: "Events not found" });
    }
    res.status(500).json({ error: error.message });
  }
};

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

  const {
    title,
    description,
    location,
    image_url,
    category,
    start_date,
    end_date,
  } = req.body;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: User not found" });
  }

  if (!isValidDateFormat(start_date) || !isValidDateFormat(end_date)) {
    return res.status(400).json({
      error:
        "Invalid date format. Please use dd/mm/yyyy format (e.g., 25/12/2023)",
    });
  }

  const startDateObj = parseDate(start_date);
  const endDateObj = parseDate(end_date);

  if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
    return res.status(400).json({
      error: "Invalid date values provided",
    });
  }

  if (startDateObj > endDateObj) {
    return res
      .status(400)
      .json({ error: "Start date must be before end date" });
  }

  try {
    const event = await db.insert(events).values({
      user_id: userId,
      title,
      description,
      start_date: startDateObj,
      end_date: endDateObj,
      start_time: startDateObj,
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
    if (image_url.includes("www.")) {
      return res.status(400).json({ error: "Image URL must not contain www." });
    }
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
    start_time,
    location,
    image_url,
    category,
  } = req.body;

  if (start_date && !isValidDateFormat(start_date)) {
    return res
      .status(400)
      .json({ error: "Invalid start_date format. Use dd/mm/yyyy" });
  }
  if (end_date && !isValidDateFormat(end_date)) {
    return res
      .status(400)
      .json({ error: "Invalid end_date format. Use dd/mm/yyyy" });
  }

  try {
    const updateData = {
      title,
      description,
      location,
      image_url,
      category,
    };

    if (start_date) {
      updateData.start_date = parseDate(start_date);
      updateData.start_time = parseDate(start_date);
    }
    if (end_date) {
      updateData.end_date = parseDate(end_date);
    }
    const event = await db
      .update(events)
      .set(updateData)
      .where(eq(events.id, eventId));
    res.json(event);
  } catch (error) {
    if (title && (title.length > 100 || title.length < 3)) {
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
    if (start_date && start_date < new Date()) {
      return res
        .status(400)
        .json({ error: "Start date must be in the future" });
    }
    if (end_date && end_date < new Date()) {
      return res.status(400).json({ error: "End date must be in the future" });
    }
    if (image_url.includes(" ")) {
      return res
        .status(400)
        .json({ error: "Image URL must not contain spaces" });
    }
    if (image_url.includes("www.")) {
      return res.status(400).json({ error: "Image URL must not contain www." });
    }
    res.status(500).json({ error: error.message });
  }
};
