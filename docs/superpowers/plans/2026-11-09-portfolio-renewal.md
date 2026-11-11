# Portfolio Renewal Implementation Plan

**Status update — November 11:** The owner approved direction A, requested more flair and maximum optimization, and authorized implementation. The original draft below is retained as the audit roadmap. The approved design is in `../specs/2026-11-09-portfolio-renewal-design.md`; measured implementation results are in `../../audits/2026-11-11-renewal-validation.md`. This supersedes the draft approval/deferred-implementation language below.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. This is a draft roadmap; creative direction is not yet approved. Do not execute application changes from this document without the owner's selection of direction.

**Goal:** Create a distinctive, personal portfolio that communicates Adon's engineering ability quickly and makes his work memorable without unnecessary delay or runtime cost.

**Architecture:** Recommended: renew the existing React/Vite project in place, retaining GitHub Pages and the new domain. Make the portfolio a content-led document with real links, project detail destinations, and optional isolated interactions. Select the URL/static-generation approach in Task 1 before implementation; avoid a framework migration without a specific benefit.

**Tech Stack:** Existing React 18, Vite, CSS, Vitest, GitHub Pages. Animation and state dependencies are retained only where the approved concept needs them; no blanket version upgrades or new backend.

**Spec:** [Audit and owner brief](../../audits/2026-11-09-code-review.md). This is the source for the draft, not an approved visual design. Task 1 produces the approved design that replaces this provisional specification.

## Global constraints

- Retain `adonpaultomy.tech` and existing GitHub Pages hosting.
- Preserve personal character; do not substitute a standard neon bento template or a generic minimal developer template.
- Make identity, work, and contact usable immediately; no required intro, theme-selection gate, or artificial loading timer.
- Core reading/navigation must work with keyboard, touch, reduced motion, and failed decorative assets.
- No invented project outcomes, download counts, qualifications, clients, testimonials, or biography.
- No automatic fetching of heavyweight optional effects on home entry.
- Use native document scrolling; decorative interactions must not capture the ordinary scroll journey.
- Application implementation is a later phase. This review does not authorize choosing the owner's visual identity on their behalf.

## Review focus

- Keyboard-only entry and navigation: visible focus, real links, no hidden focus targets or decorative interaction required to reach work.
- Reduced motion and storage restrictions: preferences may change during a visit, storage can throw, and disabling effects must release resources.
- Small screens and zoom: readable at 320 CSS pixels and 200% zoom without clipped projects or inaccessible controls.
- Slow/failed media or scripts: useful text and links remain; videos have posters; failed optional enhancements cannot erase the page.
- GitHub Pages direct URLs: opening, refreshing, sharing, and returning from a case-study URL work without a hosting fallback surprise.

## Creative decision: three plausible directions

These are proposals, not claims about what the owner has already chosen. The audit supports them; it cannot decide taste.

### A. Personal workshop — recommended

Build on the existing tactile/physical interest: a portrait, custom typography, restrained material depth, and a work surface presenting actual apps. A consistent accent and small annotations carry the mobile/security identity. Give each project a deliberate composition rather than a generic card.

Signature interaction: a selected project image can reveal the thinking behind a real interface decision, with a normal button performing the same action. A short transition between the product and its annotated engineering view creates a memorable “I built this, and here is why” moment. Use actual screens and explanations, not fake terminal output or decorative schematics.

Keep: physicality, expressive type, portrait, technical curiosity. Remove: chrome theme gate, page-wide glowing text, ambient particles, compulsory card shuffling. An optional Lab can preserve a carefully refined 3D experiment.

Tradeoff: requires good screenshots and short accounts of genuine decisions; cannot be achieved by merely deleting CSS. Strongest balance of individuality and hiring usefulness.

### B. Kinetic editorial portfolio

Lead with a custom typographic composition, large product imagery, deliberate spacing, and a personal editorial voice. Most motion is a brief response to navigation or a user action. Work reads like a set of visual essays, with short skimmable summaries before depth.

Signature interaction: a restrained display-title treatment and one media transition shared across case studies. Body copy stays static and readable.

