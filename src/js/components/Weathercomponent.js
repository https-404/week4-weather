export function createWeatherElement() {
    const container = document.createElement("div");
    container.className =
        "p-6 bg-white/20 dark:bg-gray-900/40 backdrop-blur-lg rounded-3xl shadow-xl text-white w-full max-w-2xl mx-auto transition-all duration-500";
    const title = document.createElement("h2");
    title.className = "text-2xl font-bold mb-4 text-center text-gray-100";
    title.textContent = "Weather";
    const status = document.createElement("p");
    status.className = "text-sm text-center text-white/80 mb-4";
    const current = document.createElement("div");
    current.className = "flex flex-col items-center justify-center mb-6";
    const forecast = document.createElement("div");
    forecast.className = "grid grid-cols-2 sm:grid-cols-4 gap-4";
    container.appendChild(title);
    container.appendChild(status);
    container.appendChild(current);
    container.appendChild(forecast);
    return {
        element: container,
        setLoading() {
            status.textContent = "Loading...";
            current.innerHTML = `
        <div class="h-32 w-full flex items-center justify-center">
          <div class="animate-pulse text-white/70">Fetching weather…</div>
        </div>
      `;
            forecast.innerHTML = "";
        },
        setError(msg) {
            status.textContent = msg;
            current.innerHTML = "";
            forecast.innerHTML = "";
        },
        setData(data, unitSymbol) {
            const windUnit = unitSymbol === "°C" ? "m/s" : "mph";
            status.textContent = `Location: ${data.current.location || data.timezone}`;
            const c = data.current;
            current.innerHTML = `
        <img 
          src="https://openweathermap.org/img/wn/${c.weather[0].icon}@4x.png" 
          alt="${c.weather[0].description}" 
          class="w-32 h-32 mb-2 drop-shadow-lg"
        />
        <p class="text-5xl font-extrabold">${Math.round(c.temp)}${unitSymbol}</p>
        <p class="text-lg capitalize">${c.weather[0].description}</p>
        <div class="flex gap-6 mt-4 text-sm text-white/90">
          <p>💧 ${c.humidity}%</p>
          <p>🌬️ ${c.wind_speed} ${windUnit}</p>
        </div>
      `;
            forecast.innerHTML = "";
            data.daily.slice(0, 4).forEach((d) => {
                const day = d.weekday || new Date(d.dt * 1000).toLocaleDateString("en-US", { weekday: "short" });
                const card = document.createElement("div");
                card.className =
                    "p-4 rounded-xl bg-gray-800 text-white flex flex-col items-center shadow-md transition hover:scale-105";
                card.innerHTML = `
          <p class="font-semibold">${day}</p>
          <img 
            src="https://openweathermap.org/img/wn/${d.weather[0].icon}.png" 
            alt="${d.weather[0].description}" 
            class="w-12 h-12 my-2"
          />
          <p class="text-lg font-bold">${Math.round(d.temp.day)}${unitSymbol}</p>
          <p class="text-sm text-white/80">Min: ${Math.round(d.temp.min)}${unitSymbol} | Max: ${Math.round(d.temp.max)}${unitSymbol}</p>
          <p class="text-xs text-white/80 capitalize">${d.weather[0].description}</p>
        `;
                forecast.appendChild(card);
            });
        },
    };
}
//# sourceMappingURL=WeatherComponent.js.map