import { UserPreferences, CachedWeatherData } from '../types/weather.types.js';

// LocalStorage Service
export class StorageService {
  private readonly PREFERENCES_KEY = 'weatherApp_preferences';
  private readonly CACHE_KEY = 'weatherApp_cache';

  getPreferences(): UserPreferences {
    const defaultPrefs: UserPreferences = {
      theme: 'light',
      unit: 'celsius',
      lastCity: ''
    };

    try {
      const stored = localStorage.getItem(this.PREFERENCES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...defaultPrefs, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load preferences:', error);
    }

    return defaultPrefs;
  }

  savePreferences(prefs: UserPreferences): void {
    try {
      localStorage.setItem(this.PREFERENCES_KEY, JSON.stringify(prefs));
    } catch (error) {
      console.warn('Failed to save preferences:', error);
    }
  }

  getCachedWeather(): CachedWeatherData | null {
    try {
      const stored = localStorage.getItem(this.CACHE_KEY);
      if (stored) {
        const parsed: CachedWeatherData = JSON.parse(stored);
        const now = Date.now();
        const cacheAge = now - parsed.timestamp;
        
        // Cache is valid for 10 minutes
        if (cacheAge < 10 * 60 * 1000) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn('Failed to load cached weather:', error);
    }

    return null;
  }

  saveCachedWeather(data: CachedWeatherData): void {
    try {
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save cached weather:', error);
    }
  }
}
