import "dotenv/config";
import express from "express";
import { clerkClient, requireAuth, clerkMiddleware } from "@clerk/express";
import * as dotenv from "dotenv";
import { db } from "./src/db.js";
import { users } from "./src/models/users.js";
import { eq } from "drizzle-orm";
import { handleClerkWebhook } from "./src/api/webHook.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.post(
  "/api/webhooks/clerk",
  express.raw({ type: "application/json" }),
  handleClerkWebhook
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Clerk middleware
app.use(clerkMiddleware());

app.get("/protected", requireAuth(), async (req, res) => {
  const { userId } = req.auth;
  let user;

  try {
    user = await clerkClient.users.getUser(userId);

    // 1. Check if user exists in your DB
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    // 2. If not, create them
    if (existingUser.length === 0) {
      await db.insert(users).values({
        id: userId,
        name: `${user.firstName} ${user.lastName}`,
        email: user.emailAddresses[0].emailAddress,
      });
      console.log("User synced to DB");
    }

    return res.json({ user });
  } catch (error) {
    console.error("Error in protected route:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Homepage - <a href='/protected'>Go to Protected Route</a>");
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
