import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
const browser = await chromium.launch();
const reports = [];
for (const mobile of [false, true]) {
  const context = await browser.newContext({
    viewport: { width: mobile ? 390 : 1440, height: mobile ? 844 : 1000 },
    deviceScaleFactor: mobile ? 2 : 1,
    isMobile: mobile,
    hasTouch: mobile,
  });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  if (mobile) {
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 150,
      downloadThroughput: 1_600_000 / 8,
      uploadThroughput: 750_000 / 8,
    });
  }
  await page.addInitScript(() => {
    window.lab = { lcp: 0, cls: 0, longTasks: [], rafCalls: 0 };
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) window.lab.lcp = e.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => {
      for (const e of list.getEntries())
        if (!e.hadRecentInput) window.lab.cls += e.value;
    }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) window.lab.longTasks.push(e.duration);
    }).observe({ type: "longtask", buffered: true });
    const raf = window.requestAnimationFrame;
    window.requestAnimationFrame = function (cb) {
      window.lab.rafCalls++;
      return raf.call(window, cb);
    };
  });
  await page.goto("http://127.0.0.1:4173/");
  await page.waitForTimeout(2500);
  const data = await page.evaluate(() => ({
    ...window.lab,
    dom: document.querySelectorAll("*").length,
    canvases: document.querySelectorAll("canvas").length,
    resources: performance.getEntriesByType("resource").map((r) => ({
      name: new URL(r.name).pathname,
      transfer: r.transferSize,
      duration: r.duration,
    })),
    paint: performance
      .getEntriesByType("paint")
      .map((p) => ({ name: p.name, startTime: p.startTime })),
  }));
  reports.push({
    profile: mobile
      ? "390px, DPR2, touch, 4x CPU, 150ms RTT, 1.6Mbps"
      : "1440px, DPR1, unthrottled",
    cache: "disabled; fresh browser context",
    server: "local static HTTP, uncompressed assets",
    ...data,
  });
  await context.close();
}
await browser.close();
await mkdir("docs/audits/evidence", { recursive: true });
await writeFile(
  "docs/audits/evidence/2026-11-11-lab.json",
  JSON.stringify(reports, null, 2) + "\n",
);
for (const r of reports)
  console.log(
    r.profile,
    JSON.stringify({
      lcp: r.lcp,
      cls: r.cls,
      longTasks: r.longTasks,
      rafCalls: r.rafCalls,
      dom: r.dom,
      canvases: r.canvases,
      transfer: r.resources.reduce((s, r) => s + r.transfer, 0),
    }),
  );
