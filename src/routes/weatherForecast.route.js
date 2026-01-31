import { Router } from "express";
import { getWeatherForecast } from "../controllers/weatherForecast.controller.js"

const router = Router();

router.get("/weather/forecast", getWeatherForecast);

export default router;