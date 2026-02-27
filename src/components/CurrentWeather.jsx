import { getMeteocon } from "../utils/meteoconMap";
import { formatDate, formatTime } from "../services/weatherService";

const CurrentWeather = ({ data }) => {
  if (!data) return null;

  const {
    name,
    main = {},
    weather = [],
    wind = {},
    sys = {},
    visibility = 0,
    timezone = 0,
    dt
  } = data;
  const currentWeather = weather?.[0] || {};
  const minTemp = Math.round(main?.temp_min ?? main?.temp ?? 0);
  const maxTemp = Math.round(main?.temp_max ?? main?.temp ?? 0);

  const toTitleCase = (text = "") =>
    text
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");

  return (
    <div className="current-weather">
      <div className="current-weather-top">
        <div>
          <p className="panel-label">Current Conditions</p>
          <h2 className="location-title">{name}</h2>
          <p className="location-meta">
            {sys?.country || "Unknown region"} . Updated{" "}
            {formatDate(dt, timezone, { month: "short", day: "numeric" })},{" "}
            {formatTime(dt, timezone)}
          </p>
        </div>
        <p className="status-badge">{toTitleCase(currentWeather.main || "Live")}</p>
      </div>

      <div className="current-weather-hero">
        <img
          src={getMeteocon(currentWeather.icon)}
          className="meteocon-main"
          alt={currentWeather.description || "weather icon"}
          loading="lazy"
        />

        <div className="temp-stack">
          <h1 className="temp-value">{Math.round(main?.temp ?? 0)}°C</h1>
          <p className="weather-description">{toTitleCase(currentWeather.description)}</p>
          <p className="feels-like">Feels like {Math.round(main?.feels_like ?? 0)}°C</p>
          <p className="temp-range">High {maxTemp}° . Low {minTemp}°</p>
        </div>
      </div>

      <div className="detail-grid">
        <article className="detail-card">
          <p className="detail-label">Humidity</p>
          <p className="detail-value">{main?.humidity ?? 0}%</p>
        </article>
        <article className="detail-card">
          <p className="detail-label">Wind</p>
          <p className="detail-value">{(wind?.speed ?? 0).toFixed(1)} m/s</p>
        </article>
        <article className="detail-card">
          <p className="detail-label">Pressure</p>
          <p className="detail-value">{main?.pressure ?? 0} hPa</p>
        </article>
        <article className="detail-card">
          <p className="detail-label">Visibility</p>
          <p className="detail-value">{((visibility ?? 0) / 1000).toFixed(1)} km</p>
        </article>
        <article className="detail-card">
          <p className="detail-label">Sunrise</p>
          <p className="detail-value">{formatTime(sys?.sunrise ?? dt, timezone)}</p>
        </article>
        <article className="detail-card">
          <p className="detail-label">Sunset</p>
          <p className="detail-value">{formatTime(sys?.sunset ?? dt, timezone)}</p>
        </article>
      </div>
    </div>
  );
};

export default CurrentWeather;
