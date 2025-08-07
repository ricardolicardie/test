/* ==========================================================================
   SEO-FRIENDLY SECURITY & ANTI-COPY PROTECTION MODULE
   ========================================================================== */

class SEOFriendlySecurityManager {
  constructor() {
    this.config = {
      enableRightClickProtection: true,
      enableKeyboardProtection: true,
      enableTextSelectionProtection: true,
      enableDevToolsProtection: true,
      enableImageProtection: true,
      enableConsoleWarning: true,
      maxFailedAttempts: 5,
      blockDuration: 300000, // 5 minutes
      // SEO-friendly settings
      allowSearchEngines: true,
      allowAccessibilityTools: true,
      respectUserPreferences: true
    };
    
    this.state = {
      failedAttempts: 0,
      isBlocked: false,
      devToolsOpen: false,
      lastActivity: Date.now(),
      isSearchEngine: false,
      isAccessibilityTool: false
    };
    
    this.init();
  }
  
  init() {
    console.log('🔒 SEO-Friendly Security Manager initialized');
    
    // Detect search engines and accessibility tools
    this.detectSearchEngines();
    this.detectAccessibilityTools();
    
    // Only apply protections if not a search engine or accessibility tool
    if (!this.state.isSearchEngine && !this.state.isAccessibilityTool) {
      this.applyProtections();
    } else {
      console.log('🤖 Search engine or accessibility tool detected - protections disabled');
    }
  }
  
  // 🤖 Detect Search Engine Bots
  detectSearchEngines() {
    const searchEnginePatterns = [
      /googlebot/i,
      /bingbot/i,
      /slurp/i, // Yahoo
      /duckduckbot/i,
      /baiduspider/i,
      /yandexbot/i,
      /facebookexternalhit/i,
      /twitterbot/i,
      /linkedinbot/i,
      /whatsapp/i,
      /telegrambot/i,
      /applebot/i,
      /crawler/i,
      /spider/i,
      /bot/i
    ];
    
    const userAgent = navigator.userAgent.toLowerCase();
    this.state.isSearchEngine = searchEnginePatterns.some(pattern => 
      pattern.test(userAgent)
    );
    
    // Additional check for headless browsers (often used by SEO tools)
    if (navigator.webdriver || window.phantom || window._phantom) {
      this.state.isSearchEngine = true;
    }
  }
  
  // ♿ Detect Accessibility Tools
  detectAccessibilityTools() {
    const accessibilityPatterns = [
      /nvda/i,
      /jaws/i,
      /dragon/i,
      /voiceover/i,
      /talkback/i,
      /accessibility/i,
      /screen.?reader/i
    ];
    
    const userAgent = navigator.userAgent.toLowerCase();
    this.state.isAccessibilityTool = accessibilityPatterns.some(pattern => 
      pattern.test(userAgent)
    );
    
    // Check for accessibility APIs
    if (window.speechSynthesis || window.SpeechRecognition || 
        document.querySelector('[aria-live]')) {
      // Likely using accessibility features
    }
  }
  
  // 🛡️ Apply Protections (Only for Regular Users)
  applyProtections() {
    // Wait a bit to ensure page is loaded and user is interacting
    setTimeout(() => {
      this.protectRightClick();
      this.protectKeyboardShortcuts();
      this.protectTextSelectionSmart();
      this.protectDevTools();
      this.protectImages();
      this.protectConsole();
      this.setupActivityMonitoring();
    }, 2000); // 2 second delay
    
    // Show console warning immediately
    if (this.config.enableConsoleWarning) {
      this.showConsoleWarning();
    }
  }
  
  // 🚫 Smart Right Click Protection
  protectRightClick() {
    if (!this.config.enableRightClickProtection) return;
    
    let rightClickCount = 0;
    
    document.addEventListener('contextmenu', (e) => {
      // Allow right click on form elements for accessibility
      if (e.target.matches('input, textarea, select')) {
        return true;
      }
      
      // Allow right click on links for "open in new tab"
      if (e.target.closest('a')) {
        return true;
      }
      
      rightClickCount++;
      
      // Only block after multiple attempts (less aggressive)
      if (rightClickCount > 2) {
        e.preventDefault();
        this.logSecurityEvent('Multiple right click attempts');
        this.showWarningMessage('Right click is limited for content protection.');
        return false;
      }
    });
    
    // Reset counter after some time
    setInterval(() => {
      rightClickCount = 0;
    }, 30000); // Reset every 30 seconds
  }
  
