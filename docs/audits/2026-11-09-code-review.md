# Portfolio code review — 9 November 2026

Reviewed revision: `566a261` (`main`). This is an audit, not an implemented redesign.

## Brief

The owner wants an innovative, personal portfolio that helps secure jobs, feels intentionally art-directed, and retains their style and soul. A generic minimal template would miss that brief. The recommendation is to preserve personality through a coherent visual idea and a few meaningful interactions, while making the work immediately readable and verifiable.

## Method and limits

Reviewed all application components, the store, all 20 source stylesheets, entry HTML, build/type configuration, test setup, deployment workflow, repository guidance, and root experiment files. Inventoried public assets, hashed duplicates, and inspected GLB image metadata. Read recent commits to distinguish existing improvements from remaining issues.

Executed `npm test -- --run` and `npm run build`; both pass. Ran an isolated React/jsdom probe against the actual VariableProximity component without modifying it. Parsed CSS to count rules and detect duplicate keyframes. No application files changed during this audit.

This is a source/build/lifecycle review, not a measured browser performance or screen-reader certification. No Lighthouse score, frame rate, GPU utilization, accessibility compliance score, or field Core Web Vitals is claimed. Layout and visual judgments below follow the source; responsive screenshots and real-device profiling are the next validation step. Local Node is 26.12.1; deployment currently selects Node 20.

## Measured baseline

| Measure | Result | Meaning |
|---|---:|---|
| Source JSX | 21 files / 4,095 lines | Includes App and its test |
| Source JS | 2 files / 144 lines | Store and test setup |
| CSS | 20 files / 6,182 lines | 856 rules; 30 `!important` declarations |
| All built JS chunks | 3,432,898 bytes | 1,172,527 bytes when each file is gzipped |
| Entry JS | 185.07 kB / 60.37 kB gzip | Not the entire eventual page cost |
| Shared R3F chunk | 855.35 kB / 233.21 kB gzip | Used by particle and lanyard scenes |
| Lanyard chunk | 2,229.24 kB / 827.38 kB gzip | Includes heavy transitive dependencies |
| All built CSS | 105,976 bytes / 23,304 gzip | Entry CSS alone is 68.05 kB |
| Public assets | 21,396,384 bytes | Files copied into deployment, not all downloaded on entry |
| Exact duplicate asset copies | 6,828,033 bytes | SHA-256 verified across three file pairs |
| Automated tests | 1 test, passing | Splash label existence only |

Sizes are decimal bytes/kB. Do not confuse total artifact size, initial requests, later preloads, and runtime work. The main issue is the combination of early preloads, continuously active effects, delayed access to content, and weak project presentation.

## Findings, ordered by impact

### F01 — Entry blocks access to the portfolio and is not keyboard-complete (high)

Evidence: `src/components/SplashScreen.jsx:42`, `:223`, `:251`, `:330`, `:431`, `:450`.

The visitor waits for a typewriter sequence, must pick a theme, then encounters a 5,000 ms timer before the exit begins. Wheel/touch input can accelerate exit after selection, so five seconds is the normal timed path rather than an unavoidable minimum in every interaction. This is a theatrical delay, not an actual asset readiness check.

The element announced as “Click to enter site” calls an empty handler. Its Enter/Space handler does the same. The theme labels are clickable spans; the focusable theme knob has pointer handlers but no keyboard activation. Hidden header controls are not made inert. The mobile CSS shrinks the slider to 140px and changes its knob positions, while JS retains desktop bounds of 4..286 and midpoint 145. Drag starts from inline `left`, ignoring the class-controlled visual position.

Plan: remove the required introduction. If any reveal survives, it must run around immediately usable content. Keep a conventional, optional theme control. Do not spend redesign time repairing the elaborate slider unless the owner expressly wants to retain it.

### F02 — The dismissed splash retains active work (high)

Evidence: `src/App.jsx:233`; `src/components/SplashScreen.jsx:95`, `:291`, `:302`; `src/components/DarkVeil.jsx:209`.

