# Maintaining Field Guides

The live collection is curated in the repository, not synchronized from Obsidian.

1. Write a reviewed Markdown article under `src/guides/articles/<slug>.md` with h2 sections. Do not include a top-level h1; the page shell provides it.
2. Add public metadata to `src/content/guides.js` and an explicit lazy import to `src/guides/loadGuide.js`. Add related slugs only when the target exists. Dates describe actual publication/edit dates.
3. Link source documentation and record provenance in `docs/content/guides-ledger.md`. Retain author/source distinctions. Review technical examples and any borrowed material before publication.
4. Use ordinary Markdown tables/code/links. `:::hint Title` and `:::flow Caption` blocks terminate with `:::` on its own line. They render native disclosure and semantic figure markup. Raw HTML is escaped. Images and unresolved wiki links intentionally fail compilation until image review/rendering support is explicitly added; do not bypass this with HTML.
5. `npm run check` validates source/tests/build budgets and every static route/link/fragment. `npm run test:e2e` checks old portfolio behavior and new guides. Do not remove old tests or increase budgets to force a release.
6. Push authorized, reviewed changes through the existing Pages workflow, verify successful deployment and actual HTTPS pages, then update the handoff receipt.

The current colours are controlled centrally in `src/content/palette.js`. Use tokens in `src/styles/guides.css`; do not alter published defaults as an incidental guide edit. Article chunks load only for the selected page; do not eagerly import the full library into Home. Failed article enhancement leaves the complete prerendered HTML readable.

The owner suspended Antigravity / agy use. Do not invoke it until explicitly permitted again.
