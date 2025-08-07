/* ==========================================================================
   THEME MANAGER - Dark Mode Implementation
   ========================================================================== */

class ThemeManager {
  constructor() {
    this.themes = {
      LIGHT: 'light',
      DARK: 'dark',
      SYSTEM: 'system'
    };
    
    this.currentTheme = this.themes.SYSTEM;
    this.systemPreference = 'light';
    
    this.elements = {
      toggle: null,
      sunIcon: null,
      moonIcon: null
    };
    
    this.init();
  }
  
  init() {
    console.log('🌙 Theme Manager initialized');
    
    // Create theme toggle button
    this.createThemeToggle();
    
    // Load saved theme preference
    this.loadThemePreference();
    
    // Listen for system theme changes
    this.watchSystemTheme();
    
    // Apply initial theme
    this.applyTheme();
    
    // Bind events
    this.bindEvents();
  }
  
  createThemeToggle() {
    // Find navigation menu
    const navMenu = document.getElementById('nav-menu');
    if (!navMenu) return;
    
    // Create theme toggle container
    const themeToggleContainer = document.createElement('li');
    themeToggleContainer.className = 'nav__item nav__theme-toggle';
    
    // Create theme toggle button
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.id = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Toggle theme');
    themeToggle.setAttribute('type', 'button');
    
    // Create icon container
    const iconContainer = document.createElement('div');
    iconContainer.className = 'theme-toggle__icon';
    
    // Create sun icon (light mode)
    const sunIcon = document.createElement('div');
    sunIcon.className = 'theme-toggle__sun';
    sunIcon.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"/>
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
      </svg>
    `;
    
    // Create moon icon (dark mode)
    const moonIcon = document.createElement('div');
    moonIcon.className = 'theme-toggle__moon';
    moonIcon.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    `;
    
    // Assemble the toggle
    iconContainer.appendChild(sunIcon);
    iconContainer.appendChild(moonIcon);
    themeToggle.appendChild(iconContainer);
    themeToggleContainer.appendChild(themeToggle);
    
    // Add to navigation menu
    navMenu.appendChild(themeToggleContainer);
    
    // Store references
    this.elements.toggle = themeToggle;
    this.elements.sunIcon = sunIcon;
    this.elements.moonIcon = moonIcon;
  }
  
