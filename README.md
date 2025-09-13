# WeatherScope - Modular TypeScript Weather App

A modern, modular weather application built with TypeScript that provides real-time weather data and forecasts.

## 🏗️ Project Structure

The application has been refactored into a clean, modular architecture:

```
src/
├── app/
│   └── weather-app.ts          # Main application controller
├── services/
│   ├── weather.service.ts      # OpenWeather API integration
│   └── storage.service.ts      # LocalStorage management
├── ui/
│   ├── weather-renderer.ts     # Weather data rendering
│   └── ui-controller.ts        # DOM interactions and state management
├── utils/
│   ├── formatters.ts           # Data formatting utilities
│   └── type-guards.ts          # Runtime type checking
├── types/
│   └── weather.types.ts        # TypeScript type definitions
└── main.ts                     # Application entry point
```

## 🚀 Features

- **Real-time Weather Data**: Current weather conditions and 7-day forecasts
- **Location Services**: Automatic location detection using browser geolocation
- **Responsive Design**: Beautiful UI that works on all devices
- **Dark/Light Theme**: Toggle between themes with persistent preferences
- **Unit Conversion**: Switch between Celsius and Fahrenheit
- **Offline Support**: Cached data when network is unavailable
- **Error Handling**: Comprehensive error management with user-friendly messages

## 🛠️ Technical Architecture

### Modular Design
- **Separation of Concerns**: Each module has a single responsibility
- **Type Safety**: Comprehensive TypeScript interfaces and type guards
- **Dependency Injection**: Services are injected into the main app controller
- **Clean Architecture**: Clear separation between data, business logic, and presentation

### Key Modules

#### WeatherService
- Handles all API calls to OpenWeather API
- Manages error handling and response validation
- Provides methods for both city-based and coordinate-based weather data

#### StorageService
- Manages user preferences (theme, units, last city)
- Handles weather data caching with expiration
- Provides fallback data for offline scenarios

#### WeatherRenderer
- Responsible for rendering weather data to the DOM
- Handles dynamic content updates
- Manages forecast display and formatting

#### UIController
- Manages all DOM interactions
- Handles user input and event listeners
- Controls application state and UI visibility

#### Formatters & Type Guards
- Utility functions for data transformation
- Runtime type checking for API responses
- Consistent data formatting across the app

## 🔧 Development

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Build the project: `npm run build`
4. Start development server: `npm run serve`

### Available Scripts
- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Watch mode for development
- `npm run serve` - Start local development server

## 🌐 API Integration

The app integrates with OpenWeather API:
- Current weather data
- 5-day weather forecast
- Reverse geocoding for location names
- Comprehensive error handling for API failures

## 📱 Browser Support

- Modern browsers with ES2020 support
- Geolocation API support for location features
- LocalStorage support for caching and preferences

## 🔒 Security

- API key is configured in the service (consider environment variables for production)
- Input validation and sanitization
- Safe error handling without exposing sensitive information

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Smooth Animations**: CSS transitions and hover effects
- **Accessibility**: Proper semantic HTML and ARIA labels
- **Loading States**: Visual feedback during API calls
- **Error States**: Clear error messages with recovery options

## 🚀 Future Enhancements

- Weather alerts and notifications
- Multiple city support with favorites
- Historical weather data
- Weather maps integration
- PWA capabilities for offline use