Tradeoff: low runtime cost and strong clarity, but must invest in original composition, art direction, and voice to avoid looking like a studio template. Less directly connected to the current tactile aesthetic.

### C. Interactive engineering exhibit

Treat each build as an exhibit: visitors can try a small real interaction, inspect an implementation choice, and open the full case study. The entrance still exposes a conventional work list and contact path. The experimental layer is optional and loaded on demand.

Signature interaction: one carefully designed object/interface connecting the projects, with a complete static alternative. Prefer DOM/CSS first; introduce WebGL only if the concept demonstrably needs it.

Tradeoff: most room for experimental identity, highest implementation and device-testing cost, greatest risk of reproducing the current effect overload. Choose only with willingness to fund the content and performance discipline it requires.

No award outcome is promised. The desired quality comes from coherent art direction, original content, typography, accessibility, and execution—not the number of libraries or effects.

## Recommended information structure

This structure applies to all three directions; visual composition remains open.

1. **Opening:** name, accurate professional positioning, one concise personal statement, clear “Selected work” and “Contact” links. Expressive visual identity alongside content, not ahead of it.
2. **Selected work:** three strongest projects, each with a real image, one-sentence purpose, role, status, and a direct detail link. Order by quality of evidence, not animation appeal.
3. **Project detail:** problem → constraints → contribution → key decisions → result/evidence → what changed or was learned. Include repository/demo links where public. A short summary precedes the deep material.
4. **About:** a compact personal story, concrete interests, relevant experience, and precise achievements. Avoid repeating the same three projects and generic “I ship” claims.
5. **Contact:** visible email and professional links; resume link only once an actual current resume is supplied.
6. **Optional Lab:** real experiments with short explanations. The current customization page is not a substitute for this content.

Before visual implementation, request only missing material: actual target roles, current graduate/employment status, exact project/repository links, ownership/contribution, current evidence for metrics, and which personal visual references resonate. Do not block structural and performance analysis on content that can be supplied later.

## Engineering approaches

| Approach | Best use | Cost / risk | Recommendation |
|---|---|---|---|
| Repair existing effect-heavy UI | Immediate operational stabilization | Preserves most visual overload and weak project storytelling | Short first phase only |
| Recompose in current React/Vite stack | Strong identity with familiar tools and reusable content | Requires replacing shell/CSS and writing case studies | Recommended |
| Move to a static-content framework | Larger writing/case-study library where pre-rendering simplicity pays off | Migration and tooling costs; still needs the same design/content work | Reconsider only after the URL/content prototype exposes a real need |

Real project URLs and initial HTML content are desirable. Task 1 must pick either build-generated static detail pages within the current toolchain or a justified static-content approach. A hash-based interim navigation fix is cheaper and robust on Pages but is not a replacement for distinct indexable case-study documents. Do not add a large router solely to avoid thinking about document structure.

## Proposed file responsibilities

Names below describe the recommended in-place approach and can be finalized with the approved design. Each file should exist because it owns a concrete responsibility.

| File/area | Responsibility |
|---|---|
| `src/App.jsx` | Lightweight shell and enhancement boundaries; no intro state machine |
| `src/components/Header.jsx`, `ThemeToggle.jsx` | Native navigation links and optional theme switch |
| `src/content/profile.js` | Verified biography, contact, availability, external links |
| `src/content/projects.js` | Shared project summaries and detail content references |
| `src/components/ProjectCard.jsx` | Readable summary with a real destination |
| `src/components/ProjectMedia.jsx` | Poster, explicit playback, fallback, responsive sizes |
| `src/components/ProjectCaseStudy.jsx` | Consistent narrative skeleton with room for project-specific composition |
| `src/components/SignatureInteraction.jsx` | One selected interaction, static default, optional enhancement |
| `src/hooks/usePreferences.js` or reduced existing store | Single source of truth for theme/motion and safe persistence |
| `src/styles/variables.css`, `globals.css` | Approved tokens, reset, focus, document flow |
| Component/page styles | Clear ownership; no duplicate global keyframes/shared rules |
| `public/` | Only intentional shipped media, metadata assets, domain/crawler files |
| `.github/workflows/deploy.yml` | Validation gates then Pages build/deploy |

