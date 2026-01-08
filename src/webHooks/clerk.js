import { Webhook } from "svix";
import { db } from "../db.js";
import { users } from "../models/users.js";
import { eq } from "drizzle-orm";

export const handleClerkWebhook = async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) return res.status(400).json({ error: "Missing secret" });

  const svix_id = req.headers["svix-id"];
  const svix_timestamp = req.headers["svix-timestamp"];
  const svix_signature = req.headers["svix-signature"];

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ error: "Missing svix headers" });
  }

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;

  try {
    evt = wh.verify(req.body.toString(), {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch {
    return res.status(400).json({ error: "Verification failed" });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  try {
    if (eventType === "user.created" || eventType === "user.updated") {
      const { email_addresses, username, image_url, primary_email_address_id } =
        evt.data;
      const email =
        email_addresses.find((e) => e.id === primary_email_address_id)
          ?.email_address ?? email_addresses[0]?.email_address;

      if (!email) return res.status(400).json({ error: "Email required" });

      const userData = {
        id,
        email,
        username: username,
        image_url: image_url,
        role: "user",
        theme: "light",
        language: "en",
        user_type: "local",
        opt_in_events_push: false,
        opt_in_events_email: false,
        onboarding_completed: false,
        onboarding_step: 0,
      };

      await db.insert(users).values(userData).onConflictDoUpdate({
        target: users.id,
        set: userData,
      });
    } else if (eventType === "user.deleted") {
      await db.delete(users).where(eq(users.id, id));
    } else if (eventType === "user.updated") {
      const { email_addresses, username, image_url, primary_email_address_id } =
        evt.data;
      const email =
        email_addresses.find((e) => e.id === primary_email_address_id)
          ?.email_address ?? email_addresses[0]?.email_address;

      const updateData = {
        email,
        username: username,
        image_url: image_url,
      };

      await db.update(users).set(updateData).where(eq(users.id, id));
    }

    return res.status(200).json({
      success: true,
      message: "Webhook received",
    });
  } catch (dbError) {
    console.error("Database operation failed:", dbError.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
