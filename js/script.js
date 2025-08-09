// ==========================================================================
// MODERN PORTFOLIO - JAVASCRIPT (WITH DARK MODE)
// ==========================================================================

// 🔧 CONFIGURACIÓN EMAILJS - REEMPLAZA CON TUS VALORES REALES
const EMAILJS_CONFIG = {
  // 📝 PASO 1: Reemplaza con tu Public Key de EmailJS
  publicKey: 'MHizOnvj424WlPHb8',        // Ej: 'user_1234567890abcdef'
  
  // 📝 PASO 2: Reemplaza con tu Service ID de EmailJS  
  serviceId: 'service_xzdlkbs',        // Ej: 'service_gmail'
  
  // 📝 PASO 3: Reemplaza con los IDs de tus 2 templates
  templateId: 'template_wjftsqr',             // Template para formulario de contacto
  projectTemplateId: 'template_oghpz1g'    // Template para consultas de proyecto
};

// ==========================================================================
//document.addEventListener('DOMContentLoaded', function () {
  //document.getElementById('available-btn').addEventListener('click', function(e) {
    //e.preventDefault();
    //window.location.href = 'mailto:tucorreo@ejemplo.com?subject=New%20Project&body=Hi%20Ricardo,%20quiero%20consultar%20sobre%20un%20proyecto.';
  //});
//});

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('available-btn').addEventListener('click', function(e) {
    e.preventDefault();

    const destinationEmail = 'ricardolicardie@gmail.com'; // correo real
    const subject = encodeURIComponent('New Project Inquiry');
    const body = encodeURIComponent(`Hi Ricardo,
      I was reviewing your portfolio and I really liked your work.
      I am looking for someone for a new project.

      Here are a few details:
      - Project Name: [Insert Project Name]
      - Project Description: [Insert Project Description]
      - Budget: [Insert Budget]
      - Deadline: [Insert Deadline]

      Looking forward to hearing from you soon!

      Best regards,
      [Your Name]
      [Your Email]
      [Your Phone Number]
      `);

    // abrir correo
    window.location.href = `mailto:${destinationEmail}?subject=${subject}&body=${body}`;

    // mostrar notificación
    const noti = document.getElementById('email-notification');
    noti.style.display = 'block';

    // ocultar notificación después de 5 segundos
    setTimeout(() => {
      noti.style.display = 'none';
    }, 4000);
  });
});

// ==========================================================================
const ANIMATION_CONFIG = {
  scrollThrottle: 50,
  resizeDebounce: 250,
  notificationDuration: 5000,
  autoScrollInterval: 4000,
  autoScrollPause: 10000,
  transitionDuration: 300
};

const GALLERY_CONFIG = {
  slideWidth: 344, // 320px + 24px gap
  autoScroll: true,
  touchEnabled: true,
  keyboardNavigation: true
};

const VALIDATION_MESSAGES = {
  required: (field) => `${field.charAt(0).toUpperCase() + field.slice(1)} is required`,
  email: 'Please enter a valid email address',
  minLength: (field, length) => `${field} must be at least ${length} characters long`
};

// Utility Functions
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}


function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function getElement(id) {
  const element = document.getElementById(id);
  if (!element) {
    console.warn(`Element with ID '${id}' not found`);
  }
  return element;
}

function getElements(selector) {
  const elements = document.querySelectorAll(selector);
  if (elements.length === 0) {
    console.warn(`No elements found for selector '${selector}'`);
  }
  return elements;
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function setButtonLoading(button, isLoading = true) {
  if (!button) return;
  
  if (isLoading) {
    button.classList.add('btn--loading');
    button.disabled = true;
  } else {
    button.classList.remove('btn--loading');
    button.disabled = false;
  }
}

function scrollToElement(element, offset = 0) {
  if (!element) return;
  
  const elementPosition = element.offsetTop - offset;
  window.scrollTo({
    top: elementPosition,
    behavior: 'smooth'
  });
}

function createNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.innerHTML = `
    <div class="notification__content">
      <span class="notification__message">${message}</span>
      <button class="notification__close" aria-label="Close notification">×</button>
    </div>
  `;
  
  return notification;
}

