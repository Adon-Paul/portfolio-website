import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { guides } from "../src/content/guides";

test("guides are complete static documents, with valid contents and no hydration errors", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const guide of guides) {
    expect((await page.goto(`/guides/${guide.slug}/`)).status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      guide.title,
    );
    await expect(page.locator(".guide-prose")).not.toBeEmpty();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://adonpaultomy.tech/guides/${guide.slug}/`,
    );
    const broken = await page
      .locator(".guide-contents nav a")
      .evaluateAll((links) =>
        links
          .filter((a) => !document.getElementById(a.hash.slice(1)))
          .map((a) => a.href),
      );
    expect(broken).toEqual([]);
  }
  expect(errors).toEqual([]);
  expect((await page.goto("/guides/unknown/")).status()).toBe(404);
});

test("library and long articles reflow and remain accessible", async ({
  page,
}) => {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      "/guides/",
      "/guides/sunset/",
      "/guides/linux-bootcamp-walkthrough/",
    ]) {
      await page.goto(path);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    }
  }
  await page.screenshot({
    path: "test-results/guide-desktop.png",
    fullPage: false,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/guides/");
  await page.screenshot({
    path: "test-results/guides-mobile.png",
    fullPage: true,
  });
});

test("guides work without JavaScript and do not ship article chunks to the homepage", async ({
  browser,
  page,
}) => {
  const requests = [];
  page.on("request", (r) => requests.push(r.url()));
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: "Browse all field guides" }),
  ).toBeVisible();
  expect(
    requests.some((url) =>
      /\/assets\/(sunset|sakura|bandit|linux-|nmap|osint)/.test(url),
    ),
  ).toBe(false);
  const context = await browser.newContext({ javaScriptEnabled: false });
  const reader = await context.newPage();
  await reader.goto("http://127.0.0.1:4173/guides/");
  await reader
    .getByRole("link", { name: /Sunset: a small permission/ })
    .click();
  await expect(reader.locator(".guide-prose")).toContainText("Remediation");
  await reader.getByRole("link", { name: "Summary", exact: true }).click();
  await expect(reader).toHaveURL(/#summary$/);
  await context.close();
});

test("failed article chunk preserves the complete server-rendered page", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.route("**/assets/sunset-*.js", (route) => route.abort());
  await page.goto("/guides/sunset/");
  await expect(page.locator(".guide-prose")).toContainText("Remediation");
  await expect(
    page.getByRole("link", { name: "All field guides", exact: true }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("guide hints, keyboard reading and print remain useful", async ({
  page,
}) => {
  await page.goto("/guides/bandit-files/");
  const hint = page.locator(".guide-hint");
  await expect(hint).not.toHaveAttribute("open", "");
  await hint.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(hint).toHaveAttribute("open", "");
  await page.locator(".guide-code pre").first().focus();
  await expect(page.locator(".guide-code pre").first()).toBeFocused();
  await page.emulateMedia({ media: "print" });
  await expect(page.locator(".guide-prose")).toBeVisible();
  await expect(page.locator(".guide-contents")).toBeHidden();
  await expect(
    page.getByRole("button", { name: "Open palette controls" }),
  ).toBeHidden();
  await expect(page.locator(".motion-control")).toBeHidden();
});

test("guide theme and motion controls survive navigation to existing work", async ({
  page,
}) => {
  await page.goto("/guides/sakura/");
  await page.getByRole("button", { name: "Open palette controls" }).click();
  await page.getByLabel("Preset", { exact: true }).selectOption("cobalt");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Pause motion", exact: true }).click();
  await expect(page.locator(".guide-prose a").first()).toHaveCSS(
    "color",
    "rgb(139, 183, 255)",
  );
  await page.goto("/work/melody/");
  await expect(page.locator("#top")).toHaveAttribute("data-motion", "paused");
  await page.getByRole("button", { name: "Open palette controls" }).click();
  await expect(page.getByLabel("Accent HEX", { exact: true })).toHaveValue(
    "#8bb7ff",
  );
  await page.getByRole("button", { name: "Reset to original" }).click();
  await expect(page.getByLabel("Accent HEX", { exact: true })).toHaveValue(
    "#ff9a62",
  );
});
