import { readFile, writeFile, mkdir } from "node:fs/promises";
import { render, projects, projectPath } from "../.prerender/entry-server.js";
import { originalPalette, paletteFavicon } from "../src/content/palette.js";
await writeFile("dist/favicon.svg", paletteFavicon(originalPalette) + "\n");
const origin = "https://adonpaultomy.tech";
const template = await readFile("dist/index.html", "utf8");
const escape = (value) =>
  value.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const routes = [
  {
    path: "/",
    title: "Adon Paul Tomy — Developer · Mobile, AI & security",
    description:
      "Mobile apps, applied AI and cybersecurity studies. Explore LumiSense, Melody and Style Transfer AI, with original demos and source code.",
  },
  ...projects.map((p) => ({
    path: projectPath(p),
    title: `${p.title} — Adon Paul Tomy`,
    description: p.summary,
  })),
  {
    path: "/404.html",
    title: "Page not found — Adon Paul Tomy",
    description: "Back to Adon’s projects.",
  },
];
for (const route of routes) {
  const url = origin + route.path;
  const meta = `<meta name="description" content="${escape(route.description)}" />
<link rel="canonical" href="${url}" />
<meta property="og:type" content="website" />
<meta property="og:title" content="${escape(route.title)}" />
<meta property="og:description" content="${escape(route.description)}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${origin}/media/share.png" />
<meta property="og:image:width" content="1200" /><meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Adon Paul Tomy — build, observe, question." />
<meta name="twitter:card" content="summary_large_image" />${route.path === "/404.html" ? '\n<meta name="robots" content="noindex" />' : ""}`;
  const html = template
    .replace(
      /<meta name="theme-color" content="[^"]*" \/>/,
      `<meta name="theme-color" content="${originalPalette.canvas}" />`,
    )
    .replace(/<title>.*?<\/title>/, `<title>${escape(route.title)}</title>`)
    .replace("<!--page-meta-->", meta)
    .replace('<div id="root">', `<div id="root" data-route="${route.path}">`)
    .replace("<!--app-html-->", render(route.path));
  const destination =
    route.path === "/404.html"
      ? "dist/404.html"
      : `dist${route.path}index.html`;
  await mkdir(destination.slice(0, destination.lastIndexOf("/")), {
    recursive: true,
  });
  await writeFile(destination, html);
  console.log(`Rendered ${route.path}`);
}
await writeFile(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes
    .filter((r) => r.path !== "/404.html")
    .map((r) => `<url><loc>${origin}${r.path}</loc></url>`)
    .join("")}</urlset>\n`,
);
