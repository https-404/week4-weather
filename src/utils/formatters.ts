// Utility functions for formatting data

export class Formatters {
  static convertTemperature(temp: number, isCelsius: boolean): number {
    if (isCelsius) {
      return temp;
    }
    return (temp * 9/5) + 32;
  }

  static getWeatherIcon(iconCode: string): string {
    const iconMap: { [key: string]: string } = {
      '01d': 'fa-sun text-yellow-400',
      '01n': 'fa-moon text-blue-300',
      '02d': 'fa-cloud-sun text-yellow-300',
      '02n': 'fa-cloud-moon text-blue-300',
      '03d': 'fa-cloud text-gray-300',
      '03n': 'fa-cloud text-gray-300',
      '04d': 'fa-cloud text-gray-400',
      '04n': 'fa-cloud text-gray-400',
      '09d': 'fa-cloud-rain text-blue-400',
      '09n': 'fa-cloud-rain text-blue-400',
      '10d': 'fa-cloud-sun-rain text-blue-400',
      '10n': 'fa-cloud-moon-rain text-blue-400',
      '11d': 'fa-bolt text-yellow-500',
      '11n': 'fa-bolt text-yellow-500',
      '13d': 'fa-snowflake text-blue-200',
      '13n': 'fa-snowflake text-blue-200',
      '50d': 'fa-smog text-gray-300',
      '50n': 'fa-smog text-gray-300'
    };

    return iconMap[iconCode] || 'fa-cloud text-gray-300';
  }

  static formatDate(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  static formatDay(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }

  static formatTime(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  static getDailyForecasts(forecastList: any[]): any[] {
    const dailyData: { [key: string]: any } = {};
    
    // Group forecasts by date
    forecastList.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toDateString();
      
      if (!dailyData[dateKey]) {
        dailyData[dateKey] = {
          dt: item.dt,
          temp: item.main.temp,
          icon: item.weather[0].icon,
          description: item.weather[0].description,
          count: 1
        };
      } else {
        // Average the temperature and use the most common weather condition
        dailyData[dateKey].temp = (dailyData[dateKey].temp + item.main.temp) / 2;
        dailyData[dateKey].count++;
      }
    });
    
    // Convert to array and sort by date, take first 7 days
    return Object.values(dailyData)
      .sort((a, b) => a.dt - b.dt)
      .slice(0, 7);
  }

  static getErrorMessage(error: any): string {
    if (error instanceof Error) {
      return error.message;
    }
    return 'An unexpected error occurred. Please try again.';
  }
}
