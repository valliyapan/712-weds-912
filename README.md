# Valli Weds Shammu — Wedding Invitation

A single-page static wedding e-invitation for Valliyapan SM & Shamyuktha VR, built with plain HTML, CSS, and vanilla JavaScript — no frameworks, no build step.

## Tech

- **HTML/CSS/JS** — no dependencies, no npm packages.
- **Google Fonts** — Cormorant Garamond (display) + Karla (body), loaded via `<link>`.
- **Inline SVG** — all icons, motifs, and decorative patterns are inline SVG or CSS `background-image` data URIs.
- **Netlify Forms** — the RSVP form (`name="rsvp"`) is detected and handled by Netlify at deploy time.

## Structure

- `index.html` — all page markup and sections (hero, countdown, story, events, gallery, RSVP, blessings, footer).
- `styles.css` — all styling, including CSS custom properties for the colour palette and responsive breakpoints.
- `script.js` — countdown timer, scroll-reveal via IntersectionObserver, floating petal canvas animation, gallery lightbox, AJAX RSVP submission, and confetti burst.
- `netlify.toml` — publishes the project root (`publish = "."`).
- `og-image.svg` — social preview image referenced by Open Graph/Twitter meta tags.

## Running locally

No build step is required. Either:

```bash
npx serve .
```

or, to test Netlify Forms locally:

```bash
netlify dev
```

Then open the printed local URL in a browser.
