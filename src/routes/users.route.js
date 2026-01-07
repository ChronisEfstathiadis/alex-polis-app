import { Router } from "express";
import { getUserById } from "../controllers/users.controller.js";
// import { requireAuth } from "@clerk/express";
import { requireAuthDev } from "../middlewares/mockAuth.js";

const router = Router();

router.get("/users/:userId", requireAuthDev(), getUserById);

export default router;
