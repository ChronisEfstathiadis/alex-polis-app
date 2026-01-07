import { Router } from "express";
import {
  getAllPointsOfInterest,
  getPointOfInterestById,
  createPointOfInterest,
  deletePointOfInterest,
  updatePointOfInterest,
} from "../controllers/pointsOfInterest.controller.js";
import { requireAuthDev } from "../middlewares/mockAuth.js";

const router = Router();

router.get("/points-of-interest", requireAuthDev(), getAllPointsOfInterest);
router.get("/points-of-interest/:id", requireAuthDev(), getPointOfInterestById);
router.post("/points-of-interest", requireAuthDev(), createPointOfInterest);
router.delete(
  "/points-of-interest/:id",
  requireAuthDev(),
  deletePointOfInterest
);
router.put("/points-of-interest/:id", requireAuthDev(), updatePointOfInterest);
export default router;
