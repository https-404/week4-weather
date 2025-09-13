import { 
  WeatherData, 
  ForecastData, 
  CachedWeatherData 
} from '../types/weather.types.js';
import { TypeGuards } from '../utils/type-guards.js';
import { DataTransformer } from '../utils/data-transformer.js';

// Weather Service Class
export class WeatherService {
  private readonly API_KEY = this.getApiKey();
  private readonly BASE_URL = 'https://api.openweathermap.org/data/2.5';

  private getApiKey(): string {
    const apiKey = '29626b3b0e752f4fa55a469b80a0dad5'; // Your OpenWeather API key
    return apiKey;
  }

  async getCurrentWeather(city: string): Promise<WeatherData> {
    const url = `${this.BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${this.API_KEY}&units=metric`;
    
    try {
      const response = await fetch(url);
      console.log(response)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (TypeGuards.isApiError(errorData)) {
          throw new Error(errorData.message);
        }
        
        switch (response.status) {
          case 404:
            throw new Error('City not found. Please check the spelling and try again.');
          case 401:
            throw new Error('Invalid API key. Please check your configuration.');
          case 429:
            throw new Error('API rate limit exceeded. Please try again later.');
          default:
            throw new Error(`Weather service error: ${response.status}`);
        }
      }
      
      const data = await response.json();
      
      if (!TypeGuards.isWeatherData(data)) {
        throw new Error('Invalid weather data received from API');
      }
      
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch weather data');
    }
  }

  async getForecast(city: string): Promise<ForecastData> {
    const url = `${this.BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${this.API_KEY}&units=metric`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (TypeGuards.isApiError(errorData)) {
          throw new Error(errorData.message);
        }
        
        switch (response.status) {
          case 404:
            throw new Error('City not found for forecast. Please check the spelling and try again.');
          case 401:
            throw new Error('Invalid API key for forecast. Please check your configuration.');
          case 429:
            throw new Error('API rate limit exceeded. Please try again later.');
          default:
            throw new Error(`Forecast service error: ${response.status}`);
        }
      }
      
      const data = await response.json();
      
      // Log the response for debugging
      console.log('Forecast API Response:', {
        status: response.status,
        hasData: !!data,
        dataKeys: data ? Object.keys(data) : [],
        listLength: data?.list?.length,
        cityName: data?.city?.name,
        firstItem: data?.list?.[0] ? {
          dt: data.list[0].dt,
          dt_txt: data.list[0].dt_txt,
          hasMain: !!data.list[0].main,
          hasWeather: !!data.list[0].weather,
          weatherLength: data.list[0].weather?.length
        } : null
      });
      
      // Try to validate the data
      if (!TypeGuards.isForecastData(data)) {
        console.warn('⚠️ Forecast data failed validation, attempting to normalize...');
        
        // Try to normalize the data
        const normalizedData = DataTransformer.normalizeForecastData(data);
        if (normalizedData) {
          console.log('✅ Forecast data normalized successfully');
          return normalizedData;
        }
        
        console.error('❌ Failed to normalize forecast data:', data);
        throw new Error('Invalid forecast data received from API. Check console for details.');
      }
      
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch forecast data');
    }
  }

  async getWeatherByCoordinates(lat: number, lon: number): Promise<WeatherData> {
    const url = `${this.BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=metric`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (TypeGuards.isApiError(errorData)) {
          throw new Error(errorData.message);
        }
        
        switch (response.status) {
          case 404:
            throw new Error('Location not found. Please try again.');
          case 401:
            throw new Error('Invalid API key for location weather. Please check your configuration.');
          case 429:
            throw new Error('API rate limit exceeded. Please try again later.');
          default:
            throw new Error(`Weather service error: ${response.status}`);
        }
      }
      
      const data = await response.json();
      
      if (!TypeGuards.isWeatherData(data)) {
        throw new Error('Invalid weather data received from API');
      }
      
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch weather data for coordinates');
    }
  }

  async getForecastByCoordinates(lat: number, lon: number): Promise<ForecastData> {
    const url = `${this.BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=metric`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (TypeGuards.isApiError(errorData)) {
          throw new Error(errorData.message);
        }
        
        switch (response.status) {
          case 404:
            throw new Error('Location not found for forecast. Please try again.');
          case 401:
            throw new Error('Invalid API key for location forecast. Please check your configuration.');
          case 429:
            throw new Error('API rate limit exceeded. Please try again later.');
          default:
            throw new Error(`Forecast service error: ${response.status}`);
        }
      }
      
      const data = await response.json();
      
      // Log the response for debugging
      console.log('Forecast by Coordinates API Response:', {
        status: response.status,
        coordinates: { lat, lon },
        hasData: !!data,
        dataKeys: data ? Object.keys(data) : [],
        listLength: data?.list?.length,
        cityName: data?.city?.name,
        firstItem: data?.list?.[0] ? {
          dt: data.list[0].dt,
          dt_txt: data.list[0].dt_txt,
          hasMain: !!data.list[0].main,
          hasWeather: !!data.list[0].weather,
          weatherLength: data.list[0].weather?.length
        } : null
      });
      
      // Try to validate the data
      if (!TypeGuards.isForecastData(data)) {
        console.warn('⚠️ Forecast data failed validation, attempting to normalize...');
        
        // Try to normalize the data
        const normalizedData = DataTransformer.normalizeForecastData(data);
        if (normalizedData) {
          console.log('✅ Forecast data normalized successfully');
          return normalizedData;
        }
        
        console.error('❌ Failed to normalize forecast data:', data);
        throw new Error('Invalid forecast data received from API. Check console for details.');
      }
      
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch forecast data for coordinates');
    }
  }

  async getCompleteWeatherData(city: string): Promise<CachedWeatherData> {
    try {
      const [current, forecast] = await Promise.all([
        this.getCurrentWeather(city),
        this.getForecast(city)
      ]);

      return {
        current,
        forecast,
        timestamp: Date.now(),
        city: current.name
      };
    } catch (error) {
      throw error;
    }
  }

  async getCompleteWeatherDataByCoordinates(lat: number, lon: number): Promise<CachedWeatherData> {
    try {
      const [current, forecast] = await Promise.all([
        this.getWeatherByCoordinates(lat, lon),
        this.getForecastByCoordinates(lat, lon)
      ]);

      return {
        current,
        forecast,
        timestamp: Date.now(),
        city: current.name
      };
    } catch (error) {
      throw error;
    }
  }

  async getBetterCityName(lat: number, lon: number): Promise<string | null> {
    try {
      // Use OpenWeather's reverse geocoding API for better city names
      const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${this.API_KEY}`;
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        
        if (TypeGuards.isReverseGeocodingArray(data)) {
          const location = data[0];
          // Try to get the most specific location name
          let cityName = location.name;
          if (location.state && location.state !== location.name) {
            cityName = `${location.name}, ${location.state}`;
          }
          if (location.country) {
            cityName = `${cityName}, ${location.country}`;
          }
          return cityName;
        }
      }
    } catch (error) {
      console.warn('Failed to get better city name:', error);
    }
    return null;
  }
}
