import { db } from "../db.js";
import { places } from "../models/places.js";
import { eq } from "drizzle-orm";

export const getAllPlaces = async (req, res) => {
  try {
    const places = await db.select().from(places);
    res.json(places);
  } catch (error) {
    if (places.length === 0) {
      return res.status(404).json({ error: "Places not found" });
    }
    res.status(500).json({ error: error.message });
  }
};

export const getPlaceById = async (req, res) => {
  const { id } = req.params;
  try {
    const place = await db.select().from(places).where(eq(places.id, id));
    res.json(place);
  } catch (error) {
    if (id !== undefined) {
      return res.status(400).json({ error: "Invalid place ID" });
    }
    if (place.length === 0) {
      return res.status(404).json({ error: "Place not found" });
    }
    res.status(500).json({ error: error.message });
  }
};

export const createPlace = async (req, res) => {
  const { name, description, image_url } = req.body;
  try {
    const place = await db
      .insert(places)
      .values({ name, description, image_url });
    res.json(place);
  } catch (error) {
    if (
      name === undefined ||
      description === undefined ||
      image_url === undefined
    ) {
      return res
        .status(400)
        .json({ error: "Name, description, and image URL are required" });
    }
    res.status(500).json({ error: error.message });
  }
};

export const updatePlace = async (req, res) => {
  const { id } = req.params;
  const { name, description, image_url } = req.body;
  try {
    const place = await db
      .update(places)
      .set({ name, description, image_url })
      .where(eq(places.id, id));
    res.json(place);
  } catch (error) {
    if (
      name === undefined ||
      description === undefined ||
      image_url === undefined
    ) {
      return res
        .status(400)
        .json({ error: "Name, description, and image URL are required" });
    }
    if (id === undefined) {
      return res.status(400).json({ error: "Invalid place ID" });
    }
    if (place === undefined) {
      return res.status(404).json({ error: "Place not found" });
    }
    res.status(500).json({ error: error.message });
  }
};

export const deletePlace = async (req, res) => {
  const { id } = req.params;
  try {
    const place = await db.delete(places).where(eq(places.id, id));
    res.json(place);
  } catch (error) {
    if (id === undefined) {
      return res.status(400).json({ error: "Invalid place ID" });
    }
    if (place === undefined) {
      return res.status(404).json({ error: "Place not found" });
    }
    res.status(500).json({ error: error.message });
  }
};
