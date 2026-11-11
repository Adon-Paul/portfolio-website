import { readdir, readFile, stat } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import assert from "node:assert/strict";
const files = await readdir("dist/assets");
let js = 0,
  css = 0;
for (const file of files) {
  const data = await readFile(`dist/assets/${file}`);
  if (file.endsWith(".js")) js += gzipSync(data).length;
  if (file.endsWith(".css")) css += gzipSync(data).length;
}
assert(js < 200_000, `JS budget exceeded: ${js}`);
assert(css < 30_000, `CSS budget exceeded: ${css}`);
for (const path of [
  "",
  "work/melody/",
  "work/style-transfer-ai/",
  "work/luxecart/",
]) {
  const html = await readFile(`dist/${path}index.html`, "utf8");
  assert(html.includes("<h1"), `Missing prerendered heading at /${path}`);
  assert(
    html.includes(`href="https://adonpaultomy.tech/${path}"`),
    `Wrong canonical at /${path}`,
  );
  assert(
    html.includes("mailto:adonpaultomy@gmail.com"),
    `Missing no-JS contact at /${path}`,
  );
  assert(
    !html.includes("<video"),
    `Video loaded before interaction at /${path}`,
  );
  for (const match of html.matchAll(/(?:src|href)="(\/[^"#?]*)"/g)) {
    const asset = match[1];
    if (asset.endsWith("/")) await stat(`dist${asset}index.html`);
    else await stat(`dist${asset}`);
  }
}
const font = (await stat("dist/fonts/space-grotesk-latin.woff2")).size;
assert(font < 100_000, `Font budget exceeded: ${font}`);
const portrait = (await stat("dist/media/adon-640.webp")).size;
assert(portrait < 300_000, `Hero image budget exceeded: ${portrait}`);
console.log(
  `Budgets passed: JS ${js} B gzip; CSS ${css} B gzip; font ${font} B; hero ${portrait} B`,
);
