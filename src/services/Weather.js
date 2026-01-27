import axios from 'axios';

const GOOGLE_WEATHER_API_KEY = process.env.GOOGLE_API_KEY;
const ALEXANDROUPOLIS_COORDINATES = {
  latitude: 40.8473,
  longitude: 25.8767
};

export const fetchWeatherForecast = async (latitude, longitude, days = 7) => {
    try {
      const url = 'https://weather.googleapis.com/v1/forecast/days:lookup';
      
      const response = await axios.get(url, {
        params: {
          key: process.env.GOOGLE_API_KEY,
          'location.latitude': latitude,
          'location.longitude': longitude,
          days: days
        }
      });
      
      return transformGoogleWeatherToCleanFormat(response.data, "Alexandroupolis, Greece");
    } catch (error) {
      console.error('Error fetching weather data:', error.response?.data || error.message);
      throw new Error('Failed to fetch weather data');
    }
  };

export const fetchAlexandroupolisWeather = async () => {
  return fetchWeatherForecast(
    ALEXANDROUPOLIS_COORDINATES.latitude,
    ALEXANDROUPOLIS_COORDINATES.longitude
  );
};

export { transformGoogleWeatherToCleanFormat };


function transformGoogleWeatherToCleanFormat(googleData, location = "Alexandroupolis, Greece") {
    return {
      location,
      timezone: googleData.timeZone.id,
      forecast: googleData.forecastDays.map(day => {
        const date = new Date(day.displayDate.year, day.displayDate.month - 1, day.displayDate.day);
        
        return {
          date: date.toISOString().split('T')[0],
          dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'long' }),
          temperature: {
            max: Math.round(day.maxTemperature.degrees),
            min: Math.round(day.minTemperature.degrees),
            feelsLikeMax: Math.round(day.feelsLikeMaxTemperature.degrees),
            feelsLikeMin: Math.round(day.feelsLikeMinTemperature.degrees),
            unit: '°C'
          },
          daytime: {
            condition: day.daytimeForecast.weatherCondition.description.text,
            icon: day.daytimeForecast.weatherCondition.iconBaseUri,
            humidity: day.daytimeForecast.relativeHumidity,
            uvIndex: day.daytimeForecast.uvIndex,
            rainChance: day.daytimeForecast.precipitation.probability.percent,
            rainAmount: Math.round(day.daytimeForecast.precipitation.qpf.quantity * 10) / 10,
            wind: {
              speed: day.daytimeForecast.wind.speed.value,
              gust: day.daytimeForecast.wind.gust.value,
              direction: day.daytimeForecast.wind.direction.cardinal.replace(/_/g, ''),
              unit: 'km/h'
            },
            cloudCover: day.daytimeForecast.cloudCover
          },
          nighttime: {
            condition: day.nighttimeForecast.weatherCondition.description.text,
            icon: day.nighttimeForecast.weatherCondition.iconBaseUri,
            humidity: day.nighttimeForecast.relativeHumidity,
            rainChance: day.nighttimeForecast.precipitation.probability.percent,
            rainAmount: Math.round(day.nighttimeForecast.precipitation.qpf.quantity * 10) / 10,
            wind: {
              speed: day.nighttimeForecast.wind.speed.value,
              gust: day.nighttimeForecast.wind.gust.value,
              direction: day.nighttimeForecast.wind.direction.cardinal.replace(/_/g, ''),
              unit: 'km/h'
            },
            cloudCover: day.nighttimeForecast.cloudCover
          },
          sun: {
            sunrise: formatTime(day.sunEvents.sunriseTime),
            sunset: formatTime(day.sunEvents.sunsetTime)
          },
          moon: {
            phase: formatMoonPhase(day.moonEvents.moonPhase),
            moonrise: day.moonEvents.moonriseTimes.length > 0 ? formatTime(day.moonEvents.moonriseTimes[0]) : null,
            moonset: day.moonEvents.moonsetTimes.length > 0 ? formatTime(day.moonEvents.moonsetTimes[0]) : null
          }
        };
      })
    };
  }
  
  function formatTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false,
      timeZone: 'Europe/Athens'
    });
  }
  
  function formatMoonPhase(phase) {
    return phase.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  }