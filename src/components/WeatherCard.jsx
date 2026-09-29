import React from "react";

const WeatherCard = ({ weather }) => {
  if (!weather) return null;

  const { location, current } = weather;

  /* ================= Color Logic ================= */
  const temp = current.temp_c;
  const isDay = current.is_day === 1;

  const getTheme = () => {
    if (temp <= 15) return "blue";
    if (temp <= 28) return "teal";
    return "orange";
  };

  const theme = getTheme();

  const themeStyles = {
    blue: {
      card: "bg-blue-50/80",
      accent: "text-blue-600",
      stat: "bg-blue-100",
    },
    teal: {
      card: "bg-teal-50/80",
      accent: "text-teal-600",
      stat: "bg-teal-100",
    },
    orange: {
      card: "bg-orange-50/80",
      accent: "text-orange-600",
      stat: "bg-orange-100",
    },
  };

  const styles = themeStyles[theme];

  return (
    <div
      className={`mt-6 backdrop-blur rounded-2xl shadow-xl p-6 ${styles.card} ${
        !isDay && "opacity-95"
      }`}
    >
      {/* ================= Header ================= */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          {location.name}, {location.country}
        </h2>
        <p className="text-sm text-gray-500">
          {location.region} • {location.tz_id}
        </p>
      </div>

      {/* ================= Main Weather ================= */}
      <div className="flex items-center justify-center gap-6 mb-8">
        <img
          src={`https:${current.condition.icon}`}
          alt={current.condition.text}
          className="w-20 h-20"
        />

        <div>
          <p className={`text-5xl font-bold ${styles.accent}`}>
            {Math.round(temp)}°
          </p>
          <p className="text-gray-600 capitalize">
            {current.condition.text}
          </p>
        </div>
      </div>

      {/* ================= Key Stats ================= */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Stat
          label="Feels Like"
          value={`${Math.round(current.feelslike_c)}°`}
          className={styles.stat}
        />
        <Stat
          label="Humidity"
          value={`${current.humidity}%`}
          className={styles.stat}
        />
      </div>

      {/* ================= Divider ================= */}
      <div className="border-t border-gray-200 my-6"></div>

      {/* ================= Details ================= */}
      <div className="grid grid-cols-2 gap-y-4 text-sm text-gray-700">
        <Detail label="Wind" value={`${current.wind_kph} km/h`} />
        <Detail label="Pressure" value={`${current.pressure_mb} mb`} />
        <Detail label="Visibility" value={`${current.vis_km} km`} />
        <Detail label="Cloudiness" value={`${current.cloud}%`} />
      </div>

      {/* ================= Footer ================= */}
      <p className="mt-6 text-xs text-center text-gray-400">
        Last updated: {current.last_updated}
      </p>
    </div>
  );
};

/* ================= Reusable Components ================= */

const Stat = ({ label, value, className }) => (
  <div className={`rounded-xl p-4 text-center ${className}`}>
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <p className="text-xl font-semibold text-gray-800">{value}</p>
  </div>
);

const Detail = ({ label, value }) => (
  <div className="flex justify-between px-1">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default WeatherCard;
