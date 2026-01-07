import { db } from "../db.js";
import { PointsOfInterest } from "../models/pointsOfInterest.js";
import { eq } from "drizzle-orm";

export const getAllPointsOfInterest = async (req, res) => {
  try {
    const pointsOfInterest = await db.select().from(PointsOfInterest);
    res.json(pointsOfInterest);
  } catch (error) {
    if (pointsOfInterest.length === 0) {
      return res.status(404).json({ error: "Points of interest not found" });
    }
    res.status(500).json({ error: error.message });
  }
};

export const getPointOfInterestById = async (req, res) => {
  const { id } = req.params;
  try {
    const pointOfInterest = await db
      .select()
      .from(PointsOfInterest)
      .where(eq(PointsOfInterest.id, id));
    res.json(pointOfInterest);
  } catch (error) {
    if (id !== undefined) {
      return res.status(400).json({ error: "Invalid point of interest ID" });
    }
    if (pointOfInterest.length === 0) {
      return res.status(404).json({ error: "Point of interest not found" });
    }
    res.status(500).json({ error: error.message });
  }
};

export const createPointOfInterest = async (req, res) => {
  const { name, description, image_url } = req.body;
  try {
    const pointOfInterest = await db
      .insert(PointsOfInterest)
      .values({ name, description, image_url });
    res.json(pointOfInterest);
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

export const updatePointOfInterest = async (req, res) => {
  const { id } = req.params;
  const { name, description, image_url } = req.body;
  try {
    const pointOfInterest = await db
      .update(PointsOfInterest)
      .set({ name, description, image_url })
      .where(eq(PointsOfInterest.id, id));
    res.json(pointOfInterest);
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
      return res.status(400).json({ error: "Invalid point of interest ID" });
    }
    if (pointOfInterest === undefined) {
      return res.status(404).json({ error: "Point of interest not found" });
    }
    res.status(500).json({ error: error.message });
  }
};

export const deletePointOfInterest = async (req, res) => {
  const { id } = req.params;
  try {
    const pointOfInterest = await db
      .delete(PointsOfInterest)
      .where(eq(PointsOfInterest.id, id));
    res.json(pointOfInterest);
  } catch (error) {
    if (id === undefined) {
      return res.status(400).json({ error: "Invalid point of interest ID" });
    }
    if (pointOfInterest === undefined) {
      return res.status(404).json({ error: "Point of interest not found" });
    }
    res.status(500).json({ error: error.message });
  }
};
