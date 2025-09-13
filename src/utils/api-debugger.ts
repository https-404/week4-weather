// API Debugger utility for testing OpenWeather API responses
import { WeatherService } from '../services/weather.service.js';

export class ApiDebugger {
  private weatherService: WeatherService;

  constructor() {
    this.weatherService = new WeatherService();
  }

  async testForecastAPI(city: string = 'London'): Promise<void> {
    console.log(`🧪 Testing Forecast API for: ${city}`);
    
    try {
      const data = await this.weatherService.getForecast(city);
      console.log('✅ Forecast API Test Passed');
      console.log('📊 Forecast Data Summary:', {
        cityName: data.city.name,
        country: data.city.country,
        totalForecasts: data.list.length,
        firstForecast: {
          date: data.list[0].dt_txt,
          temperature: data.list[0].main.temp,
          weather: data.list[0].weather[0].description,
          icon: data.list[0].weather[0].icon
        },
        lastForecast: {
          date: data.list[data.list.length - 1].dt_txt,
          temperature: data.list[data.list.length - 1].main.temp,
          weather: data.list[data.list.length - 1].weather[0].description
        }
      });
    } catch (error) {
      console.error('❌ Forecast API Test Failed:', error);
    }
  }

  async testCurrentWeatherAPI(city: string = 'London'): Promise<void> {
    console.log(`🧪 Testing Current Weather API for: ${city}`);
    
    try {
      const data = await this.weatherService.getCurrentWeather(city);
      console.log('✅ Current Weather API Test Passed');
      console.log('📊 Current Weather Data Summary:', {
        cityName: data.name,
        country: data.sys.country,
        temperature: data.main.temp,
        weather: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed
      });
    } catch (error) {
      console.error('❌ Current Weather API Test Failed:', error);
    }
  }

  async runAllTests(): Promise<void> {
    console.log('🚀 Starting API Tests...');
    console.log('=' .repeat(50));
    
    await this.testCurrentWeatherAPI('London');
    console.log('-'.repeat(30));
    await this.testForecastAPI('London');
    console.log('-'.repeat(30));
    await this.testCurrentWeatherAPI('New York');
    console.log('-'.repeat(30));
    await this.testForecastAPI('New York');
    
    console.log('=' .repeat(50));
    console.log('🏁 API Tests Complete');
  }
}

// Make it available globally for console testing
declare global {
  interface Window {
    apiDebugger: ApiDebugger;
  }
}

// Auto-initialize when imported
if (typeof window !== 'undefined') {
  window.apiDebugger = new ApiDebugger();
  console.log('🔧 API Debugger available as window.apiDebugger');
  console.log('💡 Try: window.apiDebugger.runAllTests()');
}
