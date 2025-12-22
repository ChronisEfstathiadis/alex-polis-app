import { db } from "../db.js";
import { users } from "../models/users.js";
import { eq } from "drizzle-orm";

export const getUser = async (req, res) => {
  try {
    const { userId } = req.auth;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
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

export const createUser = async (req, res) => {
  try {
    const { userId } = req.auth;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const user = await db.insert(users).values({ id: userId, username, email });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
