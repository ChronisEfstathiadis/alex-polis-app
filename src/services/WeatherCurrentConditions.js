import axios from 'axios';

const GOOGLE_WEATHER_API_KEY = process.env.GOOGLE_API_KEY;
const ALEXANDROUPOLIS_COORDINATES = {
    latitude: 40.8473,
    longitude: 25.8767
};

export const fetchWeatherCurrentConditions = async () => {
    try {
        const url = 'https://weather.googleapis.com/v1/currentConditions:lookup';
        const response = await axios.get(url, {
            params: {
                key: GOOGLE_WEATHER_API_KEY,
                'location.latitude': ALEXANDROUPOLIS_COORDINATES.latitude,
            'location.longitude': ALEXANDROUPOLIS_COORDINATES.longitude
        }
    });
        return transformCurrentConditionsToCleanFormat(response.data);
    } catch (error) {
        console.error('Error fetching weather current conditions:', error.response?.data || error.message);
        throw new Error('Failed to fetch weather current conditions');
    }
};

function transformCurrentConditionsToCleanFormat(googleData) {
    return {
      icon: googleData.weatherCondition.iconBaseUri,
      condition: googleData.weatherCondition.description.text,
      temperature: {
        current: googleData.temperature.degrees,
        feelsLike: googleData.feelsLikeTemperature.degrees,
        unit: "°C"
      }
    };
  }