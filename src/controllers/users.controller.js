import { db } from "../db.js";
import { users } from "../models/users.js";
import { eq } from "drizzle-orm";

export const getUserById = async (req, res) => {
  const { userId } = req.params;
  console.log(userId);
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
