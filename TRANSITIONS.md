    # Transitions & Animations Inventory

This repository is a static portfolio site with two primary entry points:

- `index.html`: “coming soon / landing” page with theme toggle, splash overlay, cursor light, shooting stars, and Lottie loader.
- `home.html`: main portfolio page with reveal-on-scroll animations and hover transitions.

This document lists every transition/animation mechanism currently present in the codebase (CSS transitions, CSS keyframe animations, and JS-driven motion).

---

## Motion policy (reduced motion)

### JavaScript gating
- `index.html` defines `reduceMotion` via `matchMedia('(prefers-reduced-motion: reduce)')`.
  - If `reduceMotion` is true:
    - Splash overlay is removed (`display: none`).
    - Shooting stars are not scheduled.
    - Heading text scramble does not run.
    - Cursor-follow/parallax handler returns early on move events.
- `js/main.js` defines `prefersReducedMotion` via the same media query.
  - If reduced motion is requested, it **does not** run the IntersectionObserver reveal system.

### CSS gating
- `css/landing.css` disables animations for reduced motion:
  - `.content-card { animation: none; }`
  - `.shooting-star { display: none; }`
  - `html.theme-morph` blur/opacity changes are disabled under `@media (prefers-reduced-motion: reduce)`.

---

## Page: `home.html` (main portfolio)

### A) Smooth scrolling (browser-driven)
- **Where**: `css/style.css`
- **Selector**: `:root`
- **Mechanism**: `scroll-behavior: smooth;`
- **Trigger**: Clicking in-page anchors like `#work`, `#about`, etc.
- **Effect**: Smooth scroll interpolation to the target anchor.

### B) Button hover transitions
- **Where**: `css/style.css`
- **Selector**: `.btn`
- **Transition**: `transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease`
- **Trigger**: Hover/active states (primarily `.btn.primary:hover`).
- **Effect**:
  - Primary button lifts slightly: `translateY(-2px) scale(1.01)`
  - Box-shadow intensifies.

### C) Service “pillar” card hover
- **Where**: `css/style.css`
- **Selector**: `.pillars article`
- **Transition**: `transform 0.3s ease, border-color 0.3s ease`
- **Trigger**: Hover (`.pillars article:hover`).
- **Effect**: Card lifts (`translateY(-6px)`) and border color brightens.

### D) Reveal-on-scroll (IntersectionObserver)
- **Where**: `css/style.css` + `js/main.js`

**CSS states**
- **Base state**: `.reveal`
  - `opacity: 0;`
  - `transform: translateY(30px);`
  - `transition: opacity 0.6s ease, transform 0.6s ease;`
- **Revealed**: `.reveal.in-view`
  - `opacity: 1;`
  - `transform: translateY(0);`

**JS trigger**
- `js/main.js`:
  - Adds class `reveal` to each element in:
    - `.pillars article`
    - `.project-card`
    - `.lab article`
    - `.testimonial-grid figure`
    - `.updates article`
  - Observes them with `IntersectionObserver({ threshold: 0.3 })`.
  - When an element becomes visible (`entry.isIntersecting`): adds `in-view` and unobserves it.

**Effect**
- Elements fade in + slide up once as they enter the viewport.

### E) Hero “glow” pulse animation
- **Where**: `css/style.css`
- **Selector**: `.hero-visual .glow`
- **Animation**: `pulse 6s ease-in-out infinite`
- **Keyframes**: `@keyframes pulse`
  - Scales from `0.95 → 1.05 → 0.95` while opacity goes `0.6 → 0.9 → 0.6`.
- **Trigger**: Always on (no JS).

---

## Page: `index.html` (landing / coming soon)

All styles for the landing page are in `css/landing.css`, with several JS-driven effects defined inline in `index.html`.

### A) Content entrance animation
- **Where**: `css/landing.css`
- **Selector**: `.content-card`
- **Animation**: `fadeUp .75s cubic-bezier(.22, 1, .36, 1) forwards`
- **Keyframes**: `@keyframes fadeUp`
  - `opacity: 0 → 1`
  - `transform: translateY(14px) → translateY(0)`
- **Trigger**: Page load (CSS applies immediately).
- **Reduced motion**: Disabled via `@media (prefers-reduced-motion: reduce)`.

### B) Splash overlay (typing + progress + slide-away)

