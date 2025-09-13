interface WeatherResponse {
  name: string;
  coord: { lat: number; lon: number };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: { description: string; icon: string }[];
}

interface ForecastItem {
  dt: number;
  main: { temp: number };
  weather: { icon: string; description: string }[];
  dt_txt: string;
}

interface ForecastResponse {
  list: ForecastItem[];
}

const API_KEY = "611f6b44d46c24ad622706398d8d63fe";
let isCelsius = true;

const cityInput = document.getElementById("city") as HTMLInputElement;
const tempDiv = document.getElementById("temp-div")!;
const weatherInfo = document.getElementById("weather-info")!;
const weatherIcon = document.getElementById("weather-icon") as HTMLImageElement;
const loading = document.getElementById("loading")!;
const errorMessage = document.getElementById("error-message")!;
const dailyForecast = document.getElementById("daily-forecast")!;
const unitChange = document.getElementById("unit-toggle")!;
const themeChange = document.getElementById("theme-toggle")!;
const appBody = document.getElementById("app-body")!;

async function getWeather() {
  const city = cityInput.value.trim();
  if (!city) {
    return;
  }

  loading.classList.remove("hidden");
  errorMessage.classList.add("hidden");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    if (!response.ok) {
        throw new Error("City not found");
    }
    const data: WeatherResponse = await response.json();

    showWeather(data);

    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );
    const forecastData: ForecastResponse = await forecastResponse.json();

    showForecast(forecastData);

  } catch (err: unknown) {
      errorMessage.textContent = "Something went wrong";
  } 
}

function cToF(c: number): number {
  return (c * 9) / 5 + 32;
}

function showWeather(data: WeatherResponse) {
  if (!isCelsius) {
    data.main.temp = cToF(data.main.temp);
  }

  weatherInfo.textContent = `${data.weather[0].description}, Humidity: ${data.main.humidity}%`;

  weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
  weatherIcon.classList.remove("hidden");
}

function showForecast(forecastData: ForecastResponse) {
  dailyForecast.innerHTML = "";

  const daily: ForecastItem[] = [];
  const grouped: Record<string, ForecastItem[]> = {};

  forecastData.list.forEach((item: ForecastItem) => {
    const date = item.dt_txt.split(" ")[0];
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(item);
  });

  Object.values(grouped).forEach((items: ForecastItem[]) => {
    const noonData =
      items.find((i: ForecastItem) => i.dt_txt.includes("12:00:00")) || items[0];
    daily.push(noonData);
  });

  daily.slice(0, 5).forEach((day: ForecastItem) => {
    const temp = isCelsius ? day.main.temp : cToF(day.main.temp);
    const date = new Date(day.dt * 1000).toLocaleDateString("en-US", {
      weekday: "short",
    });

    const div = document.createElement("div");
    div.className =
      "bg-white/20 p-3 rounded-lg flex flex-col items-center text-center";

    div.innerHTML = `
      <p>${date}</p>
      <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="icon" />
      <p>${Math.round(temp)}°${isCelsius ? "C" : "F"}</p>
    `;
    dailyForecast.appendChild(div);
  });
}

unitChange.addEventListener("click", () => {
  isCelsius = !isCelsius;
  unitChange.textContent = isCelsius ? "Switch to °F" : "Switch to °C";
  getWeather();
});

themeChange.addEventListener("click", () => {
  if (appBody.classList.contains("bg-purple-600")) {
    appBody.classList.remove("bg-purple-600");
    appBody.classList.add("bg-gray-900");
  } else {
    appBody.classList.remove("bg-gray-900");
    appBody.classList.add("bg-purple-600");
  }
});

(window as any).getWeather = getWeather;
