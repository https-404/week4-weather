import { WeatherApp } from './app/weather-app.js';
import './utils/api-debugger.js'; // Import debugger for development

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new WeatherApp();
});
