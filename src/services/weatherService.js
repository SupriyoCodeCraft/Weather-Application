const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const assertApiKey = () => {
  if (!API_KEY) {
    throw new Error('Missing API key. Set VITE_API_KEY in your .env file.');
  }
};

const buildUrl = (endpoint, params) => {
  const url = new URL(`${BASE_URL}/${endpoint}`);
  const searchParams = new URLSearchParams({
    ...params,
    appid: API_KEY
  });
  url.search = searchParams.toString();
  return url.toString();
};

const fetchWeatherApi = async (endpoint, params, fallbackMessage) => {
  assertApiKey();

  try {
    const response = await fetch(buildUrl(endpoint, params));
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || fallbackMessage);
    }

    return data;
  } catch (error) {
    throw new Error(error.message || fallbackMessage);
  }
};

/**
 * Fetch current weather by city name
 * @param {string} city - City name
 * @returns {Promise<Object>} Weather data
 */
export const getCurrentWeather = async (city) => {
  return fetchWeatherApi(
    'weather',
    { q: city, units: 'metric' },
    'City not found'
  );
};

/**
 * Fetch 5-day weather forecast by city name
 * @param {string} city - City name
 * @returns {Promise<Object>} Forecast data
 */
export const getForecast = async (city) => {
  return fetchWeatherApi(
    'forecast',
    { q: city, units: 'metric' },
    'City not found'
  );
};

/**
 * Fetch weather by coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Weather data
 */
export const getWeatherByCoords = async (lat, lon) => {
  return fetchWeatherApi(
    'weather',
    { lat, lon, units: 'metric' },
    'Failed to fetch weather for your location'
  );
};

/**
 * Fetch forecast by coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Forecast data
 */
export const getForecastByCoords = async (lat, lon) => {
  return fetchWeatherApi(
    'forecast',
    { lat, lon, units: 'metric' },
    'Failed to fetch forecast for your location'
  );
};

/**
 * Get user's current location using Geolocation API
 * @returns {Promise<Object>} Coordinates object with lat and lon
 */
export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      () => {
        reject(new Error('Unable to retrieve your location'));
      }
    );
  });
};

/**
 * Get weather icon URL
 * @param {string} iconCode - Icon code from API
 * @returns {string} Icon URL
 */
export const getWeatherIconUrl = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

const formatTimestamp = (timestamp, timezoneOffset = 0, options = {}) => {
  const date = new Date((timestamp + timezoneOffset) * 1000);
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    ...options
  }).format(date);
};

/**
 * Format date from timestamp
 * @param {number} timestamp - Unix timestamp
 * @param {number} timezoneOffset - Timezone offset in seconds
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date
 */
export const formatDate = (
  timestamp,
  timezoneOffset = 0,
  options = {}
) => {
  return formatTimestamp(timestamp, timezoneOffset, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    ...options
  });
};

/**
 * Format time from timestamp
 * @param {number} timestamp - Unix timestamp
 * @param {number} timezoneOffset - Timezone offset in seconds
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted time
 */
export const formatTime = (
  timestamp,
  timezoneOffset = 0,
  options = {}
) => {
  return formatTimestamp(timestamp, timezoneOffset, {
    hour: '2-digit',
    minute: '2-digit',
    ...options
  });
};
