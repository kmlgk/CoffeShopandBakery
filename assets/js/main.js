/* ==========================================================================
   Brew & Crumb — Coffee & Bakery — Main JavaScript
   Vanilla ES6+, no dependencies. Each function is self-guarding so pages
   only wire up the widgets they actually contain.
   ========================================================================== */

'use strict';

/* === Page Loader ===
   Hide the spinner once the window loads, with a hard fallback so slow or
   failed external images/fonts never trap the page behind the loader. */
function initLoader() {
  const loader = document.querySelector('.page-loader');
  if (!loader) return;
  const hide = () => loader.classList.add('hide');
  window.addEventListener('load', () => setTimeout(hide, 300));
  setTimeout(hide, 700);
}

/* === Navbar shadow on scroll === */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
}

/* === Hamburger (mobile drawer) === */
function initHamburger() {
  const btn  = document.querySelector('.hamburger');
  const menu = document.querySelector('.nav-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = btn.classList.toggle('open');
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
  });

  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      btn.classList.remove('open');
      menu.classList.remove('open');
    }
  });
}

/* === Mobile dropdown accordion === */
function initMobileDropdowns() {
  const mq = window.matchMedia('(max-width: 768px)');
  document.querySelectorAll('.nav-menu .dropdown > .nav-link').forEach(link => {
    link.setAttribute('aria-expanded', 'false');
    link.addEventListener('click', (e) => {
      if (!mq.matches) return;          // desktop keeps hover + navigation
      e.preventDefault();
      const parent = link.parentElement;
      const willOpen = !parent.classList.contains('open');
      document.querySelectorAll('.nav-menu .dropdown.open').forEach(d => {
        if (d !== parent) {
          d.classList.remove('open');
          const l = d.querySelector(':scope > .nav-link');
          if (l) l.setAttribute('aria-expanded', 'false');
        }
      });
      parent.classList.toggle('open', willOpen);
      link.setAttribute('aria-expanded', String(willOpen));
    });
  });

  mq.addEventListener('change', (ev) => {
    if (!ev.matches) {
      document.querySelectorAll('.nav-menu .dropdown.open').forEach(d => {
        d.classList.remove('open');
        const l = d.querySelector(':scope > .nav-link');
        if (l) l.setAttribute('aria-expanded', 'false');
      });
    }
  });
}

/* === Account avatar dropdown === */
function initAccountMenu() {
  const dropdown = document.querySelector('.account-dropdown');
  if (!dropdown) return;
  const toggle = dropdown.querySelector('.account-toggle');
  if (!toggle) return;

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = dropdown.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdown.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* === Theme toggle (dark / light) with system-preference detection === */
function initTheme() {
  const STORAGE_KEY = 'brew-theme';
  const btns = document.querySelectorAll('.theme-toggle:not(.rtl-toggle)');

  const apply = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    btns.forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
  };

  const saved = localStorage.getItem(STORAGE_KEY);
  const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  apply(saved || preferred);

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      apply(current === 'dark' ? 'light' : 'dark');
    });
  });
}

/* === RTL toggle === */
function initRTL() {
  const RTL_KEY = 'brew-dir';

  const apply = (dir) => {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem(RTL_KEY, dir);
    document.querySelectorAll('.rtl-toggle').forEach(btn => {
      btn.setAttribute('aria-pressed', dir === 'rtl');
      btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL');
    });
  };

  apply(localStorage.getItem(RTL_KEY) || 'ltr');

  document.querySelectorAll('.rtl-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('dir') || 'ltr';
      apply(current === 'rtl' ? 'ltr' : 'rtl');
    });
  });
}

/* === Back to top === */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 400));
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* === FAQ accordion === */
function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(o => o.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* === Client-side form validation ===
   Applies to any <form data-validate>. Shows inline errors + a success toast. */
function initForms() {
  document.querySelectorAll('form[data-validate]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      form.querySelectorAll('[required]').forEach(field => {
        const error = field.parentElement.querySelector('.form-error');
        if (!field.value.trim()) {
          field.classList.add('error');
          if (error) error.classList.add('show');
          valid = false;
        } else {
          field.classList.remove('error');
          if (error) error.classList.remove('show');
        }
      });

      const emailField = form.querySelector('[type="email"]');
      if (emailField && emailField.value) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const error = emailField.parentElement.querySelector('.form-error');
        if (!re.test(emailField.value)) {
          emailField.classList.add('error');
          if (error) { error.textContent = 'Please enter a valid email address.'; error.classList.add('show'); }
          valid = false;
        }
      }

      if (valid) {
        showToast(form.dataset.success || 'Thanks! We\'ll be in touch shortly.', 'success');
        form.reset();
        // Reset any selectable chips inside the form.
        form.querySelectorAll('.chip.selected').forEach(c => c.classList.remove('selected'));
      }
    });

    form.querySelectorAll('[required]').forEach(field => {
      field.addEventListener('input', () => {
        if (field.value.trim()) {
          field.classList.remove('error');
          const error = field.parentElement.querySelector('.form-error');
          if (error) error.classList.remove('show');
        }
      });
    });
  });
}

/* === Toast notification === */
function showToast(message, type = 'success') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  const icon = type === 'success' ? 'fa-mug-hot' : 'fa-exclamation-circle';
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
  requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 4000);
}

