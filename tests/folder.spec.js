import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("folder demo opens by keyboard, selects a supplied note and closes", async ({
  page,
}) => {
  await page.goto("/#contact");
  const folder = page.getByRole("button", { name: "Design feedback, 4 notes" });
  await folder.scrollIntoViewIfNeeded();
  await folder.focus();
  await page.keyboard.press("Enter");
  await expect(folder).toHaveAttribute("aria-expanded", "true");
  const note = page.getByRole("button", {
    name: "Love the new hero",
    exact: true,
  });
  await note.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".folder-demo-selection")).toHaveText(
    "Selected: Love the new hero",
  );
  await expect(folder).toHaveAttribute("aria-expanded", "false");
  await expect(folder).toBeFocused();
});

test("folder is usable on touch at 320px, follows palette and motion preferences", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 320, height: 800 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto("/#contact");
  const folder = page.getByRole("button", { name: "Design feedback, 4 notes" });
  await folder.tap();
  await expect(folder).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator(".folder-float")).toHaveAttribute("data-live", "");
  await page.getByRole("button", { name: "Pause motion", exact: true }).tap();
  await expect(page.locator(".folder-float")).not.toHaveAttribute(
    "data-live",
    "",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(
    (await new AxeBuilder({ page }).include(".folder-demo").analyze())
      .violations,
  ).toEqual([]);
  await page.getByRole("button", { name: "Open palette controls" }).tap();
  await page.getByLabel("Preset", { exact: true }).selectOption("cobalt");
  await page.getByRole("button", { name: "Close palette controls" }).tap();
  expect(
    await page
      .locator(".folder-float__back")
      .evaluate((el) => getComputedStyle(el).backgroundColor),
  ).toBe("rgb(139, 183, 255)");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await folder.tap();
  await folder.tap();
  await expect(page.locator(".folder-float")).not.toHaveAttribute(
    "data-live",
    "",
  );
  await context.close();
});

test("floating notes can be dragged without selecting them and stop when the folder closes", async ({
  page,
}) => {
  await page.goto("/#contact");
  const trigger = page.getByRole("button", {
    name: "Design feedback, 4 notes",
  });
  await trigger.hover();
  const root = page.locator(".folder-float");
  await expect(root).toHaveAttribute("data-live", "");
  const note = page.getByRole("button", {
    name: "Try a warmer palette",
    exact: true,
  });
  const bounds = await note.boundingBox();
  await page.mouse.move(
    bounds.x + bounds.width / 2,
    bounds.y + bounds.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    bounds.x + bounds.width / 2 + 25,
    bounds.y + bounds.height / 2 - 15,
    { steps: 5 },
  );
  await expect(note).toHaveAttribute("data-drag", "");
  await page.mouse.up();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator(".folder-demo-selection")).toHaveText(
    "Demo only — selections stay on this page.",
  );
  await note.focus();
  await page.keyboard.press("Escape");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(root).not.toHaveAttribute("data-live", "");
});
