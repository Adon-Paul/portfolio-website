# Current progress

Updated November 11, 2026. Branch `feat/evidence-led-portfolio`, based on live `66d67ac`.

## Implemented and verified
- Replaced the beige collage with dark/green typographic identity, original SVG signal sculpture, editorial project layout and coherent case-study styling. Removed shipped portrait/phone artwork and obsolete SignatureInteraction; original portrait remains in assets/originals and Git history.
- LumiSense leads the showcase and has a real static `/work/lumisense/` case study. Interactive architecture paths explain OCR, scenes and objects. This is explicitly an illustration, not a fake live app demo.
- Both original silent videos are playable on home and detail. No MP4 before activation; native controls, walkthroughs, focus/failure download, manual retry, and mutual pause.
- Curated three real certificate scans with native disclosures and accurate classifications. Added sanitized Sunset learning note and current cybersecurity context.
- Owner confirmed: all LumiSense app implementation built by him with AI assistance. Manuscript fully prepared, never submitted. Its public PDF is explicitly an unsubmitted/unpublished final-year manuscript; academic coauthorship remains distinct.
- Reviewed one-page résumé is downloadable in Contact at /documents/adon-paul-tomy-resume.pdf. Editable HTML remains in docs/career. Graduation and uncertain community end dates are not asserted.
- Updated sharing image, favicon, static metadata, sitemap/build checks; all old project routes preserved.

## Verification
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