SplashScreen stays mounted after `dashboard`; clipping, opacity, pointer-events, and aria-hidden hide it visually. `selectedTheme` remains set, so its DarkVeil remains mounted. App has another DarkVeil. `isEntering` is never reset, so the 400ms crafting-dots interval also continues. The preview is no longer visible but is not gated off. With normal motion enabled and background enabled, both background render loops remain present after a theme selection; home adds its particle canvas.

Plan: unmount the intro and its resources after completion, or delete the intro entirely. A retained effect must have explicit activation, offscreen, hidden-tab, reduced-motion, and teardown behavior.

### F03 — Motion toggling leaks VariableProximity subscriptions (high; reproduced)

Evidence: `src/components/VariableProximity.jsx:80` returns before hooks at `:88`; subscriptions and cleanup are at `:147–245`.

The enabled/disabled branches violate React hook ordering. An isolated probe using the installed React version, jsdom, esbuild, and createRoot rendered `enabled=true → false → true → false`, then unmounted:

| Stage | resize listeners | scroll listeners | shared mouse/touch listeners |
|---|---:|---:|---:|
| First enabled render | 1 | 1 | 1 each |
| Disabled | 1 | 1 | 1 each |
| Re-enabled | 2 | 2 | 1 each |
| Disabled then unmounted | 2 | 2 | 1 each |

A single “Hello world” instance rendered 14 spans when enabled and one when disabled. The probe did **not** produce a crash; the demonstrated failure is retained listeners/subscriptions. Do not describe an unobserved crash as confirmed.

Plan: remove page-wide text mutation. If a limited signature text interaction is retained, isolate its component lifecycle and keep all hooks unconditional; prove subscriptions return to baseline after toggle/unmount.

### F04 — Several controls promise behavior they do not provide (high)

Evidence: `src/store/useAppStore.js:45–65`, `src/components/InterestingPage.jsx:94–193`, `src/components/GlassCursor.jsx`.

Font size and high contrast set HTML data attributes, but no stylesheet consumes them. Cursor glow sets an attribute, but GlassCursor has no imports/mounts and no CSS consumes the attribute. These settings can change their displayed state without changing the experience.

The motion toggle is not persisted, and the system motion media query is read only at initialization. CSS generally follows the OS query, while React follows the store; they can disagree. Projects still mount CardSwap and autoplay videos regardless of the reduceMotion prop. LogoLoop targets zero velocity under reduced motion but continues requesting frames. The mobile About GIF is not motion-aware.

Plan: reduce preferences to purposeful, fully tested controls. Accessible contrast and text zoom should work by default. If a high-contrast or text-size preference remains, implement and verify it rather than retaining a decorative switch.

### F05 — Project evidence is weaker than the presentation surrounding it (high for hiring)

Evidence: `src/components/ProjectsPage.jsx:14–30`, `:40–56`, `:79–106`; `src/components/AboutPage.jsx:249–289`.

Two of the three project entries contain a title and video only. The third has a description and tags. There are no per-project repository/demo links or case-study destinations. The only GitHub link is to the whole repository list. The About page repeats projects with decorative gradient placeholders rather than actual product images.

Autoplaying, stacked project cards make viewers work to inspect the projects. The prominent “How I Build” section describes intentions instead of showing decisions, constraints, responsibilities, and outcomes. Claims such as “No tutorials, no toy demos” add confidence without corresponding evidence.

Plan: build three focused case studies using real screenshots, verified roles/outcomes, technical choices, links, and concise personal commentary. Let the work supply the personality. Preserve the owner’s voice; do not invent metrics, clients, employment, or achievements.

### F06 — Lazy loading is partly defeated by automatic preloads (high for transfer cost)

Evidence: `src/App.jsx:66–87`, `:95–108`; `src/components/Lanyard.jsx:337`.

After dashboard entry, an idle callback (timeout 1,200ms) or 350ms fallback imports all secondary views plus Lanyard, LogoLoop, and CardSwap. This occurs even if motion is reduced. Importing Lanyard also calls `useGLTF.preload` at module scope, initiating model loading. Intent-based hover/focus prefetch already exists but is undermined by the blanket preload.