Project schema proposal: `slug`, `title`, `summary`, `role`, `status`, `stack`, `poster`, optional `video`, optional `repositoryUrl`, optional `demoUrl`, `problem`, `constraints`, `decisions`, `outcome`, `evidence`, `lessons`. Missing evidence is represented as missing, never filled with generated facts. No CMS is needed for three projects.

## Plan 1 — Stabilize access and effect lifecycle

Purpose: remove confirmed visitor-facing defects while the larger direction is being designed. If the approved redesign immediately removes a defective component, delete it there instead of separately optimizing it.

### Task 1: Establish the baseline and select the concept

**Files:** audit document; new `docs/superpowers/specs/2026-11-09-portfolio-renewal-design.md` after direction selection; current App, page components, and static output as references.

- [ ] Record mobile and desktop screenshots for entry, home, about, work, and preferences; include a short viewport, touch input, and reduced motion.
- [ ] Measure a cold first visit, dashboard entry, and About/Projects visits separately. Capture requests, long tasks, DOM count, canvas count, and idle behavior. Save environment and raw reports with the baseline.
- [ ] Choose A/B/C, settle the extent of remaining 3D, and approve one home composition plus one project composition at desktop and mobile sizes.
- [ ] Prototype only the selected URL/build approach and verify direct opening/refresh of one detail page on Pages-compatible static hosting before adopting it.
- [ ] Write the design with chosen materials/type/motion, content needs, routes, and budgets. Keep a plain static representation for every essential interaction.

**Acceptance:** a concrete approved visual/interaction direction and hosting proof, not simply a moodboard or a framework choice. No full implementation before this decision.

### Task 2: Make entry and reading reliable

**Files:** `src/App.jsx`, `src/App.css`, `src/components/SplashScreen.jsx`, `src/components/Header.jsx`, associated splash/header/global CSS, `src/App.test.jsx`.

- [ ] Add a behavior test that identity, selected-work navigation, and contact are reachable without selecting a theme or advancing a timer; verify it fails against the gated app.
- [ ] Remove the mandatory splash and its global input/scroll handlers; prune splash-only dependencies once unused.
- [ ] Establish normal page scrolling and visible native navigation; remove obsolete transition state and hidden interactive elements.
- [ ] Verify keyboard activation, focus, narrow viewport, and zoom; use a real browser for layout assertions.
- [ ] Run the focused test, full current tests, and build; commit the independently usable change.

**Acceptance:** no entry gate, no artificial wait, no hidden splash canvas/timer after entry. Work stays reachable if decorative code fails.

### Task 3: Correct preferences and remove fake controls

**Files:** `src/store/useAppStore.js`, `InterestingPage.jsx`, `AutoVariableProximity.jsx`, `VariableProximity.jsx`, `ProjectsPage.jsx`, `LogoLoop.jsx`; related CSS; focused preference/effect tests.

- [ ] Add regressions for motion toggles and listener cleanup, runtime OS preference changes, blocked localStorage, and refresh persistence where offered.
- [ ] Remove global per-character effects or split retained animated/plain modes into correct lifecycles. Verify event listeners and observers return to baseline after repeated toggles/unmount.
- [ ] Remove unimplemented settings; retain high contrast/text preferences only with measurable rendering behavior and tests. Ensure ordinary zoom/contrast work without opting in.
- [ ] Make retained video/card/logo effects honor motion preferences, or replace them with the static approved presentation.
- [ ] Run focused/full tests and build, then commit.

**Acceptance:** every visible control works, storage failures do not prevent content, and reduced motion is a complete presentation mode rather than a partial switch.

## Plan 2 — Give the work and identity a coherent presentation

### Task 4: Build the content foundation and project stories

**Files:** new `src/content/profile.js`, `src/content/projects.js`; `LandingPage.jsx`, `AboutPage.jsx`, `ProjectsPage.jsx`; proposed ProjectCard/CaseStudy/Media components.

