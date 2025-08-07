/* ==========================================================================
   SEO OPTIMIZATION & SEARCH ENGINE FRIENDLY FEATURES
   ========================================================================== */

class SEOOptimizer {
  constructor() {
    this.init();
  }
  
  init() {
    this.setupStructuredData();
    this.optimizeImages();
    this.setupLazyLoading();
    this.trackPagePerformance();
    this.setupSocialSharing();
    console.log('🚀 SEO Optimizer initialized');
  }
  
  // 📊 Enhanced Structured Data
  setupStructuredData() {
    // Add breadcrumb structured data
    const breadcrumbData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": window.location.origin
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Portfolio",
          "item": window.location.origin + "#work"
        }
      ]
    };
    
    this.addStructuredData(breadcrumbData);
    
    // Add portfolio work structured data
    this.addPortfolioStructuredData();
  }
  
  addStructuredData(data) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }
  
  addPortfolioStructuredData() {
    const portfolioItems = document.querySelectorAll('.gallery-card, .project');
    
    portfolioItems.forEach((item, index) => {
      const title = item.querySelector('h3')?.textContent;
      const description = item.querySelector('p')?.textContent;
      const image = item.querySelector('img')?.src;
      
      if (title) {
        const workData = {
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          "name": title,
          "description": description,
          "image": image,
          "creator": {
            "@type": "Person",
            "name": "Ricardo Licardie"
          },
          "url": window.location.origin + `#project-${index}`
        };
        
        this.addStructuredData(workData);
      }
    });
  }
  
  // 🖼️ Image Optimization for SEO
  optimizeImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      // Add loading="lazy" if not already present
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
      
      // Ensure alt text exists
      if (!img.hasAttribute('alt') || img.alt === '') {
        const figcaption = img.closest('figure')?.querySelector('figcaption');
        const title = img.closest('.gallery-card')?.querySelector('h3')?.textContent;
        
        if (figcaption) {
          img.alt = figcaption.textContent;
        } else if (title) {
          img.alt = `${title} - Portfolio project by Ricardo Licardie`;
        } else {
          img.alt = 'Portfolio work by Ricardo Licardie';
        }
      }
      
      // Add width and height attributes for CLS prevention
      if (!img.hasAttribute('width') && !img.hasAttribute('height')) {
        img.addEventListener('load', function() {
          this.setAttribute('width', this.naturalWidth);
          this.setAttribute('height', this.naturalHeight);
        });
      }
    });
  }
  
  // ⚡ Performance Optimization
  setupLazyLoading() {
    // Intersection Observer for better lazy loading
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // Preload next images
          const nextImages = this.getNextImages(img, 2);
          nextImages.forEach(nextImg => {
            if (nextImg.dataset.src) {
              nextImg.src = nextImg.dataset.src;
              nextImg.removeAttribute('data-src');
            }
          });
          
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px'
    });
    
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      imageObserver.observe(img);
    });
  }
  
  getNextImages(currentImg, count) {
    const allImages = Array.from(document.querySelectorAll('img'));
    const currentIndex = allImages.indexOf(currentImg);
    return allImages.slice(currentIndex + 1, currentIndex + 1 + count);
  }
  
  // 📈 Performance Tracking
  trackPagePerformance() {
    // Core Web Vitals tracking
    if ('web-vital' in window) {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(this.sendToAnalytics);
        getFID(this.sendToAnalytics);
        getFCP(this.sendToAnalytics);
        getLCP(this.sendToAnalytics);
        getTTFB(this.sendToAnalytics);
      });
    }
    
    // Page load performance
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        
        if (perfData) {
          const metrics = {
            'page_load_time': perfData.loadEventEnd - perfData.loadEventStart,
            'dom_content_loaded': perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
            'first_paint': performance.getEntriesByType('paint')[0]?.startTime || 0
          };
          
          // Send to Google Analytics
          if (typeof gtag !== 'undefined') {
            Object.entries(metrics).forEach(([metric, value]) => {
              gtag('event', 'page_performance', {
                'custom_parameter': metric,
                'value': Math.round(value)
              });
            });
          }
        }
      }, 0);
    });
  }
  
  sendToAnalytics(metric) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'web_vitals', {
        'custom_parameter': metric.name,
        'value': Math.round(metric.value),
        'metric_id': metric.id
      });
    }
  }
  
  // 📱 Social Sharing Optimization
  setupSocialSharing() {
    // Dynamic Open Graph updates based on current section
    const updateOGTags = (section) => {
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDescription = document.querySelector('meta[property="og:description"]');
      const ogUrl = document.querySelector('meta[property="og:url"]');
      
      const sectionData = {
        'home': {
          title: 'Ricardo Licardie - Dreamer & Designer | Portfolio',
          description: 'Professional Web Designer & Developer specializing in modern web design, UI/UX, and creative digital solutions.',
          url: window.location.origin
        },
        'work': {
          title: 'Portfolio Work - Ricardo Licardie | Web Design Projects',
          description: 'Explore my latest web design and development projects, including AI platforms, mobile apps, and creative digital solutions.',
          url: window.location.origin + '#work'
        },
        'about': {
          title: 'About Ricardo Licardie | Web Designer & Developer',
          description: 'Learn about Ricardo Licardie, a passionate web designer and developer creating innovative digital experiences.',
          url: window.location.origin + '#about'
        },
        'contact': {
          title: 'Contact Ricardo Licardie | Web Design Services',
          description: 'Get in touch with Ricardo Licardie for your next web design or development project. Available for freelance work.',
          url: window.location.origin + '#contact'
        }
      };
      
      const data = sectionData[section] || sectionData['home'];
      
      if (ogTitle) ogTitle.content = data.title;
      if (ogDescription) ogDescription.content = data.description;
      if (ogUrl) ogUrl.content = data.url;
      
      // Update page title
      document.title = data.title;
    };
    
    // Listen for section changes
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          updateOGTags(sectionId);
          
          // Update URL without page reload
          if (history.pushState) {
            const newUrl = sectionId === 'home' ? 
              window.location.origin : 
              window.location.origin + '#' + sectionId;
            history.pushState(null, '', newUrl);
          }
        }
      });
    }, {
      threshold: 0.5
    });
    
    document.querySelectorAll('section[id]').forEach(section => {
      observer.observe(section);
    });
  }
}

// Initialize SEO Optimizer
window.SEOOptimizer = new SEOOptimizer();

console.log('🚀 SEO Optimization module loaded');
