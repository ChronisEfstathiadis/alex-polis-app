import { Webhook } from "svix";
import { db } from "../config/database"; // Point to your actual db config
import { users } from "../db/schema/user";
import { eq } from "drizzle-orm";

export const handleClerkWebhook = async (req: any, res: any) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return res.status(400).json({ error: "Missing CLERK_WEBHOOK_SECRET" });
  }

  // Get Svix headers for verification
  const svix_id = req.headers["svix-id"] as string;
  const svix_timestamp = req.headers["svix-timestamp"] as string;
  const svix_signature = req.headers["svix-signature"] as string;

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ error: "Missing svix headers" });
  }

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: any;

  try {
    // req.body must be the raw buffer/string for verification to work
    evt = wh.verify(req.body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err: any) {
    console.error("Webhook verification failed:", err.message);
    return res.status(400).json({ error: "Verification failed" });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  try {
    if (eventType === "user.created" || eventType === "user.updated") {
      const { email_addresses, username, image_url, primary_email_address_id } =
        evt.data;

      const email =
        email_addresses.find((e: any) => e.id === primary_email_address_id)
          ?.email_address ?? email_addresses[0]?.email_address;

      const userData = {
        id, // Clerk ID
        email,
        username: username || null,
        role: "user",
        imageUrl: image_url || null,
        createdAt: new Date(),
      };

      await db
        .insert(users)
        .values(userData)
        .onConflictDoUpdate({
          target: users.id,
          set: {
            email: userData.email,
            username: userData.username,
            role: userData.role,
            imageUrl: userData.imageUrl,
            createdAt: userData.createdAt,
          },
        });
    } else if (eventType === "user.deleted") {
      await db.delete(users).where(eq(users.id, id));
    }

    return res.status(200).json({ success: true });
  } catch (dbError: any) {
    console.error("Database operation failed:", dbError.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