- [ ] Collect and reconcile the current profile, exact SIH achievement, project roles, links, screenshots, and dated outcome evidence.
- [ ] Write three concise summaries and at least one complete flagship case study before filling every screen with placeholders.
- [ ] Test project navigation and link destinations against the verified data; omitted optional fields must not create empty controls.
- [ ] Render projects directly with accessible media and narrative; replace the rotating stack and repeated decorative project placeholders.
- [ ] Review copy aloud for a personal, concrete voice. Remove unsupported bravado and generic filler; keep honest tradeoffs and lessons.
- [ ] Validate at desktop/mobile sizes and commit.

**Acceptance:** within roughly 30 seconds a visitor can identify the role sought, find the strongest work, and open evidence or contact. This is a usability review criterion, not a claimed analytics result.

### Task 5: Implement the selected art direction

**Files:** home/about/work components, Header/ThemeToggle, `variables.css`, `globals.css`, page CSS, typography/shared styles.

- [ ] Translate the approved compositions into tokens: a small type hierarchy, intentional accent(s), spacing rhythm, surfaces, and focus states.
- [ ] Give each work presentation a project-specific visual using real product material while preserving consistent navigation and reading structure.
- [ ] Replace fixed-height/nested-scroll scaffolding and CSS overrides with ordinary responsive flow.
- [ ] Consolidate duplicate shared selectors/keyframes; remove obsolete splash, cursor, glow, and legacy About styling only after confirming all states.
- [ ] Review 320, 390, 768, and 1440 CSS-pixel widths plus 200% zoom. Check light/dark only if both are part of the approved design.
- [ ] Run tests/build and commit.

**Acceptance:** the page reads as one authored visual system. Interaction affordances are distinguishable from decoration; body text remains stable and selectable.

### Task 6: Add one signature interaction

**Files:** new `SignatureInteraction.jsx` and its CSS/tests; the host project/home component; retained graphics dependencies only if selected.

- [ ] Start from the fully useful static design; define the exact interaction and what story it tells about Adon's work.
- [ ] Add tests for keyboard/touch equivalence, reduced-motion fallback, failed enhancement loading, and repeated mount/unmount cleanup.
- [ ] Implement the interaction with DOM/CSS first. If WebGL is justified, isolate its import, cap quality, stop offscreen/hidden work, and let motion settle.
- [ ] Compare cold-load transfer and idle performance against the static version. Remove complexity that does not materially improve the chosen experience.
- [ ] Test on an actual midrange phone and a device with WebGL disabled/unavailable; commit after the interaction passes.

**Acceptance:** a memorable specific detail, not simultaneous ambient effects. It is safe to skip, and the portfolio is complete without it.

## Plan 3 — Delivery, maintainability, and release quality

### Task 7: Optimize the assets and loading policy

**Files:** `public/images`, `public/videos`, `public/assets`; image/media consumers; `App.jsx` preload policy; `index.html`; `package.json`/lockfile if dependencies are removed.

- [ ] Remove blanket secondary-view preloading and module-scope preloads for unused effects. Verify the network waterfall, not only import syntax.
- [ ] Export responsive portrait/project images with dimensions and useful fallbacks; preserve originals outside shipped assets.
- [ ] Replace animated navigation images and unnecessary font families; keep at most two delivered font families unless the approved concept has a measured reason for more.
- [ ] Use project posters and explicit video playback; preserve pause/controls and supply captions if the real media needs them.
- [ ] Remove hash-identical duplicates and unused build assets after reference checks, and remove dependencies only after their last consumer is gone.
- [ ] Build and inspect actual output/requests; compare with baseline and commit.

**Acceptance:** all performance budgets below are met or have an explicitly documented design exception; no automatic video/3D download during a normal home visit.

### Task 8: Make links, metadata, and failures production-ready

**Files:** routing/static generation chosen in Task 1, project pages, `index.html`, public sharing image/icons/sitemap, enhancement boundary/fallback components.

- [ ] Test direct detail URLs, refresh, browser back/forward, anchors, invalid URLs, and external links on the real static output.
- [ ] Add accurate titles/descriptions, canonical and share URLs, a raster share image, and a sitemap using real published pages.
- [ ] Ensure primary biography/work content is in generated HTML if that is part of the selected architecture; verify with JavaScript disabled.
- [ ] Add visible recovery/fallback states for failed optional bundles and media. Test a missing image and a rejected enhancement import.
- [ ] Check focus management, active navigation semantics, skip link, contrast, text scaling, and controllable motion; commit.

