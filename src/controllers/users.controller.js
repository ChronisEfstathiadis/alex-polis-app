import { db } from "../db.js";
import { users } from "../models/users.js";
import { eq } from "drizzle-orm";

export const getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { userId } = req.params;

  const updateData = {};
  const allowedFields = [
    "username",
    "email",
    "image_url",
    "theme",
    "language",
    "user_type",
    "opt_in_events_push",
    "opt_in_events_email",
    "onboarding_completed",
    "onboarding_step",
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({
      success: false,
      error: "No valid fields provided for update",
    });
  }

  try {
    const user = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning();

    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.status(200).json(user[0]);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