function showNotification(message, type = 'info') {
  const container = getElement('notification-container');
  if (!container) return;
  
  const notification = createNotification(message, type);
  container.appendChild(notification);
  
  // Show notification
  setTimeout(() => notification.classList.add('notification--show'), 100);
  
  // Auto-hide notification
  setTimeout(() => {
    notification.classList.remove('notification--show');
    setTimeout(() => notification.remove(), 300);
  }, ANIMATION_CONFIG.notificationDuration);
  
  // Close button functionality
  const closeBtn = notification.querySelector('.notification__close');
  closeBtn.addEventListener('click', () => {
    notification.classList.remove('notification--show');
    setTimeout(() => notification.remove(), 300);
  });
}

// Navigation Class
class Navigation {
  constructor() {
    this.elements = {
      toggle: getElement('nav-toggle'),
      menu: getElement('nav-menu'),
      links: getElements('.nav__link'),
      header: document.querySelector('.header'),
      sections: getElements('section[id]')
    };
    
    this.state = {
      isMenuOpen: false,
      activeSection: 'home'
    };
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.updateActiveNavLink();
    this.handleHeaderScroll();
  }
  
  bindEvents() {
    // Mobile menu toggle
    if (this.elements.toggle) {
      this.elements.toggle.addEventListener('click', () => this.toggleMobileMenu());
    }
    
    // Navigation links
    this.elements.links.forEach(link => {
      link.addEventListener('click', (e) => this.handleNavLinkClick(e));
    });
    
    // Close menu on outside click
    document.addEventListener('click', (e) => this.handleOutsideClick(e));
    
    // Scroll events
    window.addEventListener('scroll', throttle(() => {
      this.updateActiveNavLink();
      this.handleHeaderScroll();
    }, ANIMATION_CONFIG.scrollThrottle));
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    
    // Window resize
    window.addEventListener('resize', debounce(() => {
      if (window.innerWidth > 768) {
        this.closeMobileMenu();
      }
    }, ANIMATION_CONFIG.resizeDebounce));
  }
  
  toggleMobileMenu() {
    if (this.state.isMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }
  
  openMobileMenu() {
    if (!this.elements.menu || !this.elements.toggle) return;
    
    this.elements.menu.classList.add('nav__menu--active');
    this.elements.toggle.classList.add('nav__toggle--active');
    this.elements.toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    this.state.isMenuOpen = true;
    
    // Stagger animation for menu items
    const menuItems = this.elements.menu.querySelectorAll('.nav__item');
    menuItems.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      setTimeout(() => {
        item.style.transition = 'all 0.3s ease';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, index * 50);
    });
    
    // Add haptic feedback on mobile
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  }
  
  closeMobileMenu() {
    if (!this.elements.menu || !this.elements.toggle) return;
    
    this.elements.menu.classList.remove('nav__menu--active');
    this.elements.toggle.classList.remove('nav__toggle--active');
    this.elements.toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    this.state.isMenuOpen = false;
    
    // Reset menu items styles
    const menuItems = this.elements.menu.querySelectorAll('.nav__item');
    menuItems.forEach((item) => {
      item.style.opacity = '';
      item.style.transform = '';
      item.style.transition = '';
    });
  }
  
  handleNavLinkClick(e) {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
      const headerHeight = this.elements.header.offsetHeight;
      scrollToElement(targetSection, headerHeight);
      
      // Close mobile menu if open
      if (window.innerWidth <= 768) {
        this.closeMobileMenu();
      }
    }
  }
  
  handleOutsideClick(e) {
    if (
      window.innerWidth <= 768 &&
      !this.elements.menu.contains(e.target) &&
      !this.elements.toggle.contains(e.target) &&
      this.state.isMenuOpen
    ) {
      this.closeMobileMenu();
    }
  }
  
  handleKeyboard(e) {
    // Escape key closes mobile menu
    if (e.key === 'Escape' && this.state.isMenuOpen) {
      this.closeMobileMenu();
    }
  }
  
  updateActiveNavLink() {
    if (!this.elements.header || this.elements.sections.length === 0) return;
    
    const scrollPosition = window.scrollY + this.elements.header.offsetHeight + 50;
    
    this.elements.sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        // Update active section
        if (this.state.activeSection !== sectionId) {
          this.state.activeSection = sectionId;
          
          // Update navigation links
          this.elements.links.forEach((link) => {
            link.classList.remove('nav__link--active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('nav__link--active');
            }
          });
        }
      }
    });
  }
  
  handleHeaderScroll() {
    if (!this.elements.header) return;
    
    const scrollThreshold = 200;
    
    if (window.scrollY > scrollThreshold) {
      this.elements.header.classList.add('header--scrolled');
    } else {
      this.elements.header.classList.remove('header--scrolled');
    }
  }
}

