# Copilot Instructions – Portfolio Website

## ⚠️ Critical: Edit Workflow (READ FIRST)

**Before making ANY code changes:**
1. **Read all relevant code** — trace through affected components, styles, and state flows
2. **Review recent changes** — check git history or conversation context for prior modifications
3. **Identify dependencies** — map which components/effects rely on the code being changed
4. **Verify nothing is already broken** — run the dev server, check console for errors

**After making edits:**
1. **Test the changes** — confirm the feature works as expected
2. **Check for regressions** — verify existing animations, transitions, and effects still function
3. **Explicitly report impact** — inform the user if any previous behavior changed, even if intentional

> This project has tightly coupled visual effects. A small CSS or state change can break animations, WebGL shaders, or page transitions. Always verify before and after.

---

## Architecture Overview

This is a **React 18 + Vite** single-page portfolio site with heavy emphasis on custom visual effects. There is **no router library**—navigation uses in-memory state in `App.jsx` (`currentPage`, `pendingPage`) with CSS slide transitions.

### Key data flow
```
App.jsx (state: splashState, currentPage, theme)
  ├─ SplashScreen (intro → dashboard via scroll/click)
  ├─ Header (onNavigate callbacks)
  └─ Page components (LandingPage, AboutPage, ProjectsPage, InterestingPage)
```

Pages receive `theme`, `reduceMotion`, and `onNavigate` as props; they do **not** manage their own routing.

---

## Developer Workflow

| Task | Command |
|------|---------|
| Dev server (http://localhost:3000) | `npm run dev` |
| Production build | `npm run build` |
| Preview prod build | `npm run preview` |

- Build output goes to `dist/`
- Deployed via GitHub Pages (custom domain `adonpaultomy.wiki`)

---

## Project Conventions

### Component patterns
- **Functional components only** with hooks (`useState`, `useEffect`, `useRef`, `useCallback`)
- Props always include `theme` ("dark" | "light") and `reduceMotion` (boolean) for accessibility
- When animation should be skipped, check `reduceMotion` and exit early or render static fallback

### Styling
- All global styles live in [src/styles/landing.css](src/styles/landing.css) (~2500 lines)
- CSS custom properties defined in `:root` (e.g., `--bg`, `--fg`, `--glass-light`)
- Glassmorphism pattern: `backdrop-filter: blur()` + semi-transparent backgrounds
    - Use common utility classes like `.glass-panel` for containers
- Theme switching sets `data-theme` attribute on `<html>`

### Animation conventions
- **No animation libraries for core transitions**—raw `requestAnimationFrame` loops with spring physics (see `SplashScreen.jsx`)
- Direct DOM manipulation via refs for performance-critical animations (bypass React render cycle)
- WebGL shaders use **OGL** library (not Three.js) for lightweight effects

---

## Visual Effects Components

| Component | Purpose | Key tech |
|-----------|---------|----------|
| `DarkVeil` | Animated nebula WebGL background | OGL shaders (CPPN neural network) |
| `ShootingStars` | Particle shooting-star overlay | CSS animations |
| `Antigravity` | @react-three/fiber particle ring | Three.js / Rapier physics |
| `AutoVariableProximity` | Cursor-proximity variable font weight | Wraps text children automatically |
| `GradualBlur` | Edge blur gradient overlay | CSS `backdrop-filter` layers |
| `Lanyard` | 3D lanyard physics simulation | @react-three/fiber + Rapier |
| `CardSwap` | Stacked card shuffle animation | GSAP + React Ref manipulation |
| `GlassCursor` | Cursor-following frosted lens | CSS `backdrop-filter` + JS physics |

### Adding new visual effects
1. Create component in `src/components/` with matching `.css` if needed
2. Accept `reduceMotion` prop; render nothing or static fallback when true
3. For WebGL: prefer OGL for simple shaders, Three.js for 3D scenes
4. Import conditionally in page components based on `theme === 'dark'`

---

## File Organization

```
src/
├── main.jsx          # Entry point
├── App.jsx           # Root component, navigation state
├── App.css           # App-level transitions
├── components/       # All UI components (flat structure)
└── styles/
    └── landing.css   # Global stylesheet
```

Static assets: `public/images/`, `public/assets/3d/`, `public/videos/`

---

## Gotchas & Tips

- **No React Router**: Navigation is state-driven with slide CSS transitions in `App.jsx`
- **WebGL errors**: `DarkVeil` catches init failures and sets `hasError` state—check console for shader compilation issues
- **Variable fonts**: `AutoVariableProximity` wraps all text children recursively; exclude SVG elements via `EXCLUDED_TAGS` set
- **Images**: Use `import.meta.env.BASE_URL` prefix for correct paths in both dev and prod (e.g., `` `${import.meta.env.BASE_URL}images/...` ``)
- **3D assets**: Place `.glb` files in `public/assets/3d/`; Vite config includes `assetsInclude: ['**/*.glb']`
