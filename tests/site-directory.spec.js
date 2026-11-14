import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("header directory preserves branching animation and navigates to a deep guide section", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (
      m.type() === "error" &&
      /hydrat|server HTML|did not match/i.test(m.text())
    )
      errors.push(m.text());
  });
  await page.goto("/#top");
  const trigger = page.getByRole("button", {
    name: "Site directory",
    exact: true,
  });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const search = page.getByRole("searchbox", { name: "Find a page or topic" });
  await expect(search).toBeFocused();
  const menu = page.getByRole("navigation", {
    name: "All pages and locations",
  });
  await expect(menu).toBeVisible();
  await expect(
    menu.getByRole("button", { name: "Homepage", exact: true }),
  ).toHaveAttribute("aria-expanded", "true");
  await expect(menu.locator(".branched-menu__marker")).toHaveAttribute(
    "data-on",
    "",
  );
  expect(
    await menu.locator(".branched-menu__reach").first().getAttribute("d"),
  ).toContain(" A 10 10 ");
  await menu.getByRole("button", { name: "Homepage", exact: true }).click();
  await expect(
    menu.getByRole("button", { name: "Homepage", exact: true }),
  ).toHaveAttribute("aria-expanded", "false");
  expect(
    await menu
      .locator(".branched-menu__body")
      .first()
      .evaluate((el) => el.inert),
  ).toBe(true);
  await search.fill("Alternative privilege escalation");
  const link = menu.getByRole("link", {
    name: "Alternative privilege escalation methods via privileged file operations",
    exact: true,
  });
  await expect(link).toHaveAttribute(
    "href",
    "/guides/sunset/#alternative-privilege-escalation-methods-via-privileged-file-operations",
  );
  await link.click();
  await expect(page).toHaveURL(/\/guides\/sunset\/#alternative-privilege/);
  await expect(
    page.getByRole("heading", {
      name: "Alternative privilege escalation methods via privileged file operations",
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Site directory", exact: true })
    .click();
  await expect(page.getByRole("searchbox")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator(".site-directory")).not.toHaveAttribute("open", "");
  await expect(
    page.getByRole("button", { name: "Site directory", exact: true }),
  ).toBeFocused();
  expect(errors).toEqual([]);
});

test("directory fits mobile, wraps detailed topics and follows palette and paused motion", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 760 });
  await page.goto("/guides/");
  await page
    .getByRole("button", { name: "Site directory", exact: true })
    .click();
  const search = page.getByRole("searchbox");
  await search.fill("Alternative privilege escalation");
  const link = page
    .getByRole("navigation", { name: "All pages and locations" })
    .getByRole("link")
    .first();
  await expect(link).toBeVisible();
  await page.locator(".site-directory__panel").evaluate(async (element) => {
    await Promise.all(
      element.getAnimations().map((animation) => animation.finished),
    );
  });
  const panel = await page
    .getByRole("region", { name: "Site directory", exact: true })
    .boundingBox();
  expect((await search.boundingBox()).width).toBeGreaterThan(panel.width - 50);
  await expect(
    page.getByText("1 destination · 1 group", { exact: true }),
  ).toBeVisible();
  expect(panel.x).toBe(0);
  expect(panel.y).toBe(0);
  expect(panel.height).toBe(760);
  expect(panel.x + panel.width).toBeLessThanOrEqual(320);
  expect(
    await link
      .locator("span")
      .evaluate((el) => el.getBoundingClientRect().height),
  ).toBeLessThanOrEqual(64);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Open palette controls" }).click();
  await page.getByLabel("Preset", { exact: true }).selectOption("cobalt");
  await page.getByRole("button", { name: "Close palette controls" }).click();
  await page.getByRole("button", { name: "Pause motion", exact: true }).click();
  await page
    .getByRole("button", { name: "Site directory", exact: true })
    .click();
  await expect(page.locator(".branched-menu")).toBeVisible();
  expect(
    await page
      .locator(".branched-menu")
      .evaluate((el) =>
        getComputedStyle(el).getPropertyValue("--bm-accent").trim(),
      ),
  ).toBe("#8bb7ff");
  expect(
    await page
      .locator(".branched-menu__reach")
      .first()
      .evaluate((el) => getComputedStyle(el).transitionDuration),
  ).toBe("0s");
});

test("complete directory works without JavaScript and covers every page and guide heading", async ({
  browser,
  request,
}) => {
  const catalog = await (await request.get("/site-directory.json")).json();
  expect(catalog.length).toBeGreaterThan(20);
  expect(catalog.flatMap((g) => g.children).length).toBeGreaterThan(370);
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await page
    .getByRole("button", { name: "Site directory", exact: true })
    .click();
  await page
    .getByRole("link", { name: "Open the complete site index" })
    .click();
  await expect(page).toHaveURL(/\/directory\//);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Complete site directory.",
  );
  for (const group of catalog)
    for (const item of group.children)
      await expect(
        page.locator(`a[href="${item.value}"]`).first(),
      ).toBeAttached();
  await context.close();
});

test("failed directory enhancement retains the full static index link", async ({
  page,
}) => {
  await page.route("**/site-directory.json", (r) => r.abort());
  await page.goto("/guides/");
  await page
    .getByRole("button", { name: "Site directory", exact: true })
    .click();
  await expect(
    page.getByText(
      "The directory could not load. Use the complete index below.",
    ),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Open the complete site index" })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Complete site directory.",
  );
});
