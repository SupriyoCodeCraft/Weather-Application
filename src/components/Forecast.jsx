import { getMeteocon } from "../utils/meteoconMap";
import { formatDate } from "../services/weatherService";

const Forecast = ({ data }) => {
  if (!data || !data.list) return null;

  const timezoneOffset = data.city?.timezone || 0;

  const getDateKey = (timestamp) =>
    new Date((timestamp + timezoneOffset) * 1000).toISOString().split("T")[0];

  const dailyMap = data.list.reduce((acc, item) => {
    const key = getDateKey(item.dt);

    if (!acc[key]) {
      acc[key] = {
        entries: [],
        minTemp: Infinity,
        maxTemp: -Infinity,
        maxPrecipChance: 0
      };
    }

    acc[key].entries.push(item);
    acc[key].minTemp = Math.min(acc[key].minTemp, item.main.temp_min);
    acc[key].maxTemp = Math.max(acc[key].maxTemp, item.main.temp_max);
    acc[key].maxPrecipChance = Math.max(acc[key].maxPrecipChance, item.pop || 0);

    return acc;
  }, {});

  const dailyForecasts = Object.values(dailyMap)
    .map((dayData) => {
      const representative = dayData.entries.reduce((closest, current) => {
        const currentHour = new Date((current.dt + timezoneOffset) * 1000).getUTCHours();
        const closestHour = new Date((closest.dt + timezoneOffset) * 1000).getUTCHours();
        return Math.abs(currentHour - 12) < Math.abs(closestHour - 12)
          ? current
          : closest;
      });

      return {
        ...representative,
        minTemp: dayData.minTemp,
        maxTemp: dayData.maxTemp,
        maxPrecipChance: dayData.maxPrecipChance
      };
    })
    .slice(0, 5);

  return (
    <div className="forecast">
      <h3 className="forecast-title">5-Day Outlook</h3>
      <div className="forecast-grid">
        {dailyForecasts.map((day, index) => {
          const rainChance = Math.round(day.maxPrecipChance * 100);

          return (
            <div key={index} className="forecast-card">
              <div className="forecast-main">
                <p className="forecast-day">
                  {index === 0
                    ? "Today"
                    : formatDate(day.dt, timezoneOffset, { weekday: "short" })}
                </p>
                <p className="forecast-type">{day.weather[0].main}</p>
              </div>

              <img
                src={getMeteocon(day.weather[0].icon)}
                className="meteocon-small forecast-icon"
                alt={day.weather[0].description || "weather icon"}
                loading="lazy"
              />

              <div className="forecast-meta">
                <p className="forecast-temps">
                  H {Math.round(day.maxTemp)}° <span>L {Math.round(day.minTemp)}°</span>
                </p>
                <div className="pop-meter" aria-hidden="true">
                  <span className="pop-fill" style={{ width: `${rainChance}%` }} />
                </div>
                <p className="forecast-pop">Rain {rainChance}%</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Forecast;
