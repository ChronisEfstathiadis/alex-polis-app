import { fetchWeatherCurrentConditions } from '../services/WeatherCurrentConditions.js';

export const getWeatherCurrentConditions = async (req, res) => {
    try {
        const weatherData = await fetchWeatherCurrentConditions();
        res.json(weatherData);
    } catch (error) {
        console.error('Weather current conditions controller error:', error);
        res.status(500).json({ 
            error: 'Unable to fetch weather current conditions',
            message: error.message 
        });
    }
};