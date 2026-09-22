/**
 * BLOOM & FORM — FLORAL DESIGN WORKSHOPS
 * Public Website Main JavaScript (assets/js/main.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Core Systems
  initTheme();
  initRTL();
  initNavbar();
  initMobileDrawer();
  initSeasonalSelector();
  initWorkshopFilters();
  initContactForm();
  initLoginForm();
  initRegisterForm();
  initFAQAccordion();
  initBackToTop();
});

/* ==========================================================================
   1. THEME SWITCHING (LIGHT / DARK)
   ========================================================================== */
function initTheme() {
  const savedTheme = localStorage.getItem('bloom-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeToggleUI(savedTheme);

  const themeBtns = document.querySelectorAll('.js-theme-toggle');
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('bloom-theme', newTheme);
      updateThemeToggleUI(newTheme);
      showToast(`Switched to ${newTheme.toUpperCase()} mode`);
    });
  });
}

function updateThemeToggleUI(theme) {
  const themeBtns = document.querySelectorAll('.js-theme-toggle');
  themeBtns.forEach(btn => {
    const label = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    btn.setAttribute('aria-label', label);
    btn.setAttribute('title', label);
  });
  const themeTexts = document.querySelectorAll('.js-theme-text');
  themeTexts.forEach(el => {
    el.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
  });
}

/* ==========================================================================
   2. RTL SWITCHING (LTR / RTL)
   ========================================================================== */
function initRTL() {
  const savedRTL = localStorage.getItem('bloom-rtl') || 'ltr';
  document.documentElement.setAttribute('dir', savedRTL);
  updateRTLToggleUI(savedRTL);

  const rtlBtns = document.querySelectorAll('.js-rtl-toggle');
  rtlBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      document.documentElement.setAttribute('dir', newDir);
      localStorage.setItem('bloom-rtl', newDir);
      updateRTLToggleUI(newDir);
      showToast(`Language direction set to ${newDir.toUpperCase()}`);
    });
  });
}

function updateRTLToggleUI(dir) {
  const rtlBtns = document.querySelectorAll('.js-rtl-toggle');
  rtlBtns.forEach(btn => {
    const label = dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL';
    btn.setAttribute('aria-label', label);
    btn.setAttribute('title', label);
  });
  const rtlTexts = document.querySelectorAll('.js-rtl-text');
  rtlTexts.forEach(el => {
    el.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
  });
}

/* ==========================================================================
   3. STICKY NAVBAR
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   4. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileDrawer() {
  const hamburger = document.querySelector('.mobile-hamburger');
  const drawer = document.querySelector('.mobile-drawer');
  const closeBtn = document.querySelector('.drawer-close-btn');

  if (!hamburger || !drawer) return;

  // Create backdrop if not already existing
  let backdrop = document.querySelector('.drawer-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'drawer-backdrop';
    document.body.appendChild(backdrop);
  }

  const openDrawer = () => {
    drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  // Close when clicking drawer links
  const drawerLinks = drawer.querySelectorAll('.mobile-drawer-link');
  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // ESC key support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   5. INTERACTIVE SEASONAL STORY SELECTOR
   ========================================================================== */
const seasonalData = {
  spring: {
    title: "Garden Bloom & Delicate Stems",
    meta: "SPRING COLLECTION",
    desc: "Celebrate rebirth with soft pastel garden roses, early ranunculus, sweet peas, and fresh eucalyptus branches.",
    img: "assets/images/30.png",
    style: "Garden-inspired, soft color palette & romantic movement."
  },
  summer: {
    title: "Vibrant Botanicals & Wild Textures",
    meta: "SUMMER COLLECTION",
    desc: "Bold dahlias, sunflowers, lush greenery, and meadow wildflowers arranged in natural ceramic vessels.",
    img: "assets/images/12.png",
    style: "Sun-drenched, textured & sculptural garden forms."
  },
  autumn: {
    title: "Earthy Stems & Dried Accents",
    meta: "AUTUMN COLLECTION",
    desc: "Rich rust hues, toasted amaranthus, dried seed pods, and deep amber seasonal foliage.",
    img: "assets/images/13.png",
    style: "Warm, sculptural, long-lasting botanical compositions."
  },
  winter: {
    title: "Architectural Evergreen & Winter Berries",
    meta: "WINTER COLLECTION",
    desc: "Elegantly minimalist cedar branches, white hellebores, silver dollar eucalyptus, and velvet ribbons.",
    img: "assets/images/14.png",
    style: "Textural foliage, crisp contrast & winter studio warmth."
  }
};

function initSeasonalSelector() {
  const tabs = document.querySelectorAll('.seasonal-tab-btn');
  if (!tabs.length) return;

  const titleEl = document.getElementById('seasonal-title');
  const metaEl = document.getElementById('seasonal-meta');
  const descEl = document.getElementById('seasonal-desc');
  const styleEl = document.getElementById('seasonal-style');
  const imgEl = document.getElementById('seasonal-img');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const season = tab.dataset.season;
      if (!seasonalData[season]) return;

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const data = seasonalData[season];
      if (titleEl) titleEl.textContent = data.title;
      if (metaEl) metaEl.textContent = data.meta;
      if (descEl) descEl.textContent = data.desc;
      if (styleEl) styleEl.textContent = data.style;
      if (imgEl) {
        imgEl.style.opacity = 0;
        setTimeout(() => {
          imgEl.src = data.img;
          imgEl.style.opacity = 1;
        }, 200);
      }
    });
  });
}

