// Comprehensive Type Definitions for the Weather App

// API Response Types
export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface WeatherMain {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
  grnd_level?: number;
  temp_kf?: number;
}

export interface WeatherWind {
  speed: number;
  deg: number;
  gust?: number;
}

export interface WeatherClouds {
  all: number;
}

export interface WeatherSys {
  type?: number;
  id?: number;
  country: string;
  sunrise: number;
  sunset: number;
  pod?: string;
}

export interface WeatherCoord {
  lon: number;
  lat: number;
}

export interface WeatherData {
  coord: WeatherCoord;
  weather: WeatherCondition[];
  base: string;
  main: WeatherMain;
  visibility: number;
  wind: WeatherWind;
  clouds: WeatherClouds;
  dt: number;
  sys: WeatherSys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface ForecastItem {
  dt: number;
  main: WeatherMain;
  weather: WeatherCondition[];
  clouds: WeatherClouds;
  wind: WeatherWind;
  visibility: number;
  pop: number;
  sys: WeatherSys;
  dt_txt: string;
  rain?: { '3h': number };
  snow?: { '3h': number };
}

export interface ForecastCity {
  id: number;
  name: string;
  coord: WeatherCoord;
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

export interface ForecastData {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: ForecastCity;
}

// Reverse Geocoding Types
export interface ReverseGeocodingResult {
  name: string;
  local_names?: { [key: string]: string };
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

// Application State Types
export type AppStatus = 'loading' | 'success' | 'error' | 'welcome';

export interface AppState {
  status: AppStatus;
  data?: CachedWeatherData;
  error?: string;
  loadingMessage?: string;
}

export interface CachedWeatherData {
  current: WeatherData;
  forecast: ForecastData;
  timestamp: number;
  city: string;
  coordinates?: WeatherCoord;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  unit: 'celsius' | 'fahrenheit';
  lastCity: string;
}

// Error Types
export interface WeatherError {
  code: string;
  message: string;
  details?: string;
}

// API Response Wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: WeatherError;
}
