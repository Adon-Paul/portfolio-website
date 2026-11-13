# Field Guides Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task directly in the active session. The owner has explicitly suspended Antigravity / agy delegation until renewed permission. Do not invoke it. This document is a proposed plan; product implementation has not begun.

**Goal:** Publish a curated, useful collection of lab walkthroughs, Linux learning material and references without changing the portfolio's current design defaults or exposing the private vault.

**Architecture:** Keep React/Vite and GitHub Pages static directories. Maintain lightweight guide metadata separately from article modules, load only the selected article for hydration, and prerender complete article HTML at build time. Initial editorial copies use JSX with a small shared reading component set; Markdown/MDX tooling can be reconsidered if authoring volume warrants it, not added preemptively.

**Tech Stack:** Existing React 18, Vite 6, Node 22 CI, Vitest, Playwright and axe; native HTML/CSS/SVG. No new runtime dependencies.

**Spec:** `docs/superpowers/specs/2026-11-13-field-guides-design.md`

## Global constraints
- No Antigravity / agy use until explicit renewed permission.
- Keep GitHub Pages, `adonpaultomy.tech`, existing project routes and actual prerendered HTML directories.
- All published colour defaults remain unchanged; use `src/content/palette.js` tokens.
- Preserve MotionFrame, TechText, palette persistence/reset, the two original videos, résumé and manuscript links.
- Vault originals are read-only; no automatic vault imports or folder copies.
- No private dossiers, credentials/flags, unverified CVE claims or unlicensed third-party screenshot republication.
- New project recordings are deferred; confirmed résumé facts do not require renewed confirmation.
- Initial guide runtime has no new dependencies, tracking, backend, hosted search or third-party embeds.
- Existing build limits remain JS <200,000 B gzip, CSS <30,000 B gzip and font <100,000 B.
- Planning does not authorize claiming articles are reviewed, implemented or published.

## Review focus
1. A guide module fails to download: preserve the server-rendered readable page and links; do not replace it with a blank client root (Task 3).
2. Draft/private content is accidentally registered: drafts must be absent from public metadata, chunks, HTML and sitemap (Tasks 1–3).
3. A pasted code line, long URL or table is wider than a phone: contained horizontal scrolling, no page overflow (Tasks 4 and 7).
4. Clipboard/storage access fails or JavaScript is disabled: reading, contents, hints and navigation remain usable (Tasks 4 and 7).
5. Nested routes, encoded/unknown paths and source links disagree: exact route matching, canonical metadata, working anchors, real 404 behavior (Tasks 2, 3 and 7).

## File map and interfaces

Create:
- `docs/content/guides-ledger.md`: source/provenance, corrections, image decisions, verification status. No copied secrets.
- `src/content/guides.js`: public metadata and series definitions only; no article bodies or draft records.
- `src/guides/loadGuide.js`: explicit dynamic-import registry for published articles, not a recursive filesystem glob.
- `src/guides/articles/*.jsx`: curated public article bodies; each exports `default function Article()`.
- `src/components/guides/GuideIndex.jsx`: grouped public index.
- `src/components/guides/GuidePage.jsx`: heading, context, contents, article and related reading.
- `src/components/guides/GuideParts.jsx`: CodeBlock, Figure and Hint components; native markup first.
- `src/styles/guides.css`: scoped reading/index/print styles using palette tokens.
- `public/media/guides/<slug>/`: approved optimized assets only.
- `tests/guides.test.jsx`, `tests/guides.spec.js`: metadata/route and reading/browser behavior.

Modify:
- `src/App.jsx`: route GuideIndex or GuidePage within the existing shared shell; add Guides nav link after mobile layout review.
- `src/main.jsx`: resolve selected article before hydrating guide pages, preserve existing `root.dataset.route` precedence.
- `src/entry-server.jsx`: asynchronous `render(path)` loads the selected article; export public guide metadata for prerendering.
- `scripts/prerender.mjs`: await render; generate guide routes, metadata, sitemap and article structured data.
- `scripts/check-build.mjs`: include guides in output checks; separately assess initial bundle versus async article chunks.
- `src/components/Home.jsx`: curated Field Guides preview and full-Sunset link.
- Existing handoff and content-source documents: record actual implementation/release state.

### Shared data contract
`GuideMeta = { slug, title, description, kind, topics, publishedAt, reviewedAt, sections, related, provenance, seriesId?, chapterOrder? }`

- `kind`: `lab`, `lesson`, `reference` or `path`.
- `sections`: `{ id, title }[]`; IDs match article h2 anchors.
- `related`: existing published guide slugs only.
- `provenance`: `{ label, sources: { title, url }[] }`; explicit learning-source distinction for Sakura.
- Dates: actual ISO calendar dates, no speculative publication dates.
- Series: `{ id, title, landingSlug, chapterSlugs }`; chapters must exist and be ordered explicitly.
- Export `guides`, `guideSeries`, `guidePath(guide)` → `/guides/${slug}/`, `guideAtPath(path)` → GuideMeta | undefined.
- `loadGuide(slug)` → Promise<ArticleComponent | undefined>; unknown slugs return undefined, actual import failures reject.
- `App({ path = '/', GuideArticle = null })`; `GuidePage({ guide, Article })`.
- Keep index route `/guides/` distinct from article slugs; allow slashless lookup only for static-server redirect/dev compatibility. Never infer slugs from arbitrary user input or imports.

