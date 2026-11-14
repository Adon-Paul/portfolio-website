import assert from "node:assert/strict";
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { JSDOM } from "jsdom";
import { paletteCSS } from "../src/content/palette.js";
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const labels = {
  work: "Selected work",
  "field-notes": "Cybersecurity field notes",
  about: "About & background",
  contact: "Contact, résumé & social links",
  "credentials-title": "Certificates & evidence",
  "workbench-title": "Interactive workbench",
  "hero-title": "ADON — introduction",
  "portfolio-likes": "Like counter",
  "folder-demo-title": "Floating feedback folder",
};
export async function buildSiteDirectory(routes) {
  const ids = new Map();
  const items = [],
    documents = new Map();
  let home;
  for (const route of routes) {
    const file =
      route.path === "/404.html"
        ? "dist/404.html"
        : `dist${route.path}index.html`;
    const html = await readFile(file, "utf8");
    if (route.path === "/") home = html;
    const dom = new JSDOM(html),
      main = dom.window.document.querySelector("main");
    const label =
      route.path === "/"
        ? "Homepage"
        : route.path === "/guides/"
          ? "Field Guides — collection"
          : route.path === "/404.html"
            ? "Not-found page"
            : route.guide?.title ||
              route.title.replace(/ — Adon Paul Tomy$/, "");
    ids.set(
      route.path,
      new Set(
        [...dom.window.document.querySelectorAll("[id]")].map((el) => el.id),
      ),
    );
    const parents = new Map(),
      stack = [];
    for (const heading of main.querySelectorAll("h1,h2,h3,h4,h5,h6")) {
      const level = Number(heading.tagName[1]);
      while (stack.length && stack.at(-1).level >= level) stack.pop();
      parents.set(heading.id, stack.at(-1)?.title);
      stack.push({
        level,
        title: heading.textContent.replace(/\s+/g, " ").trim(),
      });
    }
    const children = [{ value: route.path, label: `Open ${label}` }];
    for (const node of main.querySelectorAll(
      "h1[id],h2[id],h3[id],h4[id],h5[id],h6[id],section[id],article[id],div[id],figure[id]",
    )) {
      const heading = /^H/.test(node.tagName)
        ? node
        : node.querySelector("h1,h2,h3,h4");
      if (
        node !== heading &&
        heading?.id &&
        !labels[node.id] &&
        !node.hasAttribute("aria-label")
      )
        continue;
      const title =
        labels[node.id] ||
        node.getAttribute("aria-label") ||
        heading?.textContent.replace(/\s+/g, " ").trim();
      if (title)
        children.push({ value: route.path + "#" + node.id, label: title });
    }
    const counts = new Map();
    for (const child of children)
      counts.set(child.label, (counts.get(child.label) || 0) + 1);
    for (const child of children) {
      const parent = parents.get(child.value.split("#")[1]);
      if (counts.get(child.label) > 1 && parent)
        child.label = `${parent} › ${child.label}`;
    }
    for (const a of main.querySelectorAll('a[href^="/"]')) {
      const href = a.getAttribute("href");
      if (
        /\.(pdf|txt|webp|png|jpg|mp4)(?:$|#)/i.test(href) &&
        !documents.has(href)
      )
        documents.set(
          href,
          [
            a.closest("figure")?.getAttribute("aria-label") ||
              a.closest(".credential")?.querySelector(".credential-title")
                ?.textContent,
            a.textContent.trim(),
          ]
            .filter(Boolean)
            .join(" — ")
            .replace(/\s+/g, " ")
            .trim() || href.split("/").pop(),
        );
    }
    items.push({ label, children });
    dom.window.close();
  }
  items.push({
    label: "Documents, demos & evidence",
    children: [...documents].map(([value, label]) => ({ value, label })),
  });
  items.push({
    label: "Complete site index",
    children: [
      {
        value: "/directory/",
        label: "All pages and section links in one document",
      },
    ],
  });
  await writeFile("dist/site-directory.json", JSON.stringify(items));
  const styles = [...home.matchAll(/<link[^>]+rel="stylesheet"[^>]*>/g)]
    .map((m) => m[0])
    .join("");
  const body = items
    .map(
      (group) =>
        `<details open><summary>${escape(group.label)}</summary><ul>${group.children.map((item) => `<li><a href="${escape(item.value)}">${escape(item.label)}</a></li>`).join("")}</ul></details>`,
    )
    .join("");
  await mkdir("dist/directory", { recursive: true });
  await writeFile(
    "dist/directory/index.html",
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Complete site directory — Adon Paul Tomy</title><meta name="description" content="Every published page, section, field guide topic and document in Adon Paul Tomy’s portfolio."><link rel="canonical" href="https://adonpaultomy.tech/directory/">${styles}<style>${paletteCSS} .directory-page{max-width:900px;margin:50px auto;padding:0 24px}.directory-page h1{margin:28px 0 12px}.directory-page details{margin:20px 0;border-top:1px solid var(--p-line);padding-top:16px}.directory-page summary{font-size:20px}.directory-page ul{padding-left:24px}.directory-page li{margin:14px 0;line-height:1.5}.directory-page a{text-decoration:underline;text-underline-offset:4px}</style></head><body><main class="directory-page" id="main"><a href="/">← Adon Paul Tomy — home</a><h1>Complete site directory.</h1><p>Every page, section and guide topic. This index works without JavaScript.</p>${body}<p><a href="mailto:adonpaultomy@gmail.com">Contact Adon</a></p></main></body></html>`,
  );
  for (const group of items)
    for (const item of group.children) {
      const url = new URL(item.value, "https://adonpaultomy.tech");
      assert(url.origin === "https://adonpaultomy.tech");
      if (url.hash)
        assert(
          ids.get(url.pathname)?.has(decodeURIComponent(url.hash.slice(1))),
          `Missing directory target ${item.value}`,
        );
      else
        await stat(
          url.pathname.endsWith("/")
            ? `dist${url.pathname}index.html`
            : `dist${url.pathname}`,
        );
    }
  return items;
}

// Development uses the last generated index; rebuild after adding destinations.
export function directoryDevPlugin() {
  return {
    name: "generated-directory-dev-assets",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const path = req.url.split("?")[0];
        if (path === "/directory") {
          res.writeHead(301, { Location: "/directory/" }).end();
          return;
        }
        const file =
          path === "/site-directory.json"
            ? "dist/site-directory.json"
            : path === "/directory/"
              ? "dist/directory/index.html"
              : /^\/assets\/[\w-]+\.css$/.test(path)
                ? `dist${path}`
                : null;
        if (!file) {
          next();
          return;
        }
        try {
          const body = await readFile(file);
          res.setHeader(
            "Content-Type",
            file.endsWith(".json")
              ? "application/json"
              : file.endsWith(".css")
                ? "text/css"
                : "text/html; charset=utf-8",
          );
          res.end(body);
        } catch {
          next();
        }
      });
    },
  };
}