// Gallery Class (unchanged)
class Gallery {
  constructor() {
    this.elements = {
      scroll: getElement('gallery-scroll'),
      prevBtn: getElement('gallery-prev'),
      nextBtn: getElement('gallery-next'),
      indicators: getElement('gallery-indicators'),
      items: getElements('.gallery__item')
    };
    
    this.state = {
      currentSlide: 0,
      isAutoScrolling: true,
      isDragging: false,
      startX: 0,
      scrollLeft: 0
    };
    
    this.config = {
      ...GALLERY_CONFIG,
      totalSlides: this.elements.items.length
    };
    
    this.autoScrollInterval = null;
    
    this.init();
  }
  
  init() {
    if (!this.elements.scroll || this.config.totalSlides === 0) {
      return;
    }
    
    this.bindEvents();
    this.updateUI();
    
    if (this.config.autoScroll) {
      this.startAutoScroll();
    }
  }
  
  bindEvents() {
    // Navigation buttons
    if (this.elements.prevBtn) {
      this.elements.prevBtn.addEventListener('click', () => this.previousSlide());
    }
    if (this.elements.nextBtn) {
      this.elements.nextBtn.addEventListener('click', () => this.nextSlide());
    }
    
    // Indicators
    if (this.elements.indicators) {
      this.elements.indicators.addEventListener('click', (e) => {
        if (e.target.classList.contains('gallery__indicator')) {
          const slideIndex = parseInt(e.target.getAttribute('data-slide'));
          this.goToSlide(slideIndex);
          this.pauseAutoScroll();
        }
      });
    }
    
    // Mouse/touch events for dragging
    if (this.config.touchEnabled && this.elements.scroll) {
      this.bindDragEvents();
    }
    
    // Keyboard navigation
    if (this.config.keyboardNavigation) {
      document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }
    
    // Pause auto-scroll on hover
    if (this.elements.scroll) {
      this.elements.scroll.addEventListener('mouseenter', () => {
        this.clearAutoScroll();
      });
      
      this.elements.scroll.addEventListener('mouseleave', () => {
        if (this.state.isAutoScrolling) {
          this.startAutoScroll();
        }
      });
    }
    
    // Window resize
    window.addEventListener('resize', debounce(() => {
      this.updateUI();
    }, ANIMATION_CONFIG.resizeDebounce));
  }
  
  bindDragEvents() {
    // Mouse events
    this.elements.scroll.addEventListener('mousedown', (e) => this.startDrag(e));
    this.elements.scroll.addEventListener('mouseleave', () => this.endDrag());
    this.elements.scroll.addEventListener('mouseup', () => this.endDrag());
    this.elements.scroll.addEventListener('mousemove', (e) => this.drag(e));
    
    // Touch events
    this.elements.scroll.addEventListener('touchstart', (e) => this.startTouch(e));
    this.elements.scroll.addEventListener('touchmove', (e) => this.touchMove(e));
    this.elements.scroll.addEventListener('touchend', () => this.endDrag());
  }
  
  startDrag(e) {
    this.state.isDragging = true;
    this.state.startX = e.pageX - this.elements.scroll.offsetLeft;
    this.state.scrollLeft = this.elements.scroll.scrollLeft;
    this.elements.scroll.style.cursor = 'grabbing';
    this.clearAutoScroll();
  }
  
  drag(e) {
    if (!this.state.isDragging) return;
    e.preventDefault();
    const x = e.pageX - this.elements.scroll.offsetLeft;
    const walk = (x - this.state.startX) * 2;
    this.elements.scroll.scrollLeft = this.state.scrollLeft - walk;
  }
  
  endDrag() {
    if (!this.state.isDragging) return;
    this.state.isDragging = false;
    this.elements.scroll.style.cursor = 'grab';
    
    // Resume auto-scroll after a delay
    setTimeout(() => {
      if (this.state.isAutoScrolling) {
        this.startAutoScroll();
      }
    }, 2000);
  }
  
