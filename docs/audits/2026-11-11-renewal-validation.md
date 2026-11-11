# Personal workshop — implementation and validation

Implemented on `feat/personal-workshop`, from `566a261`, November 11, 2026. Review version only: not pushed, merged or deployed. Existing GitHub Pages/domain configuration is retained. Run `npm run preview` after building, or open the running static preview at http://127.0.0.1:4173.

## Result

Warm paper, ink, electric blue, expressive typography and the owner's illustrated portrait. The home page has immediate native navigation, three selected projects, community/experience context and contact. Melody has a user-triggered engineering annotation view. Three real static project pages contain evidence, decisions, limitations and next questions; videos load only after activation. Silent recordings have scene-by-scene text walkthroughs.

Removed forced splash, artificial navigation delays, fake settings, global character effects, ambient shaders/physics, custom cursor, automatic video playback and blanket preloading. Replaced about/project duplication and competing global CSS. Preserved original portrait outside public, and preserved the earlier site in Git. Removed unused 3D assets, effect dependencies, scratch files and tracked IDE/nested-worktree debris. Updated README, agent guidance and CI.

## Build comparison

All byte figures are total generated assets, not a claim about the previous first viewport's network transfer. Gzip uses Node's `gzipSync` defaults, as in the new budget gate.

| Metric | Audit baseline | Renewal | Change |
|---|---:|---:|---:|
| All client JS, raw | 3,432,898 B | 166,139 B | −95.2% |
| All client JS, gzip | 1,172,527 B | 53,782 B | −95.4% |
| All CSS, raw | 105,976 B | 23,264 B | −78.0% |
| All CSS, gzip | 23,304 B | 6,059 B | −74.0% |
| Shipped public assets | 21,396,384 B | 5,474,701 B | −74.4% |
| Largest hero image | — | 18,110 B | WebP; 400/640 responsive variants |
| Delivered fonts | Four remote families plus CSS import | 22,288 B | One self-hosted variable font |

The retained silent demo videos account for most remaining public bytes and are not fetched on entry. Public also contains a raster sharing image, favicon, font license, crawler and domain files. No third-party requests are necessary for the reading experience.

## Verification

- `npm run check`: passed. Hooks/accessibility lint, 6 behavior tests, client/SSR builds, prerendering, actual output/link existence and size budgets.
- `npm run test:e2e`: 9 passed in Chromium 158. Desktop/mobile viewports 320, 390, 768 and 1440 CSS pixels; expanded annotation containment; axe scans of open/closed home states and project pages; no automatic video/3D requests; no browser errors in exercised flows.
- Direct static URLs, refresh, missing trailing slash redirect, history/back restoration, actual 404 HTTP response and correct hydration: passed on the static preview server, without Vite's fallback.
- JavaScript-disabled reading/navigation/evidence and demo download: passed. Enhancement-only buttons are hidden until bootstrap.
- Keyboard skip link, engineering toggle, focus transfer into video and to download after failure; unavailable storage; live reduced-motion changes; 200% CSS zoom reflow: passed. CSS zoom is a reflow approximation, not a substitute for testing a user's actual browser zoom configuration.
- Failed image/video requests retain narrative, evidence and contact: passed.
- `npm audit` after compatible updates: zero reported vulnerabilities, including development dependencies. Vite 6.4.6 and Vitest 4.1.12 are locked; no React/framework migration.
- `git diff --check`: passed before commit.

Visual review: [desktop](../preview/desktop.png), [mobile](../preview/mobile.png), [320px engineering view](../preview/engineering-notes.png). The visual review found a small-screen annotation overflow; a failing browser regression was added, the expanded panel was enlarged, and the suite passed. Expanded-state axe testing also caught a skipped heading level; corrected from h4 to h3. Play-button focus loss was reproduced by a failing behavior test and corrected.

## Cold lab sample

Environment: local Linux, Node 26.12.1, headless Chromium 158; CI targets Node 22. Each profile used a fresh browser context, disabled cache, local static HTTP without compression, and a 2.5-second settled observation. [Raw evidence](evidence/2026-11-11-lab.json); reproduce with `node scripts/measure.mjs` while the static preview runs.

| Profile | LCP | CLS | Long tasks | app-requested RAF calls | Canvas elements |
|---|---:|---:|---:|---:|---:|
| 1440px, DPR 1, unthrottled | 68 ms | 0 | 0 | 0 | 0 |
| 390px, DPR 2, touch, 4× CPU, 150ms latency, 1.6Mbps | 868 ms | 0 | 1 (84 ms) | 0 | 0 |

These are single local lab samples, not field Core Web Vitals, an INP measurement, an award/compliance assertion or a deployed-domain speed promise. No real phone, screen reader, Safari or Firefox run was performed. Image-failure behavior has automated coverage. Custom font failure uses system fallback stacks but was not separately exercised; native media decoder behavior on iOS still needs device testing. Production DNS/TLS and GitHub Actions execution must be verified after an authorized release.

## Delegation and decisions

Owner preference is persisted in `AGENTS.md`: use configured `agy` for small tasks, keep integration and verification with the main agent.

Antigravity completed three bounded tasks: factual copy summaries, an edge-case checklist, and a video-component review. The initial read task was denied by its headless tool policy; subsequent tasks received context directly and used no tools. A larger component review timed out and was narrowed. No blanket permission bypass was used. Review suggestions were verified rather than accepted blindly.

- Used the existing clean checkout on a feature branch; cost: no simultaneous independent checkout.
- Combined overlapping redesign/cleanup phases; removed effects needed no separate lifecycle repair. Cost: old theme/customization controls are retired.
- Kept React/Vite and generated static directories; cost: a small prerender script to maintain, in exchange for no router/framework migration.
- Updated compatible dependency versions after concrete audit findings; cost: lockfile/tooling changes, covered by the full suite.
- Applied Antigravity's focus finding with RED→GREEN evidence and marked silent video muted. Its universal caption/track claim was too broad: silent video can have an equivalent text alternative. Added actual scene-by-scene walkthroughs, following [W3C's video-only guidance](https://www.w3.org/WAI/WCAG22/Understanding/audio-only-and-video-only-prerecorded.html). No accessibility compliance claim is made.
- Review was scoped Antigravity feedback plus main-agent integration/visual checks, not a full independent repository audit. Real-device and live-domain verification remain release follow-up, not claimed completed work.

Release remains a separate action. Merge/push to main triggers Pages only after checks. The previous main revision `566a261` remains the rollback reference.
