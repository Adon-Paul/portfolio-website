// Build first and run the static preview on port 4173. Reuses the site's original SVG and font.
import { originalPalette } from "../src/content/palette.js";
import { chromium } from "@playwright/test";
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  await page.goto("http://127.0.0.1:4173/");
  await page.evaluate(async (colors) => {
    await document.fonts.ready;
    const graphic = document.querySelector(".identity-graphic").outerHTML;
    document.body.innerHTML = `<main style="position:relative;isolation:isolate;height:630px;overflow:hidden;padding:48px 56px;background:${colors.canvas};color:${colors.text}"><div style="font:12px ui-monospace,monospace;letter-spacing:1.5px;color:${colors.accent}">MOBILE DEVELOPMENT / APPLIED AI / CYBERSECURITY STUDIES</div><div style="position:absolute;inset:85px -160px -250px 340px;z-index:-1">${graphic}</div><h1 style="font-size:230px;line-height:.9;letter-spacing:-19px;margin:65px 0 0 -11px;font-weight:600">ADON</h1><div style="font-size:46px;letter-spacing:3px;margin-top:27px">PAUL TOMY</div><div style="position:absolute;bottom:42px;left:56px;right:56px;display:flex;justify-content:space-between;border-top:1px solid ${colors.line};padding-top:20px;font:13px ui-monospace,monospace"><span>BUILD. OBSERVE. QUESTION.</span><span style="color:${colors.accent}">adonpaultomy.tech ↗</span></div></main>`;
    for (const [key, value] of Object.entries(colors))
      document.documentElement.style.setProperty(`--p-${key}`, value);
    const svg = document.querySelector("svg");
    svg.style.cssText = "width:100%;height:100%;position:static;opacity:.8";
  }, originalPalette);
  await page.screenshot({ path: "public/media/share.png" });
} finally {
  await browser.close();
}
