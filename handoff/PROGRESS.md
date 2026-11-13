# Current progress

Updated November 13, 2026. Current branch: `main`. Application release **7db7853** is deployed. This top summary supersedes historical checkpoints below.

## Current production state
- Live: https://adonpaultomy.tech . Successful Pages run: https://github.com/Adon-Paul/portfolio-website/actions/runs/43262133443 .
- Current palette is charcoal/ivory/orange; all default colours preserved exactly during centralization. Green is historical and rejected.
- Continuous motion, global pause/reduced-motion support, TechText ADON, interactive project studies and Palette studio are implemented. Do not recreate them.
- Latest release checks: lint/build/static budgets and 12 unit tests pass; all 18 Chromium browser tests pass; four palette-specific Firefox tests pass. Earlier Firefox/axe edited-text scan limitation remains documented below; do not claim full cross-browser coverage.
- Nov 13 live check: palette edit/save/download/import/navigation/reset pass, fresh visitor gets original colours, all four project routes return 200, résumé/manuscript hashes match local release, no browser page errors. Receipt: docs/verification/2026-11-13-production-review.json.
- Remaining priorities: real LumiSense recording; owner-confirmed degree/role dates; additional evidence-based case-study outcomes; physical-device/Safari checks; isolate the Firefox/axe tooling crash. No release is pending.

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