Plan: retain targeted prefetch where measurements justify it; remove unconditional background loading of optional experiences. Load a retained 3D feature only on explicit activation or relevant visibility, respecting motion/data preferences. Merely splitting these chunks further does not eliminate their work.

### F07 — Constant effects have no clear runtime budget (high/medium)

Evidence: `Antigravity.jsx:63–112`, `:129`; `Lanyard.jsx:184–255`; `DarkVeil.jsx:209–247`; `LogoLoop.jsx:64–79`; `App.jsx:255–265`.

Antigravity updates 150 home particles every frame and requests high-performance rendering. Lanyard explicitly wakes its body every frame to keep spinning, regenerates rope points, and runs physics continuously. DarkVeil renders a full-screen neural shader at device pixel ratios up to two. GradualBlur layers six backdrop filters over a fixed page strip, on top of numerous translucent surfaces.

None of these components has a coordinated page-visibility/offscreen policy. At <=480px the particle container is hidden using CSS, but the React canvas component still mounts; runtime work should be measured rather than assuming display:none is a lifecycle boundary. Antigravity’s incremental rotation is frame-rate dependent.

Plan: one signature effect, isolated and optional, with a static visual alternative. Keep normal reading idle. For retained WebGL, implement lifecycle controls before tuning shaders. Demand rendering requires settling animations/physics plus explicit invalidation; changing one Canvas prop alone is not a complete solution.

### F08 — Navigation behaves like internal application state (medium/high)

Evidence: `src/App.jsx:110–148`, `:158–204`; `src/components/Header.jsx:10–78`; `src/App.css:3–18`; `src/styles/globals.css:158–175`.

The address bar never identifies the selected page. Refresh resets navigation; browser back/forward and shareable project links are unavailable. Navigation buttons do not have link semantics or `aria-current`. Slide transitions temporarily mount both pages and discard clicks while in transition. Loading fallbacks are null, and there is no error boundary for failed lazy imports/3D children.

The scroll reset targets window, whereas the mobile scroll container is `.page-container`; reduced-motion navigation returns before any reset. Desktop overflow rules, full-height layouts, nested containers, and fixed transitions make scrolling more fragile. No route-change focus management or skip link exists.

Plan: normal document scrolling, real links and URLs, deterministic focus handling, useful loading/failure states. Choose routing and static generation together for GitHub Pages; do not introduce history-based deep links without a refresh strategy.

### F09 — Styling has accumulated competing rules and visual languages (medium)

Evidence: `src/styles/components/header.css:5` and `:37`; `shared-panels.css`; `projects.css`; `typography.css`; `landing.css`; `VariableProximity.css`.

Header declares `position: fixed` and then `position: relative` in the same rule; the latter wins. Shared glass-panel, header, section, and footer rules are repeated in the asynchronously loaded projects stylesheet. Two different `@keyframes statusPulse` definitions share a global name. Page preloading can therefore introduce styles affecting already-mounted content.

The visual vocabulary mixes neon, metallic frames, chrome sliders, gold buttons, translucent glass, terminal panels, bento tiles, and warm wood tones. Almost every surface receives a treatment, leaving little hierarchy. That is a design diagnosis, not a claim that any one of those styles is inherently wrong.

The app requests four Google font families in HTML and Roboto Flex through imported CSS. VariableProximity overrides wrapped text to Roboto Flex, competing with the intentional heading/body type choices. JetBrains Mono has no source CSS use. Broad character wrapping increases DOM, observers, listeners, and per-pointer calculations across entire pages.

Plan: define a compact material, color, type, spacing, and motion system; give shared styles one owner; remove unused rules with coverage checks across all views/states. Restrict expressive type treatment to a deliberate display moment.

### F10 — Assets contain waste and incomplete delivery details (medium)

Hash-identical pairs:

