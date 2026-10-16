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
  initInteractiveWorkbench();
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

/* ==========================================================================
   12. INTERACTIVE ARTISAN WORKBENCH SIMULATOR
   ========================================================================== */
const workbenchPhases = {
  vessel: {
    index: 0,
    badge: "Phase 01 • Clean Vessels",
    title: "Vessel Selection & Hydration Base",
    desc: "Select your ceramic vessel shape and prepare the water reservoir. You'll master Japanese pin frog positioning for organic weight distribution.",
    img: "assets/images/2.png",
    cardTitle: "Technique Highlight: Japanese Kenzan Pin Frog",
    cardText: "Unlike disposable floral foam which contains microplastics and suffocates stem ends, metal pin frogs allow stems to drink clean water freely for twice the vase life.",
    hotspots: [
      { top: "72%", start: "38%", title: "Kenzan Pin Frog", desc: "Heavy Japanese brass pin frog sitting inside the vase. Stems press directly into sharp pins for zero-foam structural integrity." },
      { top: "35%", start: "65%", title: "Artisan Turned Ceramic", desc: "Hand-glazed pottery with natural earthy texture made exclusively by local potters for our studio sessions." },
      { top: "60%", start: "22%", title: "Precision Shears", desc: "Japanese carbon-steel floral shears for clean stem hydration cuts without crushing cell walls." }
    ]
  },
  foliage: {
    index: 1,
    badge: "Phase 02 • Green Skeleton",
    title: "Foliage Grading & Structural Framework",
    desc: "Establish your arrangement's perimeter and height proportions using eucalyptus, olive branches, and textured greenery. This creates the architectural framework.",
    img: "assets/images/23.png",
    cardTitle: "Technique Highlight: 3:5 Proportion Rule",
    cardText: "We teach you the classical proportion rule where tall stems extend 1.5x the height or width of the ceramic vessel to create effortless, natural elegance.",
    hotspots: [
      { top: "25%", start: "30%", title: "Perimeter Branch", desc: "First branch sets the overall width and gesture of the organic design." },
      { top: "50%", start: "55%", title: "Negative Space Gap", desc: "Deliberate pocket left open so focal blooms can breathe without overcrowding." },
      { top: "75%", start: "45%", title: "Stem Collar Wrap", desc: "Low greenery draping gently over the lip of the pottery to soften hard ceramic edges." }
    ]
  },
  blooms: {
    index: 2,
    badge: "Phase 03 • Focal Placement",
    title: "Focal Blooms & Dynamic Angles",
    desc: "Introduce primary garden roses, ranunculus, and delicate accent stems. Learn how slight face-angle variations direct the viewer's eye through the arrangement.",
    img: "assets/images/24.png",
    cardTitle: "Technique Highlight: Color Blocking & Face Direction",
    cardText: "Never point all flowers straight up. Tilting focal blooms outward and angling subtle buds upward mimics how flowers naturally grow in wild meadows.",
    hotspots: [
      { top: "32%", start: "45%", title: "Primary Focal Rose", desc: "Large open garden rose positioned as the visual anchor of the centerpiece." },
      { top: "45%", start: "25%", title: "Secondary Accent Bloom", desc: "Complementary pastel ranunculus floating slightly higher to introduce dynamic depth." },
      { top: "68%", start: "60%", title: "Textural Seed Pod", desc: "Subtle dried poppy pods and textural foliage lending rich tactile personality." }
    ]
  },
  finishing: {
    index: 3,
    badge: "Phase 04 • Packaging & Care",
    title: "Eco Packaging & 14-Day Preservation",
    desc: "Stage your arrangement for the studio photo, then hand-tie a botanical linen ribbon and safely package your creation in our signature carry box with care guide.",
    img: "assets/images/32.png",
    cardTitle: "Technique Highlight: At-Home Floral Longevity",
    cardText: "Every guest receives our studio preservation card: water temperature tips, daily misting guidelines, and clean stem re-cutting for centerpieces that last up to two weeks.",
    hotspots: [
      { top: "40%", start: "50%", title: "Complete Botanical Work", desc: "A museum-worthy centerpiece sculpted entirely by your own hands during the 2-hour session." },
      { top: "80%", start: "35%", title: "Handmade Linen Ribbon", desc: "Soft-dyed natural linen ribbon tied around your vessel for travel." },
      { top: "20%", start: "65%", title: "Longevity Care Guide", desc: "Take-home card explaining hydration maintenance and flower stem preservation." }
    ]
  }
};

function initInteractiveWorkbench() {
  const container = document.querySelector('.workbench-container');
  if (!container) return;

  const stageImg = document.getElementById('workbench-img');
  const stageBadge = document.getElementById('workbench-badge');
  const titleEl = document.getElementById('workbench-title');
  const descEl = document.getElementById('workbench-desc');
  const cardTitle = document.getElementById('workbench-card-title');
  const cardText = document.getElementById('workbench-card-text');
  const buttons = document.querySelectorAll('.workbench-selector-btn');
  const dots = document.querySelectorAll('.workbench-dot');
  const stage = document.querySelector('.workbench-stage');

  function renderHotspots(hotspotList) {
    // Remove existing hotspots
    const oldHotspots = stage.querySelectorAll('.stage-hotspot');
    oldHotspots.forEach(el => el.remove());

    hotspotList.forEach((spot, idx) => {
      const pin = document.createElement('div');
      pin.className = 'stage-hotspot js-hotspot';
      pin.style.top = spot.top;
      pin.style.insetInlineStart = spot.start;
      pin.textContent = idx + 1;
      pin.title = `Click to inspect: ${spot.title}`;

      pin.addEventListener('click', () => {
        if (cardTitle) cardTitle.textContent = spot.title;
        if (cardText) cardText.textContent = spot.desc;
        const liveCard = document.getElementById('workbench-card');
        if (liveCard) {
          liveCard.style.borderColor = 'var(--terracotta-bloom)';
          liveCard.style.boxShadow = '0 6px 20px rgba(201, 111, 85, 0.2)';
          setTimeout(() => {
            liveCard.style.borderColor = 'var(--border-color)';
            liveCard.style.boxShadow = 'none';
          }, 1200);
        }
      });

      stage.appendChild(pin);
    });
  }

  function setPhase(key) {
    const data = workbenchPhases[key];
    if (!data) return;

    buttons.forEach(b => b.classList.toggle('active', b.dataset.workbench === key));
    dots.forEach((d, i) => d.classList.toggle('active', i === data.index));

    if (stageBadge) stageBadge.textContent = data.badge;
    if (titleEl) titleEl.textContent = data.title;
    if (descEl) descEl.textContent = data.desc;
    if (cardTitle) cardTitle.textContent = data.cardTitle;
    if (cardText) cardText.textContent = data.cardText;

    if (stageImg) {
      stageImg.style.opacity = '0';
      stageImg.style.transform = 'scale(0.96)';
      setTimeout(() => {
        stageImg.src = data.img;
        stageImg.style.opacity = '1';
        stageImg.style.transform = 'scale(1)';
        renderHotspots(data.hotspots);
      }, 200);
    }
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      setPhase(btn.dataset.workbench);
    });
  });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const stepIdx = parseInt(dot.dataset.step, 10);
      const keys = Object.keys(workbenchPhases);
      if (keys[stepIdx]) {
        setPhase(keys[stepIdx]);
      }
    });
  });

  // Initial render of first phase
  if (workbenchPhases.vessel) {
    renderHotspots(workbenchPhases.vessel.hotspots);
  }
}

