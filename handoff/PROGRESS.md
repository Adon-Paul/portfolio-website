# Hosted release runner adjustment — November 14

First Pages run 43583445194 failed 11 browser checks: predominantly 30-second workflow timeouts on software WebGL, plus fixed-window cube displacement and a skip-button observation after the opening had ended. Local full 55-test suite passed. Configure one CI worker, 90-second CI workflow deadlines and 15-second assertion deadlines (local remains 30/5 seconds with two workers). Cube movement still must exceed 8px, now polled; bounds and pause assertions unchanged. Opening tests observe DOM readiness instead of waiting for all resource loading. No product rendering quality change or test removal. Follow-up CI pending.

# Sidebar release — November 14, 2026

Owner approved publishing accumulated local changes, replacing directory popup with a full-height left sidebar, and hiding unconfigured shared likes. Implemented edge-attached 440px/max-viewport sidebar, reduced-motion/pause-aware entry, native disclosure/search/branch/static index preserved, selection restores trigger focus. Likes render only after valid public configuration; existing shared-service behavior remains.

Verification: npm run check passes 27 unit/client tests, lint (one existing FolderFloat unused-disable warning), prerender/static checks and unchanged budgets (JS 133785 B gzip; CSS 15976 B). Final npm run test:e2e -- --workers=2 passes all 55 tests (2.1m). Initial eight-worker run had timing failures across unrelated features; two-worker rerun isolated an animation-in-progress geometry assertion, corrected to await the sidebar entrance before measuring. No assertion or timeout weakened. Desktop sidebar screenshot inspected. Original palette/media/content retained. Deployment pending commit/push and Pages confirmation below.

# Restore hero artwork; foreground cube — November 14, 2026

Owner requested restoration of removed content and the cube as foremost layer. Restored the exact original IdentityGraphic function (44 gradient ellipses, circle, axes and markers) from HEAD in `Home.jsx` alongside HeroGlass. HeroGlass now has z-index 2/opacity 1 above hero text/art, with pointer-events none so wordmark/links remain usable. Removed its duplicate fallback background image. The FluidGlass shader clears pixels outside the glass except for its shadow/light contribution, preserving the original content beneath.

Updated `HeroGlass.jsx`/CSS, `Home.jsx`, `FluidGlass.jsx` and focused hero checks. Removed unreachable single-cube morph bookkeeping to retain the unchanged budget; cube movement/optics remain. `npm run check` passes 25 unit/client tests and all lint/build/static gates; JS 199974 B gzip, CSS 14584 B gzip. All three focused hero checks pass; screenshot confirms cube visibly over ADON with original artwork behind. First full run caught a paused-folder test sampling its hidden initial pose; its fixed 100ms delay now waits for visible opacity before the unchanged pause-stability assertion. That run was later interrupted (exit 143), not counted as a pass. Final fresh Chromium rerun passes all 43 tests.

No deployment/Antigravity. Existing guide/folder/opening/palette/media and pending shared-like work preserved. All changes remain local/uncommitted. Supabase connection/project still needed for real shared totals. Next: review http://localhost:4173/.

---

# FluidGlass inside the hero circle — November 14, 2026

- Owner requested supplied FluidGlass beside ADON inside the circle, replacing the spinning filament. `Home.jsx` now uses `HeroGlass.jsx`/CSS there; the heading/TechText/layout and all other animations/features are retained. Cube follows/spins/wobbles locally, refracting a palette-controlled original SVG circle/grid. Rest size/position and pointer bounds keep it visible beside the name on mobile.
- Added a specialized cube/image-only `FluidGlass.jsx`/CSS from supplied upstream source. Unused alternate shapes/morphing/video/canvas-text paths omitted to preserve the unchanged JS budget; actual cube optics and interaction remain. No new dependencies. See `docs/fluid-glass-hero.md` and `docs/superpowers/plans/2026-11-14-fluid-glass-hero.md`.
- OpeningTransition only adds a DOM readiness signal; its approved decode/feathered exit behavior is unchanged. The glass lazily mounts after the opening is gone and while its hero is visible. Real first-draw readiness, palette edits, static no-JS/WebGL fallback, global pause/reduced motion, visibility suspension and GPU cleanup are implemented. No project video/media requests from the hero.
- `npm run check` passes 25 unit/client tests, lint/build/static gates and unchanged budgets: JS 199860 B gzip; CSS 14580 B gzip. All three focused hero checks pass, and the final full Chromium suite passes all 43 tests after placement/fallback additions. Desktop/mobile rendered screenshots inspected. Budget-report wording now correctly describes the SVG fallback; no checks or thresholds weakened.
- Prior shared-like work is preserved. Its final full run passed all 40 tests and real PostgreSQL checks passed; a Supabase connection/project is still needed to enable real shared totals. No live setup or publication happened. All current work remains local/uncommitted. Next: review http://localhost:4173/; shared likes follow-up remains in TASKS.

---

# Shared PulseHeart likes — implemented locally, backend connection pending, November 13, 2026

