# Protected contracts

## Delivery: do not change without an explicit reason and verification
- Domain `adonpaultomy.tech`, GitHub Pages hosting, `public/CNAME`, root CNAME, workflow deploy target and `.nvmrc`.
- `src/main.jsx` uses the prerendered `data-route`; `/404.html` must hydrate as a not-found document at arbitrary URLs.
- Actual static project directories, canonical URLs, sitemap and basic content without JavaScript. No SPA-only routing or client-side redirect workaround.
- Preserve `/work/melody/`, `/work/style-transfer-ai/`, `/work/luxecart/` even if the latter leaves the main showcase. Add LumiSense as `/work/lumisense/`.
- `public/videos/melody.mp4` and `public/videos/style-transfer-ai.mp4` are the owner's real recordings. NEVER replace them with fake mockups, stock video, generated footage or placeholder players.
- Videos need visible play controls on home as well as detail; no media download until activation; native pause/seek controls, keyboard focus and persistent fallback download.
- Preserve reduced-motion behavior, keyboard controls, visible focus, no-JS links, small-screen reflow, case studies and source links.
- Do not weaken tests, lint or build budgets to make a failure disappear. Document any real spec change before changing expectations.

## Content and private material
- External source folders are READ ONLY. Never move/delete files in Downloads or Documents.
- Do not bulk copy the Obsidian vault, private OSINT investigations, credentials/flags, internal IPs, screenshots containing secrets, unverified CVE claims, or personal contact details into Git/public assets.
- Use sanitized summaries of authorized training labs. Learning notes are not professional pentest engagements or original vulnerability discoveries.
- LumiSense is a team academic project, with implementation built entirely by Adon with AI assistance (owner clarification). The manuscript has multiple authors; owner confirmed it is fully prepared, not submitted or published. The PDF is presented as a completed final-year manuscript. Never call the manuscript an IEEE publication merely because it uses IEEE formatting.
- Manuscript benchmarks are author-reported on one device; no independently verified/user-study claims. Avoid headline performance numbers until raw evidence is available.
- NASA certificates establish participation, not employment, an award or NASA endorsement. Wireless & 5G is webinar participation, not a professional cybersecurity certification.
- Generic Buildathon qualification graphic has no recipient/project name; don't label it individually verified.
- Owner confirmed on November 13 that all supplied résumé details are real. Treat them as owner-confirmed, not independently audited. Preserve the corrected .tech domain; do not restore the obsolete .wiki URL. Do not infer dates or wording absent from the supplied résumé.
- Remove old portrait/record/receipt artwork from visible design and sharing image. Keep originals recoverable outside public or in Git history.

## Visual quality
- The rejected beige collage design is HISTORY, not the current spec. Do not restore it because an old doc says approved.
- No generic neon hacker terminal, fake telemetry, arbitrary status dots, decorative progress percentages or unsupported benchmark numbers.
- Every arrow/indicator must describe a real action or state. Distinguish external links, expansions, playback and navigation.
- No scroll hijack, custom cursor, or hidden evidence behind hover-only interactions. Owner explicitly requested the React Bits GradientASCII homepage opening on November 13: its temporary WebGL animation loop is allowed; preserve immediate skip, reduced-motion/saved-pause bypass, failure timeout, and resource cleanup. Other continuous motion follows the existing CSS/SVG approach.
- A great screenshot is not completion: check actual playback, selected states, mobile, overflow, keyboard, failed requests and static URLs.

## Current visual direction — November 12
Owner explicitly rejected green and requested continuous motion with NO cursor effects. Charcoal/ivory/orange is the current implemented palette (recommended default; optional preference question had no reply). CSS/SVG hero rotation, signal flow and persistent motion emblem are intentional. Preserve global pause, session persistence, reduced-motion and hidden-tab handling. This supersedes older documents prohibiting continuous decorative motion. Never add cursor followers.

## FluidGlass hero — November 14 owner request
The owner explicitly replaced the spinning hero filament with React Bits FluidGlass inside the circle beside ADON. Its local follow/spin/wobble and bounded WebGL loop are authorized here; preserve the wordmark, palette defaults, global pause/reduced motion, offscreen/hidden suspension, static fallback and no eager project-video requests. Do not extend this into a global cursor follower. The owner-requested FolderFloat physics remains another scoped exception to the general CSS/SVG preference.

Latest November 14 follow-up supersedes replacing/removing the filament: **restore and preserve the full original IdentityGraphic**, with FluidGlass as a separate foremost hero layer. Cube pixels outside the glass must be transparent so the restored content remains visible. Keep pointer events passing through the decorative overlay.

- Nov 14 owner explicitly rejected simplifying FluidGlass. Preserve the full upstream renderer, original optics and 2× DPR cap. Keep restored IdentityGraphic and foreground cube. Use build-time compression rather than removing effects to satisfy budgets.

- Latest Nov 14 motion instruction: hero cube bounces autonomously within its circular/visible hero confines, instead of following the mouse. Keep that behavior, full optics, live backdrop, impact wobble, and pause/reduced-motion support.

- Latest Nov 14 addition: preserve both the cube and prism as separate full-quality glass objects in the same hero confines, each with autonomous bouncing and original optical effects. Do not replace the cube or simplify either renderer.

- Latest Nov 14 supersedes the prism addition: remove the prism instance from the homepage; retain the full-quality bouncing cube. ADON TechText interaction is restricted to D and O only. A and N retain their appearance/spacing but stay static, including when D/O click impulses propagate.
