/* ==========================================================================
   Brew & Crumb — Premium Effects
   AOS + GSAP wiring, ambient coffee-bean / sprinkle fields, crumb-burst,
   magnetic buttons, tilt cards, cursor bean trail, scroll progress.
   Self-guarding like main.js: every init checks its target exists first,
   and every animation-heavy feature checks prefers-reduced-motion.
   ========================================================================== */

'use strict';

const REDUCED_MOTION = window.matchMedia('(prefers-color-scheme: no-preference)') &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const CAN_HOVER = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* === AOS init === */
function initAOS() {
  if (typeof AOS === 'undefined') return;
  AOS.init({
    duration: 700,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80,
    disable: REDUCED_MOTION ? true : false,
  });
  window.addEventListener('load', () => AOS.refresh());
}

/* === GSAP hero entrance + parallax === */
function initGSAP() {
  if (typeof gsap === 'undefined' || REDUCED_MOTION) return;
  if (gsap.registerPlugin && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  const heroBadge = document.querySelector('.hero .hero-badge, .hero-v2 .hero-badge');
  const heroHeading = document.querySelector('.hero h1, .hero-v2 h1');
  const heroLead = document.querySelector('.hero p.lead, .hero-v2 p.lead');
  const heroCta = document.querySelector('.hero .hero-cta, .hero-v2 .hero-cta');
  const heroStats = document.querySelector('.hero .hero-stats, .hero-v2 .hero-stats');
  const heroArt = document.querySelector('.hero-image-wrap, .hero-v2 .hero-image-wrap');

  if (heroBadge) heroTl.from(heroBadge, { y: -16, opacity: 0, duration: 0.6 });
  if (heroHeading) heroTl.from(heroHeading, { y: 26, opacity: 0, duration: 0.7 }, '-=0.3');
  if (heroLead) heroTl.from(heroLead, { y: 18, opacity: 0, duration: 0.6 }, '-=0.4');
  if (heroCta) heroTl.from(heroCta.children, { y: 16, opacity: 0, duration: 0.5, stagger: 0.12 }, '-=0.35');
  if (heroStats) heroTl.from(heroStats.children, { y: 14, opacity: 0, duration: 0.5, stagger: 0.1 }, '-=0.3');
  if (heroArt) heroTl.from(heroArt, { x: 40, opacity: 0, duration: 0.8 }, '-=0.9');

  if (typeof ScrollTrigger !== 'undefined') {
    const heroImg = document.querySelector('.hero-img-main');
    if (heroImg) {
      gsap.to(heroImg, {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: heroImg, start: 'top top', end: 'bottom top', scrub: true },
      });
    }

    document.querySelectorAll('.gsap-fade-up').forEach((el) => {
      gsap.from(el, {
        y: 40, opacity: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      });
    });

    document.querySelectorAll('.gsap-scale-in').forEach((el) => {
      gsap.from(el, {
        scale: 0.85, opacity: 0, duration: 0.7, ease: 'back.out(1.6)',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      });
    });
  }
}

/* === Ambient coffee-bean float field ===
   Populates every [data-float-icons] container with randomly placed,
   randomly delayed Font Awesome icons drifting in place. */
function initFloatFields() {
  const icons = ['fa-mug-hot', 'fa-seedling', 'fa-cookie-bite', 'fa-bread-slice', 'fa-mug-saucer'];
  document.querySelectorAll('[data-float-icons]').forEach((field) => {
    field.classList.add('float-field');
    const count = parseInt(field.dataset.floatIcons, 10) || 6;
    for (let i = 0; i < count; i++) {
      const span = document.createElement('i');
      span.className = `fi fas ${icons[i % icons.length]}`;
      span.style.left = `${Math.random() * 92}%`;
      span.style.top = `${Math.random() * 88}%`;
      span.style.fontSize = `${16 + Math.random() * 20}px`;
      span.style.animationDelay = `${Math.random() * 5}s`;
      span.style.animationDuration = `${7 + Math.random() * 5}s`;
      span.setAttribute('aria-hidden', 'true');
      field.appendChild(span);
    }
  });
}

/* === Ambient sprinkle field (cake effect) ===
   Populates every [data-sprinkles] container with randomly placed,
   randomly rotated, randomly colored sprinkle capsules. */
