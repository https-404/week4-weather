import { createSearchElement } from "./components/SearchComponent.js";
import { createWeatherElement } from "./components/WeatherComponent.js";
import {
  OPENWEATHER_API_KEY,
  OPENWEATHER_GEOCODE_URL,
  DEFAULT_UNIT,
  type Unit,
} from "./config.js";

const app = document.getElementById("app")!;
app.className =
  "min-h-screen flex items-center justify-center p-6 transition-colors duration-500 " +
  "bg-blue-500 dark:bg-gray-900";
      

const wrapper = document.createElement("div");
wrapper.className = "flex flex-col items-center w-full max-w-3xl";
app.appendChild(wrapper);

const searchContainer = document.createElement("div");
searchContainer.className = "w-full";
wrapper.appendChild(searchContainer);

const weatherContainer = document.createElement("div");
weatherContainer.className = "w-full mt-6 hidden";
wrapper.appendChild(weatherContainer);

const search = createSearchElement(localStorage.getItem("lastCity") || "");
searchContainer.appendChild(search.element);

const weather = createWeatherElement();
weatherContainer.appendChild(weather.element);

let currentUnit: Unit =
  (localStorage.getItem("unit") as Unit) || DEFAULT_UNIT;
let currentCity: string = localStorage.getItem("lastCity") || "";

search.setUnit(currentUnit);

async function fetchCoordinates(city: string) {
  const url = `${OPENWEATHER_GEOCODE_URL}?q=${encodeURIComponent(
    city
  )}&limit=1&appid=${OPENWEATHER_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch coordinates");
  const data = await res.json();
  if (!data.length) throw new Error("City not found");
  return {
    lat: data[0].lat,
    lon: data[0].lon,
    name: data[0].name,
    country: data[0].country,
  };
}

async function fetchWeatherForecast(lat: number, lon: number, unit: Unit) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${OPENWEATHER_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch weather forecast");
  const data = await res.json();

  const dailyData = data.list.filter((_: any, i: number) => i % 8 === 0);
  return { ...data, daily: dailyData };
}

function getWeekdayFromTimestamp(dt: number) {
  const date = new Date(dt * 1000);
  return date.toLocaleDateString(undefined, { weekday: "short" });
}

function transformForecastToOneCall(
  forecastData: any,
  cityName: string,
  country: string
) {
  if (!forecastData.daily || forecastData.daily.length === 0) {
    throw new Error("No daily data available");
  }

  const currentItem = forecastData.list[0];

  const current = {
    dt: currentItem.dt,
    temp: currentItem.main.temp,
    feels_like: currentItem.main.feels_like,
    humidity: currentItem.main.humidity,
    wind_speed: currentItem.wind.speed,
    weather: [
      {
        id: currentItem.weather[0].id,
        main: currentItem.weather[0].main,
        description: currentItem.weather[0].description,
        icon: currentItem.weather[0].icon,
      },
    ],
    location: `${cityName}, ${country}`,
  };

  const daily = forecastData.daily.map((item: any, index: number) => ({
    dt: item.dt,
    weekday: index === 0 ? "Today" : getWeekdayFromTimestamp(item.dt),
    temp: {
      day: item.main.temp,
      min: item.main.temp_min,
      max: item.main.temp_max,
    },
    weather: [
      {
        id: item.weather[0].id,
        main: item.weather[0].main,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
      },
    ],
  }));

  const lat = forecastData.city.coord.lat;
  const lon = forecastData.city.coord.lon;
  const timezone = forecastData.city.timezone || "UTC";

  return { current, daily, lat, lon, timezone };
}

function setDynamicBackground(weatherMain: string) {
 const backgrounds: Record<string, string> = {
  Clear: "bg-yellow-400",
  Clouds: "bg-gray-500",
  Rain: "bg-blue-800",
  Thunderstorm: "bg-purple-800",
  Snow: "bg-blue-200",
  Mist: "bg-gray-400",
};

  const app = document.getElementById("app")!;
  const baseClasses =
    "min-h-screen flex items-center justify-center p-6 transition-colors duration-700";
  app.className = `${baseClasses} ${backgrounds[weatherMain] || backgrounds["Clear"]}`;
}


async function loadWeather(city: string, unit: Unit) {
  try {
    weatherContainer.classList.remove("hidden");
    weather.setLoading();

    const { lat, lon, name, country } = await fetchCoordinates(city);
    const forecastData = await fetchWeatherForecast(lat, lon, unit);
    const transformedData = transformForecastToOneCall(
      forecastData,
      name,
      country
    );
    weather.setData(transformedData, unit === "metric" ? "°C" : "°F");
    
    localStorage.setItem("lastCity", city);
    localStorage.setItem("unit", unit);
    currentCity = city;
    currentUnit = unit;
  } catch (err: any) {
    weather.setError(err?.message ?? "Unknown error");
  }
}

search.onSearch((city, unit) => {
  if (!city) {
    search.setMessage("Please enter a city name.");
    return;
  }
  search.setMessage("");
  loadWeather(city, unit);
});

search.onUnitChange((unit) => {
  currentUnit = unit;
  localStorage.setItem("unit", unit);
  if (currentCity) loadWeather(currentCity, unit);
});

search.onThemeToggle(() => {
  document.documentElement.classList.toggle("dark");
  const isDark = document.documentElement.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

if (localStorage.getItem("theme") === "dark") {
  document.documentElement.classList.add("dark");
}