# Current progress

Updated November 11, 2026. Branch `feat/evidence-led-portfolio`, based on live `66d67ac`.

## Implemented and verified
- Replaced the beige collage with dark/green typographic identity, original SVG signal sculpture, editorial project layout and coherent case-study styling. Removed shipped portrait/phone artwork and obsolete SignatureInteraction; original portrait remains in assets/originals and Git history.
- LumiSense leads the showcase and has a real static `/work/lumisense/` case study. Interactive architecture paths explain OCR, scenes and objects. This is explicitly an illustration, not a fake live app demo.
- Both original silent videos are playable on home and detail. No MP4 before activation; native controls, walkthroughs, focus/failure download, manual retry, and mutual pause.
- Curated three real certificate scans with native disclosures and accurate classifications. Added sanitized Sunset learning note and current cybersecurity context.
- Owner confirmed: all LumiSense app implementation built by him with AI assistance. Manuscript fully prepared, never submitted. Its public PDF is explicitly an unsubmitted/unpublished final-year manuscript; academic coauthorship remains distinct.
- Corrected one-page résumé draft and editable HTML in docs/career. It is not the site's public résumé download; owner should review degree/completion wording and role dates first.
- Updated sharing image, favicon, static metadata, sitemap/build checks; all old project routes preserved.

## Verification
- `npm run check`: PASS — lint, 9 unit tests, static builds, all route/asset and size assertions.
- `npm run test:e2e`: PASS — 12 Chromium tests. Four viewport widths (320/390/768/1440), axe, no-JS, keyboard, 200% CSS zoom/reflow, reduced motion, blocked storage, real playback/mutual pause, failures, history/404, disclosures and forced colours.
- JavaScript 57,496 B gzip; CSS 5,750 B gzip; font 22,288 B. No added runtime dependencies.
- Single local throttled Chromium run: LCP 964 ms, CLS 0, no MP4 requests. See docs/verification/2026-11-11-v2-lab.json for conditions and pre-final-fix hashes. This is lab evidence, not field performance or a Lighthouse score.
- Lighthouse could not install: npm registry could not resolve tldts-core@^7.4.22. No Lighthouse score claimed. No physical-device Safari/Firefox testing.
- Visually inspected desktop/mobile home screenshots and generated one-page résumé PDF. Screenshot outputs from browser suite: test-results/home-*.png.

## Review decisions
Antigravity completed bounded concept, content and component reviews using supplied context, without changing code. Accepted forced-colour indicator improvement and manual video retry (both failing-to-passing checks). Did not accept claims that the fallback was absent (permanent download exists), duplicate SVG IDs in current layout (one instance per document with distinct case ID), or invalid 404 destination (static output/browser checks pass). Kept conditional failure focus to avoid stealing focus when the visitor moves elsewhere. Cross-browser focus remains worth manual checking.

## Delivery checkpoint
Latest user instruction: summarize changes/next steps and push current work. Commit and push this feature branch; do not merge main at this checkpoint. Record the resulting commit in Git history and verify remote equality. Live baseline remains 66d67ac until a later merge.

## Next actions
1. Review http://localhost:4173/ after `npm run build` and `node scripts/serve.mjs` (or `npm run dev` for edits).
2. Get a real LumiSense screen recording from the owner; do not invent app footage. Add only after inspecting it and updating walkthrough text.
3. Owner reviews résumé draft (degree/completion wording and community dates), then expose an approved public download.
4. Check Safari/Firefox and physical Android/iOS; iterate from concrete visual feedback.
5. On release, merge reviewed branch to main, push, monitor GitHub Pages Actions and verify HTTPS plus all four case routes. Preserve CNAME/domain configuration.