  startTouch(e) {
    this.state.startX = e.touches[0].pageX - this.elements.scroll.offsetLeft;
    this.state.scrollLeft = this.elements.scroll.scrollLeft;
    this.clearAutoScroll();
  }
  
  touchMove(e) {
    const x = e.touches[0].pageX - this.elements.scroll.offsetLeft;
    const walk = (x - this.state.startX) * 2;
    this.elements.scroll.scrollLeft = this.state.scrollLeft - walk;
  }
  
  handleKeyboard(e) {
    if (e.key === 'ArrowLeft') {
      this.previousSlide();
      this.pauseAutoScroll();
    } else if (e.key === 'ArrowRight') {
      this.nextSlide();
      this.pauseAutoScroll();
    }
  }
  
  previousSlide() {
    this.goToSlide(this.state.currentSlide - 1);
  }
  
  nextSlide() {
    this.goToSlide(this.state.currentSlide + 1);
  }
  
  goToSlide(slideIndex) {
    const maxSlide = this.config.totalSlides - this.getVisibleSlides();
    this.state.currentSlide = Math.max(0, Math.min(slideIndex, maxSlide));
    
    const scrollPosition = this.state.currentSlide * this.config.slideWidth;
    
    this.elements.scroll.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
    
    this.updateUI();
  }
  
  getVisibleSlides() {
    if (!this.elements.scroll) return 1;
    const containerWidth = this.elements.scroll.parentElement.offsetWidth;
    return Math.floor(containerWidth / this.config.slideWidth);
  }
  
  updateUI() {
    this.updateButtons();
    this.updateIndicators();
  }
  
  updateButtons() {
    if (!this.elements.prevBtn || !this.elements.nextBtn) return;
    
    const maxSlide = this.config.totalSlides - this.getVisibleSlides();
    
    this.elements.prevBtn.disabled = this.state.currentSlide === 0;
    this.elements.nextBtn.disabled = this.state.currentSlide >= maxSlide;
  }
  
  updateIndicators() {
    if (!this.elements.indicators) return;
    
    const indicators = this.elements.indicators.querySelectorAll('.gallery__indicator');
    indicators.forEach((indicator, index) => {
      const isActive = index === this.state.currentSlide;
      indicator.classList.toggle('gallery__indicator--active', isActive);
      indicator.setAttribute('aria-selected', isActive.toString());
    });
  }
  
  startAutoScroll() {
    if (!this.state.isAutoScrolling) return;
    
    this.autoScrollInterval = setInterval(() => {
      const maxSlide = this.config.totalSlides - this.getVisibleSlides();
      
      if (this.state.currentSlide >= maxSlide) {
        this.goToSlide(0);
      } else {
        this.nextSlide();
      }
    }, ANIMATION_CONFIG.autoScrollInterval);
  }
  
  clearAutoScroll() {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
      this.autoScrollInterval = null;
    }
  }
  
  pauseAutoScroll() {
    this.state.isAutoScrolling = false;
    this.clearAutoScroll();
    
    // Resume auto-scroll after pause duration
    setTimeout(() => {
      this.state.isAutoScrolling = true;
      this.startAutoScroll();
    }, ANIMATION_CONFIG.autoScrollPause);
  }
  
  play() {
    this.state.isAutoScrolling = true;
    this.startAutoScroll();
  }
  
  pause() {
    this.state.isAutoScrolling = false;
    this.clearAutoScroll();
  }
  
  destroy() {
    this.clearAutoScroll();
  }
}

// Forms Class (unchanged)
class Forms {
  constructor() {
    this.elements = {
      contactForm: getElement('contact-form'),
      contactInputs: getElements('#contact-form input, #contact-form textarea')
    };
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    console.log('📧 Forms module initialized');
  }
  
