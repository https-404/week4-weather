// Data transformer to normalize API responses and handle variations
import { ForecastData, ForecastItem } from '../types/weather.types.js';

export class DataTransformer {
  static normalizeForecastData(apiResponse: any): ForecastData | null {
    try {
      console.log('🔄 Normalizing forecast data...');
      
      // If it's already in the correct format, return it
      if (this.isValidForecastStructure(apiResponse)) {
        console.log('✅ Data already in correct format');
        return apiResponse;
      }

      // Try to transform the data
      const normalized: ForecastData = {
        cod: apiResponse.cod || '200',
        message: apiResponse.message || 0,
        cnt: apiResponse.cnt || (apiResponse.list ? apiResponse.list.length : 0),
        list: [],
        city: {
          id: apiResponse.city?.id || 0,
          name: apiResponse.city?.name || 'Unknown City',
          coord: apiResponse.city?.coord || { lat: 0, lon: 0 },
          country: apiResponse.city?.country || '',
          population: apiResponse.city?.population || 0,
          timezone: apiResponse.city?.timezone || 0,
          sunrise: apiResponse.city?.sunrise || 0,
          sunset: apiResponse.city?.sunset || 0
        }
      };

      // Normalize forecast items
      if (Array.isArray(apiResponse.list)) {
        normalized.list = apiResponse.list.map((item: any) => this.normalizeForecastItem(item));
      }

      console.log('✅ Forecast data normalized successfully');
      return normalized;
    } catch (error) {
      console.error('❌ Failed to normalize forecast data:', error);
      return null;
    }
  }

  private static normalizeForecastItem(item: any): ForecastItem {
    return {
      dt: item.dt || 0,
      main: {
        temp: item.main?.temp || 0,
        feels_like: item.main?.feels_like || 0,
        temp_min: item.main?.temp_min || 0,
        temp_max: item.main?.temp_max || 0,
        pressure: item.main?.pressure || 0,
        humidity: item.main?.humidity || 0,
        sea_level: item.main?.sea_level,
        grnd_level: item.main?.grnd_level,
        temp_kf: item.main?.temp_kf
      },
      weather: Array.isArray(item.weather) ? item.weather.map((w: any) => ({
        id: w.id || 0,
        main: w.main || 'Unknown',
        description: w.description || 'No description',
        icon: w.icon || '01d'
      })) : [],
      clouds: {
        all: item.clouds?.all || 0
      },
      wind: {
        speed: item.wind?.speed || 0,
        deg: item.wind?.deg || 0,
        gust: item.wind?.gust
      },
      visibility: item.visibility || 0,
      pop: item.pop || 0,
      sys: {
        country: item.sys?.country || '',
        sunrise: item.sys?.sunrise || 0,
        sunset: item.sys?.sunset || 0,
        pod: item.sys?.pod || 'd'
      },
      dt_txt: item.dt_txt || new Date(item.dt * 1000).toISOString(),
      rain: item.rain,
      snow: item.snow
    };
  }

  private static isValidForecastStructure(obj: any): boolean {
    return (
      obj &&
      typeof obj === 'object' &&
      Array.isArray(obj.list) &&
      obj.list.length > 0 &&
      typeof obj.city === 'object' &&
      typeof obj.city.name === 'string' &&
      obj.list[0] &&
      typeof obj.list[0].dt === 'number' &&
      obj.list[0].main &&
      typeof obj.list[0].main.temp === 'number' &&
      Array.isArray(obj.list[0].weather) &&
      obj.list[0].weather.length > 0 &&
      typeof obj.list[0].weather[0].description === 'string'
    );
  }

  static createFallbackForecastData(cityName: string): ForecastData {
    console.log('🔄 Creating fallback forecast data for:', cityName);
    
    const now = Date.now() / 1000;
    const forecastItems: ForecastItem[] = [];
    
    // Create 5 days of forecast data
    for (let i = 0; i < 5; i++) {
      const timestamp = now + (i * 24 * 60 * 60);
      forecastItems.push({
        dt: timestamp,
        main: {
          temp: 20 + Math.random() * 10,
          feels_like: 20 + Math.random() * 10,
          temp_min: 15 + Math.random() * 5,
          temp_max: 25 + Math.random() * 5,
          pressure: 1013,
          humidity: 60 + Math.random() * 20
        },
        weather: [{
          id: 800,
          main: 'Clear',
          description: 'clear sky',
          icon: '01d'
        }],
        clouds: { all: 0 },
        wind: { 
          speed: 2 + Math.random() * 3,
          deg: Math.random() * 360
        },
        visibility: 10000,
        pop: 0,
        sys: { 
          country: '',
          sunrise: timestamp,
          sunset: timestamp + 43200,
          pod: 'd' 
        },
        dt_txt: new Date(timestamp * 1000).toISOString()
      });
    }

    return {
      cod: '200',
      message: 0,
      cnt: forecastItems.length,
      list: forecastItems,
      city: {
        id: 0,
        name: cityName,
        coord: { lat: 0, lon: 0 },
        country: '',
        population: 0,
        timezone: 0,
        sunrise: now,
        sunset: now + 43200
      }
    };
  }
}
