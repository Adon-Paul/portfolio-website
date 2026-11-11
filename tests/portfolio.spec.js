import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
for (const width of [320, 390, 768, 1440]) {
  test(`home fits ${width}px and has no automatic video or 3D requests`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const requests = [];
    const errors = [];
    page.on("request", (r) => requests.push(r.url()));
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(
      page.getByRole("button", { name: /under the hood/i }),
    ).toBeVisible();
    await page.getByRole("button", { name: /under the hood/i }).click();
    await expect(page.getByText("One queue, two views.")).toBeVisible();
    const notes = await page.locator(".engineering-notes").boundingBox();
    const lastNote = await page
      .locator(".state-diagram > span")
      .last()
      .boundingBox();
    expect(lastNote.y + lastNote.height).toBeLessThanOrEqual(
      notes.y + notes.height - 8,
    );
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.getByRole("button", { name: /back to the surface/i }).click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(requests.filter((u) => /\.(mp4|glb|wasm)(\?|$)/.test(u))).toEqual(
      [],
    );
    expect(errors).toEqual([]);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
    await page.screenshot({
      path: `test-results/home-${width}.png`,
      fullPage: true,
    });
  });
}
test("direct routes, reload, back and video activation use real static documents", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Explore Melody", exact: true }).click();
  await expect(page).toHaveURL(/\/work\/melody\/$/);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Melody.");
  await expect(page.locator("video")).toHaveCount(0);
  await page.getByRole("button", { name: /play melody demo/i }).click();
  await expect(page.locator("video")).toHaveAttribute(
    "src",
    "/videos/melody.mp4",
  );
  await page.goBack();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "A curious mind.",
  );
  for (const [path, title] of [
    ["style-transfer-ai", "Style Transfer AI."],
    ["luxecart", "LuxeCart."],
  ]) {
    expect((await page.goto(`/work/${path}/`)).status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  }
  expect((await page.goto("/work/does-not-exist/")).status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Page not found.",
  );
});
test("core content and evidence links work without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173/");
  await expect(
    page.getByRole("button", { name: /under the hood/i }),
  ).toBeHidden();
  await page.getByRole("link", { name: "Explore Melody", exact: true }).click();
  await expect(page.getByText("One queue, two views")).toBeVisible();
  await expect(
    page.getByRole("link", { name: /download the demo/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /view source/i }),
  ).toHaveAttribute("href", "https://github.com/Adon-Paul/melody");
  await context.close();
});
test("keyboard, reduced motion, zoom and blocked storage remain usable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("Blocked storage");
      },
    });
  });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
  await page.setViewportSize({ width: 640, height: 800 });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.evaluate(() => (document.documentElement.style.zoom = "2"));
  await page.getByRole("button", { name: /under the hood/i }).focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("button", { name: /back to the surface/i }),
  ).toHaveAttribute("aria-expanded", "true");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test("failed media cannot remove project evidence or contact", async ({
  page,
}) => {
  await page.route("**/media/**", (route) => route.abort());
  await page.route("**/videos/**", (route) => route.abort());
  await page.goto("/work/melody/");
  await page.getByRole("button", { name: /play melody demo/i }).click();
  await expect(page.getByText(/video could not load/i)).toBeVisible();
  await expect(page.getByRole("link", { name: /view source/i })).toBeVisible();
  await expect(
    page.getByRole("link", { name: /adonpaultomy@gmail.com/i }),
  ).toBeVisible();
});

test("slash redirects, history restoration and live motion changes remain usable", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/work/melody");
  await expect(page).toHaveURL(/\/work\/melody\/$/);
  await page.getByRole("button", { name: /play melody demo/i }).click();
  await page.getByRole("link", { name: /next from the workbench/i }).click();
  await page.goBack();
  await expect(
    page.getByRole("link", { name: /download the demo/i }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Melody.");
  await page.goto("/");
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
  expect(errors).toEqual([]);
});