  bindEvents() {
    // Contact form
    if (this.elements.contactForm) {
      this.elements.contactForm.addEventListener('submit', (e) => this.handleContactSubmit(e));
    }
    
    // Real-time validation for contact form
    this.elements.contactInputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => {
        if (input.closest('.form-group').classList.contains('form-group--error')) {
          this.validateField(input);
        }
      });
    });
  }
  
  async handleContactSubmit(e) {
    e.preventDefault();
    console.log('📧 Processing contact form submission...');
    
    // Validate all fields
    let isFormValid = true;
    this.elements.contactInputs.forEach(input => {
      if (!this.validateField(input)) {
        isFormValid = false;
      }
    });
    
    if (!isFormValid) {
      showNotification('Please fix the errors above', 'error');
      return;
    }
    
    // Get form data
    const formData = new FormData(this.elements.contactForm);
    const data = Object.fromEntries(formData.entries());
    
    // Show loading state
    const submitButton = this.elements.contactForm.querySelector('button[type="submit"]');
    setButtonLoading(submitButton, true);
    
    try {
      // Try to send with EmailJS if configured
      if (window.emailjs && this.isEmailJSConfigured()) {
        console.log('📧 Sending email via EmailJS...');
        await this.sendContactEmail(data);
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
      } else {
        console.log('⚠️ EmailJS not configured, simulating submission...');
        // Simulate form submission
        await wait(2000);
        showNotification('EmailJS not configured. Check console for setup instructions.', 'warning');
      }
      
      this.elements.contactForm.reset();
      
    } catch (error) {
      console.error('❌ Contact form error:', error);
      showNotification('Failed to send message. Please try again.', 'error');
    } finally {
      setButtonLoading(submitButton, false);
    }
  }
  
  async sendContactEmail(data) {
    const templateParams = {
      from_name: data.name || '',
      from_email: data.email || '',
      message: data.message || ''
    };
    
    console.log('📧 Sending to template:', EMAILJS_CONFIG.templateId);
    console.log('📧 Template params:', templateParams);
    
    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      templateParams
    );
    
    console.log('✅ Contact email sent successfully:', response);
    return response;
  }
  
  isEmailJSConfigured() {
    const isConfigured = EMAILJS_CONFIG.publicKey !== 'TU_PUBLIC_KEY_AQUI' &&
           EMAILJS_CONFIG.serviceId !== 'TU_SERVICE_ID_AQUI' &&
           EMAILJS_CONFIG.templateId !== 'contact_form';
    
    if (!isConfigured) {
      console.log('⚠️ EmailJS not configured. Please update EMAILJS_CONFIG in script.js');
    }
    
    return isConfigured;
  }
  
  validateField(field) {
    if (!field) return true;
    
    const value = field.value.trim();
    const fieldName = field.name || field.id.replace('contact-', '');
    const errorElement = document.getElementById(`${field.id}-error`);
    const formGroup = field.closest('.form-group');
    
    let isValid = true;
    let errorMessage = '';
    
    // Remove previous error state
    if (formGroup) {
      formGroup.classList.remove('form-group--error');
    }
    if (errorElement) {
      errorElement.textContent = '';
    }
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = VALIDATION_MESSAGES.required(fieldName);
    }
    // Email validation
    else if (field.type === 'email' && value && !isValidEmail(value)) {
      isValid = false;
      errorMessage = VALIDATION_MESSAGES.email;
    }
    // Name validation
    else if (fieldName === 'name' && value && value.length < 2) {
      isValid = false;
      errorMessage = VALIDATION_MESSAGES.minLength('Name', 2);
    }
    // Message validation
    else if (fieldName === 'message' && value && value.length < 10) {
      isValid = false;
      errorMessage = VALIDATION_MESSAGES.minLength('Message', 10);
    }
    
    // Show error if validation failed
    if (!isValid && formGroup && errorElement) {
      formGroup.classList.add('form-group--error');
      errorElement.textContent = errorMessage;
    }
    
    return isValid;
  }
}

// Modal Class (unchanged)
class Modal {
  constructor() {
    this.elements = {
      modal: getElement('email-modal'),
      overlay: getElement('modal-overlay'),
      closeBtn: getElement('modal-close'),
      cancelBtn: getElement('modal-cancel'),
      form: getElement('modal-form'),
      inputs: getElements('#modal-form input, #modal-form select, #modal-form textarea'),
      triggers: {
        getWork: getElement('get-work-btn'),
        
      }
    };
    
    this.state = {
      isOpen: false
    };
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    console.log('🚀 Modal module initialized');
  }
  
