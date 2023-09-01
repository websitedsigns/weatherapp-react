import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm } from 'react-icons/wi';
import './App.css';

function getWeatherIcon(weatherCode) {
  switch (weatherCode) {
    case '01d':
      return <WiDaySunny />;
    case '01n':
      return <WiDaySunny />;
    case '02d':
      return <WiCloudy />;
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

function getWeatherBackgroundClass(weatherCode) {
  switch (weatherCode) {
    case '01d':
    case '01n':
      return 'weather-sunny';
    case '02d':
    case '02n':
      return 'weather-cloudy';
    case '03d':
    case '03n':
    case '04d':
    case '04n':
      return 'weather-cloudy';
    case '09d':
    case '09n':
    case '10d':
    case '10n':
      return 'weather-rain';
    case '13d':
    case '13n':
      return 'weather-snow';
    case '11d':
    case '11n':
      return 'weather-thunderstorm';
    default:
      return 'weather-default'; // Default background class
  }
}

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('');
  const [unit, setUnit] = useState('metric'); // 'metric' represents Celsius by default
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const apiKey = '3ec4a7cf1f19e18756476b82a0860caf';
  const [temperature, setTemperature] = useState(null);

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
    if (unit === 'metric') {
      setUnit('imperial'); // Switch to Fahrenheit
    } else {
      setUnit('metric'); // Switch to Celsius
    }
    fetchWeatherData(); // Fetch weather data with the new unit
  };

  useEffect(() => {
    // Fetch weather data when the component mounts (initial load)
    fetchWeatherData();
  }, []);

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
              {unit === 'metric' ? '°C' : '°F'}
            </button>
          </div>
          <p>Unit: {unit === 'metric' ? 'Celsius' : 'Fahrenheit'}</p>
          {error !== null && <p className="error-message">{error}</p>}
          {weatherData && (
  <div className="weather-info">
    <h2>{weatherData.name}</h2>
    <div className="temperature">
      <p>
        {temperature !== null ? `${temperature.toFixed(1)}${unit === 'metric' ? '°C' : '°F'}` : 'N/A'}
      </p>
    </div>
    <div className="weather-description">
      <p>
        Weather: {weatherData.weather[0].main}
      </p>
      <p>
        {getWeatherIcon(weatherData.weather[0].icon)}
      </p>
    </div>
  </div>
)}
          
        </div>
      </div>
    </div>
  );
}

export default App;
