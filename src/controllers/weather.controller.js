import { fetchAlexandroupolisWeather } from '../services/Weather.js';

export const getWeatherForecast = async (req, res) => {
  try {
    const weatherData = await fetchAlexandroupolisWeather();
    res.json(weatherData);
  } catch (error) {
    console.error('Weather controller error:', error);
    res.status(500).json({ 
      error: 'Unable to fetch weather forecast',
      message: error.message 
    });
  }
};