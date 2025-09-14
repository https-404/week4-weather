const LAST_CITY_KEY = "weather:lastCity";
const PREFS_KEY = "weather:prefs";
const LAST_SUCCESS_KEY = "weather:lastSuccess";
export function setLastCity(city) {
    localStorage.setItem(LAST_CITY_KEY, city);
}
export function getLastCity() {
    return localStorage.getItem(LAST_CITY_KEY);
}
export function savePrefs(p) {
    localStorage.setItem(PREFS_KEY, JSON.stringify(p));
}
export function loadPrefs() {
    const raw = localStorage.getItem(PREFS_KEY);
    return raw ? JSON.parse(raw) : null;
}
export function cacheLastSuccess(data) {
    try {
        localStorage.setItem(LAST_SUCCESS_KEY, JSON.stringify({ ts: Date.now(), data }));
    }
    catch (e) {
        console.warn("Failed to cache weather data:", e);
    }
}
export function loadLastSuccess() {
    const raw = localStorage.getItem(LAST_SUCCESS_KEY);
    if (!raw)
        return null;
    try {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.data)
            return parsed.data;
        return parsed;
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=storage.js.map