/* === Scroll reveal === */
function initScrollReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    observer.observe(el);
  });
}

/* === Counter animation === */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animate = (el, target) => {
    let current = 0;
    const step = target / 60;
    const tick = () => {
      current += step;
      if (current < target) {
        el.textContent = Math.floor(current) + (el.dataset.suffix || '');
        requestAnimationFrame(tick);
      } else {
        el.textContent = target + (el.dataset.suffix || '');
      }
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target, parseInt(entry.target.dataset.count));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* === Simple gallery lightbox === */
function initGallery() {
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img) return;

      const overlay = document.createElement('div');
      overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:9998;display:flex;align-items:center;justify-content:center;cursor:zoom-out;';
      const picture = document.createElement('img');
      picture.src = img.src;
      picture.alt = img.alt;
      picture.style.cssText = 'max-width:90vw;max-height:90vh;border-radius:12px;box-shadow:0 24px 60px rgba(0,0,0,0.5);';
      const close = document.createElement('button');
      close.innerHTML = '<i class="fas fa-times"></i>';
      close.style.cssText = 'position:absolute;top:20px;right:20px;width:44px;height:44px;background:rgba(255,255,255,0.15);border:none;border-radius:50%;color:#fff;font-size:1.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;';
      overlay.appendChild(picture);
      overlay.appendChild(close);
      document.body.appendChild(overlay);

      const destroy = () => overlay.remove();
      overlay.addEventListener('click', destroy);
      close.addEventListener('click', (e) => { e.stopPropagation(); destroy(); });
      document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { destroy(); document.removeEventListener('keydown', esc); } });
    });
  });
}

/* === Newsletter signup === */
function initNewsletter() {
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        showToast('You\'re on the list! Fresh brews and news headed your way. ☕', 'success');
        input.value = '';
      } else {
        showToast('Please enter a valid email.', 'error');
      }
    });
  });
}

/* === Highlight the active nav link based on the current file === */
function initActiveNav() {
  const links = document.querySelectorAll('.nav-link');
  const current = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.includes(current)) link.classList.add('active');
  });
}

/* === Selectable chips (party size, times, filters) ===
   Chips inside the same [data-chip-group] behave as a single-choice group and
   mirror their value into an optional hidden input named by data-target. */
function initChips() {
  document.querySelectorAll('[data-chip-group]').forEach(group => {
    const targetName = group.dataset.target;
    group.querySelectorAll('.chip:not(.disabled)').forEach(chip => {
      chip.addEventListener('click', () => {
        group.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
        if (targetName) {
          const input = document.querySelector(`input[name="${targetName}"]`);
          if (input) input.value = chip.dataset.value || chip.textContent.trim();
        }
      });
    });
  });
}

/* === Category / menu filter tabs === */
function initFilters() {
  document.querySelectorAll('[data-filter-group]').forEach(group => {
    const targetSel = group.dataset.filterTarget;
    group.querySelectorAll('[data-filter]').forEach(tab => {
      tab.addEventListener('click', () => {
        group.querySelectorAll('[data-filter]').forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        const filter = tab.dataset.filter;
        if (!targetSel) return;
        document.querySelectorAll(`${targetSel} [data-category]`).forEach(card => {
          const show = filter === 'all' || card.dataset.category === filter;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  });
}

/* === Pricing billing toggle (per-cup vs monthly, etc.) === */
function initPricingToggle() {
  const toggles = document.querySelectorAll('[data-price-toggle]');
  if (!toggles.length) return;
  toggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.priceToggle;
      document.querySelectorAll('[data-price-toggle]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('[data-price-monthly], [data-price-annual]').forEach(el => {
        el.style.display = 'none';
      });
      document.querySelectorAll(`[data-price-${mode}]`).forEach(el => { el.style.display = ''; });
    });
  });
}

/* === Password show / hide on auth pages === */
function initPasswordToggle() {
  document.querySelectorAll('.pw-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('input');
      if (!input) return;
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      const icon = btn.querySelector('i');
      if (icon) icon.className = show ? 'fas fa-eye-slash' : 'fas fa-eye';
    });
  });
}

/* === Reservation multi-step advance ===
   Purely visual step indicator: clicking "Continue" advances the highlighted
   step. The final submit routes through initForms() validation. */
function initReservation() {
  const btns = document.querySelectorAll('[data-reserve-next]');
  if (!btns.length) return;
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const steps = document.querySelectorAll('.reserve-step');
      const activeIdx = Array.from(steps).findIndex(s => s.classList.contains('active'));
      if (activeIdx > -1 && activeIdx < steps.length - 1) {
        steps[activeIdx].classList.remove('active');
        steps[activeIdx + 1].classList.add('active');
      }
      const panel = document.querySelector('.reserve-body');
      if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
}

/* === Init all === */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNavbar();
  initHamburger();
  initMobileDropdowns();
  initAccountMenu();
  initTheme();
  initRTL();
  initBackToTop();
  initFAQ();
  initForms();
  initScrollReveal();
  initCounters();
  initGallery();
  initNewsletter();
  initActiveNav();
  initChips();
  initFilters();
  initPricingToggle();
  initPasswordToggle();
  initReservation();
});