- Owner requested PulseHeart and explicitly chose **shared across visitors**, superseding the initial suggested local-only default. Added palette-aware homepage like widget after FolderFloat/before Footer, original pulse/rolling count, optimistic save with authoritative response/rollback, and motion/accessibility handling. Added `@hugeicons/core-free-icons` plus license. No fabricated starting total or local-only fallback.
- New PulseHeart/SiteLikes JS/CSS, `src/likes/client.js`, `public/site-likes.json`, and `supabase/migrations/202611130001_portfolio_likes.sql`. Database uses anonymous authenticated identity, private rows, public aggregate, idempotent boolean writes and per-identity transaction locks. Client handles persistence, token refresh, blocked storage, timeouts and failures without a full Supabase SDK.
- **Required external step remains:** Supabase was discovered/suggested; latest connector check confirms installed=false and no Supabase tools are available. No account/project connection exists. Public config stays empty and the widget is disabled/no count when unavailable. No live Supabase resource or website was deployed. Next: owner installs/connects Supabase and selects a project; inspect settings/tables, apply migration, enable anonymous sign-in, populate only public config, then verify the actual live service. See `docs/shared-likes.md` and `docs/superpowers/plans/2026-11-13-shared-likes.md`.
- `npm run check` passes 25 unit/client tests, lint/build/static gates and unchanged budgets (JS 188587 B gzip; CSS 14146 B gzip). Four targeted browser checks pass: unavailable state, two visitors/shared reads/unlike, failed-save rollback/retry, and mobile pulse/palette/motion/axe. Final full Chromium suite passes all 40 tests. API tests use explicit test-only provider fixtures; they are not live backend verification.
- `node scripts/test-likes-db.mjs` PASS against real temporary PostgreSQL 17: public read/private records, auth checks, duplicate likes/unlikes, two identities and concurrent retries. Container was stopped/removed after completion. Added `npm run test:likes-db` for reproduction.
- Kept original folder interactions. Removed remaining unreachable glass compositor helpers and imported only required Matter modules to stay within the unchanged JS budget; no physics or configured solid-folder behavior intentionally changed. `src/test/setup.js` now guards its browser mock so the real-HTTP Node tests can run. A failed-save regression exposed a stale pulse blocking immediate retry; controlled rollback now cancels it.
- All work remains local/uncommitted. Production remains the last verified Field Guides release; no publication assigned.

---

# Guide folders — original effects/readability correction, November 13, 2026

Owner rejected the simplified miniature folders and requested original effects with better readability. Revised to four folders of three guides (split Linux into foundations/systems), larger two-column desktop layout, readable-scale stack on narrow screens, custom paper topic labels, and selected-guide panels with full original titles/descriptions and native Read guide links. Restored entrance, peek, local tilt, spring movement, drag-out/back and click-to-zoom. All-guides native disclosures are now independent rather than forced open with the folder. The same twelve additional guides remain discoverable; published content is unchanged.

Changed `GuideFolders.jsx`/CSS and source integration in `Folder.jsx`: corrected toggle layering/Tab order, derived custom paper button names from visible labels, and made pause terminate entrance motion immediately. Retained shared palette, motion accessibility, no-JS links and source/license attribution. Solid material remains the original configured material; unused WebGL glass compositor is still omitted for the unchanged JS budget. Updated `docs/guide-folders.md`.

Verification: targeted five guide-folder checks pass, including drag-out without selection/navigation, preview zoom, full-title Read guide navigation, native no-JS lists, palette and 320px axe. `npm run check` passes all 18 unit tests, lint/build/static checks and budgets. The first full run passed 35/36; the existing 390px home axe scan sampled the SignalStudy button midway through its 180ms foreground/background transition. `tests/portfolio.spec.js` now waits for native button transitions to finish before both existing full axe scans; neither scan nor its expectations were removed. Final full Chromium rerun passes all 36 tests. Larger desktop/mobile zoomed-paper screenshots inspected. No Antigravity or deployment; all current work is local/uncommitted. Next: review http://localhost:4173/#guide-folders.

---

# Homepage guide Folder interaction — local continuation, November 13, 2026

- Owner requested the supplied React Bits Folder within the homepage Guides section to expose additional guides. Kept all three featured cards and index navigation. Added three thematic folders containing twelve existing notes (Linux topics, Bandit lessons, labs/references); no article content or static URLs changed.
- Added `Folder.jsx`/CSS and `GuideFolders.jsx`/CSS; `Home.jsx` renders the collection. Native folder controls and real preview/list anchors; synchronized details lists retain no-JS navigation. Drag/zoom/tilt/peek disabled for reading/navigation. Shared palette changes apply live.
- Adapted source for deterministic SSR colour parsing, native control semantics, site pause/reduced motion, hidden/offscreen suspension and cleanup. Initial resting-pose write prevents an uninitialized offscreen folder. Unused WebGL glass compositor omitted after initial build exceeded the unchanged 200 KB JS budget; configured solid-folder effect is retained. No new dependencies in this task.
- Four new browser checks cover keyboard article navigation, no-JS browsing, 320px/axe/palette and direct paper links with motion paused. All four targeted checks pass; the final full Chromium run passes all 35 tests after the resting-pose correction and extra direct-link check. `npm run check` passes 18 unit tests, lint/build/static checks and unchanged budgets. Desktop/mobile screenshots inspected. See `docs/guide-folders.md` and bounded plan `docs/superpowers/plans/2026-11-13-guide-folders.md`.
- All previous opening/FolderFloat work remains intact. No Antigravity was used. Work remains local, uncommitted and unpublished. Next: review http://localhost:4173/#guide-folders; no deployment assigned.

