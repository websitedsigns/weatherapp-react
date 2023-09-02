import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm } from 'react-icons/wi';
import './App.css';

function getWeatherIcon(weatherCode) {
  switch (weatherCode) {
    case '01d':
    case '01n':
      return <WiDaySunny />;
    case '02d':
    case '02n':
      return <WiCloudy />;
    case '03d':
    case '03n':
    case '04d':
    case '04n':
      return <WiCloudy />;
    case '09d':
    case '09n':
    case '10d':
    case '10n':
      return <WiRain />;
    case '13d':
    case '13n':
      return <WiSnow />;
    case '11d':
    case '11n':
      return <WiThunderstorm />;
    default:
      return null;
  }
}



function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('');
  const [unit, setUnit] = useState('metric');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const apiKey = '3ec4a7cf1f19e18756476b82a0860caf';
  const [temperature, setTemperature] = useState(null);
  const [forecastData, setForecastData] = useState(null);

  useEffect(() => {
    // When the unit changes, fetch weather data again
    fetchWeatherData();
  }, [unit]);

  const fetchForecastData = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${unit}`
      );
      setForecastData(response.data);
    } catch (error) {
      console.error('Error fetching forecast data:', error);
      setError('Error fetching forecast data. Please check the city name or try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderForecast = () => {
    if (forecastData && forecastData.list) {
      const groupedForecast = forecastData.list.reduce((grouped, forecast) => {
        const date = new Date(forecast.dt * 1000).toLocaleDateString();
        if (!grouped[date]) {
          grouped[date] = [];
        }
        grouped[date].push(forecast);
        return grouped;
      }, {});

      return (
        <div className="forecast">
          <h2>5-Day Forecast for {city}</h2>
          <div className="forecast-grid">
            {Object.entries(groupedForecast).map(([date, forecasts]) => (
              <div className="forecast-item" key={date}>
                <h3>{date}</h3>
                <div className="forecast-day">
                  {forecasts.map((forecast) => (
                    <div className="forecast-box" key={forecast.dt}>
                      <div className="forecast-time">
                        {getTimeOfDay(forecast.dt_txt)}
                      </div>
                      <div className="forecast-icon">
                        {getWeatherIcon(forecast.weather[0].icon)}
                      </div>
                      <p className="forecast-temperature">
                        {forecast.main.temp.toFixed(1)}{unit === 'metric' ? '°C' : '°F'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const getTimeOfDay = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();

    if (hours >= 5 && hours < 12) {
      return 'Morning';
    } else if (hours >= 12 && hours < 18) {
      return 'Day';
    } else {
      return 'Night';
    }
  };

  const fetchWeatherData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`
      );
      setWeatherData(response.data);
      setTemperature(response.data.main.temp);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Error fetching weather data. Please check the city name or try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUnit = () => {
    // Toggle between metric and imperial units
    setUnit((prevUnit) => (prevUnit === 'metric' ? 'imperial' : 'metric'));
  };

  return (
    <div className={`container ${getWeatherBackgroundClass(weatherData?.weather[0].icon)}`}>
      <div className="App">
        <div className="center-content">
          <h1>Weather App</h1>
          <div className="input-buttons">
            <div className="input-container">
              <input
                type="text"
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <button onClick={fetchWeatherData}>
              {isLoading ? 'Loading...' : 'Get Weather'}
            </button>
            <button onClick={toggleUnit} className="toggle-unit-button">
              {unit === 'metric' ? 'Switch to °F' : 'Switch to °C'}
            </button>
            <button onClick={fetchForecastData} className="forecast-button">
              {isLoading ? 'Loading Forecast...' : 'Get 5-Day Forecast'}
            </button>
          </div>
          <p>Unit: {unit === 'metric' ? 'Celsius' : 'Fahrenheit'}</p>
          {error !== null && <p className="error-message">{error}</p>}
          {weatherData && (
            <div className="weather-info">
              <h2>{weatherData.name}</h2>
              <div className="temperature">
                <p>
                  Temperature: {temperature !== null ? temperature.toFixed(1) : 'N/A'}{unit === 'metric' ? '°C' : '°F'}
                </p>
              </div>
              <div className="weather-description">
                <p>
                  Weather: {weatherData.weather[0].main}
                </p>
                <div className="current-weather-icon">
                  {getWeatherIcon(weatherData.weather[0].icon)}
                </div>
              </div>
            </div>
          )}

          {renderForecast()}
        </div>
      </div>
    </div>
  );
}

export default App;
