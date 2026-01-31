import "dotenv/config";
import express from "express";
import cors from "cors";
import { clerkClient, requireAuth, clerkMiddleware } from "@clerk/express";
import * as dotenv from "dotenv";
import { db } from "./src/db.js";
import { users } from "./src/models/users.js";
import { eq } from "drizzle-orm";
import { handleClerkWebhook } from "./src/webHooks/clerk.js";
import usersRoutes from "./src/routes/users.route.js";
import eventsRoutes from "./src/routes/events.route.js";
import pointsOfInterestRoutes from "./src/routes/pointsOfInterest.route.js";
import weatherForecastRoutes from "./src/routes/weatherForecast.route.js";
import weatherCurrentConditionsRoutes from "./src/routes/weatherCurrentConditions.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.post(
  "/api/webhooks/clerk",
  express.raw({ type: "application/json" }),
  handleClerkWebhook
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(clerkMiddleware());

app.get("/protected", requireAuth(), async (req, res) => {
  console.log("Protected route accessed");
  const { userId } = req.auth;
  let user;

  try {
    user = await clerkClient.users.getUser(userId);

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (existingUser.length === 0) {
      await db.insert(users).values({
        id: userId,
        username: `${user.username}`,
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

app.use("/api", usersRoutes);
app.use("/api", eventsRoutes);
app.use("/api", pointsOfInterestRoutes);
app.use("/api", weatherForecastRoutes);
app.use("/api", weatherCurrentConditionsRoutes);
app.get("/", (req, res) => {
  res.send("Homepage - <a href='/protected'>Go to Protected Route</a>");
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
