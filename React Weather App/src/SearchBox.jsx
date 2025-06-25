import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import "./SearchBox.css"

export default function SearchBox({ updateInfo }) {
  const [city, setCity] = useState("");
  const [error, setError] = useState(false);

  const API_URL = "http://api.openweathermap.org/geo/1.0/direct";
  const API_KEY = "af5c49e3c9aa1a7434cbdb07b1cc5016";

  const handleChange = (event) => {
    setCity(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(false); // Clear previous error

    try {
      const newInfo = await getWeather(city);
      updateInfo(newInfo);
      setCity(""); // Clear input after successful fetch
    } catch (err) {
      console.error("Error fetching weather:", err);
      setError(true);
    }
  };

  const getWeather = async (cityName) => {
    const response = await fetch(`${API_URL}?q=${cityName}&appid=${API_KEY}`);
    const result = await response.json();

    if (!result.length) {
      throw new Error("City not found");
    }

    const { lat, lon } = result[0];
    return await getWeatherInfo(cityName, lat, lon);
  };

  const getWeatherInfo = async (cityName, lat, lon) => {
    const API_URL1 = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const response = await fetch(API_URL1);
    const responseJson = await response.json();

    return {
      city: cityName,
      temp: responseJson.main.temp,
      feelsLike: responseJson.main.feels_like,
      tempMin: responseJson.main.temp_min,
      tempMax: responseJson.main.temp_max,
      humidity: responseJson.main.humidity,
      weather: responseJson.weather[0].description,
    };
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h3>Search for the Weather</h3>
        <TextField
          id="outlined-search"
          label="Search field"
          type="search"
          required
          value={city}
          onChange={handleChange}
          color="success"
        />
        <br /><br />
        <Button variant="contained" type="submit">Search</Button>
        {error && <p style={{ color: "red" }}>No Such Place Exists!</p>}
      </form>
    </div>
  );
}
