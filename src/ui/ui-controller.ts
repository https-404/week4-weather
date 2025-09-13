import { AppState, UserPreferences } from '../types/weather.types.js';

// UI Controller Class for managing DOM interactions and state display
export class UIController {
  // DOM Elements
  private searchInput!: HTMLInputElement;
  private searchBtn!: HTMLButtonElement;
  private locationBtn!: HTMLButtonElement;
  private themeToggle!: HTMLButtonElement;
  private unitToggle!: HTMLButtonElement;
  private errorContainer!: HTMLElement;
  private errorMessage!: HTMLElement;
  private loadingContainer!: HTMLElement;
  private weatherContainer!: HTMLElement;
  private welcomeContainer!: HTMLElement;
  private offlineIndicator!: HTMLElement;

  private currentState: AppState;

  constructor() {
    this.currentState = { status: 'welcome' };
    this.initializeElements();
  }

  // State Management Methods
  setState(newState: AppState): void {
    this.currentState = newState;
    this.renderState();
  }

  setLoadingState(message?: string): void {
    this.setState({ 
      status: 'loading', 
      loadingMessage: message || 'Loading...' 
    });
  }

  setSuccessState(): void {
    this.setState({ 
      status: 'success'
    });
  }

  setErrorState(error: string): void {
    this.setState({ 
      status: 'error', 
      error 
    });
  }

  setWelcomeState(): void {
    this.setState({ 
      status: 'welcome'
    });
  }

  private renderState(): void {
    switch (this.currentState.status) {
      case 'loading':
        this.showLoading();
        break;
      case 'success':
        this.showWeather();
        break;
      case 'error':
        if (this.currentState.error) {
          this.showError(this.currentState.error);
        }
        break;
      case 'welcome':
        this.hideWeather();
        this.hideError();
        this.hideLoading();
        this.welcomeContainer.classList.remove('hidden');
        break;
    }
  }

  private initializeElements(): void {
    this.searchInput = document.getElementById('searchInput') as HTMLInputElement;
    this.searchBtn = document.getElementById('searchBtn') as HTMLButtonElement;
    this.locationBtn = document.getElementById('locationBtn') as HTMLButtonElement;
    this.themeToggle = document.getElementById('themeToggle') as HTMLButtonElement;
    this.unitToggle = document.getElementById('unitToggle') as HTMLButtonElement;
    this.errorContainer = document.getElementById('errorContainer') as HTMLElement;
    this.errorMessage = document.getElementById('errorMessage') as HTMLElement;
    this.loadingContainer = document.getElementById('loadingContainer') as HTMLElement;
    this.weatherContainer = document.getElementById('weatherContainer') as HTMLElement;
    this.welcomeContainer = document.getElementById('welcomeContainer') as HTMLElement;
    this.offlineIndicator = document.getElementById('offlineIndicator') as HTMLElement;
  }

  setupEventListeners(
    onSearch: () => void,
    onLocationSearch: () => void,
    onThemeToggle: () => void,
    onUnitToggle: () => void
  ): void {
    this.searchBtn.addEventListener('click', onSearch);
    this.searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        onSearch();
      }
    });
    this.locationBtn.addEventListener('click', onLocationSearch);
    this.themeToggle.addEventListener('click', onThemeToggle);
    this.unitToggle.addEventListener('click', onUnitToggle);

    // Check online status
    window.addEventListener('online', () => this.hideOfflineIndicator());
    window.addEventListener('offline', () => this.showOfflineIndicator());
  }

  applyPreferences(preferences: UserPreferences): void {
    // Apply theme
    if (preferences.theme === 'dark') {
      document.body.classList.add('dark');
      this.themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      document.body.classList.remove('dark');
      this.themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }

    // Apply unit
    this.unitToggle.textContent = preferences.unit === 'celsius' ? '°C / °F' : '°F / °C';
  }

  getSearchInput(): string {
    return this.searchInput.value.trim();
  }

  setSearchInput(value: string): void {
    this.searchInput.value = value;
  }

  private showLoading(): void {
    this.loadingContainer.classList.remove('hidden');
    this.loadingContainer.classList.add('flex');
    
    // Update loading message if provided
    const loadingText = this.loadingContainer.querySelector('p');
    if (loadingText && this.currentState.loadingMessage) {
      loadingText.textContent = this.currentState.loadingMessage;
    }
    
    this.hideWeather();
    this.hideWelcome();
    this.hideError();
    
    console.log('🔄 Loading state activated');
  }

  private showWeather(): void {
    this.weatherContainer.classList.remove('hidden');
    this.hideLoading();
  }

  private hideWeather(): void {
    this.weatherContainer.classList.add('hidden');
  }

  private hideWelcome(): void {
    this.welcomeContainer.classList.add('hidden');
  }

  private showError(message: string): void {
    this.errorMessage.textContent = message;
    this.errorContainer.classList.remove('hidden');
    this.hideLoading();
    this.hideWeather();
    this.hideWelcome();
  }

  private hideError(): void {
    this.errorContainer.classList.add('hidden');
  }

  private showOfflineIndicator(): void {
    this.offlineIndicator.classList.remove('hidden');
  }

  private hideOfflineIndicator(): void {
    this.offlineIndicator.classList.add('hidden');
  }

  private hideLoading(): void {
    this.loadingContainer.classList.add('hidden');
    this.loadingContainer.classList.remove('flex');
    console.log('✅ Loading state hidden');
  }
}
