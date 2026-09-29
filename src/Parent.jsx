// In your main App or WeatherApp component:
const App = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("");

  // const fetchWeather = async (city) => {
  //   setLoading(true);
  //   try {
  //     // Your weather API call
  //     const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=c671dcf401244e12a3593123252412&q=${currentLocation}`);
  //     const data = await response.json();
  //     setWeather(data);
  //     setCurrentLocation(`${data.name}, ${data.sys.country}`);
  //   } catch (error) {
  //     console.error("Error fetching weather:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const fetchWeather = async (city) => {
  setLoading(true);
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=API_KEY&q=${encodeURIComponent(city)}&aqi=no`
    );
    const data = await response.json();
    setWeather(data);
    setCurrentLocation(`${data.location.name}, ${data.location.country}`);
  } catch (error) {
    console.error("Error fetching weather:", error);
  } finally {
    setLoading(false);
  }
};

  const handleCurrentLocation = async (lat, lon) => {
    // Fetch weather by coordinates
  };

  return (
    <div>
      <SearchBar 
        fetchWeather={fetchWeather}
        currentLocation={currentLocation}
        loading={loading}
        onUseCurrentLocation={handleCurrentLocation}
      />
      {/* Your WeatherCard component */}
    </div>
  );
};