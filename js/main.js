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

// =============================================
// Módulo: Language Switcher
// =============================================
function initLanguageSystem() {
  const translations = {
    pt: {
      "projects": "Projetos",
      "development": "Desenvolvimento",
      "testimonials": "Depoimentos",
      "pricing": "Preços",
      "contact": "Contato",
      "description_text": "Na v.graphiks, criamos soluções visuais que combinam criatividade, funcionalidade e impacto. Do branding ao motion design, os nossos clientes confiam no nosso trabalho para dar vida às suas ideias e destacar as suas marcas.",
      "services_title": "Nossos Serviços",
      "service1_title": "Branding",
      "service1_text": "Criação de identidades visuais completas que comunicam a essência da sua marca de forma memorável.",
      "service2_title": "Motion Design",
      "service2_text": "Animações e vídeos que contam histórias e engajam seu público-alvo de forma dinâmica.",
      "service3_title": "Design Gráfico",
      "service3_text": "Soluções visuais para impressos e digitais, desde cartões de visita a banners para redes sociais.",
      "service4_title": "Apresentações",
      "service4_text": "Slides profissionais e impactantes que destacam seu conteúdo e mantêm a audiência engajada.",
      "development_title": "Nosso Processo de Desenvolvimento",
      "development_text": "Na v.graphiks, combinamos criatividade, tecnologia e estratégia para criar experiências visuais excepcionais. Nosso processo é projetado para ser flexível, colaborativo e eficiente, garantindo que cada projeto atenda aos mais altos padrões.",
      "step1_title": "1. Descoberta & Estratégia",
      "step1_text": "Começamos entendendo sua visão, objetivos e público-alvo. Através de pesquisa e análise, definimos o melhor caminho.",
      "step2_title": "2. Conceito & Design",
      "step3_title": "3. Execução & Refinamento",
      "step4_title": "4. Testes & Entrega",
      "why_choose_title": "Por Que Escolher Nosso Processo?",
      "why1": "✅ Ágil & Adaptável – Ajustamos ao feedback em tempo real.",
      "why2": "✅ Ferramentas Modernas – Desde design assistido por IA até motion graphics.",
      "why3": "✅ Colaboração Transparente – Você está envolvido em cada etapa.",
      "pricing_title": "Tabela de Preços",
      "contact_title": "Contacte-nos",
      "contact_text": "Tem um projeto em mente? Entre em contacto connosco através do email, WhatsApp ou telefone. Estamos disponíveis para discutir suas necessidades e criar soluções visuais que destacarão sua marca no mercado.",
      "footer_text": "v.graphiks - Todos os direitos reservados"
    },
    en: {
      "projects": "Projects",
      "development": "Development",
      "testimonials": "Testimonials",
      "pricing": "Pricing",
      "contact": "Contact",
      "description_text": "At v.graphiks, we create visual solutions that combine creativity, functionality and impact. From branding to motion design, our clients trust our work to bring their ideas to life and make their brands stand out.",
      "services_title": "Our Services",
      "service1_title": "Branding",
      "service1_text": "Creation of complete visual identities that communicate the essence of your brand in a memorable way.",
      "service2_title": "Motion Design",
      "service2_text": "Animations and videos that tell stories and engage your target audience dynamically.",
      "service3_title": "Graphic Design",
      "service3_text": "Visual solutions for print and digital, from business cards to social media banners.",
      "service4_title": "Presentations",
      "service4_text": "Professional and impactful slides that highlight your content and keep the audience engaged.",
      "development_title": "Our Development Process",
      "development_text": "At v.graphiks, we combine creativity, technology and strategy to create exceptional visual experiences. Our process is designed to be flexible, collaborative and efficient, ensuring each project meets the highest standards.",
      "step1_title": "1. Discovery & Strategy",
      "step1_text": "We start by understanding your vision, goals and target audience. Through research and analysis, we define the best path.",
      "step2_title": "2. Concept & Design",
      "step3_title": "3. Execution & Refinement",
      "step4_title": "4. Testing & Delivery",
      "why_choose_title": "Why Choose Our Process?",
      "why1": "✅ Agile & Adaptable – We adjust to feedback in real time.",
      "why2": "✅ Modern Tools – From AI-assisted design to motion graphics.",
      "why3": "✅ Transparent Collaboration – You're involved in every step.",
      "pricing_title": "Pricing Table",
      "contact_title": "Contact Us",
      "contact_text": "Have a project in mind? Contact us via email, WhatsApp or phone. We're available to discuss your needs and create visual solutions that will make your brand stand out in the market.",
      "footer_text": "v.graphiks - All rights reserved"
    }
  };

  let currentLanguage = localStorage.getItem('preferredLanguage') || 'pt';
  
  const setLanguage = (lang) => {
    if (currentLanguage === lang) return;
    
    currentLanguage = lang;
    updateLanguage();
    localStorage.setItem('preferredLanguage', lang);
    
    // Update buttons
    document.getElementById('pt-btn')?.classList.toggle('active', lang === 'pt');
    document.getElementById('en-btn')?.classList.toggle('active', lang === 'en');
  };
  
  const updateLanguage = () => {
    // Update all elements with data-translate attribute
    document.querySelectorAll('[data-translate]').forEach(el => {
      const key = el.getAttribute('data-translate');
      if (translations[currentLanguage][key]) {
        el.textContent = translations[currentLanguage][key];
      }
    });

    // Update navigation links
    document.querySelectorAll('.nav-links a').forEach((link, index) => {
      const keys = ['projects', 'development', 'testimonials', 'pricing', 'contact'];
      if (keys[index]) {
        link.textContent = translations[currentLanguage][keys[index]];
      }
    });

    // Update service cards
    document.querySelectorAll('.service-card h3').forEach((card, index) => {
      const keys = ['service1_title', 'service2_title', 'service3_title', 'service4_title'];
      if (keys[index]) {
        card.textContent = translations[currentLanguage][keys[index]];
      }
    });

    document.querySelectorAll('.service-card p').forEach((card, index) => {
      const keys = ['service1_text', 'service2_text', 'service3_text', 'service4_text'];
      if (keys[index]) {
        card.textContent = translations[currentLanguage][keys[index]];
      }
    });

    // Update process steps
    document.querySelectorAll('.process-step h3').forEach((step, index) => {
      const keys = ['step1_title', 'step2_title', 'step3_title', 'step4_title'];
      if (keys[index]) {
        step.textContent = translations[currentLanguage][keys[index]];
      }
    });

    document.querySelectorAll('.process-step p').forEach((step, index) => {
      const keys = ['step1_text', 'step2_text', 'step3_text', 'step4_text'];
      if (keys[index] && translations[currentLanguage][keys[index]]) {
        step.textContent = translations[currentLanguage][keys[index]];
      }
    });

    // Update why choose section
    const whyChoose = document.querySelector('.why-choose');
    if (whyChoose) {
      whyChoose.querySelector('h3').textContent = translations[currentLanguage]['why_choose_title'];
      whyChoose.querySelectorAll('p').forEach((p, index) => {
        const keys = ['why1', 'why2', 'why3'];
        if (keys[index]) {
          p.textContent = translations[currentLanguage][keys[index]];
        }
      });
    }

    // Update footer
    const footer = document.querySelector('footer p');
    if (footer) {
      const year = new Date().getFullYear();
      footer.innerHTML = `© ${year} ${translations[currentLanguage]['footer_text']}`;
    }
  };
  
  // Public interface
  window.setLanguage = setLanguage;
  
  // Initialize
  updateLanguage();
}