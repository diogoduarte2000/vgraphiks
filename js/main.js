/**
 * v.graphiks - Main JavaScript File
 * Responsável por inicializar todos os módulos e funcionalidades do site
 */

// =============================================
// Configurações Globais
// =============================================
const CONFIG = {
  mobileBreakpoint: 768, // px
  parallaxSpeed: 0.3, // Velocidade do efeito parallax
  testimonialInterval: 6000 // ms
};

// =============================================
// Função Principal (DOMContentLoaded)
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  // Inicializa todos os módulos
  initStickyNav();
  initTestimonials();
  initParallax();
  initLanguageSystem();
  
  // Carrega CSS crítico
  loadCriticalCSS();
  
  // Verifica se é mobile
  detectMobile();
});

// =============================================
// Módulo: Sticky Navigation
// =============================================
function initStickyNav() {
  const navbar = document.getElementById('navbar');
  const header = document.querySelector('header');
  
  if (!navbar || !header) return;

  const headerHeight = header.offsetHeight;
  
  const updateNavbar = () => {
    const scrollPosition = window.pageYOffset;
    const headerScrollRatio = Math.min(scrollPosition / headerHeight, 1);
    
    if (scrollPosition > headerHeight) {
      navbar.classList.add('fixed');
      navbar.style.transform = 'translateY(0)';
    } 
    else if (scrollPosition > 0) {
      navbar.classList.remove('fixed');
      navbar.style.transform = `translateY(${-headerScrollRatio * 100}%)`;
    }
    else {
      navbar.classList.remove('fixed');
      navbar.style.transform = 'translateY(0)';
    }
  };
  
  // Otimização com requestAnimationFrame
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateNavbar();
        ticking = false;
      });
      ticking = true;
    }
  });
  
  // Executa uma vez ao carregar
  updateNavbar();
}

// =============================================
// Módulo: Testimonial Slider
// =============================================
function initTestimonials() {
  const testimonials = document.querySelectorAll('.testimonial');
  if (testimonials.length === 0) return;

  let current = 0;
  let interval;
  
  const showTestimonial = (index) => {
    testimonials.forEach((t, i) => {
      t.classList.remove('active', 'prev', 'next');
      
      if (i === index) {
        t.classList.add('active');
        // Pré-carrega a próxima imagem
        const nextIndex = (index + 1) % testimonials.length;
        const nextImg = testimonials[nextIndex].querySelector('img');
        if (nextImg && !nextImg.src) {
          nextImg.src = nextImg.dataset.src || nextImg.getAttribute('src');
        }
      }
      else if (i === (index + 1) % testimonials.length) t.classList.add('next');
      else if (i === (index - 1 + testimonials.length) % testimonials.length) t.classList.add('prev');
    });
    current = index;
  };
  
  const nextTestimonial = () => {
    showTestimonial((current + 1) % testimonials.length);
    resetInterval();
  };
  
  const prevTestimonial = () => {
    showTestimonial((current - 1 + testimonials.length) % testimonials.length);
    resetInterval();
  };
  
  const resetInterval = () => {
    clearInterval(interval);
    interval = setInterval(nextTestimonial, CONFIG.testimonialInterval);
  };
  
  // Controles públicos
  window.nextTestimonial = nextTestimonial;
  window.prevTestimonial = prevTestimonial;
  
  // Inicialização
  showTestimonial(0);
  interval = setInterval(nextTestimonial, CONFIG.testimonialInterval);
  
  // Pausa ao passar o mouse
  const testimonialContainer = document.querySelector('.testimonials');
  if (testimonialContainer) {
    testimonialContainer.addEventListener('mouseenter', () => clearInterval(interval));
    testimonialContainer.addEventListener('mouseleave', resetInterval);
  }
}

// =============================================
// Módulo: Parallax Effect
// =============================================
function initParallax() {
  const developmentSection = document.querySelector('.development');
  if (!developmentSection) return;

  let ticking = false;
  let lastScrollPosition = 0;
  
  const updateParallax = () => {
    developmentSection.style.setProperty('--parallax-pos', `${lastScrollPosition * CONFIG.parallaxSpeed}px`);
    ticking = false;
  };
  
  window.addEventListener('scroll', () => {
    lastScrollPosition = window.scrollY || window.pageYOffset;
    
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });
}

// =============================================
// Módulo: Language Switcher
// =============================================
function initLanguageSystem() {
  const translations = {
    // ... (insira aqui o objeto completo de traduções do código anterior)
  };
  
  let currentLanguage = localStorage.getItem('preferredLanguage') || 'pt';
  
  const setLanguage = (lang) => {
    if (currentLanguage === lang) return;
    
    currentLanguage = lang;
    updateLanguage();
    localStorage.setItem('preferredLanguage', lang);
    
    // Atualiza botões
    document.getElementById('pt-btn')?.classList.toggle('active', lang === 'pt');
    document.getElementById('en-btn')?.classList.toggle('active', lang === 'en');
  };
  
  const updateLanguage = () => {
    // Atualiza todos os textos conforme o idioma selecionado
    // ... (implemente a mesma lógica de atualização do código anterior)
  };
  
  // Interface pública
  window.setLanguage = setLanguage;
  
  // Inicialização
  updateLanguage();
}

// =============================================
// Funções Auxiliares
// =============================================
function loadCriticalCSS() {
  // CSS necessário para renderização inicial
  const criticalCSS = `
    header, .navbar, .description {
      opacity: 1 !important;
    }
    .navbar {
      transition: transform 0.3s ease;
    }
  `;
  
  const style = document.createElement('style');
  style.id = 'critical-css';
  style.textContent = criticalCSS;
  document.head.appendChild(style);
}

function detectMobile() {
  const isMobile = window.innerWidth < CONFIG.mobileBreakpoint;
  document.documentElement.classList.toggle('is-mobile', isMobile);
  
  // Atualiza ao redimensionar (debounced)
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const newIsMobile = window.innerWidth < CONFIG.mobileBreakpoint;
      if (isMobile !== newIsMobile) {
        document.documentElement.classList.toggle('is-mobile', newIsMobile);
      }
    }, 100);
  });
}

// =============================================
// Polyfills (se necessário)
// =============================================
// requestAnimationFrame polyfill
(function() {
  const vendors = ['ms', 'moz', 'webkit', 'o'];
  for (let i = 0; i < vendors.length && !window.requestAnimationFrame; i++) {
    window.requestAnimationFrame = window[`${vendors[i]}RequestAnimationFrame`];
    window.cancelAnimationFrame = window[`${vendors[i]}CancelAnimationFrame`] || 
                                 window[`${vendors[i]}CancelRequestAnimationFrame`];
  }
  
  if (!window.requestAnimationFrame) {
    let lastTime = 0;
    window.requestAnimationFrame = function(callback) {
      const currTime = Date.now();
      const timeToCall = Math.max(0, 16 - (currTime - lastTime));
      const id = setTimeout(() => callback(currTime + timeToCall), timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
    
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }
})();