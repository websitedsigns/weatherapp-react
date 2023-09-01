import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

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
<div className="container">
  <div className="App">
    <h1>Weather App</h1>
    <input
      type="text"
      placeholder="Enter city"
      value={city}
      onChange={(e) => setCity(e.target.value)}
    />
    <button onClick={fetchWeatherData}>
      {isLoading ? 'Loading...' : 'Get Weather'}
    </button>
    <button onClick={toggleUnit}>Toggle Unit</button>
    <p>Unit: {unit === 'metric' ? 'Celsius' : 'Fahrenheit'}</p>
    {error !== null && <p className="error-message">{error}</p>} {/* Display error message here */}
    {weatherData && (
      <div>
        <h2>{weatherData.name}</h2>
        <p>Temperature: {temperature !== null ? `${temperature}°${unit === 'metric' ? 'C' : 'F'}` : 'N/A'}</p>

        <p>Weather: {weatherData.weather[0].main}</p>
      </div>
    )}
  </div>
</div>
  );
}

export default App;
