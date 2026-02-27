const base = "https://basmilius.github.io/weather-icons/production/fill/all/";
const fallbackBase = "https://openweathermap.org/img/wn/";

const iconMap = {
  "01d": base + "clear-day.svg",
  "01n": base + "clear-night.svg",

  "02d": base + "partly-cloudy-day.svg",
  "02n": base + "partly-cloudy-night.svg",

  "03d": base + "cloudy.svg",
  "03n": base + "cloudy.svg",

  "04d": base + "overcast.svg",
  "04n": base + "overcast.svg",

  "09d": base + "rain.svg",
  "09n": base + "rain.svg",

  "10d": base + "rain.svg",
  "10n": base + "rain.svg",

  "11d": base + "thunderstorms.svg",
  "11n": base + "thunderstorms.svg",

  "13d": base + "snow.svg",
  "13n": base + "snow.svg",

  "50d": base + "mist.svg",
  "50n": base + "mist.svg",
};

export const getMeteocon = (iconCode) => {
  return iconMap[iconCode] || `${fallbackBase}${iconCode || "01d"}@2x.png`;
};
