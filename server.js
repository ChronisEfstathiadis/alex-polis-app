import "dotenv/config";
import express from "express";
import cors from "cors";
import { clerkClient, requireAuth, clerkMiddleware } from "@clerk/express";
import * as dotenv from "dotenv";
import { db } from "./src/db.js";
import { users } from "./src/models/users.js";
import { eq } from "drizzle-orm";
import { handleClerkWebhook } from "./src/webHooks/clerk.js";
import { specs } from "./src/swagger.js";
import swaggerUi from "swagger-ui-express";
import usersRoutes from "./src/routes/users.route.js";
import eventsRoutes from "./src/routes/events.route.js";

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

// Change this line:
// app.use("/swagger", swaggerUi.serve, swaggerUi.setup(specs));

// To this:
app.use(
  "/swagger",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    customCssUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css",
    customJs: [
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js",
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js",
    ],
  })
);

app.use("/api", usersRoutes);
app.use("/api", eventsRoutes);
app.get("/", (req, res) => {
  res.send("Homepage - <a href='/protected'>Go to Protected Route</a>");
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