---

# FolderFloat footer demo — local continuation, November 13, 2026

- Owner requested supplied React Bits FolderFloat at the end of the page and selected the four original design-feedback demo notes. Added homepage-only section after Contact/before Footer. Selection displays locally; there is no submission or fake collected feedback.
- New `FolderFloat.jsx`/CSS and `FolderDemo.jsx`/CSS; `src/App.jsx` renders the wrapper. Added only `matter-js` to package manifest/lock, with license copy. Source/provenance and adaptations documented in `docs/folder-float.md`; bounded plan in `docs/superpowers/plans/2026-11-13-folder-float.md`.
- Shared palette tokens cover folder/tab, flap, paper, pills, labels, focus, highlights and shadows. Preserved existing published colours, opening reveal, project media and guides.
- Adapted upstream physics for site pause, reduced motion, hidden tabs, intersection visibility and cleanup. Added keyboard focus/close restoration, touch-safe trigger, responsive cloud/hover area, and observer fallback. Corrected a global `.js .enhanced` layout conflict caught by the 320px touch check.
- Initial feature tests failed because folder was absent. `npm run check` now passes all 18 unit tests plus lint/build/routes/assets/fragments and budgets (JS 184198 B gzip; CSS 11447 B gzip). Three folder browser tests pass: keyboard selection, 320px touch/palette/motion/axe and physics dragging without selection. Full final Chromium run passes all 31 tests. Desktop/mobile open-folder screenshots inspected.
- No Antigravity was used. All current changes remain local/uncommitted on main, unpublished. Next: review local footer interaction at http://localhost:4173/; no deployment is assigned.

---

# Opening palette verification — November 13, 2026

Owner requested adjustable opening colours following the common scheme. Existing implementation already meets this: veil uses `--p-canvas`; shader ramp uses saved `accent-dark`, `accent`, `accent-hover`, `text` from the shared palette. No product changes or new tokens needed. Documented the matching Palette studio controls in `docs/palette-studio.md`.

Targeted Chromium check selected Cobalt through the actual Palette studio, reloaded, confirmed the saved accent and shared background, and intercepted actual WebGL ramp uploads to confirm the opening colours changed. Reset through the UI plus reload restored the exact original shader ramp. This is browser-local persistence; changes apply to the next opening. Existing 18-unit/28-Chromium verification remains valid because product code is unchanged. Work remains local/uncommitted/unpublished.

---

# Feathered veil reveal — November 13, 2026

Owner clarified the exit: keep the homepage stationary and reveal it gradually at the rising black veil's edge, from opaque through translucent to clear. Replaced the artwork translation with an animated CSS alpha mask in `OpeningTransition.css`. The mask's 80–160px soft band sweeps upward over 1100ms; both canvas and homepage stay fixed. The band starts below the viewport, preserving the approved opening. Updated the matching cleanup timeout in `OpeningTransition.jsx` and behavior notes in `docs/gradient-ascii-opening.md`. Existing skip, motion preferences, palette, content and fallback behavior retained.

Verification: `npm run check` passes (18 unit tests, lint/build/static checks/budgets); full Chromium suite passes all 28 tests. Targeted browser inspection confirms stationary canvas/page bounds and a halfway alpha mask; mobile mid-reveal screenshot inspected. Changes remain local/uncommitted; no deployment.

---

# Opening exit refinement — November 13, 2026

Owner approved the beginning and requested the ending move upward to reveal the page. Changed only `OpeningTransition.css` behavior: the opaque artwork translates from 0 to -100% over 900ms with smooth acceleration/deceleration, revealing the existing homepage from bottom to top. Decode timing, palette, skip controls, reduced-motion behavior and cleanup remain intact. Updated `docs/gradient-ascii-opening.md`. Verification: `npm run check` passes (18 unit tests, lint/build/static checks/budgets); `npm run test:e2e -- --workers=2` passes all 28 Chromium tests. A targeted mobile browser geometry check confirms the artwork moves upward while staying fully opaque during the reveal. Changes remain local, uncommitted and unpublished.

---

# GradientASCII opening — local continuation, November 13, 2026

