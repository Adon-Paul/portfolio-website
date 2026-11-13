# Repository review and public guides — November 13, 2026

## Scope and outcome
Owner asks to add useful GitHub projects and assess turning Obsidian notes into helpful public guides. Owner confirms résumé facts, defers new demo evidence, and reports satisfactory browser behavior. The current colours, hosting, interactions and original videos remain protected.

## Repository curation
Reviewed the 17 repositories returned by the connected GitHub account (including visibility), then public metadata and selected documentation for candidates.

- **NitroMax:** useful addition linking Linux systems work to the cybersecurity learning direction. Public, non-fork metadata; Avalonia/C# UI and Python daemon files; README credits Linuwu Sense. Added a modest homepage source link labeled work in progress. NITRO_MASTER_PLAN.md is a plan, not proof of implementation, security or performance. Existing DivAcerManagerMax naming indicates upstream lineage; do not claim all code is original or a ground-up implementation without attribution review.
- **Already featured:** LumiSense, Melody, Style Transfer AI, E-Commerce/LuxeCart.
- **Portfolio itself:** already visible to visitors; a future engineering case study could explain static rendering, accessibility and palette architecture, with actual measurements.
- **DyadBuilder, chrome-extension-template, Web-Dev-For-Beginners, ML-For-Beginners, Wand-Enhancer:** forks. Do not present the upstream products as original projects. A specific documented contribution could later earn a contribution entry.
- **Git-intro:** introductory GitHub course content, low additional hiring signal.
- **RoamBrew:** empty in repository metadata; no project evidence to feature.
- **Adon-Paul:** profile README repository, not a separate product.
- **Private repositories:** left private and unfeatured. No visibility changes or public links to inaccessible projects.

Sources: GitHub repository metadata, README and tree endpoints reviewed Nov 13. NitroMax revision: `03a5a860ab45906c6e3b527739eae8eeb37dcd10`.

## Can the notes become guides?
Yes. A curated section within this portfolio is the recommended next addition. The vault contains enough foundational material without needing new app videos. This turn assesses feasibility; it does not publish or bulk export the vault.

### Approaches
1. **Curated static guides in the portfolio (recommended):** same visual identity and domain, searchable by search engines, ordinary URLs, no extra runtime framework. Editorial copies allow correction and attribution without exposing private notes.
2. **Separate digital garden:** useful later if the collection becomes large; more navigation, deployment and style maintenance now.
3. **Raw vault publication:** poor fit because mixed private material, lab answers, unresolved technical claims and Obsidian-only syntax would become public together.

### First three articles
1. **Linux permissions: why a readable file can still be inaccessible.** Explain file versus directory permissions with a small local exercise; make directory traversal the central insight.
2. **Shell pipelines: where output and errors actually go.** File descriptors, append versus overwrite, ordering of redirections and pipeline exit status, with harmless reproducible examples.
3. **Nmap: from a scoped scan to an explainable finding.** Target selection, discovery versus port scanning, interpreting states and saving results. Use an isolated example target; distinguish observation from inferred service identity.

Next candidates: Linux process signals; log triage with synthetic, explicitly labeled logs; an expanded Sunset lab write-up focused on failure causes and remediation. Keep Bandit walkthroughs as concept-focused explanations rather than password/answer dumps.

### Review findings before publication
- Permissions table currently says directory `rw-` permits creating/deleting files. Directory modification generally also requires search/execute permission; correct the table and demonstrate with an unprivileged temporary-directory exercise. ACLs, sticky bits and capabilities require explicit scope if discussed.
- Private-key example should use a non-executable mode (600); do not teach `u=rwx` for a private key.
- Shell stream defaults assume an interactive terminal, not every process. Explain redirection order and the difference between stdout-only pipes and stderr.
- Log paths/service names depend on distribution and configuration. The fixed-field SSH log parser is format-dependent. Failed authentication events do not alone establish an attacker or brute-force incident.
- Nmap material already has useful official references. Check commands against https://nmap.org/book/man.html and linked option sections. Default-script selection is not a universal safety guarantee; specify lab scope and scan intent.
- Convert wiki links, callouts, tables and Mermaid diagrams deliberately; resolve or omit missing attachments. Use accessible static diagrams where practical rather than shipping a diagram runtime for a few figures.
- Preserve attribution to lab platforms and documentation. Do not claim notes demonstrate completed courses, original vulnerability discovery or professional engagements.

### Publication contract
Each guide gets a clear question, prerequisites, environment/version and review date, explanation, reproducible commands, actual verified output (or explicitly illustrative output), common mistakes, a short exercise and primary-source references. Do not invent experimental results. Keep title/description/slug/topic in a small reviewed manifest. Use actual prerendered `/guides/.../` directories, canonical metadata and sitemap entries; add home links near Field Notes. Prefer no new runtime dependencies. Test mobile tables/code overflow, no-JS reading, keyboard navigation, copied commands and direct routes.

Only approved editorial copies enter the repository. Keep original vault read-only. Never auto-sync it. Exclude personal OSINT investigations, credentials/flags, identifiable targets, sensitive screenshots and unverified PHP2Shell CVE claims. No blanket conclusion that unreviewed notes are publication-ready.

## Delegated editorial review
Antigravity completed a tool-free bounded review using supplied topic names. It recommended fundamentals, log triage and scoped reconnaissance, with context/mechanics/walkthrough/gotchas/takeaways. Adopted that article structure, but kept permissions and process signals separate to avoid overloading the first guide. No private vault content was sent to the CLI.