## Task 1 — Prepare the first release's editorial sources

Files: create ledger and seven-route release manifest in documentation; author article drafts outside `public/` and outside the import registry until ready.

- [ ] Record a ledger row for Sunset, Bootcamp landing, filesystem, permissions, pipelines and Nmap. These six content pages plus `/guides/` form release A.
- [ ] Read each source fully, verify provenance, and record the observed-versus-reported distinctions. Inspect candidate images before including them.
- [ ] Write fresh public drafts following the briefs in the spec; omit flags, passwords, repeated answer tables and unnecessary screenshots.
- [ ] Reproduce harmless filesystem/permissions/pipeline exercises in a disposable directory as an unprivileged user; record exact environment and output. Do not run lab exploitation commands or network scans against live systems as part of authoring validation.
- [ ] Check technical claims with primary documentation. Resolve the known corrections listed in the design; mark unresolved material as unpublished.
- [ ] Review each draft for a clear reader outcome, actual attribution, working source links and plain language. Acceptance: six useful complete bodies, not placeholders; a reader can follow the local exercises.
- [ ] Commit only reviewed editorial material and the ledger. Do not commit source-vault exports or secret-containing intermediate files.

## Task 2 — Define the public registry and route rules

Files: `src/content/guides.js`, `src/guides/loadGuide.js`, `tests/guides.test.jsx`, selected `src/guides/articles/*.jsx`.

Consumes: reviewed content from Task 1. Produces: the shared metadata/load interfaces above.

- [ ] Write tests asserting unique lower-case slugs, unique section IDs per guide, every related/series reference exists, all required metadata is present, and every published slug resolves to an Article function.
- [ ] Add assertions: `guideAtPath('/guides/sunset/').slug === 'sunset'`; `/guides/no-such-guide/`, `/guides/sunset/extra/`, and `/guides/%2e%2e/` resolve undefined; index `/guides/` is not an article.
- [ ] Run `npx vitest run tests/guides.test.jsx` and confirm failures arise from the absent registry, then implement the explicit public registry and imports.
- [ ] Convert reviewed bodies to semantic JSX, using real section IDs, paragraphs, lists, code and tables. Keep prose out of the metadata file. No raw HTML injection or runtime Markdown parser.
- [ ] Run the same tests; confirm passing. Inspect registry/import diff for only the six release-A pages.
- [ ] Commit the registry and reviewed article modules together.

## Task 3 — Prerender routes and hydrate only the selected article

Files: `src/App.jsx`, `src/main.jsx`, `src/entry-server.jsx`, `scripts/prerender.mjs`, `scripts/check-build.mjs`, `tests/guides.spec.js`.

Consumes: metadata and loadGuide. Produces: complete static guide routes and matching client hydration.

- [ ] Add browser checks for `/guides/` and `/guides/sunset/`: status 200, one correct h1, body content visible with JS disabled, canonical URL exact, direct reload and ordinary back navigation work. Add unknown guide 404 and retain the existing unknown-project test.
- [ ] Build and run the focused tests; record the expected missing-route failure before adding routing.
- [ ] Resolve GuideArticle in the SSR `render(path)` and client entry only when guideAtPath matches. Change prerender to await render for every route, including old routes.
- [ ] On a client import failure, retain existing prerendered content, skip hydration of that root, and keep default HTML readable. Do not silently clear the document. Test by blocking the selected article chunk; article text and links must survive without uncaught page errors. Development empty-root behavior may show a simple retry link.
- [ ] Generate all public routes and sitemap entries from metadata; exclude unregistered drafts. Add appropriate Article JSON-LD to lab/lesson/reference pages, and CollectionPage metadata to index/path pages. Author and dates must reflect the actual article, including attributed learning context; no ratings or invented credentials.
- [ ] Extend build link/asset checks to guides and h2 fragment targets. Preserve existing project checks. Inspect output paths/chunks and ensure no private-source names, unpublished draft phrases or credential content entered dist.
- [ ] Check the home network requests: no article chunks or guide images fetched at initial load. Preserve the existing total gzip budget and record initial JS separately. No blanket preloading of all guide modules.
- [ ] Run unit tests, build and focused routing/browser tests, then commit.

## Task 4 — Build the reading layout and reusable article pieces

Files: GuidePage.jsx, GuideParts.jsx, guides.css and related unit/browser tests.

Interfaces: `GuidePage({guide, Article})`; `CodeBlock({code, language, label})`; `Figure({src, alt, caption, width, height})`; `Hint({title, children})`.