- Owner requested the supplied React Bits GradientASCII JavaScript/CSS effect on homepage opening, followed by a clean transition into the existing page. This explicitly supersedes the old no-intro rule only for this bounded effect.
- Added `src/components/GradientASCII.jsx` and CSS, `OpeningTransition.jsx` and CSS; `src/App.jsx` mounts it only on `/`. Existing design, palette values, motion controls, project videos, PDFs, guides and static routing remain intact. No dependencies added.
- Horizon uses the saved site palette; cursor/click effects disabled. First-frame-driven decode and 900ms artwork dissolve, Skip/Escape/Tab dismissal, reduced-motion/saved-pause/fragment bypass, hidden-tab/pause dismissal, WebGL failure/context-loss dismissal and 5.5s fallback. Canvas unmounts after completion. Upstream intro timing adjusted to elapsed time to prevent slow frames stretching it beyond the dissolve.
- `docs/gradient-ascii-opening.md` records source, existing React Bits license location, behavior and limitations. `tests/opening.spec.js` adds four browser checks. Initial tests failed for the absent feature; review corrected the new palette locator, a missing-matchMedia fallback and fading Skip-button contrast without changing existing tests.
- Owner reauthorized Antigravity for clearly scoped, easy, low-risk work and model/settings adjustments. Creative direction, architecture, important decisions and final review remain with the primary agent. AGENTS/START-HERE/TASKS now reflect this; no Antigravity was used on this change.
- Verification: `npm run check` passes (18 unit tests, lint, prerendered routes/assets/fragments and budgets). The final full Chromium rerun passes all 28 tests after the intro-clock adjustment. All four opening-specific Firefox tests pass. One concurrent Chromium rerun was terminated (exit 143); it is not counted as a pass. Desktop/mobile screenshots inspected; slower desktop rendering prompted the intro-clock correction, and a final desktop capture confirms the visible ASCII glow. Safari/physical devices not tested.
- Work is local and uncommitted on `main`; no push/deployment performed. Production remains the verified Field Guides release below. Exact next action: review local opening at http://localhost:4173/; publish only when assigned.

---

# Field Guides release — November 13, 2026

