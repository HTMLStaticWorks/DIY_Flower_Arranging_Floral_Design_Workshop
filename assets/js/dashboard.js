/**
 * BLOOM & FORM — GUEST DASHBOARD PORTAL
 * Dashboard JavaScript (assets/js/dashboard.js)
 * Supports Single-File Tabbed Router & Interactive Booking Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initDashboardRouter();
  initDashboardMobileSidebar();
  initNotificationDropdown();
  initBookingWizard();
  initProfileEditor();
  initLogout();
  initDashboardThemeAndRTL();
});

/* ==========================================================================
   1. DASHBOARD SINGLE-PAGE TAB ROUTER
   ========================================================================== */
function initDashboardRouter() {
  const menuLinks = document.querySelectorAll('.js-dash-tab');
  const views = document.querySelectorAll('.tab-view');
  const topbarTitle = document.getElementById('dash-topbar-title');

  const titles = {
    'overview': 'Overview',
    'bookings': 'My Bookings',
    'book-wizard': 'Book a Workshop',
    'seasonal': 'Seasonal Workshops',
    'rewards': 'Loyalty Rewards',
    'payments': 'Payment History',
    'profile': 'Guest Profile',
    'support': 'Help & Support'
  };

  const switchTab = (targetId) => {
    const targetView = document.getElementById(`tab-${targetId}`);
    if (!targetView) return;

    views.forEach(v => v.classList.remove('active'));
    menuLinks.forEach(l => l.classList.remove('active'));

    targetView.classList.add('active');

    const activeLink = document.querySelector(`.js-dash-tab[data-tab="${targetId}"]`);
    if (activeLink) activeLink.classList.add('active');

    if (topbarTitle && titles[targetId]) {
      topbarTitle.textContent = titles[targetId];
    }

    // Close mobile sidebar if open
    const sidebar = document.querySelector('.dashboard-sidebar');
    if (sidebar) sidebar.classList.remove('mobile-open');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = link.dataset.tab;
      switchTab(tabId);
    });
  });

  // Handle trigger buttons (e.g. "Change Session" or "Book Workshop" from cards)
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-switch-tab]');
    if (trigger) {
      e.preventDefault();
      switchTab(trigger.dataset.switchTab);
    }
  });
}

/* ==========================================================================
   2. MOBILE SIDEBAR DRAWER
   ========================================================================== */
function initDashboardMobileSidebar() {
  const hamburger = document.getElementById('dash-hamburger');
  const sidebar = document.querySelector('.dashboard-sidebar');

  if (hamburger && sidebar) {
    hamburger.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
    });
  }
}

/* ==========================================================================
   3. NOTIFICATION DROPDOWN MANAGER
   ========================================================================== */
function initNotificationDropdown() {
  const btn = document.getElementById('notif-toggle-btn');
  const dropdown = document.getElementById('notif-dropdown');
  const markAllBtn = document.getElementById('mark-all-read');
  const unreadItems = document.querySelectorAll('.notif-item.unread');
  const countBadge = document.querySelector('.notif-badge-count');

  if (btn && dropdown) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target) && !btn.contains(e.target)) {
        dropdown.classList.remove('show');
      }
    });
  }

  if (markAllBtn) {
    markAllBtn.addEventListener('click', () => {
      unreadItems.forEach(item => item.classList.remove('unread'));
      if (countBadge) countBadge.style.display = 'none';
      showDashToast('All notifications marked as read.');
    });
  }
}

/* ==========================================================================
   4. INTERACTIVE 5-STEP WORKSHOP BOOKING WIZARD
   ========================================================================== */
const bookingState = {
  workshop: 'Seasonal Botanical Bouquet',
  price: '$120',
  date: 'Sep 27, 2026',
  time: '2:00 PM',
  guests: '1 Guest'
};

