# Adon Paul Tomy — evidence-led portfolio

Start with [handoff/START-HERE.md](handoff/START-HERE.md) and [current progress](handoff/PROGRESS.md).

A portfolio for [adonpaultomy.tech](https://adonpaultomy.tech): Flutter projects, experiments and the thinking behind them. React 18 + Vite, with build-time static HTML for GitHub Pages.

## Develop

Use Node 22 (`nvm use`), then:

```sh
npm ci
npm run dev
```

## Verify and preview

```sh
npm run check
npx playwright install chromium
npm run test:e2e
node scripts/serve.mjs
```

The last command serves the **built static site** at http://127.0.0.1:4173, including real project directories and a 404 response. `npm run dev` is for editing; Vite's development fallback is not a hosting test.

`npm run check` runs hook/accessibility lint, behavior tests, both Vite builds, prerendering and output/budget assertions. Browser checks cover 320–1440 px layouts, accessibility scans, native navigation, direct/reloaded project URLs, no-JavaScript reading, keyboard, reduced motion, unavailable storage and failed media. CI runs the same checks before deploying main. Pull requests validate without publishing. Optional second-engine check: install Firefox using Playwright, then run `TEST_BROWSER=firefox npm run test:e2e`.

## Edit content

- `src/content/projects.js`: project summaries, evidence links, status and case-study text. Every entry gets a real `/work/<slug>/index.html` at build time and a sitemap entry.
- `src/content/profile.js`: contact and professional links.
- `src/App.jsx`: static route composition, case studies and shared navigation.
- `src/components/Home.jsx`: project showcase, biography and sanitized lab note.
- `src/styles/site.css`: responsive visual system, reduced motion, forced colors and print styles.
- `src/components/SignalStudy.jsx`: interactive LumiSense architecture illustration.
- `src/components/Credentials.jsx`: curated certificate disclosures.
- `src/components/ProjectMedia.jsx`: explicit video activation, native controls and failure/download fallback.
- `docs/content-sources.md`: evidence and boundaries behind public claims.

`src/entry-server.jsx` renders each route into Vite's built HTML via `scripts/prerender.mjs`. The browser hydrates that document. Ordinary anchors handle navigation; there is no client router, page transition timer or route preload. Unknown URLs use `404.html` and hydrate its embedded route correctly. The entire core reading journey works with JavaScript disabled.

## Performance policy

No default WebGL, animation framework, external font service, analytics, storage, decorative animation loop, or automatic video download. Font: one local Latin variable font (22 kB); serif and mono accents use system fonts. Images have fixed dimensions; posters and certificate scans lazy-load; the hero is inline SVG. Video recordings are silent visual walkthroughs with a textual explanation on home and case-study pages.

Build gates: total JS <200 kB gzip, CSS <30 kB gzip and font <100 kB. These are build budgets, not field Core Web Vitals measurements. See `docs/audits/2026-11-11-renewal-validation.md` for measured results and limitations.

The raster sharing image is committed. To regenerate it from the site's type and original SVG, run the static preview in another terminal and `node scripts/create-share.mjs`, then rebuild. The original portrait lives outside public in `assets/originals/`; legacy graphics are recoverable from Git revision `566a261`.

## Release

The evidence-led revision is released on `main`; its feature branch was merged. Merging to main deploys through GitHub Actions to the existing domain; verify Pages after release. The live baseline before this revision is `66d67ac`. DNS and domain registration remain managed separately.
