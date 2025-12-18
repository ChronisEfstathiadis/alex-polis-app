import { Request, Response, NextFunction } from "express";
import { db } from "../config/database.js";
import { users, insertUserSchema } from "../db/schema/user.js";
import { eq } from "drizzle-orm";

export const autoSyncUser = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  // Only sync if user is authenticated and we have user info
  if (req.oidc?.isAuthenticated() && req.oidc.user) {
    try {
      const { sub, email, name } = req.oidc.user;

      if (!sub || !email) {
        next();
        return;
      }

      const validatedData = insertUserSchema.parse({
        auth0Id: sub,
        email: email,
        name: name || null,
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
        console.log("Auto-sync: Creating user...", email); // ADD LOG
        await db.insert(users).values(validatedData);
        console.log("Auto-sync: Success!"); // ADD LOG
      }
    } catch (error) {
      console.error("Auto-sync CRITICAL Error:", error); // UPDATE LOG
    }
  }
  next();
};
