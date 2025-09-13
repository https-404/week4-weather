import { WeatherService } from '../services/weather.service.js';
import { StorageService } from '../services/storage.service.js';
import { WeatherRenderer } from '../ui/weather-renderer.js';
import { UIController } from '../ui/ui-controller.js';
import { CachedWeatherData, UserPreferences } from '../types/weather.types.js';
import { Formatters } from '../utils/formatters.js';

// Weather App Class with Proper State Management
export class WeatherApp {
  private weatherService: WeatherService;
  private storageService: StorageService;
  private weatherRenderer: WeatherRenderer;
  private uiController: UIController;
  private preferences: UserPreferences;

  constructor() {
    this.weatherService = new WeatherService();
    this.storageService = new StorageService();
    this.preferences = this.storageService.getPreferences();
    this.weatherRenderer = new WeatherRenderer(this.preferences);
    this.uiController = new UIController();

    this.setupEventListeners();
    this.uiController.applyPreferences(this.preferences);
    this.loadLastCity();
  }

  private setupEventListeners(): void {
    this.uiController.setupEventListeners(
      () => this.handleSearch(),
      () => this.handleLocationSearch(),
      () => this.toggleTheme(),
      () => this.toggleUnit()
    );
  }

  private async loadLastCity(): Promise<void> {
    if (this.preferences.lastCity) {
      this.uiController.setSearchInput(this.preferences.lastCity);
      await this.searchWeather(this.preferences.lastCity);
    }
  }

  private async handleSearch(): Promise<void> {
    const city = this.uiController.getSearchInput();
    if (city) {
      await this.searchWeather(city);
    }
  }

  private async handleLocationSearch(): Promise<void> {
    if (!navigator.geolocation) {
      this.uiController.setErrorState('Geolocation is not supported by this browser.');
      return;
    }

    this.uiController.setLoadingState('Getting your location...');

    const options = {
      enableHighAccuracy: true,
      timeout: 15000, // Increased timeout
      maximumAge: 0 // Don't use cached location
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude, accuracy } = position.coords;
          
          // Log the coordinates for debugging
          console.log('Your exact location coordinates:', { 
            latitude: latitude.toFixed(6), 
            longitude: longitude.toFixed(6), 
            accuracy: accuracy + ' meters' 
          });
          
          // Check if accuracy is reasonable
          if (accuracy > 1000) {
            console.warn('⚠️ Location accuracy is low:', accuracy, 'meters - this may cause wrong city detection');
          } else {
            console.log('✅ Location accuracy is good:', accuracy, 'meters');
          }
          
          // Get weather data and also try to get a better city name
          const data = await this.weatherService.getCompleteWeatherDataByCoordinates(latitude, longitude);
          
          // Try to get a more accurate city name using reverse geocoding
          const betterCityName = await this.weatherService.getBetterCityName(latitude, longitude);
          if (betterCityName && betterCityName !== data.city) {
            console.log('📍 OpenWeather says:', data.city, '| Better city name:', betterCityName);
            data.city = betterCityName;
            data.current.name = betterCityName;
          }
          
          await this.handleSuccessfulWeatherData(data);
        } catch (error) {
          this.uiController.setErrorState(Formatters.getErrorMessage(error));
        }
      },
      (error) => {
        let message = 'Unable to retrieve your location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location access denied. Please allow location access in your browser settings and try again.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information is unavailable. Please check your device location settings.';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out. Please try again.';
            break;
        }
        this.uiController.setErrorState(message);
      },
      options
    );
  }

  private async searchWeather(city: string): Promise<void> {
    this.uiController.setLoadingState('Fetching weather data...');

    try {
      // Check cache first
      const cached = this.storageService.getCachedWeather();
      if (cached && cached.city.toLowerCase() === city.toLowerCase()) {
        await this.handleSuccessfulWeatherData(cached);
        return;
      }

      // Fetch new data
      const data = await this.weatherService.getCompleteWeatherData(city);
      this.storageService.saveCachedWeather(data);
      
      // Save last city
      this.preferences.lastCity = city;
      this.storageService.savePreferences(this.preferences);
      
      await this.handleSuccessfulWeatherData(data);
    } catch (error) {
      // Try to show cached data if available
      const cached = this.storageService.getCachedWeather();
      if (cached) {
        await this.handleSuccessfulWeatherData(cached);
        // Note: Could show offline indicator here if needed
      } else {
        this.uiController.setErrorState(Formatters.getErrorMessage(error));
      }
    }
  }

  private async handleSuccessfulWeatherData(data: CachedWeatherData): Promise<void> {
    // Render the weather data first
    this.weatherRenderer.renderWeather(data);
    
    // Small delay to ensure smooth transition
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Then set success state (which will hide loading)
    this.uiController.setSuccessState();
  }

  private toggleTheme(): void {
    this.preferences.theme = this.preferences.theme === 'light' ? 'dark' : 'light';
    this.storageService.savePreferences(this.preferences);
    this.uiController.applyPreferences(this.preferences);
  }

  private toggleUnit(): void {
    this.preferences.unit = this.preferences.unit === 'celsius' ? 'fahrenheit' : 'celsius';
    this.storageService.savePreferences(this.preferences);
    this.uiController.applyPreferences(this.preferences);

    // Re-render current weather with new unit
    const cached = this.storageService.getCachedWeather();
    if (cached) {
      this.weatherRenderer.updatePreferences(this.preferences);
      this.weatherRenderer.renderWeather(cached);
    }
  }
}
