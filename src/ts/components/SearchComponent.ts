import type { Unit } from "../config.js";

export function createSearchElement(initialCity: string = "") {
  const container = document.createElement("div");
  container.className =
    "p-6 bg-white/20 dark:bg-gray-800/40 backdrop-blur-lg rounded-2xl shadow-lg flex flex-col gap-4 items-center w-full max-w-3xl";

  const title = document.createElement("h1");
  title.className = "text-2xl font-bold text-white dark:text-gray-100";
  title.textContent = "Weather App";

  const inputWrapper = document.createElement("div");
  inputWrapper.className = "flex w-full gap-2";

  const input = document.createElement("input");
  input.type = "text";
  input.value = initialCity;
  input.placeholder = "Enter city...";
  input.className =
    "flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 outline-none";

  const button = document.createElement("button");
  button.textContent = "Get Weather";
  button.className =
  "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition transform hover:-translate-y-0.5";

  inputWrapper.appendChild(input);
  inputWrapper.appendChild(button);

  const unitSelect = document.createElement("select");
  unitSelect.className =
    "px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100";
  const metricOption = new Option("°C", "metric", true, true);
  const imperialOption = new Option("°F", "imperial");
  unitSelect.add(metricOption);
  unitSelect.add(imperialOption);

  const themeToggle = document.createElement("button");
  themeToggle.textContent = "🌙";
  themeToggle.className =
    "px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition dark:bg-yellow-400 dark:text-gray-900 dark:hover:bg-yellow-300";

  const message = document.createElement("p");
  message.className = "text-sm text-red-200 dark:text-red-400 h-5";

  container.appendChild(title);
  container.appendChild(inputWrapper);
  container.appendChild(unitSelect);
  container.appendChild(themeToggle);
  container.appendChild(message);

  return {
    element: container,
    onSearch(cb: (city: string, unit: Unit) => void) {
      button.onclick = () => cb(input.value.trim(), unitSelect.value as Unit);
      input.onkeypress = (e) => {
        if (e.key === "Enter") cb(input.value.trim(), unitSelect.value as Unit);
      };
    },
    onUnitChange(cb: (unit: Unit) => void) {
      unitSelect.onchange = () => cb(unitSelect.value as Unit);
    },
    onThemeToggle(cb: () => void) {
      themeToggle.onclick = () => cb();
    },
    setMessage(msg: string) {
      message.textContent = msg;
    },
    setInput(city: string) {
      input.value = city;
    },
    setUnit(unit: Unit) {
      unitSelect.value = unit;
    },
  };
}
