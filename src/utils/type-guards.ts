import { 
  WeatherData, 
  ForecastData, 
  ReverseGeocodingResult, 
  WeatherError 
} from '../types/weather.types.js';

// Type Guards for Runtime Type Checking
export class TypeGuards {
  static isWeatherData(obj: any): obj is WeatherData {
    return (
      obj &&
      typeof obj === 'object' &&
      typeof obj.coord === 'object' &&
      typeof obj.coord.lon === 'number' &&
      typeof obj.coord.lat === 'number' &&
      Array.isArray(obj.weather) &&
      obj.weather.length > 0 &&
      typeof obj.weather[0].main === 'string' &&
      typeof obj.weather[0].description === 'string' &&
      typeof obj.weather[0].icon === 'string' &&
      typeof obj.main === 'object' &&
      typeof obj.main.temp === 'number' &&
      typeof obj.main.feels_like === 'number' &&
      typeof obj.main.humidity === 'number' &&
      typeof obj.main.pressure === 'number' &&
      typeof obj.wind === 'object' &&
      typeof obj.wind.speed === 'number' &&
      typeof obj.name === 'string' &&
      typeof obj.dt === 'number'
    );
  }

  static isForecastData(obj: any): obj is ForecastData {
    try {
      console.log('🔍 Starting forecast data validation...');
      
      // Basic structure checks
      if (!obj || typeof obj !== 'object') {
        console.warn('❌ Forecast validation failed: Not an object');
        return false;
      }

      console.log('✅ Object structure valid');

      // Check required top-level properties
      if (!Array.isArray(obj.list)) {
        console.warn('❌ Forecast validation failed: list is not an array', typeof obj.list, obj.list);
        return false;
      }

      console.log('✅ List is array, length:', obj.list.length);

      if (obj.list.length === 0) {
        console.warn('❌ Forecast validation failed: list is empty');
        return false;
      }

      if (!obj.city || typeof obj.city !== 'object') {
        console.warn('❌ Forecast validation failed: city is not an object', obj.city);
        return false;
      }

      console.log('✅ City object valid');

      if (typeof obj.city.name !== 'string') {
        console.warn('❌ Forecast validation failed: city.name is not a string', obj.city.name);
        return false;
      }

      console.log('✅ City name valid:', obj.city.name);

      // Check first forecast item structure
      const firstItem = obj.list[0];
      if (!firstItem || typeof firstItem !== 'object') {
        console.warn('❌ Forecast validation failed: first item is not an object', firstItem);
        return false;
      }

      console.log('✅ First item is object');

      if (typeof firstItem.dt !== 'number') {
        console.warn('❌ Forecast validation failed: dt is not a number', typeof firstItem.dt, firstItem.dt);
        return false;
      }

      console.log('✅ dt is number:', firstItem.dt);

      if (!firstItem.main || typeof firstItem.main !== 'object') {
        console.warn('❌ Forecast validation failed: main is not an object', firstItem.main);
        return false;
      }

      console.log('✅ Main object valid');

      if (typeof firstItem.main.temp !== 'number') {
        console.warn('❌ Forecast validation failed: main.temp is not a number', typeof firstItem.main.temp, firstItem.main.temp);
        return false;
      }

      console.log('✅ Main temp is number:', firstItem.main.temp);

      if (!Array.isArray(firstItem.weather)) {
        console.warn('❌ Forecast validation failed: weather is not an array', typeof firstItem.weather, firstItem.weather);
        return false;
      }

      console.log('✅ Weather is array, length:', firstItem.weather.length);

      if (firstItem.weather.length === 0) {
        console.warn('❌ Forecast validation failed: weather array is empty');
        return false;
      }

      if (typeof firstItem.weather[0].description !== 'string') {
        console.warn('❌ Forecast validation failed: weather description is not a string', firstItem.weather[0]);
        return false;
      }

      console.log('✅ Weather description valid:', firstItem.weather[0].description);

      // Additional checks for required forecast properties
      if (typeof firstItem.dt_txt !== 'string') {
        console.warn('❌ Forecast validation failed: dt_txt is not a string', typeof firstItem.dt_txt, firstItem.dt_txt);
        return false;
      }

      console.log('✅ dt_txt is string:', firstItem.dt_txt);

      // Make pop optional as it might not always be present
      if (firstItem.pop !== undefined && typeof firstItem.pop !== 'number') {
        console.warn('❌ Forecast validation failed: pop is not a number', typeof firstItem.pop, firstItem.pop);
        return false;
      }

      console.log('✅ pop is valid (optional):', firstItem.pop);

      console.log('🎉 Forecast data validation passed successfully!');
      return true;
    } catch (error) {
      console.error('💥 Forecast validation error:', error);
      return false;
    }
  }

  static isReverseGeocodingResult(obj: any): obj is ReverseGeocodingResult {
    return (
      obj &&
      typeof obj === 'object' &&
      typeof obj.name === 'string' &&
      typeof obj.lat === 'number' &&
      typeof obj.lon === 'number' &&
      typeof obj.country === 'string'
    );
  }

  static isReverseGeocodingArray(obj: any): obj is ReverseGeocodingResult[] {
    return (
      Array.isArray(obj) &&
      obj.length > 0 &&
      this.isReverseGeocodingResult(obj[0])
    );
  }

  static isApiError(obj: any): obj is WeatherError {
    return (
      obj &&
      typeof obj === 'object' &&
      typeof obj.code === 'string' &&
      typeof obj.message === 'string'
    );
  }
}