- [ ] Add tests for heading hierarchy, contents anchors, native hint disclosure, related links and keyboard focus. Ensure captions and alt text remain meaningful independently.
- [ ] Implement a 65–75ch reading column, visible provenance/date information, desktop contents and mobile native expandable contents. Use existing tokens; add no colour literals to themed content.
- [ ] Render CodeBlock with selectable pre/code and optional copy button. Clipboard success appears only after a resolved write; rejection displays “Could not copy—select the code to copy it.” Disable or omit copy when unsupported; noJS still exposes code.
- [ ] Use native details/summary for hints; do not embed omitted passwords/flags in closed content. Figure uses approved local assets, explicit dimensions and lazy loading below the fold.
- [ ] Test long unbroken code, URLs and wide tables at 320px and 390px; article content should scroll within its own container without widening the page. Make scrollable regions keyboard reachable where necessary.
- [ ] Add print rules that retain article, citations and meaningful figures while hiding site controls. Verify reduced motion and paused mode produce no distracting article animation.
- [ ] Run component tests and focused mobile/keyboard/axe checks; inspect desktop/mobile screenshots and a print preview. Commit.

## Task 5 — Integrate index, learning path and homepage discovery

Files: GuideIndex.jsx, GuidePage.jsx as needed, Home.jsx, App.jsx, guides.css, tests/guides.spec.js.

Consumes: guides and guideSeries. Produces: noJS navigation through all published content.

- [ ] Test that index links to all six initial content pages, Bootcamp lists only its three published chapters, and related links do not expose future chapters.
- [ ] Build grouped editorial rows for Labs, Learning paths and References, with descriptions and platform/source context. Do not add empty category placeholders or fake completion counters.
- [ ] Add a compact homepage preview for Sunset, Linux Bootcamp and Nmap. Preserve the existing Sunset summary, linking to its full guide. Keep projects visually primary.
- [ ] Add Guides to shared navigation and verify 320px/zoom layout; no new mobile-menu dependency.
- [ ] Test home→guide→related chapter→index paths with ordinary links and JS disabled. Confirm résumé/contact remain reachable from guides.
- [ ] Run focused tests, inspect homepage and guide screenshots, then commit.

## Task 6 — Expand in editorial batches

Files: reviewed article modules, metadata/registry, approved assets, ledger and sources. No new UI framework.

- [ ] Release B: prepare processes/networking/logs, Bootcamp room companion, Sakura original commentary and OSINT workflow using the spec briefs. Correct signal behavior with primary docs. Sakura images from the source PDF remain excluded unless reuse permission is established; original diagrams are preferred.
- [ ] Release C: prepare Bandit path and three grouped lessons with 15 anchored transitions, native hints, official links and no level passwords. Keep OverTheWire attribution even though the source directory says TryHackMe.
- [ ] For each batch: review sources/images, verify reproducible examples, add registry entries only when complete, run existing guide validation and browser checks, and update the ledger.
- [ ] Release D is separate engineering editorial work: source-reviewed NitroMax and portfolio case studies. Distinguish implemented behavior from plans and upstream code. Never claim new demos were created.
- [ ] Keep PHP2Shell and private dossiers out of all batches. A future generic PHP internals article requires its own source review; the current plan does not validate CVEs.

## Task 7 — Release verification and production check

Files: tests/guides.spec.js, scripts/check-build.mjs, handoff docs; existing workflow retained.

- [ ] Run `npm run check` and `npm run test:e2e`; all old tests must still pass. Add parameterized guide checks at 320/390/768/1440px with axe, no automatic media, and no page-level overflow.
- [ ] Verify all published guide paths 200, unknown paths 404, noJS full text, contents fragment navigation, clipboard denial, blocked storage, module-download failure and print output. A failure is not permission to weaken checks.
- [ ] Confirm palette edits affect guide theme, original reset remains exact, and motion preferences persist when moving between guides and work pages. Check both existing video flows.
- [ ] Review build artifacts for source prose/asset leakage. Record total and initial JS, CSS and article image sizes; reject unexpected home payload growth. Existing budgets are ceilings, not performance-score claims.
- [ ] Perform a complete content/diff review before deployment. Record precisely which pages are complete and which remain planned. Browser feedback is currently positive; do not claim unperformed physical-device testing.
- [ ] Under existing push/deploy authorization, push the tested release, monitor Pages success, then verify HTTPS responses, article content, canonical URLs, images and existing work links in production.
- [ ] Update handoff with commit, workflow URL, verification results and the next batch. If a rollback is necessary, revert only the guide release commit(s) and run the normal deployment; no force-push or history reset.

## Self-review and definition of done
- Inventory includes Sunset, Sakura, Bootcamp walkthrough + six topics, Bandit, Nmap, general OSINT, held research and excluded private reports.
- Source/adaptation distinctions are editorial gates, not assertions that the user's résumé is untrue.
- Route/load names match across tasks, SSR and hydration; content bodies are isolated from home downloads.
- All five review-focus failures have explicit acceptance checks.
- Release A is a useful complete slice. B–D do not create placeholders in A.
- No production implementation or guide publication occurs merely by saving this plan.
