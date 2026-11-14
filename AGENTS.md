# Working on this portfolio

- Start with `handoff/START-HERE.md` and `handoff/PROGRESS.md`. The owner rejected the beige personal-workshop design as generic; its old approval is superseded. Current research/proposal: `docs/research/2026-11-11-evidence-and-direction.md`. Preserve `handoff/DO-NOT-BREAK.md`.
- Owner instruction (November 13, latest): Antigravity / `agy` may handle clearly scoped, easy, low-risk tasks; model/settings changes are allowed. Keep creative direction, architecture, important decisions and final review with the primary agent. This supersedes the historical blanket prohibition.
- Keep GitHub Pages and `adonpaultomy.tech`. Project pages are actual prerendered HTML directories, not SPA fallback routes.
- No invented qualifications, outcomes, metrics, clients or product capabilities. Project evidence and limitations are documented in `docs/content-sources.md`.
- Run `npm run check` and `npm run test:e2e` before proposing release. Do not claim field performance based on build sizes or lab tests.

- Latest visual request (Nov 12): no green, continuous CSS/SVG motion, richer interactive content, no cursor effects. MotionFrame and Workbench implement this; preserve pause/reduced-motion and local-only text processing.
- Palette source of truth: src/content/palette.js. Preserve exact original values unless owner explicitly changes the published theme. Use CSS tokens for new themed UI. Palette studio edits are browser-local; fixed editor chrome is intentionally independent for recovery. See docs/palette-studio.md.