| Copy under `public/assets/3d/` also exists under `public/assets/lanyard/` | Bytes per copy |
|---|---:|
| `card.glb` | 884,892 |
| `card1.glb` | 2,457,784 |
| `texture.png` | 3,485,357 |

`Lanyard` references `assets/lanyard/card.glb` and `lanyard.png`; the loaded GLB contains an embedded JPEG. `card1.glb` and loose `texture.png` have no application references found. Preserve source artwork separately if useful; verify references before deletion. The two `lanyard.png` files are not hash-identical.

Portrait PNGs range from roughly 0.38 to 1.2 MB; a random portrait is selected on each LandingPage mount. The navigation’s animated letter GIF is roughly 320 kB. Two videos total roughly 5 MB and have no posters, controls, or viewport playback policy. `preload="metadata"` does not make autoplay a no-download experience.

Vite copies public assets even when unused. Removing duplicate files reduces deployment size; it is not automatically an equivalent reduction in first-page transfer.

Plan: deterministic, responsive portrait assets; SVG/static navigation; project poster images; on-demand video; one authoritative asset path. Avoid automatic image edits or deleting original artwork during the audit.

### F11 — Search/social metadata and editorial consistency need attention (medium)

Evidence: `index.html`, `public/sitemap.xml`, `AboutPage.jsx:75–93`, `:215`.

The HTML contains generic Open Graph/Twitter text but no canonical URL, og:url, og:image, or twitter:image. An OG SVG exists but is not referenced. The Apple touch icon path points to a missing file. Core page content is only client-rendered. The one-URL sitemap reflects current URL architecture; adding fake entries would not fix it.

The HTML describes a graduate while visible text describes a final-year student. A stat says “SIH 2025 Winner” while its detailed item says “SIH Internal Round Winner.” These must be reconciled with the owner, not guessed. Download counts and employment/availability need dates and evidence.

Plan: accurate copy, route-aware metadata, a supported raster sharing image, real static page URLs if selected, and a sitemap generated from actual pages. Preserve working robots/sitemap deployment from the domain migration.

### F12 — Tests and repository hygiene do not protect the intended experience (medium)

Evidence: `src/App.test.jsx`, `.github/workflows/deploy.yml`, `package.json`, `tsconfig.json`, root scratch files, `CLAUDE.md`.

The only test asserts a label for a nonfunctional entry action. CI builds and deploys without running that test. There is no lint script or hook linting. TypeScript config permits JS but has checkJs disabled, and there is no typecheck script; this is not an actively type-checked application. React 19 type definitions accompany React 18 runtime.

Root files include empty fetch scripts/JSON/text files, a UTF-16 JavaScript fetch scratch file, a 404 response, a copied external HTML document, IDE metadata, and tracked nested worktree settings. The fetch scripts are not part of the app; do not execute fetched content to audit them. Retained copied components need a provenance/license check rather than an assumption about ownership.

CLAUDE.md and other guidance contain stale claims: missing nav semantics, duplicated page renderer, eager-only loading, placeholder email, inconsistent LinkedIn, mathjs/lottie dependencies, and DarkVeil rebuilds on every prop are no longer accurate in this revision.

Plan: a small regression suite for real visitor journeys, hook linting, CI checks before deployment, a deliberate JS/typecheck choice, and documentation reflecting the resulting architecture.

### F13 — Smaller correctness/lifecycle details (medium/low)

- `DarkVeil.jsx:199–203`: the shader divides gl_FragCoord by CSS width/height while the drawing buffer is scaled by DPR/resolutionScale. Review against actual drawing-buffer dimensions on DPR 1 and 2. Cleanup cancels RAF/listeners but does not explicitly release geometry/program resources; inspect resource disposal if retaining this component.
- `BorderGlow.jsx:40–51`, `:131–151`: animateValue schedules timeouts/RAF without a cancellation handle. Its separate pointer RAF is cleaned up, but the introductory sweep jobs are not.
- `ShootingStars.jsx:23–36` plus `landing.css:771–798`: stars start at opacity zero and set --duration, but no rule applies the shootingStar keyframe. In the current source they create/remove nodes without the intended animation.
- `LandingPage.jsx:34–137`: cached lighting rectangles update on window scroll/resize, not the nested page container; transforms are not reset on effect cleanup when reduced motion is enabled.
- Store setters use localStorage without exception handling or validation. Restricted storage can interrupt initialization/settings. System color preference is not used for initial theme selection.
- Profile image has no failure fallback; its CSS remains transparent until onLoad fires.