Implementation merged to main and deployed as `175ebc18d14db49ed61882811d8ad010c851fc00`. Pages run [43428270273](https://github.com/Adon-Paul/portfolio-website/actions/runs/43428270273) succeeded. Live verification passed for all 22 routes, guide headings/canonicals, mobile reflow, index-to-article navigation, palette preset/persistence/reset and motion pause across old work routes, with no page errors or unsolicited MP4 requests. Receipt: docs/verification/2026-11-13-field-guides-production.json. Owner approved direct implementation/push, preservation of original notes except rewritten Sakura/Bandit, and prohibits Antigravity until renewed permission.

- Added 16 public content pages plus /guides/, homepage preview and shared navigation. Read docs/field-guides.md for maintenance and docs/content/guides-ledger.md for provenance and review decisions.
- Original palette, site stylesheet, videos, PDFs and four work routes retained. Markdown compilation is build-time only; article chunks load on demand.
- Latest local gates: 18 unit tests, lint/build/route/asset/fragment/budget checks, and all 24 Chromium browser tests pass. All six Firefox guide tests also pass. Fresh code review completed; all flagged content issues corrected.
- Original vault is unchanged. Private dossiers, exploit claims and unreviewed screenshots are not published. Sakura is attributed learning commentary; Bandit credits OverTheWire. Other articles keep original structure with technical corrections and redactions.
- New engineering case studies and real project videos remain future work; guide publication does not depend on them.

---

# Current progress

Updated November 13, 2026. Current branch: `main`. Application release **175ebc1** is deployed and verified; **97b9db5** is the previous baseline. This top summary supersedes historical checkpoints below.

## Current production state
- Live: https://adonpaultomy.tech . Successful Pages run: https://github.com/Adon-Paul/portfolio-website/actions/runs/43428270273 .
- Current palette is charcoal/ivory/orange; all default colours preserved exactly during centralization. Green is historical and rejected.
- Continuous motion, global pause/reduced-motion support, TechText ADON, interactive project studies and Palette studio are implemented. Do not recreate them.
- Latest release checks: lint/build/static budgets and 18 unit tests pass; all 24 Chromium browser tests pass; six guide-specific Firefox tests pass. Earlier Firefox/axe edited-text scan limitation remains documented below; do not claim full cross-browser coverage.
- Nov 13 live check: palette edit/save/download/import/navigation/reset pass, fresh visitor gets original colours, all four project routes return 200, résumé/manuscript hashes match local release, no browser page errors. Receipt: docs/verification/2026-11-13-production-review.json.
- Owner update Nov 13: all résumé facts confirmed; new project recordings/evidence deferred; browsers look good in owner checks (versions unspecified). Curated public study guides are now published; next additions should follow concrete reader feedback or individually reviewed source notes. Historical uncertainty and requests below are superseded by this update.

## Historical implementation checkpoints

### Initial evidence-led revision
- Replaced the beige collage with dark/green typographic identity, original SVG signal sculpture, editorial project layout and coherent case-study styling. Removed shipped portrait/phone artwork and obsolete SignatureInteraction; original portrait remains in assets/originals and Git history.
- LumiSense leads the showcase and has a real static `/work/lumisense/` case study. Interactive architecture paths explain OCR, scenes and objects. This is explicitly an illustration, not a fake live app demo.
- Both original silent videos are playable on home and detail. No MP4 before activation; native controls, walkthroughs, focus/failure download, manual retry, and mutual pause.
- Curated three real certificate scans with native disclosures and accurate classifications. Added sanitized Sunset learning note and current cybersecurity context.
- Owner confirmed: all LumiSense app implementation built by him with AI assistance. Manuscript fully prepared, never submitted. Its public PDF is explicitly an unsubmitted/unpublished final-year manuscript; academic coauthorship remains distinct.
- Reviewed one-page résumé is downloadable in Contact at /documents/adon-paul-tomy-resume.pdf. Editable HTML remains in docs/career. Graduation and uncertain community end dates are not asserted.
- Updated sharing image, favicon, static metadata, sitemap/build checks; all old project routes preserved.

### Initial verification (superseded by current summary)
- `npm run check`: PASS — lint, 9 unit tests, static builds, all route/asset and size assertions.
- `npm run test:e2e`: PASS — 12 Chromium tests. Four viewport widths (320/390/768/1440), axe, no-JS, keyboard, 200% CSS zoom/reflow, reduced motion, blocked storage, real playback/mutual pause, failures, history/404, disclosures and forced colours.
- JavaScript 57,536 B gzip; CSS 5,750 B gzip; font 22,288 B. No added runtime dependencies.
- Single local throttled Chromium run: LCP 964 ms, CLS 0, no MP4 requests. See docs/verification/2026-11-11-v2-lab.json for conditions and pre-final-fix hashes. This is lab evidence, not field performance or a Lighthouse score.
- Lighthouse could not install: npm registry could not resolve tldts-core@^7.4.22. No Lighthouse score claimed. Firefox 159 automated suite now passes too; no physical-device/Safari testing.
- Visually inspected desktop/mobile home screenshots and generated one-page résumé PDF. Screenshot outputs from browser suite: test-results/home-*.png.

## Review decisions
Antigravity completed bounded concept, content and component reviews using supplied context, without changing code. Accepted forced-colour indicator improvement and manual video retry (both failing-to-passing checks). Did not accept claims that the fallback was absent (permanent download exists), duplicate SVG IDs in current layout (one instance per document with distinct case ID), or invalid 404 destination (static output/browser checks pass). Kept conditional failure focus to avoid stealing focus when the visitor moves elsewhere. Cross-browser focus remains worth manual checking.

## Delivery checkpoint
Owner subsequently instructed “do what is needed,” authorizing completion of the release under the standing push/deploy instruction. Release checks pass: 9 unit tests, 12 Chromium tests, 12 Firefox tests. Merge to main and publish through the existing workflow. Consult the latest main Actions run and live HTTPS content for deployment status; do not repeat a completed release. Previous live baseline/rollback reference: 66d67ac.

## Next actions
1. Review http://localhost:4173/ after `npm run build` and `node scripts/serve.mjs` (or `npm run dev` for edits).
2. Get a real LumiSense screen recording from the owner; do not invent app footage. Add only after inspecting it and updating walkthrough text.
3. Refine résumé degree/completion wording when the owner supplies it; the conservative public version is already linked.
4. Check Safari and physical Android/iOS when available; Chromium and Firefox automated suites pass. Iterate from concrete visual feedback.
5. On release, merge reviewed branch to main, push, monitor GitHub Pages Actions and verify HTTPS plus all four case routes. Preserve CNAME/domain configuration.

## Reproduce Firefox checks
`PLAYWRIGHT_BROWSERS_PATH=/tmp/portfolio-playwright TEST_BROWSER=firefox npm run test:e2e` (browser installed there for this session). For later sessions install Firefox with Playwright, or omit the custom browser path when using the default cache. CI retains Chromium as its default.

## Release infrastructure correction
The first release run (43049841961) passed application checks but failed before browser tests: Ubuntu mirror DNS errors prevented optional font packages from downloading during `playwright install --with-deps`. Logs confirm runtime libraries were already installed. Workflow now pins ubuntu-24.04 and installs only Playwright headless Chromium without apt; the complete browser test gate remains required before Pages deploy. Inspect the subsequent main run for final status.

## Verified deployment — complete
- GitHub Pages run **43051714860** succeeded: https://github.com/Adon-Paul/portfolio-website/actions/runs/43051714860 . Application commit: `ebc770fd04218b2190f951e469adedfe0334bebf`.
- Live HTTPS browser check passed at https://adonpaultomy.tech : new homepage, all four case-study URLs HTTP 200, selected architecture state, both original videos play and pause each other, zero video requests before activation, no page errors.
- Public résumé and manuscript PDF SHA-256 hashes match the local release assets.
- Release is DONE. Do not redeploy or rebuild the redesign simply because earlier sections describe the release procedure. Remaining work: real LumiSense recording when supplied, optional physical-device/Safari checks, and concrete owner feedback.
- A documentation-only commit records this receipt; application files are unchanged from the successful release.

## Kinetic editorial revision — November 12
Owner requested no green, continuous motion, richer creative content and no cursor effects, then explicitly requested completion and production push. Branch feat/kinetic-editorial replaces theme greens with charcoal/ivory/orange and adds MotionFrame (CSS/SVG motion, persistent pause, reduced-motion, hidden-tab pause). Home now includes LumiSense engineering decisions, expandable implementation notes, and Workbench interactive shared-queue/text-count studies. Studies are labelled portfolio explanations; text stays local. Existing original videos, PDF evidence and routes remain intact.
Antigravity provided a bounded critique; suggestions about arbitrary published badges, lexical-density claims, hotkeys and performance guarantees were not adopted.
Checks: 12 unit tests and 14 Chromium browser tests pass, including new motion controls and studies. Firefox result recorded in the release verification below. JS 59,464 B gzip, CSS 7,341 B gzip. Sharing image and favicon regenerated for orange. Next: follow current main Actions deployment status; after release, iterate only from actual feedback.

Kinetic release verification: 12 unit tests and all 14 Chromium browser tests passed. Firefox passed 13 tests and the edit/count/overflow assertions in the final test, but its process repeatedly crashed inside axe's scan after editing the text study (also with motion paused and a scoped scan). No axe violation was reported. Preserve the full test; do not call the Firefox suite fully green. This is an unresolved Firefox/axe tooling limitation; other Firefox home scans at four widths and playback/motion checks passed. Revisit independently without weakening the Chromium release gate. Desktop/mobile screenshots inspected. User explicitly requested production deployment.

## React Bits TechText — November 12
Owner explicitly requested TechText for ADON and production push. Added upstream JavaScript/CSS variant with license in docs/licenses; localized pointer interactions supersede the earlier no-effects request only within this wordmark. Native cursor shapes only. Integrated MotionFrame pause/reduced-motion/tab visibility through observed data-motion state; semantic HTML ADON fallback remains for SSR, no JS, unavailable canvas and paused animation. No new dependencies. Check/build + 12 unit and 14 Chromium browser tests pass; dedicated browser smoke confirms canvas drawing and pause fallback. Source: https://github.com/DavidHDev/react-bits/tree/main/src/content/TextAnimations/TechText .

## Palette studio — November 12
Owner requested a unified on-site palette editor, preservation of every current colour, and production push. Branch feat/palette-studio adds a small bottom-left Palette button and native dialog. Core/advanced colour controls, HEX/RGBA, opt-in presets, reset, 8 local named combinations, strict JSON import/export/download. Previews are local only. Theme values now come from src/content/palette.js; CSS/SVG/TechText/favicon/theme meta use it. Fixed neutral editor chrome stays readable for recovery. Original raster media/PDFs and sharing PNG unchanged. See docs/palette-studio.md.
Baseline comparison of rendered colour properties on all 5 pages: ZERO differences. TechText edited-accent canvas pixel check passes. 12 unit tests, build/lint/budgets and 18 Chromium browser tests passed before final editor polish. Antigravity edge-case review was attempted but timed out without usable output; no review success claimed. Check latest release results below / main Actions before repeating deployment.
Final palette release checks: 12 unit tests, full lint/build/static route budgets, all 18 Chromium browser tests PASS after final polish. Four palette-specific Firefox tests also PASS. Desktop/mobile dialog layouts inspected. Production default colours are unchanged; edits/presets require explicit visitor action and remain browser-local. Deploy to main is explicitly authorized by the owner.

## Nov 13 — repository and guide follow-up
- Owner confirms all supplied résumé facts; future models must not repeatedly ask to verify them. Existing public PDF remains unchanged in this update. Exact missing facts must not be inferred.
- Owner defers additional demos/evidence and reports browsers look good; retain the specific historical automated-tool limitation without treating it as a reported site defect.
- Reviewed connected repository inventory; added NitroMax homepage source link using existing archive styling, labeled Linux/work in progress and crediting Linuwu Sense. No extra dependencies, palette changes or new project capability claims.
- Reviewed selected Linux/Nmap Obsidian notes read-only. No raw vault, private investigations, credentials or unverified CVE notes published. Feasibility, corrections, candidate articles and recommended static guide architecture are recorded in docs/research/2026-11-13-repositories-and-guides.md. Guide implementation is the next proposed task, not claimed complete.
- Antigravity completed the bounded editorial review. Verification: npm run check passed (12 unit tests, lint, static build, budgets); npm run test:e2e passed all 18 Chromium tests. JS 71,481 B gzip; CSS 8,249 B gzip.

## Nov 13 — detailed Field Guides plan (not implemented)
- Owner explicitly suspended Antigravity/agy delegation until renewed permission. AGENTS.md and current handoff instructions updated; no agy invocation in this planning turn.
- Created docs/superpowers/specs/2026-11-13-field-guides-design.md and docs/superpowers/plans/2026-11-13-field-guides.md: inventory, article briefs, provenance, visual direction, phased release and concrete implementation checks.
- Key finding: Sakura note explicitly adapts Levent Durdalı’s article; its 24 images were extracted from that article PDF. Plan calls for original attributed learning commentary, not republication as owner-originated investigation. Bandit correctly identified as OverTheWire.
- Reviewed selected learning sources; private dossiers and exploit-note bodies remain unread. No guide content or source attachments published. Production remains 97b9db5, successful run 43372944066.
- Documentation-only planning update; no app tests rerun because product code/assets are unchanged. Next: owner review of plan, then direct implementation of release A.

## November 14 — restore original FluidGlass quality (local)

Owner rejected the cube-only specialization and lower DPR cap. Restored the full supplied renderer from the original downloaded source: seven shapes/morph, text/image/video capabilities, original refraction/interior rays/dispersion/reflections/shadows/supersampling and movement. Hero retains restored native artwork and foreground layering, now clear glass with 2× DPR and a richer palette-aware filament refraction texture. Responsive sizing is a wrapper setting; no shader quality cuts. Kept pause/reduced motion, visibility, scoped pointer and fallback integration. Added opt-in transparent overlay behavior without changing default upstream composition.

Added development-only Terser minification (safe two-pass compression) to preserve full source within unchanged budgets. `npm run check` passes all 25 tests plus lint/build/static checks; JS 198556 B gzip, CSS 14584 B. High-DPI regression demonstrated old failure at 1.25× before fix. Desktop screenshot inspected at `/tmp/hero-original-quality.png`. Full browser verification result recorded below when finished. No commit/deployment; shared likes still need connected Supabase project.

Final verification: fresh `npm run test:e2e -- --workers=2` passes all 44 Chromium tests (1.9 min), including full-resolution 2× DPR. Earlier interrupted run lost the preview server and is not counted as a pass. `git diff --check` passes. Changes remain local and uncommitted.


## November 14 — correct subdued optical backdrop (local)

Owner still found the full-source cube subdued. Root cause: HeroGlass explicitly set empty text and supplied only faint transparent SVG lines, unlike the original component example's text/media backdrop. Preserved the full optical renderer and exact supplied cube settings. Added a local backdrop canvas containing live TechText ADON, the original palette-aware SVG artwork, page background and family name at their actual hero positions. It enters the existing media texture path through an optional callback; no optical-strength boosts, shader simplifications, palette changes or content removal. Foreground transparency outside the cube remains. Native artwork and text remain intact.

`npm run check` passes all 25 tests plus lint/build/static checks, JS 198931 B gzip, unchanged budgets. A new browser regression first failed on the old build and checks that live ADON is drawn into the optical source. Desktop screenshot inspected: `/tmp/hero-live-refraction.png`. Browser suite result follows. Preview serves the latest built files at localhost:4173; no deployment.

Final verification: full Chromium suite passes all 45 tests (1.8 min), including live ADON source capture and original 2× rendering. `git diff --check` passes. Build and preview refreshed; all work remains local/uncommitted.


## November 14 — autonomous bounded cube motion (local)

Owner requested random bouncing instead of following the mouse. Added a hero-selected bounce mode: random initial direction, reflected circle/visible-stage collisions, modest speed variation on impacts, inset accounting for cube size, and a small original wobble response. Pointer movement no longer steers this mode. Preserved source optics, foreground, live ADON backdrop, palette and all upstream interaction modes. Pause/reduced motion and offscreen/hidden controls remain. No new dependency.

`npm run check` passes 27 tests plus lint/build/static checks; JS 199466 B gzip (unchanged strict <200000 budget). Geometry tests exercise 600 seconds inside an off-centre clipped circle and pause/reflection. Browser suite result follows. Preview rebuilt; no deployment/commit.

Verification results: both mobile/desktop autonomous-motion browser tests pass, checking circular/visible-stage bounds, movement without cursor steering and pause. Final full run: 46 passed; existing desktop home accessibility test timed out during its second axe evaluation under two-worker load. That exact test passes unchanged in an isolated single-worker rerun (6.8s). Earlier new desktop motion test timed out on repeated geometry calls; measurements were batched with boundary assertions preserved, and it passes (20.2s). No timeout increase, removed accessibility scan or softened product assertion. Lint passes (existing FolderFloat unused-disable warning); `git diff --check` passes. Preview remains localhost:4173. No deployment.


## November 14 — prism alongside cube (local)

Owner supplied original FluidGlass prism and requested it in addition to the cube, in the same confined bounce area, with no simplification. Parameterized HeroGlass and added a separate prism instance. Same full existing renderer, independent random bounce path, shared bounds/backdrop/palette/pause rules. Prism optics match supplied example plus upstream defaults; original cube props are unchanged. No FluidGlass shader or geometry/motion helper changes in this addition, no dependency. Static prism fallback added. Existing browser checks scope the cube explicitly, with shared motion/bounds/pause checks also exercised for prism on mobile/desktop.

`npm run check` passes 27 tests plus lint/build/static gates: JS 199566 B gzip, CSS 14584 B; budgets unchanged. Full browser suite runs with one worker to avoid previously observed software-rendering contention. Result follows. Preview serves the rebuilt prism addition; no commit/deployment.

Final verification: full browser run had 47 passes and two desktop motion timeouts caused by repeated protocol measurements. Batched all six samples into one browser evaluation with identical boundary/movement assertions; reran all four cube/prism × mobile/desktop motion tests: 4 pass (58.2s), including desktop cube 21.1s/prism 24.6s. No timeout increase or effect-quality reduction. Final lint and diff whitespace checks pass (existing FolderFloat unused-disable warning). Inspected `/tmp/hero-cube-and-prism.png`: both complete glass objects in front of preserved artwork. Build and preview updated at localhost:4173; local/uncommitted only.


## November 14 — remove prism; restrict ADON effect to D/O (local)

Owner requested removing the prism and restricting the name effect to D and O. Removed only the prism homepage instance; full FluidGlass source/shape support and the bouncing cube remain intact. TechText now accepts optional `interactiveCharacters`; homepage sets `DO`. Hit testing filters the nearest letter after identifying it, so hovering A/N does not redirect to D/O. Click impulses also skip excluded glyphs, preventing A/N from bouncing when D/O are clicked. Typography and layout unchanged; default TechText behavior remains unchanged when the prop is omitted. Updated prism absence/motion tests; added a runtime canvas test for D/O outlines and fixed A/N drawing positions under hover/click.

`npm run check` passes 27 tests plus lint/build/static checks; JS 199629 B gzip, CSS 14584 B; existing budgets preserved. Full browser suite result follows. Preview rebuilt at localhost:4173. No commit/deployment.

Verification: new runtime ADON test passes (D/O outlined; A/N glyph draw positions unchanged after hover/click); cube motion and prism absence checks pass. Full browser run: 47 passed; pre-existing monolithic guide reflow/accessibility test timed out, including on isolated retry. It bundled all 12 route/viewport axe scans into one 30-second case. Split it by the same four viewports, retaining all three routes, overflow/axe assertions and screenshots per relevant viewport, with unchanged per-test timeout. All four guide cases pass individually (28.8s total). No guide product/content changes, removed assertions or raised timeout. Final lint/diff checks pass (existing FolderFloat unused-disable warning). Build/preview refreshed; no commit/deployment.

## November 14 — detailed header site directory (local)

Owner requested a small button beside the top-left name using React Bits BranchedMenu to list all pages/locations in detail. Added SiteDirectory and BranchedMenu components/CSS, a searchable palette-aware popup with native links and original folding/curved branches/marker/line travel, keyboard/Escape/outside closing, hidden-group inertness and pause/reduced-motion handling. Narrowest headers use a second link row to avoid overlap. Generated catalog and static no-JS `/directory/` index derive from actual prerendered pages and validate all file/fragment targets. Includes guide subsections, project sections, demos, studies, documents and evidence; repeated subsection names get parent context. Added stable IDs to existing markup only. The generated index is in sitemap; Vite dev serves last built data. See docs/site-directory.md.

Necessary size optimization: guide content was both prerendered and duplicated in client JS. Production main.jsx now hydrates from the existing article HTML/TOC; original server/development compilation stays intact. No article content or effect removed, no dependency or budget increase. Tests explicitly verify no duplicate article requests and functioning hydrated controls. Existing guide tests passed in targeted verification. New directory tests caught and fixed native summary semantics and a 320px header overlap; desktop navigation/fallback and mobile palette/accessibility tests pass. Final build/full-suite results follow. No deployment/commit.

Final verification: full Chromium suite 55 passed (2.8m). Subsequent active-route key polish and stronger hydration-console checks: directory + guide suite 13 passed (30.1s). Manual development smoke checks: generated JSON, static index and its CSS return 200; the Vite menu opens. Desktop/mobile screenshots inspected at /tmp/site-directory-desktop.png and /tmp/site-directory-mobile.png. Visual review caught a search-caption CSS specificity conflict; corrected it to a full-width field and polished singular result counts, with a responsive field-width regression assertion. Final build check: all 27 tests plus lint/static/build checks pass; aggregate JS 133805 B gzip, CSS 15934 B. Final UI recheck result follows. Existing FolderFloat unused-disable lint warning remains. No deployment/commit; preview remains localhost:4173.

Final UI recheck after visual polish: all 4 directory tests pass (14.9s), including a full-width mobile search-field assertion and singular count. Final desktop/mobile screenshots inspected at /tmp/site-directory-desktop-final.png and /tmp/site-directory-mobile-final.png. Temporary Vite development smoke server stopped; production preview on 4173 remains running. Final lint/diff checks pass. Catalog has 388 destinations across 25 groups. No remaining implementation task for this request.
