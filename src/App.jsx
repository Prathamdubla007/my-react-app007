 
import { useState } from "react";
import axios from "axios";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import video from "./video.mp4";

function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ HARD-CODED WeatherAPI key (as requested)
  const API_KEY = "c671dcf401244e12a3593123252412";

  /* ================= Fetch Weather ================= */
  const fetchWeather = async (city) => {
    if (!city) return;

    setLoading(true);
    setError("");

    try {
      const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(
        city
      )}&aqi=no`;

      const response = await axios.get(url);
      console.log("Weather API response:", response.data); 
      setWeather(response.data);
    } catch (err) {
      console.error(err);

      if (err.response?.status === 400 || err.response?.status === 404) {
        setError("City not found. Please try again.");
      } else if (err.response?.status === 401) {
        setError("Unauthorized: Invalid API key.");
      } else {
        setError("Something went wrong. Please try again later.");
      }

      setWeather(null);
    } finally {
      setLoading(false);
    }
  };


  const fetchWeatherByCoords = async (lat, lon) => {
  console.log("Fetching weather for coordinates:", lat, lon);

  setLoading(true);
  setError("");

  try {
    const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lon}&aqi=no`;

    console.log("Coords API URL:", url);

    const response = await axios.get(url);
    console.log("Coords Weather Response:", response.data);

    setWeather(response.data);
  } catch (err) {
    console.error("Location weather error:", err);
    setError("Unable to fetch weather for your location.");
    setWeather(null);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-100 relative overflow-hidden">
      {/* Background video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
      >
        <source src={video} type="video/mp4" />
      </video>

      <div className="absolute top-0 left-0 w-full h-full bg-black/20 z-1"></div>

      <div className="bg-black/70 text-white rounded-lg shadow-lg p-8 max-w-md w-full z-10">
        <h1 className="text-3xl font-bold text-center mb-6">
          Weather App
        </h1>

        {/* Search */}
        <SearchBar fetchWeather={fetchWeather}  fetchWeatherByCoords={fetchWeatherByCoords} loading={loading} />

        {/* States */}
        {loading && <p className="text-center mt-4">Loading...</p>}
        {error && <p className="text-red-400 text-center mt-4">{error}</p>}
        {weather && <WeatherCard weather={weather} />}
      </div>
    </div>
  );
}

export default App;
