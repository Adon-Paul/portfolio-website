const articles = {
  sunset: () => import("./articles/sunset.md"),
  sakura: () => import("./articles/sakura.md"),
  "linux-bootcamp": () => import("./articles/linux-bootcamp.md"),
  bandit: () => import("./articles/bandit.md"),
  "linux-bootcamp-walkthrough": () =>
    import("./articles/linux-bootcamp-walkthrough.md"),
  "linux-filesystem": () => import("./articles/linux-filesystem.md"),
  "linux-permissions": () => import("./articles/linux-permissions.md"),
  "linux-pipelines": () => import("./articles/linux-pipelines.md"),
  "linux-processes": () => import("./articles/linux-processes.md"),
  "linux-networking": () => import("./articles/linux-networking.md"),
  "linux-logs-cron": () => import("./articles/linux-logs-cron.md"),
  "bandit-files": () => import("./articles/bandit-files.md"),
  "bandit-text": () => import("./articles/bandit-text.md"),
  "bandit-formats-and-access": () =>
    import("./articles/bandit-formats-and-access.md"),
  nmap: () => import("./articles/nmap.md"),
  "osint-workflow": () => import("./articles/osint-workflow.md"),
};
export async function loadGuide(slug) {
  const load = Object.hasOwn(articles, slug) ? articles[slug] : null;
  return load ? (await load()).default : undefined;
}
