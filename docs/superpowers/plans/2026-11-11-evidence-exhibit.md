# Evidence exhibit implementation plan

> For agentic workers: use superpowers:executing-plans. Keep the durable ledger in handoff/PROGRESS.md; the owner explicitly requested a handoff for other models.

**Goal:** Build a distinctive local portfolio revision around real software, visible demos and a useful explanation of engineering decisions.
**Architecture:** Keep React/Vite static prerendering. Extract Home, SignalStudy and Credentials into focused components; extend existing project data and case-study rendering. Native navigation and progressive enhancement remain the baseline.
**Tech stack:** Existing React 18, Vite, CSS, SVG, Vitest, Playwright. No new runtime dependency.
**Spec:** docs/research/2026-11-11-evidence-and-direction.md; handoff/DO-NOT-BREAK.md.

## Global constraints
- Keep GitHub Pages and adonpaultomy.tech, all existing static routes and original MP4s.
- No video request before activation, no invented project screens or live AI behaviour.
- No private vault material, credentials, unsupported metrics or false certificate claims.
- LumiSense implementation was built by Adon with AI assistance (owner clarification); academic manuscript has multiple authors and unconfirmed publication status.
- Work locally on feat/evidence-led-portfolio. User has authorized implementation and prior push/deploy; prepare this changed direction for local visual review before another release.

## Review focus
- Multiple videos: starting one pauses the other; native controls remain usable.
- JavaScript disabled: case studies, evidence, certificate disclosure and media downloads remain accessible.
- Failed image/video: keep text, project links, focus and fallback download.
- Small screens and enlarged text: no sideways overflow or clipped controls.
- Interactive diagram: active indicator and explanatory copy agree, with keyboard operation and reduced motion.

### Task 1: Evidence and interactions
Files: src/content/projects.js, src/components/SignalStudy.jsx, src/components/ProjectMedia.jsx, src/renewal.test.jsx.
Produces: LumiSense project object using existing schema; SignalStudy({id}) interactive architecture explanation; ProjectMedia({project}) compatible on home/detail.
- [x] Add failing tests for LumiSense route/role, homepage demo buttons, signal selection and cross-player pause.
- [x] Run unit suite and inspect expected failures.
- [x] Add verified LumiSense narrative; expose meaningful channel buttons with aria-pressed and persistent static overview.
- [x] Coordinate video playback with native play events; keep request-on-click and failure recovery.
- [x] Run unit suite after integration.

### Task 2: Art direction and curated evidence
Files: src/App.jsx, src/components/Home.jsx, src/components/Credentials.jsx, src/styles/site.css, public/media/credentials/*, scripts/create-share.mjs.
Produces: new homepage and coherent case-study shell, real certificate scans and no portrait artwork.
- [x] Build typographic identity and original code-native signal visual, no endless animation.
- [x] Lead with LumiSense architecture, then home-visible Melody/Style Transfer videos and source/case links.
- [x] Add sanitized Sunset learning note with remediation and current Linux/security study context.
- [x] Add three accurate, native expandable credential records with optimized lazy scans.
- [x] Replace social image and remove unused shipped portrait/art assets, preserving Git history.
- [x] Inspect desktop/mobile screenshots; fix composition, contrast, overflow and layout shifts.

### Task 3: Verification and handoff
Files: tests/portfolio.spec.js, scripts/check-build.mjs, scripts/prerender.mjs, docs/content-sources.md, handoff/*.
- [x] Update obsolete beige-design test expectations; retain behavioural and accessibility coverage.
- [x] Add LumiSense static route/budget validation, cross-player playback and credential disclosure tests.
- [x] Run npm run check and npm run test:e2e; fix any failures and repeat affected checks.
- [x] Ask Antigravity for a bounded read-only review using supplied facts/code; assess findings.
- [x] Record actual results, remaining factual questions and next commands in handoff/PROGRESS.md.
- [x] Commit the local branch after verification; provide reviewable preview without replacing the live site.
