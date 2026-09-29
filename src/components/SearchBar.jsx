import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, Navigation, X } from "lucide-react";

const API_KEY = "c671dcf401244e12a3593123252412";

const SearchBar = ({ fetchWeather, currentLocation, loading, onUseCurrentLocation, fetchWeatherByCoords, }) => {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isGeolocating, setIsGeolocating] = useState(false);

  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  /* ---------------- Load search history ---------------- */
  useEffect(() => {
    const savedHistory = localStorage.getItem("weatherSearchHistory");
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch {}
    }
  }, []);

  /* ---------------- Save search history ---------------- */
  useEffect(() => {
    if (searchHistory.length > 0) {
      localStorage.setItem(
        "weatherSearchHistory",
        JSON.stringify(searchHistory.slice(0, 5))
      );
    }
  }, [searchHistory]);

  /* ---------------- Outside click ---------------- */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- Correct Suggestions API ---------------- */
  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await fetch(
        `http://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${encodeURIComponent(query)}`
      );
      if (!response.ok) throw new Error("Failed");
      const data = await response.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Suggestion error:", error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  /* ---------------- Proper debounce ---------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestions(city);
    }, 300);

    return () => clearTimeout(timer);
  }, [city]);

  /* ---------------- Input ---------------- */
  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  /* ---------------- Submit ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;

    await fetchWeather(city);

    if (!searchHistory.includes(city.trim())) {
      setSearchHistory((prev) => [city.trim(), ...prev]);
    }

    setShowSuggestions(false);
  };

  /* ---------------- Suggestion click ---------------- */
  const handleSuggestionClick = async (suggestion) => {
    const locationName = `${suggestion.name}${suggestion.region ? `, ${suggestion.region}` : ""}, ${suggestion.country}`;
    setCity(locationName);

    await fetchWeather(locationName);

    if (!searchHistory.includes(locationName)) {
      setSearchHistory((prev) => [locationName, ...prev]);
    }

    setShowSuggestions(false);
  };

  /* ---------------- Current location ---------------- */
  // const handleCurrentLocation = () => {
  //   if (!navigator.geolocation) {
  //     alert("Geolocation not supported");
  //     return;
  //   }

  //   setIsGeolocating(true);
  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       onUseCurrentLocation(position.coords.latitude, position.coords.longitude);
  //       setIsGeolocating(false);
  //     },
  //     () => {
  //       alert("Unable to retrieve your location");
  //       setIsGeolocating(false);
  //     }
  //   );
  // };
const handleCurrentLocation = () => {
  if (!navigator.geolocation) {
    alert("Geolocation not supported by your browser");
    return;
  }

  console.log("Requesting current location...");

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      console.log("User coordinates:", latitude, longitude);

      fetchWeatherByCoords(latitude, longitude);
      setShowSuggestions(false);
    },
    (error) => {
      console.error("Geolocation error:", error);
      alert("Unable to retrieve your location");
    }
  );
};
  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("weatherSearchHistory");
  };

  const removeHistoryItem = (index) => {
    setSearchHistory((prev) => prev.filter((_, i) => i !== index));
  };

  /* ================= UI (UNCHANGED) ================= */
  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={searchRef}>
      <form
        className="flex items-center bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:border-blue-400 transition-colors"
        onSubmit={handleSubmit}
      >
        <div className="pl-4 text-gray-400">
          <Search size={20} />
        </div>

        <input
          type="text"
          placeholder="Search for a city, state, or country..."
          value={city}
          onChange={handleInputChange}
          className="flex-1 p-4 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
          onFocus={() => city.length >= 2 && setShowSuggestions(true)}
          disabled={loading}
        />

        {city && (
          <button
            type="button"
            onClick={() => {
              setCity("");
              setSuggestions([]);
              setShowSuggestions(false);
            }}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X size={20} />
          </button>
        )}

        <div className="flex">
          <button
            type="button"
            onClick={handleCurrentLocation}
            disabled={loading || isGeolocating}
            className="px-4 py-4 text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isGeolocating ? "..." : <Navigation size={20} />}
            <span className="hidden sm:inline text-sm font-medium">Current</span>
          </button>

          <button
            type="submit"
            disabled={loading || !city.trim()}
            className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Search size={20} />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>
      </form>

      {/* Suggestions Dropdown – UI unchanged */}
      {showSuggestions && (suggestions.length > 0 || searchHistory.length > 0) && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
        >
          {suggestions.length > 0 && (
            <div className="p-2">
              <h3 className="text-sm font-medium text-gray-500 px-3 py-2">
                Suggestions
              </h3>
              {suggestions.map((s, i) => (
                <button
                  key={`${s.name}-${i}`}
                  onClick={() => handleSuggestionClick(s)}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50"
                >
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-3 text-blue-500" />
                    <div>
                      <div className="font-medium text-gray-800">
                        {s.name}
                        {s.region && <span>, {s.region}</span>}
                      </div>
                      <div className="text-sm text-gray-500">
                        {s.country}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
