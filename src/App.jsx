import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import ThemeToggle from './components/ThemeToggle';
import LocationButton from './components/LocationButton';
import {
  getCurrentWeather,
  getForecast,
  getWeatherByCoords,
  getForecastByCoords,
  getUserLocation
} from './services/weatherService';
import './App.css';

const getSceneType = (condition) => {
  if (['rain', 'drizzle', 'thunderstorm'].includes(condition)) return 'rain';
  if (condition === 'snow') return 'snow';
  if (['mist', 'fog', 'haze', 'smoke', 'dust', 'sand', 'ash', 'tornado', 'squall'].includes(condition)) {
    return 'fog';
  }
  if (condition === 'clear') return 'clear';
  return 'clouds';
};

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState('light');

  const weatherCondition = currentWeather?.weather?.[0]?.main?.toLowerCase() || 'default';
  const weatherIcon = currentWeather?.weather?.[0]?.icon || '';
  const isNight = weatherIcon.endsWith('n');
  const sceneType = getSceneType(weatherCondition);
  const trackedLocation = currentWeather
    ? `${currentWeather.name}${currentWeather?.sys?.country ? `, ${currentWeather.sys.country}` : ''}`
    : 'No city selected';

  useEffect(() => {
    const savedTheme = localStorage.getItem('weatherAppTheme');
    const savedCity = localStorage.getItem('lastSearchedCity');

    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }

    if (savedCity) {
      fetchWeatherData(savedCity);
    } else {
      handleGetLocation();
    }
  }, []);

  const fetchWeatherData = async (city) => {
    setLoading(true);
    setError(null);

    try {
      const [weatherData, forecastData] = await Promise.all([
        getCurrentWeather(city),
        getForecast(city)
      ]);

      setCurrentWeather(weatherData);
      setForecast(forecastData);
      localStorage.setItem('lastSearchedCity', city);
    } catch (err) {
      setError(err.message);
      setCurrentWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    setError(null);

    try {
      const [weatherData, forecastData] = await Promise.all([
        getWeatherByCoords(lat, lon),
        getForecastByCoords(lat, lon)
      ]);

      setCurrentWeather(weatherData);
      setForecast(forecastData);
      localStorage.setItem('lastSearchedCity', weatherData.name);
    } catch (err) {
      setError(err.message);
      setCurrentWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (city) => {
    fetchWeatherData(city);
  };

  const handleGetLocation = async () => {
    setError(null);

    try {
      const { lat, lon } = await getUserLocation();
      await fetchWeatherByCoords(lat, lon);
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('weatherAppTheme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleCloseError = () => {
    setError(null);
  };

  const rainDrops = Array.from({ length: 26 }, (_, index) => index);
  const snowFlakes = Array.from({ length: 20 }, (_, index) => index);
  const stars = Array.from({ length: 38 }, (_, index) => index);
  const cloudBands = [
    { left: '4%', top: '15%', scale: 1.05, delay: '-1.5s' },
    { left: '45%', top: '9%', scale: 1.2, delay: '-4.2s' },
    { left: '73%', top: '17%', scale: 0.9, delay: '-2.8s' }
  ];
  const fogBands = [
    { top: '14%', delay: '-0.8s', opacity: 0.38 },
    { top: '25%', delay: '-4.4s', opacity: 0.24 },
    { top: '35%', delay: '-2.1s', opacity: 0.3 }
  ];

  return (
    <div className={`app weather-${weatherCondition}`}>
      <div className="background-orb orb-a" />
      <div className="background-orb orb-b" />
      <div className="background-orb orb-c" />
      <div className={`weather-scene scene-${sceneType} ${isNight ? 'scene-night' : ''}`} aria-hidden="true">
        {sceneType === 'clear' && !isNight && (
          <>
            <div className="scene-sun-glow" />
            <div className="scene-sun-rays" />
            <div className="scene-sun" />
          </>
        )}

        {sceneType === 'clear' && isNight && (
          <>
            <div className="scene-moon-glow" />
            <div className="scene-moon">
              <span className="scene-moon-smile" />
            </div>
            <div className="scene-stars">
              {stars.map((index) => (
                <span
                  key={`star-${index}`}
                  className="scene-star"
                  style={{
                    '--star-left': `${(index * 37 + 11) % 100}%`,
                    '--star-top': `${(index * 29 + 5) % 52}%`,
                    '--twinkle-delay': `${(index % 7) * -0.7}s`,
                    '--twinkle-duration': `${2.4 + (index % 4) * 0.5}s`,
                    '--star-size': `${1.75 + (index % 3) * 0.9 + (index % 9 === 0 ? 1.1 : 0)}px`,
                    '--star-opacity': `${0.38 + (index % 4) * 0.14}`
                  }}
                />
              ))}
            </div>
          </>
        )}

        {sceneType === 'rain' && (
          <div className="scene-rain">
            {rainDrops.map((index) => (
              <span
                key={`rain-${index}`}
                className="rain-drop"
                style={{
                  '--drop-left': `${(index * 17 + 9) % 100}%`,
                  '--drop-delay': `${(index % 9) * -0.45}s`,
                  '--drop-duration': `${0.92 + (index % 5) * 0.13}s`,
                  '--drop-opacity': `${0.2 + (index % 4) * 0.12}`,
                  '--drop-height': `${44 + (index % 5) * 14}px`
                }}
              />
            ))}
          </div>
        )}

        {sceneType === 'snow' && (
          <div className="scene-snow">
            {snowFlakes.map((index) => (
              <span
                key={`snow-${index}`}
                className="snow-flake"
                style={{
                  '--flake-left': `${(index * 19 + 12) % 100}%`,
                  '--flake-delay': `${(index % 8) * -0.7}s`,
                  '--flake-duration': `${5.8 + (index % 5) * 1.15}s`,
                  '--flake-size': `${2 + (index % 3) * 1.3}px`,
                  '--flake-opacity': `${0.35 + (index % 4) * 0.13}`
                }}
              />
            ))}
          </div>
        )}

        {sceneType === 'fog' && (
          <div className="scene-fog">
            {fogBands.map((band, index) => (
              <span
                key={`fog-${index}`}
                className="fog-band"
                style={{
                  '--fog-top': band.top,
                  '--fog-delay': band.delay,
                  '--fog-opacity': band.opacity
                }}
              />
            ))}
          </div>
        )}

        {sceneType === 'clouds' && (
          <div className="scene-clouds">
            {cloudBands.map((cloud, index) => (
              <span
                key={`cloud-${index}`}
                className="cloud-band"
                style={{
                  '--cloud-left': cloud.left,
                  '--cloud-top': cloud.top,
                  '--cloud-scale': cloud.scale,
                  '--cloud-delay': cloud.delay
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="app-shell">
        <header className="app-header">
          <div className="header-content">
            <div className="logo">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
              </svg>
              <div>
                <p className="brand-kicker">Operational Weather Intelligence</p>
                <h1>Atmos Weather Console</h1>
                <p className="subtitle">Live conditions and forecast analytics</p>
              </div>
            </div>

            <div className="header-actions">
              <div className="header-chip">
                <span className="chip-label">Tracking</span>
                <span className="chip-value">{trackedLocation}</span>
              </div>
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            </div>
          </div>
        </header>

        <main className="app-main">
          <section className="search-section">
            <SearchBar onSearch={handleSearch} loading={loading} />
            <LocationButton onGetLocation={handleGetLocation} loading={loading} />
          </section>

          {error && <ErrorMessage message={error} onClose={handleCloseError} />}

          {loading && <LoadingSpinner />}

          {!loading && !error && currentWeather && (
            <section className="weather-layout">
              <CurrentWeather data={currentWeather} />
              <Forecast data={forecast} />
            </section>
          )}

          {!loading && !error && !currentWeather && (
            <section className="welcome-message">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
              </svg>
              <h2>Search a city to begin</h2>
              <p>Get current conditions, local daylight windows, and a refined 5-day outlook.</p>
            </section>
          )}
        </main>

        <footer className="app-footer">
          <p>Source: OpenWeatherMap API</p>
          <p>Atmos Console UI</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
