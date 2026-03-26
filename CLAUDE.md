# CLAUDE.md — Portfolio Website (adonpaultomy.wiki)

## Project Overview

Personal portfolio website for **Adon Paul Tomy** — a final-year CS student at VISAT Engineering College (graduating 2026) focused on Flutter development, cybersecurity, and shipping production software.

**Live**: [adonpaultomy.wiki](https://adonpaultomy.wiki)
**Stack**: React 18 + Vite 6 SPA, deployed to GitHub Pages via GitHub Actions.

---

## Quick Reference

| Task | Command |
|------|---------|
| Dev server (port 3000) | `npm run dev` |
| Production build | `npm run build` |
| Preview prod | `npm run preview` |
| Run tests | `npm test` |
| Deploy | Push to `main` (auto via GitHub Actions) |

Build output: `dist/`. Custom domain: CNAME → `adonpaultomy.wiki`.

---

## Architecture

### Navigation (No Router)

There is **no React Router**. Navigation is state-driven via Zustand:

```
App.jsx
├── PAGE_ORDER = ['home', 'about', 'projects', 'interesting']
├── currentPage (string) → which page renders
├── pendingPage + isTransitioning → CSS slide animation
└── handleNavigate(page, direction) → 500ms setTimeout transition
```

Pages receive `theme`, `reduceMotion`, and `onNavigate` as props. No URL changes, no deep linking, no browser history.

### State Management (Zustand)

`src/store/useAppStore.js` — single flat store:
- **Navigation**: splashState, currentPage, pendingPage, isTransitioning, transitionDirection
- **Settings** (persisted to localStorage): theme, reduceMotion, cursorGlow, showShootingStars, fontSize, highContrast, showBackground, navPosition
- **Actions**: direct setters + toggleTheme(), toggleNavPosition(), initializeSettings()

Settings are synced to `document.documentElement` data attributes for CSS theming.

### Component Map

```
src/
├── main.jsx                    # Entry: renders <App/> into #root
├── App.jsx                     # Root shell: splash → header → page container
├── App.css                     # Page slide transition keyframes
├── store/useAppStore.js        # Zustand store
├── components/
│   ├── SplashScreen.jsx        # Typewriter + spring physics overlay
│   ├── Header.jsx              # Fixed floating nav bar
│   ├── ThemeToggle.jsx         # Dark/light switch
│   ├── LandingPage.jsx         # Home: profile + links + CTA
│   ├── AboutPage.jsx           # Bio: lanyard + multi-section content
│   ├── ProjectsPage.jsx        # Projects: card swap carousel
│   ├── InterestingPage.jsx     # Settings toggles page
│   ├── DarkVeil.jsx            # OGL WebGL CPPN neural network shader
│   ├── ShootingStars.jsx       # CSS animated shooting stars
│   ├── GlassCursor.jsx         # Frosted glass cursor follower
│   ├── Antigravity.jsx         # Three.js instanced particle ring
│   ├── Lanyard.jsx             # Three.js + Rapier physics 3D card
│   ├── CardSwap.jsx            # GSAP card shuffle animation
│   ├── GradualBlur.jsx         # Layered backdrop-filter blur gradient
│   ├── AutoVariableProximity.jsx # Wraps text for proximity font weight
│   └── VariableProximity.jsx   # Core cursor-proximity font animation
└── styles/
    ├── landing.css             # Aggregator (imports all below)
    ├── variables.css           # CSS custom properties + theme definitions
    ├── globals.css             # Reset, scrollbar, base typography
    ├── utils.css               # Animation utilities, glass classes
    └── components/
        ├── typography.css      # h1-h6, links, social hover effects
        ├── cursor.css          # Glass cursor + cursor light
        ├── splash.css          # Splash screen animations
        ├── header.css          # Header nav + theme toggle styling
        ├── landing.css         # Landing page grid layout
        └── projects.css        # Projects, about, interesting layouts
```

### Visual Effects Stack

| Component | Tech | Purpose |
|-----------|------|---------|
| DarkVeil | OGL (WebGL) | CPPN neural network nebula background |
| Antigravity | Three.js / @react-three/fiber | Instanced particle ring animation |
| Lanyard | Three.js + Rapier physics | Draggable 3D ID card on rope |
| CardSwap | GSAP | Stacked card shuffle with elastic easing |
| SplashScreen | requestAnimationFrame + spring physics | Circle-wipe entry with typewriter |
| ShootingStars | CSS keyframes + DOM creation | Random shooting star particles |
| GlassCursor | requestAnimationFrame + backdrop-filter | Frosted lens following cursor |
| VariableProximity | requestAnimationFrame + font-variation-settings | Cursor distance → font weight |
| GradualBlur | CSS backdrop-filter layers | Edge fade blur gradient |

### CSS Architecture

- **Variables**: `:root` defines 80+ CSS custom properties (colors, spacing, shadows, gradients, z-index, transitions)
- **Theme switching**: `html[data-theme="light"]` overrides all color variables
- **Glass pattern**: `backdrop-filter: blur() saturate()` + semi-transparent bg + subtle border
- **Typography**: `clamp()` functions for fluid responsive sizing
- **Breakpoints**: 1024px (desktop), 768px (tablet), 480px (mobile)

### Asset Paths

Always use `import.meta.env.BASE_URL` prefix for public assets:
```js
`${import.meta.env.BASE_URL}images/profile/photo.png`
`${import.meta.env.BASE_URL}assets/lanyard/card.glb`
```

3D models (`.glb`) go in `public/assets/`. Images in `public/images/`. Videos in `public/videos/`.

---

## Conventions

### Component Patterns
- Functional components only, with hooks
- Every visual component accepts `reduceMotion` prop — must render static fallback or nothing when true
- Every page component accepts `theme` prop ("dark" | "light")
- Dark-mode-only effects: check `theme === 'dark'` before rendering
- Performance-critical animations use refs + direct DOM manipulation (bypass React render)

### Styling
- No CSS modules — all global selectors scoped by component-specific class names
- Glass panels: use `.glass-panel` class
- New component styles: create `src/components/ComponentName.css` and import in component
- Theme-aware: use CSS custom properties (`var(--bg)`, `var(--fg)`, `var(--accent)`)

### Adding New Visual Effects
1. Create component in `src/components/` with matching `.css`
2. Accept `reduceMotion` prop; render nothing or static fallback when true
3. For WebGL: prefer OGL for simple shaders, Three.js for 3D scenes
4. Import conditionally based on `theme === 'dark'` if dark-mode-only

---

## Known Issues & Technical Debt

### Critical
- **No URL routing**: No deep links, no browser back/forward, no shareable page URLs. Fatal for a portfolio that recruiters bookmark.
- **Placeholder email**: `mailto:adonpaul@example.com` in AboutPage.jsx:183 is fake.
- **LinkedIn URL mismatch**: LandingPage uses `/adon-paul-tomy`, AboutPage uses `/adon-paul`. One is wrong.

### Architecture
- **Page rendering duplicated in App.jsx**: Lines 155-196 and 200-241 are identical page rendering blocks (for current vs pending transition). Should be a `renderPage(pageId)` function.
- **Prop drilling on InterestingPage**: Receives 14+ props that could be consumed directly from Zustand store.
- **`useAppStore.getState()` called in render** (App.jsx:183): Anti-pattern for `onToggleMotion` — should be a `toggleReduceMotion()` action in the store.
- **setTimeout(500) for transitions** (App.jsx:80): Magic number not synced with CSS animation duration. Race condition risk.
- **No error boundaries**: Three.js/WebGL components can crash without graceful degradation.
- **No code splitting**: Heavy 3D components (Lanyard ~277 lines, DarkVeil ~219 lines) are eagerly loaded.

### Performance
- **DarkVeil recreates WebGL on any prop change**: Single useEffect with all props as deps (line 201) tears down and rebuilds the entire renderer.
- **`mathjs` dependency (~500KB)**: Used only in GradualBlur for basic math. Native `Math` would suffice.
- **`lottie-react` in dependencies but unused**: No Lottie animations exist in the codebase.
- **Multiple WebGL contexts**: Antigravity + Lanyard + DarkVeil can create 3 separate WebGL contexts simultaneously.

### Code Quality
- **`useState` for static values**: `const [year] = useState(new Date().getFullYear())` in every page — should be `const year = new Date().getFullYear()`.
- **No TypeScript**: `tsconfig.json` exists but all files are `.jsx`. Types provide zero value currently.
- **Inline styles for layout**: Complex positioning styles scattered as inline objects (LandingPage:47-56, App.jsx:106).
- **`!important` in Lanyard.css**: Technical debt marker.

### Content
- **"Website is currently under development"** on landing page — undermines confidence.
- **Placeholder cards** ("Card 3", "Card 4") in ProjectsPage.
- **"In progress"** text on InterestingPage.

### Testing
- **Single test exists**: `App.test.jsx` only checks App renders without crash. No component, interaction, or visual regression tests.

### SEO
- **No dynamic page titles**: `<title>` never updates on navigation.
- **No SSR/pre-rendering**: SPA with no meta tag updates per page.
- **No structured data** (JSON-LD) for portfolio/person schema.

### Accessibility (gaps in otherwise good framework)
- **Splash screen blocks entry**: Must scroll/click — screen reader users may be stuck.
- **No skip-to-content link**.
- **Navigation has no `<nav>` landmark in Header** (uses div-based structure).

---

## What's Done Well

- **CPPN neural network shader** (DarkVeil): Genuinely impressive generative art via trained weights in GLSL
- **Spring physics splash** (SplashScreen): Smooth, physically-correct circle-wipe using refs for 60fps
- **Zustand store design**: Clean, flat, well-organized state with localStorage persistence
- **CSS custom properties system**: 80+ variables with coherent dark/light theme overrides
- **Accessibility options**: Reduce motion, high contrast, font size, cursor glow — comprehensive for a portfolio
- **Mobile responsiveness**: Careful breakpoints, touch handling, reduced 3D quality on mobile
- **3D lanyard physics**: Rapier joints + MeshLine + draggable interaction is polished
- **Variable font proximity**: Creative typography effect with performant global mouse scheduler
- **WebGL fallback**: DarkVeil gracefully degrades to CSS gradient on WebGL failure
- **Profile image randomization**: Subtle personal touch

---

## Deployment

GitHub Actions workflow (`.github/workflows/deploy.yml`):
1. Trigger: push to `main` or manual dispatch
2. Node 20, `npm ci`, `npm run build`
3. Upload `dist/` as GitHub Pages artifact
4. Custom domain via CNAME file

---

## Dependencies

### Core
- react 18.3.1, react-dom 18.3.1
- vite 6.0.5, @vitejs/plugin-react

### 3D / WebGL
- three 0.182.0, @react-three/fiber, @react-three/drei, @react-three/rapier
- ogl 1.0.11 (lightweight WebGL for DarkVeil)
- meshline 3.3.1 (curved line rendering for Lanyard)

### Animation
- gsap 3.14.2 (CardSwap)
- motion 12.25.0 (VariableProximity, minimal use)

### State
- zustand 5.0.10

### Potentially Removable
- lottie-react 2.4.0 (unused)
- mathjs 15.1.0 (overkill for basic math in GradualBlur)