**1) Typing effect (JS)**
- **Where**: inline script in `index.html` (also similar logic exists in `js/splash.js` but is not referenced by `index.html`).
- **Mechanism**: appends one character every `speed = 100ms` using `setTimeout`.
- **Trigger**: starts after `500ms` delay.

**2) Loading bar width transition (CSS + JS)**
- **Where**: `css/landing.css` + `index.html` inline script
- **Selector**: `.loading-bar` (`#splashBar`)
- **Transition**: `width 0.1s linear`
- **Trigger**: JS updates `bar.style.width = progress + '%'` per character.
- **Effect**: Smooth linear progression between width changes.

**3) “Glitch” overlay on typed name (CSS keyframes)**
- **Where**: `css/landing.css`
- **Selector**: `.typewriter-text.glitch-active::before`
- **Animation**: `glitchText 3s infinite`
- **Keyframes**: `@keyframes glitchText`
  - Brief bursts around 91–95% of the cycle using `clip-path` and `translate(...)`.
- **Trigger**: JS adds class `glitch-active` after typing completes.

**4) Blinking cursor (CSS keyframes)**
- **Where**: `css/landing.css`
- **Selector**: `.typewriter-text::after`
- **Animation**: `blink 1s infinite`
- **Keyframes**: `@keyframes blink` toggles opacity at 50%.

**5) Slide overlay away (CSS transition)**
- **Where**: `css/landing.css` + inline script in `index.html`
- **Selector**: `#splash-overlay`
- **Transition**: `transform 0.8s cubic-bezier(0.77, 0, 0.175, 1)`
- **State change**: `.slide-up { transform: translateY(-100%); }`
- **Trigger**: after typing finishes, waits `600ms`, then adds `.slide-up` to the overlay.
- **Effect**: Overlay moves upward off-screen.
- **Reduced motion**: If reduced motion is enabled, JS skips the splash entirely.

### C) Theme toggle + theme morph (CSS transitions + JS)

**1) Toggle control transitions**
- **Where**: `css/landing.css`
- **Selector**: `.theme-toggle`
- **Transition**: `background .25s ease, border-color .25s ease`
- **Selector**: `.theme-toggle .knob`
- **Transition**: `transform .25s ease, background .25s ease`
- **Trigger**: Clicking the toggle updates `html[data-theme="light"|"dark"]`.
- **Effect**: The knob slides (via `transform`) and the toggle background changes.

**2) Theme morph blur during switching**
- **Where**: `css/landing.css` + inline script in `index.html`
- **Selector**: `html.theme-morph .content-card`
  - Applies `filter: blur(4px) saturate(108%)` and `opacity: .96`.
- **Selector**: `html.theme-morph .photo-wrap`
  - Applies `filter: blur(2px) contrast(1.02)`.
- **Trigger**: On toggle click, JS adds `theme-morph` to `<html>` and removes it after `360ms`.
- **Reduced motion**: Filters are disabled under reduced motion.

### D) Hero image cross-fade on theme change

- **Where**: `css/landing.css` + inline script in `index.html`
- **Selector**: `.profile-photo` has transition:
  - `opacity .28s cubic-bezier(.22, 1, .36, 1)`
  - `filter .28s cubic-bezier(.22, 1, .36, 1)`
  - `transform .24s ease`
- **Helper class**: `.profile-photo.fade`
  - sets `opacity: 0` and `filter: blur(1px) saturate(105%)`.

**Trigger logic (JS)**
- On theme apply:
  - Adds `fade` to the `<img>`.
  - Preloads the next image using `new Image()`.
  - On preload `onload`, swaps `img.src`.
  - On next animation frame, removes `fade` to allow opacity/filter to transition back.

**Effect**
- The hero photo cross-fades between dark/light assets without showing an unloaded frame.

### E) Image hover brightening
- **Where**: `css/landing.css`
- **Selector**: `.photo-wrap:hover .profile-photo`
- **Mechanism**: the image’s `filter` changes (brightness/saturation) and transitions due to `.profile-photo` transition rules.
- **Effect**: Subtle “brighten” on hover (dark theme only; light theme keeps it fixed).

### F) Heading “glitch” overlay
- **Where**: `css/landing.css`
- **Selector**: `h1::before`
- **Animation**: `glitchText 3s infinite`
- **Effect**: Occasional glitch overlay using clip-path slices and small translations.

