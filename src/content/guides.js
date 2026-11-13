export const guides = [
  {
    slug: "sunset",
    title: "Sunset: a small permission, a much bigger consequence",
    group: "Labs",
    category: "VulnHub / Linux",
    description:
      "From an exposed FTP backup to a root-capable editor: the original lab account, findings and remediation.",
    related: ["linux-permissions", "nmap"],
    provenance: "Original lab notes · public edition",
    publishedAt: "2026-11-13",
    reviewedAt: "2026-11-13",
  },
  {
    slug: "sakura",
    title: "Sakura: following clues without outrunning the evidence",
    group: "Labs",
    category: "TryHackMe / OSINT",
    description:
      "Metadata, reused usernames and Git history, explained through the staged Sakura investigation.",
    related: ["osint-workflow", "sunset"],
    provenance: "Rewritten learning commentary · source credited",
    publishedAt: "2026-11-13",
    reviewedAt: "2026-11-13",
  },
  {
    slug: "linux-bootcamp",
    title: "Linux Bootcamp",
    group: "Learning paths",
    category: "TryHackMe / Linux",
    description:
      "A complete room walkthrough and six connected references, from the filesystem to scheduled jobs.",
    related: [
      "linux-bootcamp-walkthrough",
      "linux-filesystem",
      "linux-permissions",
    ],
    provenance: "Study path · original notes",
    publishedAt: "2026-11-13",
    reviewedAt: "2026-11-13",
  },
  {
    slug: "bandit",
    title: "Bandit: fifteen transitions, reusable habits",
    group: "Learning paths",
    category: "OverTheWire / Linux",
    description:
      "A connected path through files, text, encodings, keys and local services.",
    related: ["bandit-files", "bandit-text", "bandit-formats-and-access"],
    provenance: "Rewritten from my level notes",
    publishedAt: "2026-11-13",
    reviewedAt: "2026-11-13",
  },
  {
    slug: "linux-bootcamp-walkthrough",
    title: "Linux Bootcamp: the complete walkthrough",
    group: "Linux fundamentals",
    category: "TryHackMe / Room companion",
    description:
      "The original twenty-task field manual, with explanations, command breakdowns and redacted task results.",
    related: ["linux-bootcamp", "linux-permissions", "linux-pipelines"],
    provenance: "Original walkthrough · public edition",
    publishedAt: "2026-11-13",
    reviewedAt: "2026-11-13",
  },
  {
    slug: "linux-filesystem",
    title: "Linux filesystem hierarchy",
    group: "Linux fundamentals",
    category: "Linux / Filesystems",
    description:
      "A map of configuration, logs, temporary storage and the kernel’s virtual filesystems.",
    related: ["linux-permissions", "linux-logs-cron"],
    provenance: "Original study notes · corrected edition",
    publishedAt: "2026-11-13",
    reviewedAt: "2026-11-13",
  },
  {
    slug: "linux-permissions",
    title: "Linux permissions & access control",
    group: "Linux fundamentals",
    category: "Linux / Permissions",
    description:
      "Read, write and execute mean different things for files and directories. Trace the boundary.",
    related: ["sunset", "linux-filesystem", "linux-processes"],
    provenance: "Original study notes · corrected edition",
    publishedAt: "2026-11-13",
    reviewedAt: "2026-11-13",
  },
  {
    slug: "linux-pipelines",
    title: "Linux redirection & pipelines",
    group: "Linux fundamentals",
    category: "Bash / Standard streams",
    description:
      "Follow stdin, stdout and stderr through redirections, pipes and conditional commands.",
    related: ["bandit-text", "linux-logs-cron"],
    provenance: "Original study notes · corrected edition",
    publishedAt: "2026-11-13",
    reviewedAt: "2026-11-13",
  },
  {
    slug: "linux-processes",
    title: "Linux processes & signals",
    group: "Linux fundamentals",
    category: "Linux / Processes",
    description:
      "Inspect what is running, understand signal handling and distinguish a request to stop from a forced termination.",
    related: ["linux-networking", "linux-logs-cron"],
    provenance: "Original study notes · corrected edition",
    publishedAt: "2026-11-13",
    reviewedAt: "2026-11-13",
  },
  {
    slug: "linux-networking",
    title: "Linux networking & file transfers",
    group: "Linux fundamentals",
    category: "Linux / Networking",
    description:
      "Interfaces, routes, listening sockets and scoped ways to move a file.",
    related: ["nmap", "linux-processes"],
    provenance: "Original study notes · corrected edition",
    publishedAt: "2026-11-13",
    reviewedAt: "2026-11-13",
  },
  {
    slug: "linux-logs-cron",
    title: "Linux log auditing & cron",
    group: "Linux fundamentals",
    category: "Linux / Administration",
    description:
      "Read system events, separate observation from inference and understand scheduled commands.",
    related: ["linux-pipelines", "linux-processes"],
    provenance: "Original study notes · corrected edition",
    publishedAt: "2026-11-13",
    reviewedAt: "2026-11-13",
  },
  {
    slug: "bandit-files",
    title: "Bandit 0–6: files, paths & search",
    group: "Bandit lessons",
    category: "OverTheWire / Levels 0→6",
    description:
      "Leading hyphens, spaces, hidden entries and file properties: learn what the shell actually receives.",
    related: ["bandit-text", "linux-filesystem"],
    provenance: "Rewritten from my level notes",
    publishedAt: "2026-11-13",
    reviewedAt: "2026-11-13",
  },
  {
    slug: "bandit-text",
    title: "Bandit 6–12: text, encodings & filters",
    group: "Bandit lessons",
    category: "OverTheWire / Levels 6→12",
    description:
      "Narrow a search, group duplicate lines, inspect strings and distinguish decoding from decryption.",
    related: ["bandit-formats-and-access", "linux-pipelines"],
    provenance: "Rewritten from my level notes",
    publishedAt: "2026-11-13",
    reviewedAt: "2026-11-13",
  },
  {
    slug: "bandit-formats-and-access",
    title: "Bandit 12–15: formats, keys & services",
    group: "Bandit lessons",
    category: "OverTheWire / Levels 12→15",
    description:
      "Inspect each compressed layer, use an SSH identity file and reason about localhost.",
    related: ["bandit", "linux-networking"],
    provenance: "Rewritten from my level notes",
    publishedAt: "2026-11-13",
    reviewedAt: "2026-11-13",
  },
  {
    slug: "nmap",
    title: "Nmap: discovery, ports & interpretation",
    group: "References",
    category: "Networking / Nmap",
    description:
      "Choose the scope, understand the scan and explain what the result can—and cannot—establish.",
    related: ["sunset", "linux-networking"],
    provenance: "Original reference notes · web edition",
    publishedAt: "2026-11-13",
    reviewedAt: "2026-11-13",
  },
  {
    slug: "osint-workflow",
    title: "OSINT tools & evidence workflow",
    group: "References",
    category: "OSINT / Research",
    description:
      "Match tools to questions, corroborate candidate findings and record uncertainty.",
    related: ["sakura", "nmap"],
    provenance: "Original reference notes · web edition",
    publishedAt: "2026-11-13",
    reviewedAt: "2026-11-13",
  },
];
export const guidePath = (guide) => `/guides/${guide.slug}/`;
export const guideAtPath = (path) =>
  guides.find(
    (guide) =>
      guidePath(guide) === path || guidePath(guide).slice(0, -1) === path,
  );
