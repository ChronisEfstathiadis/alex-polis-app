import { Router } from "express";
import { getUser, createUser } from "../controllers/users.controller.js";

const router = Router();

router.get("/api/users/:userId", getUser);
router.post("/api/users", createUser);

export default router;