/* ==========================================================================
   6. WORKSHOP FILTER SYSTEM
   ========================================================================== */
function initWorkshopFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workshopCards = document.querySelectorAll('.workshop-card');

  if (!filterBtns.length || !workshopCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.dataset.filter;

      workshopCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease-out forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   7. CONTACT FORM VALIDATION
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name');
    const email = document.getElementById('contact-email');
    const type = document.getElementById('contact-type');
    const message = document.getElementById('contact-message');

    let isValid = true;

    if (!name.value.trim()) {
      showFieldError('name-error', 'Please enter your full name');
      isValid = false;
    } else {
      hideFieldError('name-error');
    }

    if (!email.value.trim() || !validateEmail(email.value)) {
      showFieldError('email-error', 'Please enter a valid email address');
      isValid = false;
    } else {
      hideFieldError('email-error');
    }

    if (!message.value.trim()) {
      showFieldError('message-error', 'Please write your message or enquiry');
      isValid = false;
    } else {
      hideFieldError('message-error');
    }

    if (isValid) {
      showToast('YOUR ENQUIRY HAS BEEN RECEIVED. We will respond within 24 hours.');
      contactForm.reset();
    }
  });
}

function showFieldError(id, msg) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = msg;
    el.style.display = 'block';
  }
}

function hideFieldError(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ==========================================================================
   8. AUTH & LOGIN / REGISTER VALIDATION
   ========================================================================== */
function initLoginForm() {
  const loginForm = document.getElementById('login-form');
  
  // Attach Social Login Listeners
  document.querySelectorAll('.js-social-login').forEach(btn => {
    btn.addEventListener('click', () => {
      const provider = btn.getAttribute('data-provider') || 'Social Account';
      showToast(`Signing in with ${provider}... Redirecting to portal...`);
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 800);
    });
  });

  if (!loginForm) return;

  const pwdInput = document.getElementById('login-password');
  const togglePwdBtn = document.getElementById('toggle-password');

  if (togglePwdBtn && pwdInput) {
    togglePwdBtn.addEventListener('click', () => {
      const type = pwdInput.getAttribute('type') === 'password' ? 'text' : 'password';
      pwdInput.setAttribute('type', type);
      togglePwdBtn.textContent = type === 'password' ? 'Show' : 'Hide';
    });
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = pwdInput ? pwdInput.value.trim() : '';

    if (email && password) {
      showToast('Login successful! Redirecting to guest studio portal...');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 800);
    }
  });
}

function initRegisterForm() {
  const regForm = document.getElementById('register-form');
  if (!regForm) return;

  const pwdInput = document.getElementById('reg-password');
  const confirmPwdInput = document.getElementById('reg-confirm-password');
  const togglePwdBtn = document.getElementById('toggle-reg-password');
  const toggleConfirmPwdBtn = document.getElementById('toggle-reg-confirm-password');
  const errorEl = document.getElementById('register-error');

  if (togglePwdBtn && pwdInput) {
    togglePwdBtn.addEventListener('click', () => {
      const type = pwdInput.getAttribute('type') === 'password' ? 'text' : 'password';
      pwdInput.setAttribute('type', type);
      togglePwdBtn.textContent = type === 'password' ? 'Show' : 'Hide';
    });
  }

  if (toggleConfirmPwdBtn && confirmPwdInput) {
    toggleConfirmPwdBtn.addEventListener('click', () => {
      const type = confirmPwdInput.getAttribute('type') === 'password' ? 'text' : 'password';
      confirmPwdInput.setAttribute('type', type);
      toggleConfirmPwdBtn.textContent = type === 'password' ? 'Show' : 'Hide';
    });
  }

  regForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (pwdInput && confirmPwdInput && pwdInput.value !== confirmPwdInput.value) {
      if (errorEl) {
        errorEl.textContent = 'Passwords do not match. Please try again.';
        errorEl.style.display = 'block';
      }
      return;
    }

    if (errorEl) errorEl.style.display = 'none';
    showToast('Account created successfully! Welcome to Bloom & Form.');
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 900);
  });
}

/* ==========================================================================
   9. FAQ ACCORDION
   ========================================================================== */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isOpen) item.classList.add('active');
    });
  });
}

/* ==========================================================================
   10. TOAST NOTIFICATIONS
   ========================================================================== */
function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>✿</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}

/* ==========================================================================
   11. FLOATING BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  let btn = document.querySelector('.back-to-top-btn');
  if (!btn) {
    btn = document.createElement('button');
    btn.className = 'back-to-top-btn';
    btn.setAttribute('aria-label', 'Back to top');
    btn.setAttribute('title', 'Back to top');
    btn.innerHTML = '↑';
    document.body.appendChild(btn);
  }

  const handleScroll = () => {
    if (window.scrollY > 280) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
