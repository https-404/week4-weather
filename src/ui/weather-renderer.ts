import { CachedWeatherData, ForecastData } from '../types/weather.types.js';
import { Formatters } from '../utils/formatters.js';

// Weather UI Renderer Class
export class WeatherRenderer {
  private preferences: { unit: 'celsius' | 'fahrenheit' };

  constructor(preferences: { unit: 'celsius' | 'fahrenheit' }) {
    this.preferences = preferences;
  }

  renderWeather(data: CachedWeatherData): void {
    console.log('🎨 Rendering weather data for:', data.city);
    const { current, forecast } = data;
    const isCelsius = this.preferences.unit === 'celsius';

    // Clear any existing coordinate info
    const existingCoordInfo = document.querySelector('.coord-debug');
    if (existingCoordInfo) {
      existingCoordInfo.remove();
    }

    // Update city and date
    document.getElementById('cityName')!.textContent = current.name;
    document.getElementById('currentDate')!.textContent = Formatters.formatDate(current.dt);

    // Add coordinates info for debugging (temporary)
    if (current.coord) {
      console.log('City coordinates:', current.coord);
      // Show coordinates in the UI temporarily for debugging
      const coordInfo = document.createElement('div');
      coordInfo.className = 'coord-debug text-white opacity-70 text-xs mt-2';
      coordInfo.innerHTML = `📍 Coordinates: ${current.coord.lat.toFixed(6)}, ${current.coord.lon.toFixed(6)}`;
      const cityElement = document.getElementById('cityName')!;
      cityElement.parentNode?.insertBefore(coordInfo, cityElement.nextSibling);

      // Add a link to verify location on Google Maps
      const mapLink = document.createElement('div');
      mapLink.className = 'coord-debug text-blue-300 text-xs mt-1';
      mapLink.innerHTML = `<a href="https://www.google.com/maps?q=${current.coord.lat},${current.coord.lon}" target="_blank" class="underline">🗺️ Verify on Google Maps</a>`;
      cityElement.parentNode?.insertBefore(mapLink, cityElement.nextSibling);
    }

    // Update current temperature
    const temp = Formatters.convertTemperature(current.main.temp, isCelsius);
    document.getElementById('currentTemp')!.textContent = `${Math.round(temp)}°${isCelsius ? 'C' : 'F'}`;

    // Update weather icon
    const weatherIcon = document.getElementById('weatherIcon')!;
    weatherIcon.className = `fas ${Formatters.getWeatherIcon(current.weather[0].icon)} text-6xl`;

    // Update weather details
    const feelsLike = Formatters.convertTemperature(current.main.feels_like, isCelsius);
    document.getElementById('feelsLike')!.textContent = `${Math.round(feelsLike)}°${isCelsius ? 'C' : 'F'}`;
    document.getElementById('humidity')!.textContent = `${current.main.humidity}%`;
    document.getElementById('windSpeed')!.textContent = `${current.wind.speed} km/h`;
    document.getElementById('pressure')!.textContent = `${current.main.pressure} hPa`;

    // Update forecast
    this.renderForecast(forecast, isCelsius);

    // Update last updated time
    document.getElementById('lastUpdated')!.textContent = Formatters.formatTime(data.timestamp);
  }

  renderForecast(forecast: ForecastData, isCelsius: boolean): void {
    const container = document.getElementById('forecastContainer')!;
    container.innerHTML = '';

    // Group forecasts by day and get daily summaries
    const dailyForecasts = Formatters.getDailyForecasts(forecast.list);

    dailyForecasts.forEach((day) => {
      const dayElement = document.createElement('div');
      dayElement.className = 'forecast-item bg-white bg-opacity-20 p-4 rounded-xl text-center';

      const temp = Formatters.convertTemperature(day.temp, isCelsius);
      const dayName = Formatters.formatDay(day.dt);

      dayElement.innerHTML = `
        <p class="text-white font-semibold mb-2">${dayName}</p>
        <i class="fas ${Formatters.getWeatherIcon(day.icon)} text-2xl text-white mb-2"></i>
        <p class="text-white text-lg font-bold">${Math.round(temp)}°${isCelsius ? 'C' : 'F'}</p>
        <p class="text-white opacity-80 text-sm">${day.description}</p>
      `;

      container.appendChild(dayElement);
    });
  }

  updatePreferences(preferences: { unit: 'celsius' | 'fahrenheit' }): void {
    this.preferences = preferences;
  }
}