function initSprinkleFields() {
  document.querySelectorAll('[data-sprinkles]').forEach((field) => {
    field.classList.add('sprinkle-field');
    const count = parseInt(field.dataset.sprinkles, 10) || 24;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('span');
      dot.className = 'sprinkle';
      dot.style.left = `${Math.random() * 98}%`;
      dot.style.top = `${Math.random() * 96}%`;
      dot.style.setProperty('--sp-rot', `${Math.random() * 360}deg`);
      dot.style.animationDelay = `${Math.random() * 4}s`;
      dot.style.animationDuration = `${4 + Math.random() * 4}s`;
      field.appendChild(dot);
    }
  });
}

/* === Crumb-burst (cake effect) ===
   Elements with [data-crumb-burst] spawn a little burst of icing-colored
   crumbs from the cursor position on hover-enter, once per hover. */
function initCrumbBurst() {
  if (REDUCED_MOTION) return;
  const colors = ['#9B6A43', '#D6A419', '#6E8B6E', '#D97B6C', '#F7EFE4'];

  function burst(x, y) {
    const count = 10;
    for (let i = 0; i < count; i++) {
      const crumb = document.createElement('span');
      crumb.className = 'crumb';
      crumb.style.left = `${x}px`;
      crumb.style.top = `${y}px`;
      crumb.style.background = colors[i % colors.length];
      crumb.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      document.body.appendChild(crumb);

      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const dist = 30 + Math.random() * 40;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist - 10;

      const anim = crumb.animate(
        [
          { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: 1 },
          { transform: `translate(${dx}px, ${dy}px) scale(0.4) rotate(${Math.random() * 180}deg)`, opacity: 0 },
        ],
        { duration: 550 + Math.random() * 250, easing: 'cubic-bezier(0.2, 0.8, 0.3, 1)' }
      );
      anim.onfinish = () => crumb.remove();
    }
  }

  document.querySelectorAll('[data-crumb-burst]').forEach((el) => {
    let last = 0;
    el.addEventListener('mouseenter', (e) => {
      const now = Date.now();
      if (now - last < 400) return;
      last = now;
      const rect = el.getBoundingClientRect();
      burst(e.clientX ?? rect.left + rect.width / 2, e.clientY ?? rect.top + rect.height / 2);
    });
  });
}

/* === Magnetic buttons === */
function initMagneticButtons() {
  if (!CAN_HOVER || REDUCED_MOTION) return;
  document.querySelectorAll('.btn-magnetic').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.22}px, ${y * 0.32}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0, 0)'; });
  });
}

/* === Tilt cards === */
function initTiltCards() {
  if (!CAN_HOVER || REDUCED_MOTION) return;
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${px * 8}deg) rotateX(${py * -8}deg) translateZ(0)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg)';
    });
  });
}

/* === Cursor coffee-bean trail (desktop, motion-safe only) === */
function initCursorTrail() {
  if (!CAN_HOVER || REDUCED_MOTION) return;
  const zone = document.querySelector('[data-cursor-trail]');
  if (!zone) return;

  const beans = [];
  for (let i = 0; i < 5; i++) {
    const bean = document.createElement('div');
    bean.className = 'cursor-bean';
    document.body.appendChild(bean);
    beans.push({ el: bean, x: 0, y: 0 });
  }

  let mouseX = 0, mouseY = 0, active = false;
  zone.addEventListener('mouseenter', () => { active = true; beans.forEach(b => b.el.style.opacity = '0.7'); });
  zone.addEventListener('mouseleave', () => { active = false; beans.forEach(b => b.el.style.opacity = '0'); });
  zone.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });

  function loop() {
    if (active) {
      let x = mouseX, y = mouseY;
      beans.forEach((b, i) => {
        b.x += (x - b.x) * 0.28;
        b.y += (y - b.y) * 0.28;
        b.el.style.transform = `translate(${b.x - 5}px, ${b.y - 7}px) rotate(${i * 22}deg)`;
        x = b.x; y = b.y;
      });
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

/* === Scroll progress bar === */
function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    bar.style.width = `${scrolled}%`;
  });
}

/* === Init all === */
document.addEventListener('DOMContentLoaded', () => {
  initAOS();
  initGSAP();
  initFloatFields();
  initSprinkleFields();
  initCrumbBurst();
  initMagneticButtons();
  initTiltCards();
  initCursorTrail();
  initScrollProgress();
});
