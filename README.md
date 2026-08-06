# Hearth & Oat — Coffee House & Bakery HTML Template

A warm, fully responsive multipurpose HTML template for **coffee shops, cafés, roasteries,
and bakeries**. Hand-written HTML5, CSS3, and vanilla JavaScript — no build step, no
framework dependencies. Just open and edit.

---

## ✨ Features

- **15 pre-built pages** — two homepages (Coffee House + Roastery), about, full menu, menu
  details, reservations, journal (blog) + article, contact, pricing, login, register, 404,
  and a dual-mode coming-soon / maintenance page.
- **Admin dashboard** — a single-file admin panel with Overview, Analytics, Orders, Users,
  and a two-pane Messages inbox — section-switching, sortable-style tables, charts, and
  status badges (`admin-dashboard.html`).
- **Table reservation system** — a friendly multi-step booking widget with party-size and
  time-slot pickers, availability states, and seating preferences (`reservations.html`).
- **Café price-list menu** — dotted-leader menu sections with dietary badges and a sticky
  section quick-nav (`menu.html`).
- **Fully responsive** — mobile-first, tested from 360px phones to large desktops, with a
  polished slide-in mobile navigation and no horizontal scroll.
- **Dark mode** — toggle in the navbar, respects the OS preference, saved to `localStorage`.
- **RTL support** — one-tap right-to-left layout for Arabic/Hebrew, persisted to `localStorage`.
- **Zero install** — Google Fonts (Fraunces + Nunito Sans) and Font Awesome load from CDN.
- **Accessible** — semantic HTML, ARIA labels, keyboard-friendly nav, visible focus states.
- **SEO-ready** — unique titles/descriptions, Open Graph tags, and JSON-LD structured data.

---

## 📁 File Structure

```
brew-and-crumb/
├── index.html                # Root redirect → pages/index.html
├── assets/
│   ├── css/
│   │   ├── style.css         # Design tokens, components, responsive
│   │   ├── dark-mode.css     # [data-theme="dark"] overrides
│   │   └── rtl.css           # [dir="rtl"] overrides
│   ├── js/
│   │   ├── main.js           # All interactivity (theme, nav, forms, chips…)
│   │   └── plugins/          # Drop third-party scripts here
│   ├── images/               # Local image assets
│   └── fonts/                # Self-hosted fonts (optional)
├── pages/
│   ├── index.html            # Home 1 — Coffee House
│   ├── home-2.html           # Home 2 — Roastery / Espresso Bar
│   ├── about.html            # Story, values, timeline, team
│   ├── menu.html             # Full café menu (price-list)
│   ├── menu-details.html     # Signature espresso deep-dive
│   ├── reservations.html     # Table booking widget
│   ├── blog.html             # The Journal (article grid)
│   ├── blog-details.html     # Single article + sidebar
│   ├── contact.html          # Form, map, hours
│   ├── pricing.html          # Bean subscriptions + catering
│   ├── login.html            # Sign in
│   ├── register.html         # Create account
│   ├── admin-dashboard.html  # Admin panel (analytics, orders, users, messages)
│   ├── 404.html              # Error page
│   └── coming-soon.html      # Dual-mode launch / maintenance
├── documentation/            # (place extended docs / assets here)
├── documentation.html        # Getting-started & customization guide
└── README.md
```

---

## 🚀 Getting Started

1. **Unzip** the template anywhere.
2. **Open** `index.html` in your browser — it redirects to `pages/index.html`.
3. To edit, open any file in `pages/` in your code editor. No server or build tools required
   (though a simple local server like VS Code's *Live Server* is handy).

---

## 🎨 Customization

### Colors
All colors are CSS variables in `assets/css/style.css` under `:root`:

```css
--primary:   #9B6A43;  /* roasted mocha — main brand color */
--secondary: #6E8B6E;  /* café sage — supporting accent   */
--accent:    #D6A419;  /* honey gold — highlights          */
--cream:     #F7EFE4;  /* light section backgrounds        */
--dark:      #2A1E16;  /* espresso — headings, footer      */
```

Change these and the whole site re-themes. Dark-mode equivalents live in `dark-mode.css`.

### Fonts
Headings use **Fraunces**, body text uses **Nunito Sans**, both from Google Fonts. Swap the
`<link>` in each page `<head>` and update `--font-heading` / `--font-body`.

### Images
All demo photography uses Unsplash URLs. Replace `src` values with your own images (ideally
WebP, in `assets/images/`) and keep the descriptive `alt` text.

### Reservation / Contact forms
Forms are front-end only and show a success toast. To make them live, point the `<form>` at
your provider (Formspree, Netlify Forms, etc.) — e.g. `action="https://formspree.io/f/xxxx"
method="POST"` — and remove the `data-validate` demo handler if you prefer server validation.

### Coming-soon vs. maintenance
`coming-soon.html` switches with one attribute on `<html>`:
`data-mode="coming-soon"` (countdown) or `data-mode="maintenance"` (downtime notice).

---

## 🧩 Reusable Components

Buttons (`.btn` + variants), cards (`.category-card`, `.feature-card`, `.menu-card`,
`.pricing-card`, `.blog-card`, `.testimonial-card`), the price-list (`.pricelist`), reservation
chips (`.chip`), FAQ accordion (`.faq-item`), forms (`.form-control`), and more — all
documented in `documentation.html`.

---

## 🌐 Browser Support

Latest Chrome, Firefox, Safari, and Edge. Uses `IntersectionObserver`, CSS Grid, and custom
properties (supported in all modern browsers).

---

## 📄 Credits

- **Fonts:** [Fraunces](https://fonts.google.com/specimen/Fraunces) &
  [Nunito Sans](https://fonts.google.com/specimen/Nunito+Sans) — Google Fonts (OFL)
- **Icons:** [Font Awesome 6 Free](https://fontawesome.com) (CC BY 4.0 / SIL OFL)
- **Demo photos:** [Unsplash](https://unsplash.com) (Unsplash License)
- **Demo map:** [OpenStreetMap](https://www.openstreetmap.org) (ODbL)

Replace all demo content, images, and business details before going live.

---

## 📝 License

Licensed to the end user per your marketplace license terms. Demo images and fonts retain
their respective licenses above.

**Hearth & Oat** — made with care & caffeine. ☕
