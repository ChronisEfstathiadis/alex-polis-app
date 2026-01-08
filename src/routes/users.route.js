import { Router } from "express";
import { getUserById, updateUser } from "../controllers/users.controller.js";
// import { requireAuth } from "@clerk/express";
import { requireAuthDev } from "../middlewares/mockAuth.js";

const router = Router();

router.get("/users/:userId", requireAuthDev(), getUserById);
router.put("/users/:userId", requireAuthDev(), updateUser);
export default router;