Treat these as focused tasks only if the corresponding feature survives the creative direction. Avoid polishing components scheduled for removal.

## What deserves to survive

- Real personal portrait, mobile-development emphasis, security interests, and actual work history.
- React/Vite/GitHub Pages as a usable foundation; no backend or framework rewrite is required merely to reduce effects.
- Existing lazy imports, shallow Zustand selectors, shared page renderer, bounded pointer RAF scheduling, instanced particles, and reusable Three vectors. Prior optimization work is real.
- CSS variables and some responsive/reduced-motion handling, while resolving gaps.
- A tactile interaction or custom visual motif, if it connects to the owner’s work rather than advertising a component library.

## Complete application inventory and proposed disposition

| Area | Files | Assessment / likely next move |
|---|---|---|
| Shell | main.jsx, App.jsx, App.css | Keep entry; simplify navigation, scrolling, effect lifetime |
| Preferences | store/useAppStore.js | Keep only useful settings; validate storage and live media changes |
| Introduction | SplashScreen.jsx, splash.css, BorderGlow.jsx, both BorderGlow CSS paths | Remove required gate; reuse only if concept calls for it; one CSS file is empty |
| Navigation | Header.jsx, ThemeToggle.jsx, header.css | Real links, reliable positioning, simpler controls, static icons |
| Home | LandingPage.jsx, components/landing.css | Recompose identity and featured work; intentional portrait and one signature moment |
| About | AboutPage.jsx | Personal story/evidence; reduce repeated claims and project duplication |
| Work | ProjectsPage.jsx, CardSwap.jsx/.css | Replace rotating stack with inspectable project stories and controllable media |
| Preferences page | InterestingPage.jsx | Retire customization destination; optional Lab must contain real experiments |
| Background | DarkVeil.jsx/.css | Optional concept candidate; no default full-screen loop without budget |
| 3D | Antigravity.jsx, Lanyard.jsx/.css | Remove particle ornament; lanyard candidate for isolated Lab only |
| Animated text | AutoVariableProximity.jsx, VariableProximity.jsx/.css | Remove global wrapping; optional isolated redesign after leak repair |
| Other effects | GlassCursor.jsx, ShootingStars.jsx, GradualBlur.jsx/.css | Cursor currently unused; stars broken; blur overgeneralized for one use |
| Skills loop | LogoLoop.jsx, styles/components/LogoLoop.css | Prefer meaningful skills/project associations; static list before animation |
| Styles | variables/globals/utils/landing aggregator; typography/cursor/shared-panels/projects CSS | Consolidate tokens and ownership; remove legacy styles after replacement |
| Tests | App.test.jsx, test/setup.js | Replace existence-only coverage with user behavior and lifecycle checks |
| Build/publication | package*.json, vite config, tsconfigs, index.html, Pages workflow, public CNAME/robots/sitemap | Keep hosting; add validation, metadata, route strategy, repeatable runtime |
| Assets/repo material | public images/videos/3D; README, guidance, root scratch files, IDE/worktree config | Optimize/retain originals intentionally; remove proven debris; correct docs |

## Technical references

These support the engineering principles, not claims about observed browser timings:

- [React: Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks) — hooks before conditional returns.
- [React Three Fiber: scaling performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance) — idle/on-demand rendering and invalidation.
- [Vite: static assets](https://vite.dev/guide/assets.html) — public-directory copying and imported asset processing.
- [Web Vitals](https://web.dev/articles/vitals) — field metrics and performance targets; lab measurements are not field results.
