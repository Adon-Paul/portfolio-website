import { test, expect } from "@playwright/test";

test("homepage opening completes and releases its canvas without fetching videos", async ({
  page,
}) => {
  const videos = [];
  page.on("request", (request) => {
    if (/\.mp4/.test(request.url())) videos.push(request.url());
  });
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Skip opening" }),
  ).toBeVisible();
  await expect(page.locator(".opening-transition canvas")).toBeVisible();
  await expect(page.locator(".opening-transition")).toHaveCount(0, {
    timeout: 9000,
  });
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(videos).toEqual([]);
});

test("opening can be skipped immediately with the keyboard", async ({
  page,
}) => {
  await page.goto("/");
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
  await page.goto("/");
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
  await page.goto("/");
  await expect(page.locator(".opening-transition")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
