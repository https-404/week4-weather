import type { OneCallResponse } from "./types.js";
import type { Unit } from "./config.js";

const LAST_CITY_KEY = "weather:lastCity";
const PREFS_KEY = "weather:prefs";
const LAST_SUCCESS_KEY = "weather:lastSuccess";

export function setLastCity(city: string) {
  localStorage.setItem(LAST_CITY_KEY, city);
}
export function getLastCity(): string | null {
  return localStorage.getItem(LAST_CITY_KEY);
}

export function savePrefs(p: { unit: Unit; theme: "light" | "dark" }) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(p));
}
export function loadPrefs(): { unit: Unit; theme: "light" | "dark" } | null {
  const raw = localStorage.getItem(PREFS_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function cacheLastSuccess(data: OneCallResponse) {
  try {
    localStorage.setItem(LAST_SUCCESS_KEY, JSON.stringify({ ts: Date.now(), data }));
  } catch (e) {
    console.warn("Failed to cache weather data:", e);
  }
}
export function loadLastSuccess(): OneCallResponse | null {
  const raw = localStorage.getItem(LAST_SUCCESS_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && parsed.data) return parsed.data as OneCallResponse;
    return parsed as OneCallResponse;
  } catch {
    return null;
  }
}
