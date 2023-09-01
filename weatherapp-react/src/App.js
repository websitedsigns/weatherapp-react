import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('');
  const apiKey = '3ec4a7cf1f19e18756476b82a0860caf';

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      setWeatherData(response.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  return (
    <div className="App">
      <h1>Weather App</h1>
      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={fetchWeatherData}>Get Weather</button>
      {weatherData && (
        <div>
          <h2>{weatherData.name}</h2>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <p>Weather: {weatherData.weather[0].main}</p>
        </div>
      )}
    </div>
  );
}

export default App;
