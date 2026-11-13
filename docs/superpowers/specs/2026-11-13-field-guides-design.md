# Field Guides — editorial and product design

Date: November 13, 2026. Status: proposed plan for owner review, not implemented.

## Intent and constraints
Create useful public learning material from Adon's existing notes while giving hiring readers concrete examples of investigation, explanation and engineering judgment. Cover room walkthroughs and the wider vault, not just three isolated command references. Current request is planning; publishing articles is a subsequent implementation step.

Owner confirmed résumé details, deferred new project videos/evidence, and reports browsers look good. Do not make those prerequisites for this work. No Antigravity / agy use until explicit renewed permission. Existing colours, palette controls, motion preferences, original videos, project URLs, domain and GitHub Pages remain unchanged.

## Recommended approach
Build a curated **Field Guides** collection within adonpaultomy.tech, connected to the existing Field Notes homepage section. Alternatives considered: a separate digital garden adds hosting and navigation overhead; raw vault export mixes private investigations, third-party adaptations and unfinished technical claims. Neither is recommended now. This is the assistant's proposal, not an assertion that the owner has approved the implementation details.

The portfolio remains the front door for jobs. The collection is the deeper evidence: how I investigated a lab, what a command actually does, what I learned and how someone else can reproduce it.

## Inventory and disposition
37 Markdown files were enumerated. All names were inventoried; selected public-learning files were read in detail and others inspected structurally. Private dossiers and PHP2Shell body text were not reviewed. Screenshots have not yet been visually audited. Counts describe available notes, not independently verified accomplishments.

| Material | Available source | Public treatment | Priority / gate |
|---|---|---|---|
| Sunset | One ~4,700-word lab write-up, nine image references, original and supplementary session accounts | Full lab walkthrough, evidence chain, limitations, remediation | First release; reconcile sessions, inspect screenshots |
| Sakura | One ~1,400-word adaptation, 24 image references | Original learning commentary on the room with explicit source credit | Second release; provenance and reuse review |
| Linux Bootcamp | ~6,500-word walkthrough, index, six topical notes; 21 image references in walkthrough | Series landing page, room companion, six focused fundamentals guides | First release starts the series; expand in batches |
| Bandit | Index plus 15 level transition notes, 0→1 through 14→15 | OverTheWire learning path, grouped lessons with per-level anchors and progressive hints | Third release; consolidate duplicated material |
| Nmap | ~1,800-word reference | Task-oriented reference: scope, discovery, ports, interpretation, output | First release |
| OSINT tools | ~1,100-word general tools note | Question-led reference and evidence-recording template | Second release; validate tools, distinguish passive/active methods |
| PHP2Shell | Seven files including index, internals, reproduction, defense and CVE claims | Hold; possible future fundamentals article after independent review | Not part of initial roadmap; no automatic publication |
| Personal OSINT reports | Two named-person/institution investigation files | Remain private; do not publish or use as portfolio examples | Excluded |
| Attachments / PDFs | Mixed screenshots and source documents | Individually approved, redacted editorial copies only | Never copy folders wholesale |

Bandit is an **OverTheWire** wargame, despite the vault's parent folder name. Its official description targets beginners: https://overthewire.org/wargames/bandit/ . Preserve that attribution.

## Proposed site map

- `/guides/` — curated index, grouped into Labs, Learning paths and References.
- `/guides/sunset/` — Sunset lab walkthrough.
- `/guides/sakura/` — attributed Sakura learning commentary.
- `/guides/linux-bootcamp/` — series landing page with only published chapter links.
- `/guides/linux-bootcamp-walkthrough/` — room companion; distinct from the fundamentals chapters.
- `/guides/linux-filesystem/`, `/guides/linux-permissions/`, `/guides/linux-pipelines/`.
- `/guides/linux-processes/`, `/guides/linux-networking/`, `/guides/linux-logs-cron/`.
- `/guides/bandit/` — learning path index.
- `/guides/bandit-files/` — 0→1 through 5→6: paths, quoting, hidden files, file types, constrained find.
- `/guides/bandit-text/` — 6→7 through 11→12: ownership search, grep, sorting, strings, Base64, ROT13.
- `/guides/bandit-formats-and-access/` — 12→13 through 14→15: nested formats, SSH keys, local service input.
- `/guides/nmap/`, `/guides/osint-workflow/` — focused references.