function initBookingWizard() {
  const wizard = document.getElementById('booking-wizard-container');
  if (!wizard) return;

  const stepCards = wizard.querySelectorAll('.wizard-step-card');
  const stepPills = wizard.querySelectorAll('.wizard-step-pill');
  const progressFill = document.getElementById('wizard-progress-fill');

  let currentStep = 1;

  const goToStep = (step) => {
    currentStep = step;
    stepCards.forEach((c, idx) => {
      c.style.display = (idx + 1 === step) ? 'block' : 'none';
    });
    stepPills.forEach((p, idx) => {
      if (idx + 1 === step) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });

    if (progressFill) {
      progressFill.style.width = `${((step - 1) / 4) * 100}%`;
    }
  };

  // Workshop Selection
  const optionCards = wizard.querySelectorAll('.js-select-workshop');
  optionCards.forEach(card => {
    card.addEventListener('click', () => {
      optionCards.forEach(c => {
        c.classList.remove('selected');
        const badge = c.querySelector('.wizard-badge-check');
        if (badge) badge.textContent = 'SELECT CLASS';
      });
      card.classList.add('selected');
      const activeBadge = card.querySelector('.wizard-badge-check');
      if (activeBadge) activeBadge.textContent = '✓ SELECTED';

      bookingState.workshop = card.dataset.title;
      bookingState.price = card.dataset.price;
    });
  });

  // Date selection
  const dateBtns = wizard.querySelectorAll('.js-select-date');
  dateBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      dateBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      bookingState.date = btn.dataset.date;
    });
  });

  // Time selection
  const timeBtns = wizard.querySelectorAll('.js-select-time');
  timeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      timeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      bookingState.time = btn.dataset.time;
    });
  });

  // Guests selection
  const guestSelect = document.getElementById('wizard-guest-count');
  if (guestSelect) {
    guestSelect.addEventListener('change', () => {
      bookingState.guests = guestSelect.value;
    });
  }

  // Next / Back buttons
  wizard.addEventListener('click', (e) => {
    if (e.target.closest('.js-next-step')) {
      if (currentStep < 5) {
        if (currentStep === 4) {
          updateSummary();
        }
        goToStep(currentStep + 1);
      }
    } else if (e.target.closest('.js-prev-step')) {
      if (currentStep > 1) {
        goToStep(currentStep - 1);
      }
    } else if (e.target.closest('.js-confirm-booking')) {
      generateConfirmation();
    }
  });

  function updateSummary() {
    document.getElementById('sum-workshop').textContent = bookingState.workshop;
    document.getElementById('sum-date').textContent = bookingState.date;
    document.getElementById('sum-time').textContent = bookingState.time;
    document.getElementById('sum-guests').textContent = bookingState.guests;
    document.getElementById('sum-price').textContent = bookingState.price;
  }

  function generateConfirmation() {
    const bookingRef = `BF-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    document.getElementById('conf-ref').textContent = bookingRef;
    document.getElementById('conf-workshop').textContent = bookingState.workshop;
    document.getElementById('conf-date-time').textContent = `${bookingState.date} at ${bookingState.time}`;

    goToStep(5);
    showDashToast(`Booking confirmed! ID: ${bookingRef}`);
  }
}

/* ==========================================================================
   5. PROFILE EDITOR
   ========================================================================== */
function initProfileEditor() {
  const profileForm = document.getElementById('profile-form');
  if (!profileForm) return;

  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('prof-name').value;
    const guestNameEl = document.querySelector('.guest-name');
    if (guestNameEl) guestNameEl.textContent = name;

    showDashToast('Profile updated successfully!');
  });
}

/* ==========================================================================
   6. LOGOUT
   ========================================================================== */
function initLogout() {
  const logoutBtns = document.querySelectorAll('.js-logout-btn');
  logoutBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      showDashToast('Signing out...');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 600);
    });
  });
}

/* ==========================================================================
   7. DASHBOARD THEME & RTL PERSISTENCE
   ========================================================================== */
function initDashboardThemeAndRTL() {
  // Theme Setup & Toggle Listener
  const savedTheme = localStorage.getItem('bloom-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  const themeBtns = document.querySelectorAll('.js-theme-toggle');
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('bloom-theme', newTheme);
      showDashToast(`Switched to ${newTheme.toUpperCase()} mode`);
    });
  });

  // RTL Setup & Toggle Listener
  const savedRTL = localStorage.getItem('bloom-rtl') || 'ltr';
  document.documentElement.setAttribute('dir', savedRTL);

  const rtlBtns = document.querySelectorAll('.js-rtl-toggle');
  rtlBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      document.documentElement.setAttribute('dir', newDir);
      localStorage.setItem('bloom-rtl', newDir);
      showDashToast(`Language direction set to ${newDir.toUpperCase()}`);
    });
  });
}

function showDashToast(msg) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>✿</span> <span>${msg}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3500);
}
