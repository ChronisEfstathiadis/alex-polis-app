import { db } from "../config/database.js";
import { insertUserSchema, users } from "../db/schema/user.js";
import { eq } from "drizzle-orm";
import type { Request, Response } from "express";

export const getUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    console.log("userId", userId);
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      res.status(404).json({
        error: "User not found",
        requestedId: userId,
      });
      return;
    }
    res.json(user);
  } catch (error) {
    console.error("Database Query Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const syncUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { sub, email, name } = req.user;
    const validatedData = insertUserSchema.parse({
      id: sub,
      email: email,
      username: name || null,
      imageUrl: null,
      role: "user",
      createdAt: new Date(),
    });

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, sub))
      .limit(1);

    if (existingUser) {
      const [updatedUser] = await db
        .update(users)
        .set({ username: name || null, imageUrl: null, role: "user" })
        .where(eq(users.id, sub))
        .returning();

      res.json(updatedUser);
      return;
    }

    const [newUser] = await db.insert(users).values(validatedData).returning();

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error syncing user:", error);

    if (error instanceof Error && error.name === "ZodError") {
      res.status(400).json({
        error: "Validation failed",
        details: error.message,
      });
      return;
    }

    res.status(500).json({ error: "Internal server error" });
  }
};

// export const getUsers = async (req: Request, res: Response) => {
//   try {
//     const page = parseInt(req.query.page as string) || 1;
//     const limit = parseInt(req.query.limit as string) || 10;
//     const search = req.query.search as string;
//     const offset = (page - 1) * limit;

//     let query = db.select().from(users);

//     // Add search filter if provided
//     if (search) {
//       query = query.where(
//         sql`${users.name} ILIKE ${"%" + search + "%"} OR ${users.email} ILIKE ${"%" + search + "%"}`
//       );
//     }

//     const allUsers = await query.limit(limit).offset(offset);

//     // Get total count
//     const [{ count }] = await db.select({ count: sql`count(*)` }).from(users);

//     res.json({
//       data: allUsers,
//       pagination: {
//         page,
//         limit,
//         total: Number(count),
//         totalPages: Math.ceil(Number(count) / limit),
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.id || "0";

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId.toString()))
      .limit(1);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.id || "0";
    const { name } = req.body;

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId.toString()))
      .limit(1);

    if (!existingUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const [updatedUser] = await db
      .update(users)
      .set({ username: name || null, imageUrl: null, role: "user" })
      .where(eq(users.id, userId.toString()))
      .returning();

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ADD THIS FUNCTION:
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.id || "0";

    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, userId.toString()))
      .returning();

    if (!deletedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