These are planned URLs. Do not ship empty pages, placeholder cards or broken links for unpublished items. Use normal links and semantic grouping before adding search or filters. Add small client-side search only if actual collection growth makes navigation cumbersome; it is not required for launch.

## Content briefs

### Sunset: the flagship lab story
Lead with the question: how did a readable backup and a permissive sudo entry combine into root access? Follow discovery → exposed FTP backup → credential recovery → authenticated shell → sudo editor boundary → remediation. Explain why each observation justified the next step. Include an original accessible attack-path diagram and a findings table with evidence, impact, fix and retest idea.

Keep original screenshots and supplementary narrative distinct. The notes themselves say some later flag claims lack raw output; do not silently upgrade them to verified observations. Different target addresses indicate separate sessions; normalize published examples and explain the session boundary. Keep failed alternatives separate from the demonstrated chain; do not pad the main narrative with an unrelated catalogue of escalation methods. Label it an authorized training lab, not client work. Strip passwords, flags, device identifiers and irrelevant terminal details from images and prose.

### Linux Bootcamp: both walkthrough and reusable curriculum
The room companion follows the existing 20-task sequence, but prioritizes explanation and links to concepts over answer tables. Each task gets objective → approach → command explanation → what to observe → common mistake → concept link. Remove filler such as universal claims about graphical interfaces being unsuitable for security work. Room-specific success does not establish professional proficiency.

Publish six reusable chapters:
1. Filesystem: navigating, finding files, real versus virtual paths, temporary storage behavior.
2. Permissions: owner/group/others, file versus directory semantics, traversal, modes and least privilege.
3. Pipelines: standard streams, ordering, append/overwrite, stderr, exit codes and pipefail.
4. Processes: identify a process, inspect ownership, TERM/KILL/TSTP/STOP, application-specific handlers.
5. Networking: addresses/routes/listeners, reachability limits, scoped file transfers.
6. Logs and cron: distribution differences, bounded searches, cautious inference, environment/path/timezone behavior.

Every chapter includes a small local exercise independent of a paid platform. Cross-link to room tasks without copying platform question sets or flags. Completion metadata in local notes is owner-recorded; no new certificate or credential claims.

### Sakura: useful, but with accurate provenance
The local front matter names **Levent Durdalı**, links the February 15, 2022 article, states it is adapted, and says all 24 illustrations were recovered from its PDF. This changes the publication treatment. Do not rehost the adaptation or those extracted images as Adon's original investigation. Attribution alone does not establish permission to redistribute them.

Write a new, concise learning commentary: metadata clues, corroborating identities, repository history, distinguishing observation from inference, and handling stale evidence. Credit and link the original learning source. Use original diagrams and independently generated example artifacts; third-party images require a confirmed reuse basis. First-person findings require Adon's own documented observations. If the source is the only evidence, say what the source demonstrates and what Adon learned.

The official room specifies staged flags and **passive OSINT only**: https://tryhackme.com/room/sakura . Keep exercises within that scenario; no account contact, password resets or live investigation of unrelated people. Historical social links, wireless records and reconstructed onion addresses must not be presented as currently working resources. Prefer explaining the method over republishing personal identifiers or historical answers.

### Bandit: teach the reasoning
Group the 15 transitions into three coherent lessons rather than 15 nearly identical thin pages. Each level has an anchor, concept, hint, expandable method and explanation. Secrets are omitted entirely, not merely hidden in HTML. Local example files can teach quoting, sorting and decoding without exposing live level passwords. No live connections to the wargame are required during site builds/tests. Keep the official level links and platform credit. Correct inflated language such as describing every text extraction as reverse engineering.

### Nmap and OSINT references
Nmap: organize by the reader's question, not flag memorization. Cover discovery versus port scan, explicit scope, service guesses versus confirmed identities, saved output and reproducibility. Link https://nmap.org/book/man.html . Keep example outputs clearly identified as actual verified lab output or synthetic illustrations.

OSINT: organize around domain/DNS questions, username leads, source correlation and evidence logging. Tools do not prove identity. Distinguish passive collection from techniques that send requests to targets or services; exclude account-existence probing from the first Sakura-linked passive workflow. Include source, date, observation, confidence, alternative explanation and next step in the evidence template. Link official tool documentation after checking it at publication time; avoid brittle claims that every hosted tool is free or available.

