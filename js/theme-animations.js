/* ==========================================================================
   THEME ANIMATIONS & TRANSITIONS
   ========================================================================== */

class ThemeAnimations {
  constructor() {
    this.isAnimating = false;
    this.animationDuration = 300;
    
    this.init();
  }
  
  init() {
    // Listen for theme changes
    this.observeThemeChanges();
    
    // Add page load animation
    this.addPageLoadAnimation();
    
    console.log('✨ Theme Animations initialized');
  }
  
  observeThemeChanges() {
    // Create a MutationObserver to watch for theme attribute changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          this.handleThemeChange(mutation.target.getAttribute('data-theme'));
        }
      });
    });
    
    // Start observing
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
  }
  
  handleThemeChange(newTheme) {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    
    // Add theme transition effects
    this.addThemeTransitionEffects(newTheme);
    
    // Reset animation flag
    setTimeout(() => {
      this.isAnimating = false;
    }, this.animationDuration);
  }
  
  addThemeTransitionEffects(theme) {
    // Create ripple effect from theme toggle button
    this.createRippleEffect(theme);
    
    // Animate specific elements
    this.animateElements(theme);
    
    // Update scroll indicators
    this.updateScrollIndicators(theme);
  }
  
  createRippleEffect(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    // Create ripple element
    const ripple = document.createElement('div');
    ripple.className = 'theme-ripple';
    
    // Position ripple at toggle button
    const rect = themeToggle.getBoundingClientRect();
    const size = Math.max(window.innerWidth, window.innerHeight) * 2;
    
    ripple.style.cssText = `
      position: fixed;
      top: ${rect.top + rect.height / 2}px;
      left: ${rect.left + rect.width / 2}px;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      transform: translate(-50%, -50%) scale(0);
      background-color: ${theme === 'dark' ? '#0a0a0a' : '#ffffff'};
      pointer-events: none;
      z-index: 9999;
      transition: transform ${this.animationDuration}ms ease-out;
    `;
    
    document.body.appendChild(ripple);
    
    // Trigger animation
    requestAnimationFrame(() => {
      ripple.style.transform = 'translate(-50%, -50%) scale(1)';
    });
    
    // Remove ripple after animation
    setTimeout(() => {
      ripple.remove();
    }, this.animationDuration);
  }
  
  animateElements(theme) {
    // Animate cards with stagger effect
    const cards = document.querySelectorAll('.gallery-card, .service-card, .testimonial-card');
    cards.forEach((card, index) => {
      card.style.transition = 'none';
      card.style.transform = 'translateY(10px)';
      card.style.opacity = '0.8';
      
      setTimeout(() => {
        card.style.transition = 'all 0.3s ease';
        card.style.transform = 'translateY(0)';
        card.style.opacity = '1';
      }, index * 50);
    });
    
    // Animate navigation items
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach((link, index) => {
      setTimeout(() => {
        link.style.transition = 'all 0.2s ease';
        link.style.transform = 'scale(1.05)';
        
        setTimeout(() => {
          link.style.transform = 'scale(1)';
        }, 100);
      }, index * 30);
    });
  }
  
  updateScrollIndicators(theme) {
    // Update any scroll indicators or progress bars
    const indicators = document.querySelectorAll('.gallery__indicator');
    indicators.forEach((indicator, index) => {
      setTimeout(() => {
        indicator.style.transition = 'all 0.2s ease';
        indicator.style.transform = 'scale(1.2)';
        
        setTimeout(() => {
          indicator.style.transform = 'scale(1)';
        }, 100);
      }, index * 20);
    });
  }
  
  addPageLoadAnimation() {
    // Add subtle animation when page loads with saved theme
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.playPageLoadAnimation();
      });
    } else {
      this.playPageLoadAnimation();
    }
  }
  
  playPageLoadAnimation() {
    // Fade in effect for theme-sensitive elements
    const elements = document.querySelectorAll('.hero, .nav__menu, .gallery-card');
    
    elements.forEach((element, index) => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        element.style.transition = 'all 0.6s ease';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }
  
  // Public methods for manual animations
  animateThemeChange(fromTheme, toTheme) {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    
    // Custom animation logic here
    console.log(`✨ Animating theme change from ${fromTheme} to ${toTheme}`);
    
    setTimeout(() => {
      this.isAnimating = false;
    }, this.animationDuration);
  }
  
  // Prefers reduced motion support
  respectsReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  
  // Disable animations if user prefers reduced motion
  disableAnimations() {
    if (this.respectsReducedMotion()) {
      this.animationDuration = 0;
      
      // Add CSS to disable all theme animations
      const style = document.createElement('style');
      style.textContent = `
        .theme-switching *,
        .theme-ripple,
        .theme-toggle__sun,
        .theme-toggle__moon {
          transition: none !important;
          animation: none !important;
        }
      `;
      document.head.appendChild(style);
      
      console.log('✨ Theme animations disabled (reduced motion preference)');
    }
  }
}

// Initialize Theme Animations
window.ThemeAnimations = new ThemeAnimations();

// Respect user's motion preferences
window.ThemeAnimations.disableAnimations();

console.log('✨ Theme Animations module loaded');
