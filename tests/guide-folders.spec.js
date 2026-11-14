import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("homepage guide folders open by keyboard and navigate to published articles", async ({
  page,
}) => {
  await page.goto("/#guide-folders");
  const collection = page.getByRole("article", { name: "Linux foundations" });
  const toggle = collection.getByRole("button", {
    name: "Linux foundations guides folder",
  });
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await collection
    .locator(".folder-stage")
    .getByRole("button", {
      name: "Permissions",
      exact: true,
    })
    .click();
  await expect(collection.locator(".guide-folder-selection")).toContainText(
    "Linux permissions & access control",
  );
  await collection
    .getByRole("link", {
      name: "Read guide: Linux permissions & access control",
    })
    .click();
  await expect(page).toHaveURL(/\/guides\/linux-permissions\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Linux permissions & access control",
  );
});

test("guide folders retain readable native lists without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/#guide-folders");
  const collection = page.getByRole("article", { name: "Bandit lessons" });
  await collection.locator("summary").click();
  await expect(collection.locator(".guide-folder-links a")).toHaveCount(3);
  await collection.locator(".guide-folder-links a").first().click();
  await expect(page).toHaveURL(/\/guides\/bandit-files\/$/);
  await context.close();
});

test("guide folders fit 320px and respect motion and palette controls", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#guide-folders");
  const collection = page.getByRole("article", { name: "Labs & references" });
  await collection
    .getByRole("button", { name: "Labs & references guides folder" })
    .click();
  await expect(
    collection.locator(".folder-stage").getByRole("button", {
      name: "Nmap",
      exact: true,
    }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(
    (await new AxeBuilder({ page }).include("#guide-folders").analyze())
      .violations,
  ).toEqual([]);
  await page.getByRole("button", { name: "Open palette controls" }).click();
  await page.getByLabel("Preset", { exact: true }).selectOption("cobalt");
  await page.getByRole("button", { name: "Close palette controls" }).click();
  await expect
    .poll(() =>
      collection
        .locator(".folder-root")
        .evaluate((el) =>
          getComputedStyle(el).getPropertyValue("--folder-base").trim(),
        ),
    )
    .toBe("rgb(139, 183, 255)");
});

test("document previews zoom to a readable guide selection and respect paused motion", async ({
  page,
}) => {
  await page.goto("/#guide-folders");
  await page.getByRole("button", { name: "Pause motion", exact: true }).click();
  const collection = page.getByRole("article", { name: "Bandit lessons" });
  const toggle = collection.getByRole("button", {
    name: "Bandit lessons guides folder",
  });
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  // A newly visible paused folder still needs its first layout/render frame.
  await expect(collection.locator(".folder-root")).toHaveCSS("opacity", "1");
  const front = collection.locator(".folder-front");
  const stopped = await front.evaluate((el) => el.style.transform);
  await page.waitForTimeout(200);
  expect(await front.evaluate((el) => el.style.transform)).toBe(stopped);
  const document = collection
    .locator(".folder-stage")
    .getByRole("button", { name: "Files & search", exact: true });
  await page.keyboard.press("Tab");
  await expect(document).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(collection.locator(".guide-folder-selection")).toContainText(
    "Bandit 0–6: files, paths & search",
  );
  await collection
    .getByRole("link", {
      name: "Read guide: Bandit 0–6: files, paths & search",
    })
    .click();
  await expect(page).toHaveURL(/\/guides\/bandit-files\/$/);
});

test("guide papers retain drag-out and zoom interactions without navigating on drag", async ({
  page,
}) => {
  await page.goto("/#guide-folders");
  const collection = page.getByRole("article", { name: "Linux foundations" });
  const toggle = collection.getByRole("button", {
    name: "Linux foundations guides folder",
  });
  await toggle.focus();
  await page.keyboard.press("Enter");
  const paper = collection
    .locator(".folder-stage")
    .getByRole("button", { name: "Filesystem", exact: true });
  await paper.hover();
  const box = await paper.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(
    box.x + box.width / 2 + 40,
    box.y + box.height / 2 - 35,
    { steps: 8 },
  );
  await expect(collection.locator(".folder-root")).toHaveAttribute(
    "data-dragging",
    "",
  );
  await page.mouse.up();
  await expect(collection.locator(".folder-root")).not.toHaveAttribute(
    "data-dragging",
    "",
  );
  await expect(page).toHaveURL(/\/#guide-folders$/);
  await expect(collection.locator(".guide-folder-selection")).toHaveCount(0);
  await paper.focus();
  await page.keyboard.press("Enter");
  await expect(collection.locator(".guide-folder-selection")).toContainText(
    "Linux filesystem hierarchy",
  );
  await expect(
    collection.getByRole("link", {
      name: "Read guide: Linux filesystem hierarchy",
    }),
  ).toBeVisible();
});
