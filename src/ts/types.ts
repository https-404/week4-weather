export interface Weather {
  id: number;
  main: string;
  description: string;
  icon?: string;
}

export interface CurrentWeather {
  dt: number;
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  weather: Weather[];
  location?: string; 
}

export interface DailyTemp {
  day: number;
  min: number;
  max: number;
  night: number;
  eve: number;
  morn: number;
}

export interface DailyForecast {
  dt: number;
  temp: DailyTemp;
  humidity: number;
  wind_speed: number;
  weather: Weather[];
  weekday?: string; 
}

export interface OneCallResponse {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset?: number;
  current: CurrentWeather;
  daily: DailyForecast[];
}

export type FetchState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };
