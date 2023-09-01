import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {

  const [error, setError] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('');
  const apiKey = '3ec4a7cf1f19e18756476b82a0860caf';
  const [isLoading, setIsLoading] = useState(false);


  const fetchWeatherData = async () => {
    setIsLoading(true); // Set loading to true when fetching starts
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      setWeatherData(response.data);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Error Fetching Weather Data. Please Check The City Name ');
    } finally {
      setIsLoading(false);
    }
  };

  const containerClassName = `container${weatherData ? ' with-margin' : ''}`;


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
    {error && <p className="error-message">{error}</p>} {/* Display error message here */}
    {weatherData && (
      <div>
        <h2>{weatherData.name}</h2>
        <p>Temperature: {weatherData.main.temp}°C</p>
        <p>Weather: {weatherData.weather[0].main}</p>
        </div>
      )}
    </div>
    </div>
  );
}

export default App;


