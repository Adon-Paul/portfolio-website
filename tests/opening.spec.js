import { test, expect } from "@playwright/test";

test("homepage opening completes and releases its canvas without fetching videos", async ({
  page,
}) => {
  let release;
  const hold = new Promise((resolve) => {
    release = resolve;
  });
  await page.route("**/FluidGlass-*.js", async (route) => {
    await hold;
    await route.continue();
  });
  const videos = [];
  page.on("request", (request) => {
    if (/\.mp4/.test(request.url())) videos.push(request.url());
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(
    page.getByRole("button", { name: "Skip opening" }),
  ).toBeVisible();
  await expect(page.locator(".opening-transition canvas")).toBeVisible();
  release();
  await expect(page.locator(".opening-transition")).toHaveCount(0, {
    timeout: 12000,
  });
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(videos).toEqual([]);
});

test("opening can be skipped immediately with the keyboard", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(
    page.getByRole("button", { name: "Skip opening" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".opening-transition")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Open palette controls", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
});

test("opening respects reduced motion and saved pause, and leaves deep links direct", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".opening-transition")).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.evaluate(() =>
    sessionStorage.setItem("portfolio-motion", "paused"),
  );
  await page.reload();
  await expect(page.locator(".opening-transition")).toHaveCount(0);
  await page.goto("/guides/");
  await expect(page.locator(".opening-transition")).toHaveCount(0);
});

test("missing WebGL never blocks the homepage", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      return type === "webgl2" ? null : original.call(this, type, ...args);
    };
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".opening-transition")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("loading splash waits for the hero module and then releases", async ({
  page,
}) => {
  let release;
  const hold = new Promise((resolve) => {
    release = resolve;
  });
  await page.route("**/FluidGlass-*.js", async (route) => {
    await hold;
    await route.continue();
  });
  try {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("Preparing the experience…")).toBeVisible();
    await expect(page.locator(".opening-transition")).not.toHaveClass(
      /is-leaving/,
    );
    release();
    await expect(page.locator("html")).toHaveAttribute(
      "data-hero-ready",
      /ready|fallback/,
    );
    await expect(page.locator(".opening-transition")).toHaveCount(0, {
      timeout: 12000,
    });
  } finally {
    release();
  }
});

test("ready content does not cut short splash playback or its graceful exit", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.splashTiming = {};
    const observer = new MutationObserver(() => {
      const node = document.querySelector(".opening-transition");
      const timing = window.splashTiming;
      if (node?.querySelector("canvas") && !timing.started)
        timing.started = performance.now();
      if (node?.classList.contains("is-leaving") && !timing.leaving)
        timing.leaving = performance.now();
      if (!node && timing.leaving && !timing.finished)
        timing.finished = performance.now();
    });
    observer.observe(document, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect
    .poll(() => page.evaluate(() => Boolean(window.splashTiming.finished)), {
      timeout: 12000,
    })
    .toBe(true);
  const timing = await page.evaluate(() => window.splashTiming);
  expect(timing.leaving - timing.started).toBeGreaterThanOrEqual(2600);
  expect(timing.finished - timing.leaving).toBeGreaterThanOrEqual(1000);
});