  // ⌨️ Smart Keyboard Protection
  protectKeyboardShortcuts() {
    if (!this.config.enableKeyboardProtection) return;
    
    const blockedKeys = [
      { key: 'F12' }, // Dev Tools
      { ctrl: true, shift: true, key: 'I' }, // Dev Tools
      { ctrl: true, shift: true, key: 'J' }, // Console
      { ctrl: true, shift: true, key: 'C' }, // Inspector
      { ctrl: true, key: 'U' }, // View Source
    ];
    
    // Allow some shortcuts for accessibility
    const allowedKeys = [
      { ctrl: true, key: 'A' }, // Select All (accessibility)
      { ctrl: true, key: '+' }, // Zoom in (accessibility)
      { ctrl: true, key: '-' }, // Zoom out (accessibility)
      { ctrl: true, key: '0' }, // Reset zoom (accessibility)
    ];
    
    let blockedAttempts = 0;
    
    document.addEventListener('keydown', (e) => {
      // Check if it's an allowed key first
      const isAllowed = allowedKeys.some(combo => {
        return (
          (!combo.ctrl || e.ctrlKey) &&
          (!combo.shift || e.shiftKey) &&
          (!combo.alt || e.altKey) &&
          (combo.key === e.key || combo.key === e.code)
        );
      });
      
      if (isAllowed) return true;
      
      // Check if it's a blocked key
      const blocked = blockedKeys.some(combo => {
        return (
          (!combo.ctrl || e.ctrlKey) &&
          (!combo.shift || e.shiftKey) &&
          (!combo.alt || e.altKey) &&
          (combo.key === e.key || combo.key === e.code)
        );
      });
      
      if (blocked) {
        blockedAttempts++;
        
        // Only block after multiple attempts
        if (blockedAttempts > 1) {
          e.preventDefault();
          e.stopPropagation();
          this.logSecurityEvent(`Blocked keyboard shortcut: ${e.key}`);
          this.showWarningMessage('Some keyboard shortcuts are disabled for content protection.');
          return false;
        }
      }
    });
    
    // Reset counter
    setInterval(() => {
      blockedAttempts = 0;
    }, 60000); // Reset every minute
  }
  
  // 📝 Smart Text Selection Protection
  protectTextSelectionSmart() {
    if (!this.config.enableTextSelectionProtection) return;
    
    // Allow text selection in specific areas
    const allowedSelectors = [
      'input',
      'textarea',
      '[contenteditable="true"]',
      '.allow-selection',
      'code',
      'pre',
      '.testimonial__text', // Allow copying testimonials
      '.contact__description' // Allow copying contact info
    ];
    
    document.addEventListener('selectstart', (e) => {
      // Check if selection is allowed in this element
      const isAllowed = allowedSelectors.some(selector => 
        e.target.matches(selector) || e.target.closest(selector)
      );
      
      if (isAllowed) {
        return true;
      }
      
      // Allow small selections (for accessibility)
      setTimeout(() => {
        const selection = window.getSelection();
        if (selection.toString().length > 50) {
          selection.removeAllRanges();
          this.showWarningMessage('Large text selections are limited for content protection.');
        }
      }, 100);
    });
  }
  
