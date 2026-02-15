// pdfed Landing Page - YC-Level Interactions
// Modern, smooth, delightful

document.addEventListener('DOMContentLoaded', () => {
  // 1. Smooth Scrolling for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Close mobile menu if open
        closeMobileMenu();
      }
    });
  });

  // 2. Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileCloseBtn = document.querySelector('.mobile-close-btn');
  const body = document.body;

  function openMobileMenu() {
    mobileMenu.classList.add('active');
    body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    mobileMenuBtn.classList.add('active');
  }
  function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    body.style.overflow = ''; // Restore scrolling
    mobileMenuBtn.classList.remove('active');
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      if (mobileMenu.classList.contains('active')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', closeMobileMenu);
  }

  // Close menu when clicking on overlay background
  if (mobileMenu) {
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) {
        closeMobileMenu();
      }
    });
  }

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu?.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  // 3. Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animatedElements = document.querySelectorAll('.fade-in-up, .feature-card, .step-item, .metric-item, .testimonial-card');
  animatedElements.forEach(el => {
    if (!el.closest('.hero')) {
      if (!el.classList.contains('fade-in-up')) {
        el.classList.add('fade-in-up');
      }
      el.style.opacity = '0';
      el.style.animationPlayState = 'paused';
      observer.observe(el);
    }
  });

  // 4. Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });

  // 5. Floating Card Parallax Effect (Desktop only)
  const heroSection = document.querySelector('.hero');
  const floatCards = document.querySelectorAll('.float-card');

  if (heroSection && floatCards.length > 0 && window.innerWidth > 768) {
    heroSection.addEventListener('mousemove', (e) => {
      const x = (window.innerWidth - e.pageX * 2) / 100;
      const y = (window.innerHeight - e.pageY * 2) / 100;

      floatCards.forEach((card, index) => {
        const speed = (index + 1) * 1.5;
        card.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    });
    
    heroSection.addEventListener('mouseleave', () => {
      floatCards.forEach(card => {
        card.style.transform = 'translate(0, 0)';
      });
    });
  }

  // 6. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      // Close other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
      // Toggle current item
      item.classList.toggle('active');
    });
  });

  // 7. Counter Animation for Metrics
  const counterElements = document.querySelectorAll('.metric-value[data-count]');
  
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
      current += step;
      if (current < target) {
        el.textContent = Math.floor(current).toLocaleString() + '+';
        requestAnimationFrame(updateCounter);
      } else {
        el.textContent = target.toLocaleString() + '+';
      }
    };
    
    updateCounter();
  };

  // Observe counters
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterElements.forEach(el => counterObserver.observe(el));

  // 8. Add gradient text animation on hero title
  const heroTitle = document.querySelector('.hero-title .highlight');
  if (heroTitle) {
    heroTitle.style.backgroundSize = '200% auto';
  }

  // 9. Smooth reveal for hero image
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0) scale(1)';
          heroObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    
    heroVisual.style.opacity = '0';
    heroVisual.style.transform = 'translateY(40px) scale(0.98)';
    heroVisual.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    heroObserver.observe(heroVisual);
  }

  // 10. Handle window resize - close mobile menu on desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mobileMenu?.classList.contains('active')) {
      closeMobileMenu();
    }
  });
});

// Add active state to nav links based on scroll position
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.pageYOffset >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});
