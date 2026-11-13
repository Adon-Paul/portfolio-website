# Guide implementation ledger

Owner approved implementation and production release, with Sakura/Bandit rewritten and other articles kept close to original. Antigravity remains disabled.

Ruling: preserve reviewed Markdown rather than converting long articles to JSX. A single pinned **development-only** Marked compiler runs in Vite; the browser receives only compiled content for the selected article. Raw HTML is escaped, unsafe link schemes suppressed, unresolved vault syntax and unreviewed images fail compilation. This preserves source structure and avoids runtime parsing dependencies.

Source vault is read-only. Only explicit editorial copies under src/guides/articles are public. Original wording/structure retained for Sunset, Linux Bootcamp and its six topics, Nmap and OSINT reference except documented corrections, redactions, link conversion, diagram conversion and web formatting. Sakura and Bandit are rewritten; source attribution retained. No private investigation or PHP2Shell content imported.

Publication edits: omit raw screenshots pending individual privacy/rights review; remove their embeds/captions and evidence-register image references, retain useful textual observations with clear source context. Source evidence remains in the private vault. No claim that missing evidence was independently verified. Recreate diagrams as accessible textual flows. Original passwords, flags, local addresses and device identifiers are omitted/replaced in lab copies. No changes to originals.

## Implementation and review receipt
- 16 content routes plus /guides/ index: Sunset, Sakura, Bootcamp path/walkthrough/six topics, Bandit path/three lessons, Nmap and OSINT reference. Homepage preview and shared navigation connect them to the existing portfolio.
- Ruling: article loader returns compiled `{html, sections}` rather than a JSX Article component. This follows the approved preservation request and keeps article prose out of the initial bundle. All HTML comes from the controlled build-time renderer; no user-generated HTML or runtime Markdown parsing.
- Ruling: optional copy buttons are omitted; code is selectable and scrollable with keyboard support. Native hints and accessible flow figures are included. Private screenshots are not automatically published; the inspected Sunset root capture contains a flag. No generated image is substituted for real evidence.
- Ruling: later NitroMax/portfolio engineering case studies remain future work; this release ships the complete guides collection (plan batches A–C), not speculative new project claims.
- Fresh code review: no routing, hydration, HTML-safety or theme blocker found; all 16 pre-final built guide pages passed axe at 390px. Two content issues were corrected: loopback download addresses and Bootcamp process descriptions. Reviewer did not edit files or use Antigravity.
- Local isolated examples verified: hyphen filenames, quoting spaces, sort/uniq, Base64 and ROT13 roundtrips, and unprivileged directory read-versus-traversal behavior. No live lab or exploit commands executed.
- Final check: npm run check PASS (18 unit tests, lint, static route/link/fragment checks and budgets); npm run test:e2e PASS (24 Chromium tests). New coverage includes all article direct routes, noJS, failed chunk preservation, 320/390/768/1440 reflow, accessibility on long articles/index, keyboard hints, print and palette/motion navigation into old project pages.
- Bundle: initial JS 75.73 KB gzip; all JS including 16 lazy article chunks 143,551 B gzip; CSS 9,761 B gzip. Existing thresholds unchanged. src/content/palette.js and src/styles/site.css unchanged.
- Static content has unique heading anchors, table column headers, unique scroll-region labels, plain selectable code, related reading, canonical URLs, structured metadata and sitemap entries.

- Firefox 159: all six new guide browser tests pass (27.0s), including long-page axe/reflow, noJS, failed chunk, hints/print and theme/motion across old routes. Initial browser-cache absence was resolved by downloading the test binary; no app change was required. The historical unrelated Firefox/axe text-study limitation is not reclassified.
- Independent local check also verified the corrected loopback HTTP example and stdout/stderr redirection.