  // 🛠️ Smart Developer Tools Protection
  protectDevTools() {
    if (!this.config.enableDevToolsProtection) return;
    
    let devToolsWarnings = 0;
    const maxWarnings = 3;
    
    // Method 1: Console detection (less aggressive)
    let element = new Image();
    Object.defineProperty(element, 'id', {
      get: () => {
        devToolsWarnings++;
        if (devToolsWarnings > maxWarnings) {
          this.handleDevToolsDetection();
        }
        return 'devtools-detected';
      }
    });
    
    // Check less frequently to reduce performance impact
    setInterval(() => {
      console.log('%c', element);
    }, 5000); // Every 5 seconds instead of 1
    
    // Method 2: Window size detection (with tolerance)
    const threshold = 200; // Increased threshold
    let sizeWarnings = 0;
    
    setInterval(() => {
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        sizeWarnings++;
        if (sizeWarnings > 3) { // Multiple checks before acting
          this.handleDevToolsDetection();
          sizeWarnings = 0;
        }
      } else {
        sizeWarnings = 0; // Reset if normal
      }
    }, 2000); // Check every 2 seconds
  }
  
  handleDevToolsDetection() {
    if (this.state.devToolsOpen) return;
    
    this.state.devToolsOpen = true;
    this.logSecurityEvent('Developer tools detected');
    
    // Less aggressive response
    this.showWarningMessage('Developer tools detected. Please note that content is protected.');
    
    // Don't redirect immediately, just warn
    setTimeout(() => {
      this.state.devToolsOpen = false;
    }, 10000); // Reset after 10 seconds
  }
  
  // 🖼️ Smart Image Protection
  protectImages() {
    if (!this.config.enableImageProtection) return;
    
    // Only protect specific images, not all
    const protectedImages = document.querySelectorAll('.gallery-card img, .hero__image');
    
    protectedImages.forEach(img => {
      // Disable dragging
      img.addEventListener('dragstart', (e) => {
        e.preventDefault();
        return false;
      });
      
      // Add context menu protection
      img.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        this.showWarningMessage('Image downloading is disabled.');
        return false;
      });
    });
  }
  
  // 🖥️ Console Protection (Educational)
  protectConsole() {
    if (!this.config.enableConsoleWarning) return;
    
    // Don't override console methods, just warn
    this.showConsoleWarning();
  }
  
  // 📊 Smart Activity Monitoring
  setupActivityMonitoring() {
    let suspiciousActivity = 0;
    const activityThreshold = 10; // Increased threshold
    
    // Monitor only extreme rapid activity
    let keyPressCount = 0;
    document.addEventListener('keydown', () => {
      keyPressCount++;
      setTimeout(() => keyPressCount--, 1000);
      
      if (keyPressCount > 30) { // Increased threshold
        suspiciousActivity++;
        this.logSecurityEvent('Extremely rapid key presses detected');
      }
    });
    
    // Check less frequently
    setInterval(() => {
      if (suspiciousActivity > activityThreshold) {
        this.handleSuspiciousActivity();
        suspiciousActivity = 0;
      }
    }, 30000); // Check every 30 seconds
  }
  
  // ⚠️ Gentle Warning Messages
  showWarningMessage(message) {
    // Check if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Simple alert for users who prefer reduced motion
      console.warn(message);
      return;
    }
    
    const notification = document.createElement('div');
    notification.className = 'security-warning security-warning--gentle';
    notification.innerHTML = `
      <div class="security-warning__content">
        <div class="security-warning__icon">ℹ️</div>
        <div class="security-warning__message">${message}</div>
        <button class="security-warning__close" aria-label="Close notification">×</button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove
    setTimeout(() => {
      notification.remove();
    }, 5000);
    
    // Close button
    notification.querySelector('.security-warning__close').addEventListener('click', () => {
      notification.remove();
    });
  }
  
  showConsoleWarning() {
    console.log('%c🛡️ Content Protection Active', 'color: #3b82f6; font-size: 20px; font-weight: bold;');
    console.log('%cThis website\'s content is protected. Unauthorized copying or reverse engineering is not permitted.', 'color: #6b7280; font-size: 14px;');
    console.log('%c© 2025 Ricardo Licardie. All rights reserved.', 'color: #059669; font-size: 12px;');
    console.log('%cIf you\'re a developer interested in my work, feel free to reach out!', 'color: #7c3aed; font-size: 12px;');
  }
  
  // 📝 Security Event Logging (Privacy-Friendly)
  logSecurityEvent(event) {
    // Only log essential information, respect privacy
    const logEntry = {
      timestamp: new Date().toISOString(),
      event: event,
      // Don't log sensitive user information
      url: window.location.pathname // Only pathname, not full URL
    };
    
    // Store locally with size limit
    const logs = JSON.parse(localStorage.getItem('security_logs') || '[]');
    logs.push(logEntry);
    
    // Keep only last 50 logs (reduced from 100)
    if (logs.length > 50) {
      logs.splice(0, logs.length - 50);
    }
    
    localStorage.setItem('security_logs', JSON.stringify(logs));
  }
  
  // 🔢 Gentle Failed Attempts Management
  incrementFailedAttempts() {
    this.state.failedAttempts++;
    
    if (this.state.failedAttempts >= this.config.maxFailedAttempts) {
      this.showWarningMessage('Multiple security violations detected. Please refresh the page if you\'re experiencing issues.');
      // Don't actually block, just warn
      setTimeout(() => {
        this.state.failedAttempts = 0;
      }, 60000); // Reset after 1 minute
    }
  }
  
  handleSuspiciousActivity() {
    this.logSecurityEvent('Unusual activity pattern detected');
    this.showWarningMessage('Unusual activity detected. If you\'re having trouble accessing content, please contact support.');
  }
  
  // 🧹 Easy disable for development
  disable() {
    console.log('🔓 Security protection disabled for development');
    // Remove all event listeners and restore functionality
    this.config.enableRightClickProtection = false;
    this.config.enableKeyboardProtection = false;
    this.config.enableTextSelectionProtection = false;
    this.config.enableDevToolsProtection = false;
  }
}

// Initialize SEO-Friendly Security Manager
window.SEOFriendlySecurityManager = new SEOFriendlySecurityManager();

// Development mode check
if (window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1' ||
    window.location.search.includes('debug=true')) {
  window.SEOFriendlySecurityManager.disable();
}

console.log('🔒 SEO-Friendly Security module loaded');