**Acceptance:** a recruiter can share a specific project, refresh it, read it, and contact the owner without relying on an animation or a perfect network.

### Task 9: Protect and publish the result

**Files:** `package.json`, lockfile, lint configuration, focused tests, `.github/workflows/deploy.yml`, README/guidance, `.gitignore`, obsolete root scratch/IDE/worktree artifacts.

- [ ] Add hook/accessibility lint checks and run behavioral tests before the Pages build/deploy job; align a supported Node major between local tooling and CI after checking dependency engines.
- [ ] Keep plain JS with useful checking, or adopt types deliberately; remove misleading unused config and mismatched React types if still unnecessary. Avoid a simultaneous wholesale TS rewrite.
- [ ] Cover entry, navigation, preferences, project links/media, optional-effect failure, and cleanup; avoid snapshot-only coverage of visual trivia.
- [ ] Remove confirmed scratch files and accidental nested worktree/editor artifacts; check component provenance/license obligations before retaining borrowed source.
- [ ] Update project documentation with the actual architecture, commands, content-editing flow, and effect budgets.
- [ ] Deploy a reviewable version, verify on the actual domain, and retain the previous revision as rollback. Push to main only when the user authorizes that implementation release.

**Acceptance:** CI blocks meaningful regressions, production URLs work, the intended visual direction is reviewed, and performance/accessibility evidence accompanies the release.

## Proposed budgets and validation matrix

These are design constraints for the renewal, not measurements of the existing site and not promises of an award or search ranking.

| Area | Proposed target | Verification |
|---|---|---|
| Entry | No user gate or artificial delay | DOM/keyboard tests; cold browser visit |
| Default JS | <=200 kB gzip total automatically fetched JS before optional interactions | Build report plus cold network trace, including delayed preloads |
| Default CSS | <=30 kB gzip | Sum built CSS required by primary journey |
| Initial viewport media | <=300 kB combined raster images/posters | Network trace; correct responsive source |
| Fonts | <=100 kB transferred for initial chosen subsets | Cold network trace; no unused family requests |
| Optional 3D/video | Zero requests before relevant explicit activation | Fresh visit waterfall |
| Idle reading | No app-owned continuous decorative RAF/physics loops | Performance recording after settling; hidden-tab/offscreen checks |
| Field targets | LCP <=2.5s, INP <=200ms, CLS <=0.1 at the 75th percentile | Field data when traffic permits; repeatable lab checks as interim evidence |
| Accessibility | No keyboard traps; meaningful focus; reduced-motion/static equivalence | Keyboard + screen reader + automated checks; no automatic compliance claim |
| Static delivery | Every published project URL loads directly and refreshes | Test built output and deployed Pages |

Run at least one cold mobile profile and one desktop profile, then repeat under reduced motion and failed optional assets. Record device, viewport, CPU/network throttling, cache state, and build revision. A single Lighthouse score cannot represent the splash-to-home-to-work journey.

## Dependencies and stopping points

- Task 1 settles direction before Tasks 4–6; content collection can proceed while performance measurements are gathered.
- Tasks 2–3 can be a small stabilization release if the redesign will take longer. Avoid repairing effects that Task 5 deletes.
- Task 4 supplies real material for Task 5. Task 6 follows a complete static experience, never precedes it.
- Tasks 7–8 are validated throughout implementation and completed before Task 9 publication.
- If the owner wants to retain the old experiment, archive it in Git/a separate opt-in experience rather than continuing to ship it by default.

## Self-review

The roadmap covers F01–F13 in the audit: access/lifecycle/preferences (Tasks 2–3), content and visual hierarchy (4–6), loading/assets (7), navigation/metadata/fallbacks (1, 2, 8), and quality/hygiene (9). The five review conditions are assigned to explicit tests or real-browser checks. No numerical performance improvement is promised before measurement. No creative direction has been marked approved, and no application implementation or deployment occurred during the audit.

Next decision: select the creative direction and whether an optional experimental Lab belongs in the portfolio. Then turn this draft into the final design and implementation sequence using actual project evidence.