  bindEvents() {
    // Trigger buttons
    if (this.elements.triggers.getWork) {
      this.elements.triggers.getWork.addEventListener('click', () => this.open());
    }
    if (this.elements.triggers.available) {
      this.elements.triggers.available.addEventListener('click', () => this.open());
    }
    
    // Close buttons
    if (this.elements.closeBtn) {
      this.elements.closeBtn.addEventListener('click', () => this.close());
    }
    if (this.elements.cancelBtn) {
      this.elements.cancelBtn.addEventListener('click', () => this.close());
    }
    if (this.elements.overlay) {
      this.elements.overlay.addEventListener('click', () => this.close());
    }
    
    // Form submission
    if (this.elements.form) {
      this.elements.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    // Real-time validation
    this.elements.inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => {
        const formGroup = input.closest('.form-group');
        if (formGroup && formGroup.classList.contains('form-group--error')) {
          this.validateField(input);
        }
      });
    });
    
    // Keyboard events
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
  }
  
  open() {
    if (!this.elements.modal) return;
    
    this.elements.modal.classList.add('modal--active');
    document.body.classList.add('modal-open');
    this.state.isOpen = true;
    
    // Focus on first input
    const firstInput = this.elements.modal.querySelector('input');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 300);
    }
    
    console.log('🚀 Project inquiry modal opened');
  }
  
  close() {
    if (!this.elements.modal) return;
    
    this.elements.modal.classList.remove('modal--active');
    document.body.classList.remove('modal-open');
    this.state.isOpen = false;
    
    // Reset form
    if (this.elements.form) {
      this.elements.form.reset();
      this.clearErrors();
    }
    
    console.log('🚀 Project inquiry modal closed');
  }
  
  handleKeyboard(e) {
    if (e.key === 'Escape' && this.state.isOpen) {
      this.close();
    }
  }
  
  async handleSubmit(e) {
    e.preventDefault();
    console.log('🚀 Processing project inquiry submission...');
    
    // Validate all required fields
    let isFormValid = true;
    this.elements.inputs.forEach(input => {
      if (!this.validateField(input)) {
        isFormValid = false;
      }
    });
    
    if (!isFormValid) {
      showNotification('Please fix the errors above', 'error');
      return;
    }
    
    // Get form data
    const formData = new FormData(this.elements.form);
    const data = Object.fromEntries(formData.entries());
    
    // Show loading state
    const submitButton = this.elements.form.querySelector('button[type="submit"]');
    setButtonLoading(submitButton, true);
    
    try {
      // Try to send with EmailJS if configured
      if (window.emailjs && this.isEmailJSConfigured()) {
        console.log('🚀 Sending project inquiry via EmailJS...');
        await this.sendProjectInquiry(data);
        showNotification('Project inquiry sent successfully! I\'ll get back to you within 24 hours.', 'success');
      } else {
        console.log('⚠️ EmailJS not configured, simulating submission...');
        // Simulate form submission
        await wait(2000);
        showNotification('EmailJS not configured. Check console for setup instructions.', 'warning');
      }
      
      this.close();
      
    } catch (error) {
      console.error('❌ Project inquiry error:', error);
      showNotification('Failed to send inquiry. Please try again.', 'error');
    } finally {
      setButtonLoading(submitButton, false);
    }
  }
  
  async sendProjectInquiry(data) {
    const templateParams = {
      from_name: data.from_name || '',
      from_email: data.from_email || '',
      company: data.company || 'Not specified',
      project_type: data.project_type || 'Not specified',
      budget: data.budget || 'Not specified',
      timeline: data.timeline || 'Not specified',
      message: data.message || ''
    };
    
    console.log('🚀 Sending to template:', EMAILJS_CONFIG.projectTemplateId);
    console.log('🚀 Template params:', templateParams);
    
    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.projectTemplateId,
      templateParams
    );
    
    console.log('✅ Project inquiry sent successfully:', response);
    return response;
  }
  
  isEmailJSConfigured() {
    const isConfigured = EMAILJS_CONFIG.publicKey !== 'TU_PUBLIC_KEY_AQUI' &&
           EMAILJS_CONFIG.serviceId !== 'TU_SERVICE_ID_AQUI' &&
           EMAILJS_CONFIG.projectTemplateId !== 'project_inquiry';
    
    if (!isConfigured) {
      console.log('⚠️ EmailJS not configured. Please update EMAILJS_CONFIG in script.js');
    }
    
    return isConfigured;
  }
  
  validateField(field) {
    if (!field) return true;
    
    const value = field.value.trim();
    const fieldName = field.name;
    const errorElement = document.getElementById(`modal-${fieldName}-error`);
    const formGroup = field.closest('.form-group');
    
    let isValid = true;
    let errorMessage = '';
    
    // Remove previous error state
    if (formGroup) {
      formGroup.classList.remove('form-group--error');
    }
    if (errorElement) {
      errorElement.textContent = '';
    }
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = VALIDATION_MESSAGES.required(fieldName.replace('from_', '').replace('_', ' '));
    }
    // Email validation
    else if (fieldName === 'from_email' && value && !isValidEmail(value)) {
      isValid = false;
      errorMessage = VALIDATION_MESSAGES.email;
    }
    // Name validation
    else if (fieldName === 'from_name' && value && value.length < 2) {
      isValid = false;
      errorMessage = VALIDATION_MESSAGES.minLength('Name', 2);
    }
    // Message validation
    else if (fieldName === 'message' && value && value.length < 10) {
      isValid = false;
      errorMessage = VALIDATION_MESSAGES.minLength('Message', 10);
    }
    
    // Show error if validation failed
    if (!isValid && formGroup && errorElement) {
      formGroup.classList.add('form-group--error');
      errorElement.textContent = errorMessage;
    }
    
    return isValid;
  }
  
  clearErrors() {
    const errorGroups = this.elements.modal.querySelectorAll('.form-group--error');
    errorGroups.forEach(group => group.classList.remove('form-group--error'));
    
    const errorMessages = this.elements.modal.querySelectorAll('.form-error');
    errorMessages.forEach(message => message.textContent = '');
  }
}