### G) Heading text scramble (JS-driven)
- **Where**: inline script in `index.html`
- **Function**: `runTextScramble()`
- **Mechanism**: `setInterval` every `50ms` replaces unrevealed characters with random glyphs until original text resolves.
- **Triggers**:
  - Once on initial page load.
  - Again after theme change (`setTimeout(runTextScramble, 200)`).
- **Reduced motion**: Skipped entirely when reduced motion is enabled.

### H) Shooting stars (CSS keyframes + JS scheduling)

**CSS**
- **Where**: `css/landing.css`
- **Selector**: `.shooting-star`
  - Starts hidden (`opacity: 0`).
- **Keyframes**: `@keyframes shootingStar`
  - ramps opacity up briefly, then translates by `--travel-x`/`--travel-y` until it fades out.

**JS scheduling**
- **Where**: inline script in `index.html`
- **Mechanism**:
  - Creates `.shooting-star` divs at randomized intervals (2–6 seconds).
  - Sets inline `animation: shootingStar <duration>s ease-in forwards`.
  - Sets CSS custom properties `--travel-x` and `--travel-y` to random distances.
  - Removes each star after its animation completes.
- **Gating**:
  - Disabled in light theme.
  - Disabled for reduced motion.

### I) Cursor-follow “teal light” + image parallax (JS-driven)

- **Where**: inline script in `index.html`
- **Elements**:
  - `#cursorLight` (`.cursor-light`)
  - `#heroPhoto` (`.profile-photo`)

**Cursor light motion**
- Uses `requestAnimationFrame` to smoothly move `cursor-light` toward `targetX/targetY`.
- Updates `left/top` styles each frame (creates a soft trailing effect).

**Parallax**
- Computes small shifts (`maxShift = 16px`) and writes:
  - `--parallax-x`
  - `--parallax-y`
- CSS uses these custom props in `.profile-photo` transform (desktop-only rules):
  - `transform: translateY(-18px) translate3d(var(--parallax-x, 0px), var(--parallax-y, 0px), 0);`

**Gating**
- Reduced motion prevents updates on mousemove.

### J) Lottie loader animation
- **Where**: `index.html` inline script + `css/landing.css`
- **Element**: `#lottieLoader` (`.lottie-loader`)
- **Mechanism**: `lottie.loadAnimation({ renderer: 'svg', loop: true, autoplay: true, path: '/assets/anim/Loader cat.json' })`
- **CSS transition**: `.lottie-loader { transition: opacity .32s ease; }`
- **Theme behavior**:
  - In light theme: `.lottie-loader` is hidden (`opacity: 0; visibility: hidden;`).

---

## Other motion-related code in the repo

### `js/splash.js` (splash logic)
There is a standalone splash implementation in `js/splash.js` that:
- Types out the name
- Fills the loading bar
- Adds `glitch-active`
- Adds `slide-up` after typing

However, `index.html` currently implements similar logic inline and does not include `js/splash.js` directly.

---

## Quick reference: CSS keyframes

### `css/style.css`
- `pulse` (6s ease-in-out infinite): scales/opacity “breathing” glow.

### `css/landing.css`
- `glitchText` (3s infinite): intermittent glitch slice overlay via `clip-path`.
- `fadeUp` (.75s cubic-bezier(.22, 1, .36, 1) forwards): entrance fade + upward translate.
- `shootingStar` (duration varies, ease-in, forwards): moving star with fade in/out.
- `blink` (1s infinite): blinking cursor.

---

## Quick reference: CSS transitions

### `css/style.css`
- `.btn`: transform/box-shadow/opacity (0.2s ease)
- `.pillars article`: transform/border-color (0.3s ease)
- `.reveal`: opacity/transform (0.6s ease)

### `css/landing.css`
- `.photo-wrap`: filter (.32s cubic-bezier(.22, 1, .36, 1))
- `.profile-photo`: opacity/filter/transform (.28s/.28s/.24s)
- `.links a`: transform/box-shadow/border-color/background (.28s cubic-bezier(.22, 1, .36, 1))
- `.enter a`: opacity/color/border-color (.2s ease)
- `.lottie-loader`: opacity (.32s ease)
- `.content-card`: multiple visual properties (.32s cubic-bezier(.22, 1, .36, 1))
- `.theme-toggle`: background/border-color (.25s ease)
- `.theme-toggle .knob`: transform/background (.25s ease)
- `.loading-bar`: width (0.1s linear)
- `#splash-overlay`: transform (0.8s cubic-bezier(0.77, 0, 0.175, 1))
