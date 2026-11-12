import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("palette edits stay local, survive navigation and reset exactly", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open palette controls" }).click();
  const dialog = page.getByRole("dialog", { name: "Palette studio" });
  await expect(dialog).toBeVisible();
  const hex = page.getByLabel("Accent HEX", { exact: true });
  await expect(hex).toHaveValue("#ff9a62");
  await hex.fill("not-hex");
  await hex.press("Tab");
  await expect(hex).toHaveAttribute("aria-invalid", "true");
  await page.getByRole("button", { name: "Reset to original" }).click();
  await expect(hex).toHaveValue("#ff9a62");
  await expect(hex).toHaveAttribute("aria-invalid", "false");
  await hex.fill("#3366cc");
  await hex.press("Tab");
  await expect
    .poll(() =>
      page.evaluate(() =>
        getComputedStyle(document.documentElement)
          .getPropertyValue("--p-accent")
          .trim(),
      ),
    )
    .toBe("#3366cc");
  await page.getByRole("button", { name: "Close palette controls" }).click();
  await page.getByRole("link", { name: "Explore Melody", exact: true }).click();
  await page.reload();
  await expect
    .poll(() =>
      page.evaluate(() =>
        getComputedStyle(document.documentElement)
          .getPropertyValue("--p-accent")
          .trim(),
      ),
    )
    .toBe("#3366cc");
  await page.getByRole("button", { name: "Open palette controls" }).click();
  await page.getByRole("button", { name: "Reset to original" }).click();
  await expect(page.getByLabel("Accent HEX", { exact: true })).toHaveValue(
    "#ff9a62",
  );
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Open palette controls" }),
  ).toBeFocused();
});
test("palette panel remains usable on mobile with saved combinations and validated import", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open palette controls" }).click();
  await page.getByLabel("Preset", { exact: true }).selectOption("cobalt");
  await page.getByLabel("Combination name").fill("My blue");
  await page.getByRole("button", { name: "Save combination" }).click();
  await page.getByText("Import / export", { exact: true }).click();
  await page.getByRole("button", { name: "Export JSON", exact: true }).click();
  const exported = await page.getByLabel("Palette JSON").inputValue();
  await page.getByRole("button", { name: "Reset to original" }).click();
  await page
    .getByLabel("Saved combination", { exact: true })
    .selectOption("My blue");
  await expect(page.getByLabel("Accent HEX", { exact: true })).toHaveValue(
    "#8bb7ff",
  );
  await page
    .getByLabel("Palette JSON")
    .fill('{"version":1,"colors":{"accent":"url(bad)"}}');
  await page.getByRole("button", { name: "Import JSON", exact: true }).click();
  await expect(
    page.getByText(
      "Invalid palette. Import a complete exported palette with valid hex colours.",
    ),
  ).toBeVisible();
  await page.getByLabel("Palette JSON").fill(exported);
  await page.getByRole("button", { name: "Import JSON", exact: true }).click();
  await page.getByRole("button", { name: "Reset to original" }).click();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

for (const storage of ["blocked", "corrupt"]) {
  test(`palette handles ${storage} storage with original defaults`, async ({
    page,
  }) => {
    await page.addInitScript((mode) => {
      if (mode === "blocked")
        Object.defineProperty(window, "localStorage", {
          get() {
            throw new Error("Storage unavailable");
          },
        });
      else {
        localStorage.setItem(
          "adon-palette-v1",
          '{"version":1,"colors":{"accent":"bad"}}',
        );
        localStorage.setItem("adon-palettes-saved-v1", "{broken");
      }
    }, storage);
    await page.goto("/");
    await page.getByRole("button", { name: "Open palette controls" }).click();
    await expect(page.getByLabel("Accent HEX", { exact: true })).toHaveValue(
      "#ff9a62",
    );
    await page.getByLabel("Accent HEX", { exact: true }).fill("#123456");
    await page.getByLabel("Accent HEX", { exact: true }).press("Tab");
    await expect
      .poll(() =>
        page.evaluate(() =>
          getComputedStyle(document.documentElement)
            .getPropertyValue("--p-accent")
            .trim(),
        ),
      )
      .toBe("#123456");
    if (storage === "blocked")
      await expect(
        page.getByText(
          "Preview applied. Browser storage is unavailable; export JSON to keep it.",
        ),
      ).toBeVisible();
    await page.getByRole("button", { name: "Reset to original" }).click();
    await expect(page.getByLabel("Accent HEX", { exact: true })).toHaveValue(
      "#ff9a62",
    );
  });
}
