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
  
  // Atualiza o ano no footer
  document.getElementById('current-year').textContent = new Date().getFullYear();
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
    const scrollPosition = window.scrollY || window.pageYOffset;
    const sectionOffset = developmentSection.offsetTop;
    const sectionHeight = developmentSection.offsetHeight;
    
    // Calcula a posição relativa do scroll na seção (0 a 1)
    const scrollRatio = Math.min(Math.max((scrollPosition - sectionOffset) / sectionHeight, 0), 1);
    
    // Mapeia para um valor entre -100px e 100px para o movimento
    const parallaxValue = (scrollRatio * 200) - 100;
    
    developmentSection.style.setProperty('--parallax-pos', `${parallaxValue}px`);
    ticking = false;
  };
  
  window.addEventListener('scroll', () => {
    lastScrollPosition = window.scrollY || window.pageYOffset;
    
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });

  // Inicializa
  updateParallax();
}

// =============================================
// Módulo: Language Switcher (Completo e Atualizado)
// =============================================
function initLanguageSystem() {
  const translations = {
    pt: {
      // Navegação
      "projects": "Projetos",
      "development": "Desenvolvimento",
      "testimonials": "Depoimentos",
      "pricing": "Preços",
      "contact": "Contato",
      
      // Descrição
      "description_text": "Na v.graphiks, criamos soluções visuais que combinam criatividade, funcionalidade e impacto. Do branding ao motion design, os nossos clientes confiam no nosso trabalho para dar vida às suas ideias e destacar as suas marcas.",
      
      // Serviços
      "services_title": "Nossos Serviços",
      "service1_title": "Branding",
      "service1_text": "Criação de identidades visuais completas que comunicam a essência da sua marca de forma memorável.",
      "service2_title": "Motion Design",
      "service2_text": "Animações e vídeos que contam histórias e engajam seu público-alvo de forma dinâmica.",
      "service3_title": "Design Gráfico",
      "service3_text": "Soluções visuais para impressos e digitais, desde cartões de visita a banners para redes sociais.",
      "service4_title": "Apresentações",
      "service4_text": "Slides profissionais e impactantes que destacam seu conteúdo e mantêm a audiência engajada.",
      
      // Processo
      "development_title": "Nosso Processo de Desenvolvimento",
      "development_text": "Na V.GRAPHIKS, combinamos criatividade, tecnologia e estratégia para criar experiências visuais excepcionais. Nosso processo é projetado para ser flexível, colaborativo e eficiente, garantindo que cada projeto atenda aos mais altos padrões.",
      
      // Depoimentos
      "testimonial1_text": "A v.graphiks superou as minhas expectativas! O branding que criaram para a nossa empresa foi simplesmente incrível e ajudou-nos a estabelecer uma identidade forte no mercado.",
      "testimonial2_text": "Serviço muito profissional e rápido. A v.graphiks captou exatamente o que pretendíamos para os nossos vídeos promocionais, resultando num aumento de 30% no engajamento.",
      "testimonial3_text": "Fiquei impressionada com a atenção ao detalhe e a capacidade de traduzir ideias abstratas em designs concretos. Recomendo vivamente a v.graphiks para qualquer projeto de design.",
      
      // Preços
      "pricing_title": "Tabela de Preços",
      "service_col": "Serviço",
      "description_col": "Descrição",
      "price_col": "Preço",
      "logo_design": "Design de Logotipo",
      "visual_identity": "Identidade Visual",
      "motion_design": "Motion Design",
      "social_post": "Post para Redes Sociais",
      "presentation": "Apresentação",
      
      // Contato
      "contact_title": "Contacte-nos",
      "contact_text": "Tem um projeto em mente? Entre em contacto connosco através do email, WhatsApp ou telefone. Estamos disponíveis para discutir suas necessidades e criar soluções visuais que destacarão sua marca no mercado.",
      "send_email": "Enviar Email",
      "whatsapp": "WhatsApp",
      
      // Footer
      "footer_text": "v.graphiks - Todos os direitos reservados"
    },
    en: {
      // Navigation
      "projects": "Projects",
      "development": "Development",
      "testimonials": "Testimonials",
      "pricing": "Pricing",
      "contact": "Contact",
      
      // Description
      "description_text": "At v.graphiks, we create visual solutions that combine creativity, functionality and impact. From branding to motion design, our clients trust our work to bring their ideas to life and make their brands stand out.",
      
      // Services
      "services_title": "Our Services",
      "service1_title": "Branding",
      "service1_text": "Creation of complete visual identities that communicate your brand's essence in a memorable way.",
      "service2_title": "Motion Design",
      "service2_text": "Animations and videos that tell stories and dynamically engage your target audience.",
      "service3_title": "Graphic Design",
      "service3_text": "Visual solutions for print and digital, from business cards to social media banners.",
      "service4_title": "Presentations",
      "service4_text": "Professional and impactful slides that highlight your content and keep the audience engaged.",
      
      // Process
      "development_title": "Our Development Process",
      "development_text": "At V.GRAPHIKS, we combine creativity, technology and strategy to create exceptional visual experiences. Our process is designed to be flexible, collaborative and efficient, ensuring every project meets the highest standards.",
      
      // Testimonials
      "testimonial1_text": "v.graphiks exceeded my expectations! The branding they created for our company was simply amazing and helped us establish a strong identity in the market.",
      "testimonial2_text": "Very professional and fast service. v.graphiks captured exactly what we wanted for our promotional videos, resulting in a 30% increase in engagement.",
      "testimonial3_text": "I was impressed with the attention to detail and ability to translate abstract ideas into concrete designs. I highly recommend v.graphiks for any design project.",
      
      // Pricing
      "pricing_title": "Pricing Table",
      "service_col": "Service",
      "description_col": "Description",
      "price_col": "Price",
      "logo_design": "Logo Design",
      "visual_identity": "Visual Identity",
      "motion_design": "Motion Design",
      "social_post": "Social Media Post",
      "presentation": "Presentation",
      
      // Contact
      "contact_title": "Contact Us",
      "contact_text": "Have a project in mind? Contact us via email, WhatsApp or phone. We're available to discuss your needs and create visual solutions that will make your brand stand out in the market.",
      "send_email": "Send Email",
      "whatsapp": "WhatsApp",
      
      // Footer
      "footer_text": "v.graphiks - All rights reserved"
    }
  };

  let currentLanguage = localStorage.getItem('preferredLanguage') || 'pt';
  
  const setLanguage = (lang) => {
    if (currentLanguage === lang) return;
    currentLanguage = lang;
    localStorage.setItem('preferredLanguage', lang);
    updateLanguage();
  };

  const updateLanguage = () => {
    // Atualiza elementos com data-translate
    document.querySelectorAll('[data-translate]').forEach(el => {
      const key = el.getAttribute('data-translate');
      if (translations[currentLanguage][key]) {
        if (el.hasAttribute('data-html')) {
          el.innerHTML = translations[currentLanguage][key];
        } else {
          el.textContent = translations[currentLanguage][key];
        }
      }
    });

    // Atualiza os depoimentos
    const testimonials = document.querySelectorAll('.testimonial-content p');
    testimonials.forEach((testimonial, index) => {
      const key = `testimonial${index + 1}_text`;
      if (translations[currentLanguage][key]) {
        testimonial.textContent = translations[currentLanguage][key];
      }
    });

    // Atualiza os textos das features
    document.querySelectorAll('.feature h3').forEach((feature, index) => {
      const key = `feature${index + 1}_title`;
      if (translations[currentLanguage][key]) {
        feature.textContent = translations[currentLanguage][key];
      }
    });

    document.querySelectorAll('.feature p').forEach((feature, index) => {
      const key = `feature${index + 1}_text`;
      if (translations[currentLanguage][key]) {
        feature.textContent = translations[currentLanguage][key];
      }
    });
  };

  // Event listeners para botões de idioma
  const ptBtn = document.getElementById('pt-btn');
  const enBtn = document.getElementById('en-btn');
  
  if (ptBtn && enBtn) {
    ptBtn.addEventListener('click', () => setLanguage('pt'));
    enBtn.addEventListener('click', () => setLanguage('en'));
    
    // Atualiza estado dos botões
    ptBtn.classList.toggle('active', currentLanguage === 'pt');
    enBtn.classList.toggle('active', currentLanguage === 'en');
  }

  // Inicializa
  updateLanguage();
  window.setLanguage = setLanguage;
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