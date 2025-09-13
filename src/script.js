var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var API_KEY = "611f6b44d46c24ad622706398d8d63fe"; // 🔑 Replace with your API key
var isCelsius = true;
// DOM elements
var cityInput = document.getElementById("city");
var tempDiv = document.getElementById("temp-div");
var weatherInfo = document.getElementById("weather-info");
var weatherIcon = document.getElementById("weather-icon");
var loading = document.getElementById("loading");
var errorMessage = document.getElementById("error-message");
var dailyForecast = document.getElementById("daily-forecast");
var unitToggle = document.getElementById("unit-toggle");
var themeToggle = document.getElementById("theme-toggle");
var appBody = document.getElementById("app-body");
function getWeather() {
    return __awaiter(this, void 0, void 0, function () {
        var city, res, data, forecastRes, forecastData, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    city = cityInput.value.trim();
                    if (!city)
                        return [2 /*return*/];
                    loading.classList.remove("hidden");
                    errorMessage.classList.add("hidden");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    return [4 /*yield*/, fetch("https://api.openweathermap.org/data/2.5/weather?q=".concat(city, "&appid=").concat(API_KEY, "&units=metric"))];
                case 2:
                    res = _a.sent();
                    if (!res.ok)
                        throw new Error("City not found");
                    return [4 /*yield*/, res.json()];
                case 3:
                    data = _a.sent();
                    displayWeather(data);
                    return [4 /*yield*/, fetch("https://api.openweathermap.org/data/2.5/forecast?q=".concat(city, "&appid=").concat(API_KEY, "&units=metric"))];
                case 4:
                    forecastRes = _a.sent();
                    return [4 /*yield*/, forecastRes.json()];
                case 5:
                    forecastData = _a.sent();
                    displayForecast(forecastData);
                    return [3 /*break*/, 8];
                case 6:
                    err_1 = _a.sent();
                    if (err_1 instanceof Error) {
                        errorMessage.textContent = err_1.message;
                    }
                    else {
                        errorMessage.textContent = "Something went wrong";
                    }
                    errorMessage.classList.remove("hidden");
                    return [3 /*break*/, 8];
                case 7:
                    loading.classList.add("hidden");
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function displayWeather(data) {
    var temp = isCelsius ? data.main.temp : cToF(data.main.temp);
    tempDiv.textContent = "".concat(Math.round(temp), "\u00B0").concat(isCelsius ? "C" : "F");
    weatherInfo.textContent = "".concat(data.weather[0].description, ", Humidity: ").concat(data.main.humidity, "%");
    weatherIcon.src = "https://openweathermap.org/img/wn/".concat(data.weather[0].icon, "@4x.png");
    weatherIcon.classList.remove("hidden");
}
function displayForecast(forecastData) {
    dailyForecast.innerHTML = "";
    var daily = [];
    var grouped = {};
    // group forecasts by date
    forecastData.list.forEach(function (item) {
        var date = item.dt_txt.split(" ")[0];
        if (!grouped[date])
            grouped[date] = [];
        grouped[date].push(item);
    });
    // pick 1 item per day (prefer 12:00:00)
    Object.values(grouped).forEach(function (items) {
        var noonData = items.find(function (i) { return i.dt_txt.includes("12:00:00"); }) || items[0];
        daily.push(noonData);
    });
    // take only 5 days
    daily.slice(0, 5).forEach(function (day) {
        var temp = isCelsius ? day.main.temp : cToF(day.main.temp);
        var date = new Date(day.dt * 1000).toLocaleDateString("en-US", {
            weekday: "short",
        });
        var div = document.createElement("div");
        div.className =
            "bg-white/20 p-3 rounded-lg flex flex-col items-center text-center";
        div.innerHTML = "\n      <p>".concat(date, "</p>\n      <img src=\"https://openweathermap.org/img/wn/").concat(day.weather[0].icon, ".png\" alt=\"icon\" />\n      <p>").concat(Math.round(temp), "\u00B0").concat(isCelsius ? "C" : "F", "</p>\n    ");
        dailyForecast.appendChild(div);
    });
}
function cToF(c) {
    return (c * 9) / 5 + 32;
}
// 🌡 Toggle Units
unitToggle.addEventListener("click", function () {
    isCelsius = !isCelsius;
    unitToggle.textContent = isCelsius ? "Switch to °F" : "Switch to °C";
    getWeather();
});
// 🎨 Theme Toggle
themeToggle.addEventListener("click", function () {
    if (appBody.classList.contains("bg-purple-600")) {
        appBody.classList.remove("bg-purple-600");
        appBody.classList.add("bg-gray-900");
    }
    else {
        appBody.classList.remove("bg-gray-900");
        appBody.classList.add("bg-purple-600");
    }
});
// Expose function for HTML onclick
window.getWeather = getWeather;