// Main Application Class
class PortfolioApp {
  constructor() {
    this.modules = {};
    this.state = {
      isLoaded: false,
      isMobile: window.innerWidth <= 768
    };
    
    this.init();
  }
  
  async init() {
    try {
      console.log('🚀 Initializing Portfolio Application...');
      
      // Wait for DOM to be fully loaded
      if (document.readyState === 'loading') {
        await new Promise(resolve => {
          document.addEventListener('DOMContentLoaded', resolve);
        });
      }
      
      // Initialize EmailJS if available
      this.initializeEmailJS();
      
      // Initialize all modules
      this.initializeModules();
      
      // Set up global event listeners
      this.bindGlobalEvents();
      
      // Initialize scroll animations
      this.initializeScrollAnimations();
      
      // Mark as loaded
      this.state.isLoaded = true;
      document.body.classList.add('loaded');
      
      this.showWelcomeMessage();
      
    } catch (error) {
      console.error('❌ Failed to initialize application:', error);
    }
  }
  
  initializeEmailJS() {
    if (window.emailjs && EMAILJS_CONFIG.publicKey !== 'TU_PUBLIC_KEY_AQUI') {
      try {
        emailjs.init(EMAILJS_CONFIG.publicKey);
        console.log('✅ EmailJS initialized successfully');
      } catch (error) {
        console.error('❌ EmailJS initialization failed:', error);
      }
    } else {
      console.log('⚠️ EmailJS not configured. Update EMAILJS_CONFIG to enable email functionality.');
    }
  }
  
  initializeModules() {
    try {
      // Initialize navigation
      this.modules.navigation = new Navigation();
      
      // Initialize gallery
      this.modules.gallery = new Gallery();
      
      // Initialize forms
      this.modules.forms = new Forms();
      
      // Initialize modal
      this.modules.modal = new Modal();
      
      console.log('✅ All modules initialized successfully');
      
    } catch (error) {
      console.error('❌ Module initialization failed:', error);
    }
  }
  
