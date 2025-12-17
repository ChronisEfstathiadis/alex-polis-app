import { Request, Response, NextFunction } from "express";
import { db } from "../config/database.js";
import { users, insertUserSchema } from "../db/schema/user.js";
import { eq } from "drizzle-orm";

export const autoSyncUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Only sync if user is authenticated and we have user info
  if (req.oidc?.isAuthenticated() && req.oidc.user) {
    try {
      const { sub, email, name, picture } = req.oidc.user;

      if (!sub || !email) {
        return next();
      }

      const validatedData = insertUserSchema.parse({
        auth0Id: sub,
        email: email,
        name: name || null,
        picture: picture || null,
        emailVerified: true,
        lastLogin: new Date(),
      });

      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.auth0Id, sub))
        .limit(1);

      if (existingUser) {
        // Update last login
        await db
          .update(users)
          .set({ lastLogin: new Date() })
          .where(eq(users.auth0Id, sub));
      } else {
        // Create new user
        await db.insert(users).values(validatedData);
      }
    } catch (error) {
      // Log error but don't block the request
      console.error("Error auto-syncing user:", error);
    }
  }
  next();
};