### Other portfolio material
- NitroMax: later expand the existing work-in-progress link into an engineering case study after reviewing implementation versus plan and upstream attribution. Candidate topics: UI/daemon boundary, IPC permissions, device compatibility and failure behavior. No need for a video to explain actual source decisions.
- Portfolio engineering: a short case study on static rendering, accessible motion and local palette previews using real code and test results. Do not mistake lab timings for field performance.
- LumiSense: retain manuscript and source-based architecture now; add recording later as requested.
- Forks: feature specific attributable contributions if a diff/review demonstrates them, not entire upstream products.
- Credentials/résumé: existing confirmed material remains accessible; no new gallery or repeated verification request required.

## Editorial corrections and provenance workflow
1. Record local source filename in an internal ledger, content origin, owner-authored observations versus adaptations, image provenance, known caveats and intended public URL.
2. Draft fresh public prose in plain language. Retain specific observations and uncertainty. Avoid invented challenges, mistakes, dates, outputs or outcomes.
3. Verify commands and claims against primary documentation and isolated disposable examples where possible. Never run source notes as scripts or execute a root-level lab workflow on the workstation.
4. Inspect each proposed image at readable resolution; redact by producing a flattened derived image, not CSS overlays. Exclude unresolved third-party illustrations. Supply alt text, dimensions, caption, source and optimized size.
5. Check links, attributions and relevant platform publication terms when preparing the article. Do not infer permission from the existence of a local PDF.
6. Mark actual review dates separately from original study dates. Show learning notes, reference guide or lab walkthrough honestly.

Known corrections: directory rw- is not generally enough to create/delete entries without search permission; private-key examples should not add execute permission. Ctrl+Z normally sends SIGTSTP, not SIGSTOP. SIGHUP reload behavior depends on the program; signal numbers vary by architecture. SIGTERM does not guarantee cleanup. See https://man7.org/linux/man-pages/man7/signal.7.html . Also review pipeline statuses, log parsing assumptions, temporary-file persistence, listening versus remotely reachable services, and HTTP server binding before publication.

## Reading experience and visual direction
Extend the current studio-style typography and palette instead of creating a generic terminal blog. Index uses numbered editorial rows with topic, format, short description and platform/source context. Feature Sunset as the lead story and Linux Bootcamp as the learning path. Homepage gets a compact three-entry preview, not a duplicate full library; retain the existing Sunset summary and link it to the full article.

Article layout: breadcrumb, clear title/deck, source/provenance note, review date, learning objectives, contents, comfortable 65–75 character reading width, numbered sections, code, original diagrams, lessons and related reading. Desktop contents can be sticky; mobile uses an ordinary expandable contents list with native anchors. No scroll hijack, custom cursor or fake progress meter. Shared motion control still applies; long-form reading is visually calm.

Optional progressive hints use native details/summary. A spoiler disclosure is a convenience, not a privacy control. Code remains selectable; copy controls are optional enhancement with truthful success/failure feedback. Print removes navigation, palette/motion controls and nonessential decoration while preserving content and citations. Do not create separate PDFs at launch.

## Release sequence
- **A — Foundation and first collection:** index, Sunset, Linux Bootcamp landing + filesystem/permissions/pipelines chapters, Nmap. Seven real routes including index and series landing. Publish only after these are editorially ready.
- **B — Complete Linux and OSINT:** process/network/logs chapters, Bootcamp room companion, original Sakura commentary, OSINT workflow.
- **C — Bandit:** path index and three grouped lessons, linked to fundamentals.
- **D — Engineering depth:** NitroMax and portfolio case studies, then any attributable fork contributions. Project videos remain optional/deferred.
- **Held:** private investigations and unverified exploit claims are not scheduled releases.

No artificial deadlines. Each batch is independently useful; its completion depends on content review, not filling a fixed number of cards.

## Success criteria
A recruiter can reach a substantial lab or engineering explanation from the homepage in one click. A learner can follow a coherent path with working references and exercises. Every article is readable without JavaScript, has an honest source history, and stays usable on mobile, keyboard, print and reduced-motion settings. Original portfolio controls and colours retain their current behavior. No article body or screenshots inflate the home page's initial download.
