# AGENTS.md

## Project

Static single-page wedding invitation. No framework, no build tool, no package.json — the deploy publishes the repo root as-is (`netlify.toml` sets `publish = "."`).

## Files

- `index.html` — the entire page, in section order: nav, hero, countdown, our story, events, gallery (+ lightbox markup), RSVP form, blessings, footer.
- `styles.css` — single stylesheet. Colour palette and font stacks are defined as CSS custom properties at the top (`:root`). Section background patterns are inline SVG data URIs set as `background-image` on `.pattern` elements, kept at low opacity for texture without external image requests.
- `script.js` — kept dependency-free and under ~150 lines of logic covering: mobile nav toggle, live countdown (`WEDDING_DATE` constant), IntersectionObserver scroll-reveal, canvas-based floating petals in the hero, gallery lightbox, AJAX RSVP submit, and a canvas confetti burst on successful RSVP.
- `og-image.svg` — social share preview image, referenced by the OG/Twitter meta tags in `index.html`.

## Conventions

- All icons and decorative motifs are inline SVG — never an icon font or external image host.
- Respect `prefers-reduced-motion`: `script.js` checks `reduceMotion` before running the petal animation and confetti, and `styles.css` disables reveal/scroll transitions under that media query.
- The RSVP form relies on Netlify Forms (`data-netlify="true"`, hidden `form-name` input matching the form's `name="rsvp"`). Because this is a static HTML file (not an SPA), Netlify's build-time HTML parser detects the form directly — no separate form skeleton file is needed. The AJAX submit handler in `script.js` posts to `/` with `application/x-www-form-urlencoded`.
- Countdown target date lives in one place: the `WEDDING_DATE` constant in `script.js`. Update there if the date changes.
- Any new section should follow the existing pattern: alternate `.section-cream` / `.section-blush` / `.section-emerald` backgrounds, a `.section-label` + `.section-title` header pair, and `.reveal` class on animated children for scroll-in behavior.
