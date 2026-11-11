# Working on this portfolio

- Start with `handoff/START-HERE.md` and `handoff/PROGRESS.md`. The owner rejected the beige personal-workshop design as generic; its old approval is superseded. Current research/proposal: `docs/research/2026-11-11-evidence-and-direction.md`. Preserve `handoff/DO-NOT-BREAK.md`.
- The owner has Antigravity CLI installed and configured as `agy`. Delegate small, bounded tasks to it to conserve the main agent's usage. Keep architecture, integration and final verification with the main agent. Use the configured model. Never bypass tool permissions; if headless tool access is blocked, supply the needed context in a tool-free prompt.
- Keep GitHub Pages and `adonpaultomy.tech`. Project pages are actual prerendered HTML directories, not SPA fallback routes.
- No invented qualifications, outcomes, metrics, clients or product capabilities. Project evidence and limitations are documented in `docs/content-sources.md`.
- Run `npm run check` and `npm run test:e2e` before proposing release. Do not claim field performance based on build sizes or lab tests.