  bindGlobalEvents() {
    // Window resize handler
    window.addEventListener('resize', debounce(() => {
      const wasMobile = this.state.isMobile;
      this.state.isMobile = window.innerWidth <= 768;
      
      // Handle mobile/desktop transitions
      if (wasMobile !== this.state.isMobile) {
        this.handleViewportChange();
      }
      
    }, ANIMATION_CONFIG.resizeDebounce));
    
    // Global error handler
    window.addEventListener('error', (e) => {
      console.error('🚨 JavaScript error:', e.error);
    });
    
    // Page visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.handlePageHidden();
      } else {
        this.handlePageVisible();
      }
    });
    
    // Before unload
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });
  }
  
  initializeScrollAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
      '.gallery-card, .project, .service-card, .testimonial-card'
    );
    
    animatedElements.forEach((el) => {
      el.classList.add('animate-on-scroll');
      observer.observe(el);
    });
    
    console.log(`✨ Scroll animations initialized for ${animatedElements.length} elements`);
  }
  
  handleViewportChange() {
    console.log(`📱 Viewport changed to: ${this.state.isMobile ? 'Mobile' : 'Desktop'}`);
  }
  
  handlePageHidden() {
    // Pause animations and auto-scroll when page is hidden
    if (this.modules.gallery) {
      this.modules.gallery.pause();
    }
  }
  
  handlePageVisible() {
    // Resume animations when page becomes visible
    if (this.modules.gallery) {
      this.modules.gallery.play();
    }
  }
  
  cleanup() {
    // Clean up resources before page unload
    if (this.modules.gallery) {
      this.modules.gallery.destroy();
    }
  }
  
  showWelcomeMessage() {
    console.log(
      '%c🎨 Portfolio Website with Dark Mode Loaded Successfully!',
      'color: #178d00; font-size: 16px; font-weight: bold;'
    );
    
    if (!this.isEmailJSConfigured()) {
      console.log(
        '%c📧 NEXT STEPS: Configure EmailJS to enable contact forms',
        'color: #f59e0b; font-size: 14px; font-weight: bold;'
      );
      console.log(
        '%c1. Update EMAILJS_CONFIG.publicKey with your EmailJS Public Key',
        'color: #3b82f6; font-size: 12px;'
      );
      console.log(
        '%c2. Update EMAILJS_CONFIG.serviceId with your EmailJS Service ID',
        'color: #3b82f6; font-size: 12px;'
      );
      console.log(
        '%c3. Create 2 templates: contact_form, project_inquiry',
        'color: #3b82f6; font-size: 12px;'
      );
    } else {
      console.log(
        '%c✅ EmailJS is configured and ready!',
        'color: #22c55e; font-size: 14px; font-weight: bold;'
      );
    }
    
    // Show theme manager status
    if (window.ThemeManager) {
      console.log(
        '%c🌙 Dark Mode: Ready! Click the theme toggle in the navigation.',
        'color: #8b5cf6; font-size: 14px; font-weight: bold;'
      );
    }
  }
  
  isEmailJSConfigured() {
    return EMAILJS_CONFIG.publicKey !== 'TU_PUBLIC_KEY_AQUI' &&
           EMAILJS_CONFIG.serviceId !== 'TU_SERVICE_ID_AQUI' &&
           EMAILJS_CONFIG.templateId === 'contact_form' &&
           EMAILJS_CONFIG.projectTemplateId === 'project_inquiry';
  }
  
  // Public API methods
  getModule(name) {
    return this.modules[name];
  }
  
  isReady() {
    return this.state.isLoaded;
  }
  
  isMobile() {
    return this.state.isMobile;
  }
}

// Initialize application when script loads
document.addEventListener('DOMContentLoaded', () => {
  window.PortfolioApp = new PortfolioApp();
  
  // Expose app instance globally for debugging
  window.app = window.PortfolioApp;
});


document.addEventListener('DOMContentLoaded', function () {
  const el = document.querySelector('.hero__title');
  const texts = [
    "Hey, I'm Ricardo Licardie",
    "Let's build something amazing!"
  ];
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;
  let pauseTime = 1200;

  function type() {
    const currentText = texts[textIndex];
    if (isDeleting) {
      el.textContent = currentText.substring(0, charIndex--);
    } else {
      el.textContent = currentText.substring(0, charIndex++);
    }

    if (!isDeleting && charIndex === currentText.length + 1) {
      isDeleting = true;
      setTimeout(type, pauseTime);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      setTimeout(type, 500);
    } else {
      setTimeout(type, isDeleting ? 50 : typingSpeed);
    }
  }

  type();
});