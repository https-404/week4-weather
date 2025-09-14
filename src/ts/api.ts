import { OPENWEATHER_API_KEY, OPENWEATHER_GEOCODE_URL, OPENWEATHER_ONECALL_URL, Unit } from "./config.js";
import type { OneCallResponse } from "./types.js";


export class APIError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "APIError";
    this.status = status;
  }
}

export async function geocodeCity(city: string): Promise<{ lat: number; lon: number; name?: string }> {
  const url = `${OPENWEATHER_GEOCODE_URL}?q=${encodeURIComponent(city)}&limit=1&appid=${OPENWEATHER_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new APIError(`Geocoding API error: ${res.statusText}`, res.status);
  }
  const json = await res.json();
  if (!Array.isArray(json) || json.length === 0) {
    throw new APIError("City not found (geocoding returned no results)", 404);
  }
  const item = json[0];
  if (typeof item.lat !== "number" || typeof item.lon !== "number") {
    throw new APIError("Invalid geocode response format");
  }
  return { lat: item.lat, lon: item.lon, name: item.name || undefined };
}

export function isOneCallResponse(obj: unknown): obj is OneCallResponse {
  if (!obj || typeof obj !== "object") return false;
  const o = obj as any;
  if (typeof o.lat !== "number" || typeof o.lon !== "number") return false;
  if (!o.current || typeof o.current !== "object") return false;
  if (!Array.isArray(o.daily)) return false;
  return true;
}

export async function fetchWeatherForecast(
  lat: number,
  lon: number,
  unit: Unit = "metric"
) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${OPENWEATHER_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 401) throw new APIError("API key invalid (401)", 401);
    if (res.status === 429) throw new APIError("Rate limit exceeded (429)", 429);
    throw new APIError(`Weather API error: ${res.statusText}`, res.status);
  }
  return await res.json(); 
}