  bindEvents() {
    if (!this.elements.toggle) return;
    
    // Theme toggle click
    this.elements.toggle.addEventListener('click', () => {
      this.toggleTheme();
    });
    
    // Keyboard support
    this.elements.toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggleTheme();
      }
    });
  }
  
  watchSystemTheme() {
    // Check if browser supports prefers-color-scheme
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      // Set initial system preference
      this.systemPreference = mediaQuery.matches ? this.themes.DARK : this.themes.LIGHT;
      
      // Listen for changes
      mediaQuery.addEventListener('change', (e) => {
        this.systemPreference = e.matches ? this.themes.DARK : this.themes.LIGHT;
        
        // If using system theme, update immediately
        if (this.currentTheme === this.themes.SYSTEM) {
          this.applyTheme();
        }
        
        console.log(`🌙 System theme changed to: ${this.systemPreference}`);
      });
    }
  }
  
  loadThemePreference() {
    // Load from localStorage
    const savedTheme = localStorage.getItem('theme-preference');
    
    if (savedTheme && Object.values(this.themes).includes(savedTheme)) {
      this.currentTheme = savedTheme;
    } else {
      // Default to system preference
      this.currentTheme = this.themes.SYSTEM;
    }
    
    console.log(`🌙 Loaded theme preference: ${this.currentTheme}`);
  }
  
  saveThemePreference() {
    localStorage.setItem('theme-preference', this.currentTheme);
    console.log(`🌙 Saved theme preference: ${this.currentTheme}`);
  }
  
  toggleTheme() {
    // Add loading animation
    if (this.elements.toggle) {
      this.elements.toggle.classList.add('theme-toggle--loading');
    }
    
    // Cycle through themes: system -> light -> dark -> system
    switch (this.currentTheme) {
      case this.themes.SYSTEM:
        this.currentTheme = this.themes.LIGHT;
        break;
      case this.themes.LIGHT:
        this.currentTheme = this.themes.DARK;
        break;
      case this.themes.DARK:
        this.currentTheme = this.themes.SYSTEM;
        break;
      default:
        this.currentTheme = this.themes.SYSTEM;
    }
    
    // Apply new theme
    this.applyTheme();
    
    // Save preference
    this.saveThemePreference();
    
    // Track theme change
    if (typeof trackEvent === 'function') {
      trackEvent('theme_change', {
        event_label: this.currentTheme,
        event_category: 'User Preference'
      });
    }
    
    // Remove loading animation
    setTimeout(() => {
      if (this.elements.toggle) {
        this.elements.toggle.classList.remove('theme-toggle--loading');
      }
    }, 600);
    
    console.log(`🌙 Theme toggled to: ${this.currentTheme}`);
  }
  
  applyTheme() {
    // Add transition class for smooth switching
    document.body.classList.add('theme-switching');
    
    // Determine effective theme
    let effectiveTheme;
    if (this.currentTheme === this.themes.SYSTEM) {
      effectiveTheme = this.systemPreference;
    } else {
      effectiveTheme = this.currentTheme;
    }
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', effectiveTheme);
    
    // Update meta theme-color for mobile browsers
    this.updateMetaThemeColor(effectiveTheme);
    
    // Update toggle button aria-label
    this.updateToggleLabel();
    
    // Update favicon if needed
    this.updateFavicon(effectiveTheme);
    
    // Remove transition class after animation
    setTimeout(() => {
      document.body.classList.remove('theme-switching');
    }, 300);
    
    console.log(`🌙 Applied theme: ${effectiveTheme} (from ${this.currentTheme})`);
  }
  
  updateMetaThemeColor(theme) {
    let themeColorMeta = document.querySelector('meta[name="theme-color"]');
    
    if (!themeColorMeta) {
      themeColorMeta = document.createElement('meta');
      themeColorMeta.name = 'theme-color';
      document.head.appendChild(themeColorMeta);
    }
    
    // Set theme color based on current theme
    const themeColor = theme === this.themes.DARK ? '#0a0a0a' : '#ffffff';
    themeColorMeta.content = themeColor;
  }
  
  updateToggleLabel() {
    if (!this.elements.toggle) return;
    
    const labels = {
      [this.themes.SYSTEM]: 'Switch to light theme',
      [this.themes.LIGHT]: 'Switch to dark theme',
      [this.themes.DARK]: 'Switch to system theme'
    };
    
    this.elements.toggle.setAttribute('aria-label', labels[this.currentTheme]);
    this.elements.toggle.setAttribute('data-theme', this.currentTheme);
  }
  
  updateFavicon(theme) {
    // Optional: Update favicon based on theme
    // This would require having separate favicon files for light/dark themes
    
    /*
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
      const faviconPath = theme === this.themes.DARK 
        ? '/favicon-dark.ico' 
        : '/favicon.ico';
      favicon.href = faviconPath;
    }
    */
  }
  
  // Public API methods
  getCurrentTheme() {
    return this.currentTheme;
  }
  
  getEffectiveTheme() {
    return this.currentTheme === this.themes.SYSTEM 
      ? this.systemPreference 
      : this.currentTheme;
  }
  
  setTheme(theme) {
    if (Object.values(this.themes).includes(theme)) {
      this.currentTheme = theme;
      this.applyTheme();
      this.saveThemePreference();
    }
  }
  
  // Check if dark mode is active
  isDarkMode() {
    return this.getEffectiveTheme() === this.themes.DARK;
  }
  
  // Check if light mode is active
  isLightMode() {
    return this.getEffectiveTheme() === this.themes.LIGHT;
  }
  
  // Check if system theme is being used
  isSystemTheme() {
    return this.currentTheme === this.themes.SYSTEM;
  }
}

// Initialize Theme Manager
window.ThemeManager = new ThemeManager();

// Expose theme manager globally for debugging
if (typeof window !== 'undefined') {
  window.themeManager = window.ThemeManager;
}

console.log('🌙 Theme Manager module loaded');
