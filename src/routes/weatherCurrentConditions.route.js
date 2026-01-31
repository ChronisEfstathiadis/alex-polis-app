import { Router } from "express";
import { getWeatherCurrentConditions } from "../controllers/weatherCurrentConditions.controller.js";

const router = Router();

router.get("/weather/current-conditions", getWeatherCurrentConditions);

export default router;