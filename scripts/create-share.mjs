// Run after building; uses the local static preview and the same type/portrait as the site.
import { chromium } from "@playwright/test";
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
await page.goto("http://127.0.0.1:4173/");
await page.evaluate(() => {
  document.body.innerHTML = `<div style="padding:55px 64px;height:630px;position:relative;overflow:hidden"><div style="font-size:36px;font-weight:700;letter-spacing:-2px">adon<span style="color:#2547eb">.</span></div><div style="font:12px monospace;letter-spacing:2px;margin-top:36px">ADON PAUL TOMY / DEVELOPER</div><h1 style="font-size:87px;line-height:1.04;letter-spacing:-6px;margin-top:24px;font-weight:500">A curious mind.<br>A <em style="font-family:Georgia;font-weight:400">builder’s</em><br>instinct<span style="color:#2547eb">.</span></h1><div style="position:absolute;right:75px;top:160px;width:290px;height:335px;background:#dddcd0;transform:rotate(6deg);border:10px solid #e9e6dd"><img src="/media/adon-640.webp" style="width:100%;height:100%;object-fit:contain;object-position:bottom"></div><div style="position:absolute;bottom:38px;left:64px;font:13px monospace">adonpaultomy.tech</div><div style="position:absolute;right:64px;bottom:35px;color:#2547eb;font-size:45px">↗</div></div>`;
});
await page.evaluate(async () => {
  await document.fonts.ready;
  await Promise.all([...document.images].map((i) => i.decode()));
});
await page.screenshot({ path: "public/media/share.png" });
await browser.close();
