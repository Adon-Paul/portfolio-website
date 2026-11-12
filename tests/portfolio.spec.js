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
    const read = page.getByRole("button", { name: "Read text", exact: true });
    const scene = page.getByRole("button", { name: /describe a scene/i });
    await expect(read).toHaveAttribute("aria-pressed", "true");
    await scene.click();
    await expect(scene).toHaveAttribute("aria-pressed", "true");
    await expect(read).toHaveAttribute("aria-pressed", "false");
    await expect(page.getByRole("status")).toContainText("provider choice");
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await read.click();
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
  await expect(page.getByRole("heading", { level: 1 })).toContainText("ADON");
  for (const [path, title] of [
    ["lumisense", "LumiSense."],
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
    page.getByRole("button", { name: /describe a scene/i }),
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
  await page.getByRole("button", { name: /describe a scene/i }).focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("button", { name: /describe a scene/i }),
  ).toHaveAttribute("aria-pressed", "true");
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
  await page.getByRole("link", { name: /next project/i }).click();
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

test("home plays both original recordings and pauses the previous player", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: /play melody demo/i }).click();
  const first = page.locator('video[src="/videos/melody.mp4"]');
  await expect.poll(() => first.evaluate((v) => v.paused)).toBe(false);
  await page
    .getByRole("button", { name: /play style transfer ai demo/i })
    .click();
  const second = page.locator('video[src="/videos/style-transfer-ai.mp4"]');
  await expect.poll(() => second.evaluate((v) => v.paused)).toBe(false);
  await expect.poll(() => first.evaluate((v) => v.paused)).toBe(true);
  await expect(second).toBeFocused();
  await first.evaluate((v) => v.play());
  await expect.poll(() => second.evaluate((v) => v.paused)).toBe(true);
  expect(await first.evaluate((v) => v.currentTime)).toBeGreaterThanOrEqual(0);
});

test("certificates disclose accurate evidence and the lab note remains readable", async ({
  page,
}) => {
  await page.goto("/");
  const credential = page.locator(".credential").first();
  await credential.locator("summary").click();
  await expect(credential).toHaveAttribute("open", "");
  await expect(credential).toContainText("Participation");
  await expect(credential.locator("img")).toBeVisible();
  expect(
    await credential
      .locator("img")
      .evaluate((i) => i.complete && i.naturalWidth > 0),
  ).toBe(true);
  await page.getByText("What I took away", { exact: true }).click();
  await expect(
    page.getByText(
      "Remove sensitive backups from publicly accessible services.",
    ),
  ).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test("disclosure and selected-path indicators survive forced colours", async ({
  page,
}) => {
  await page.emulateMedia({ forcedColors: "active" });
  await page.goto("/");
  const scene = page.getByRole("button", { name: /describe a scene/i });
  await scene.click();
  expect(
    await scene.evaluate((el) => getComputedStyle(el).textDecorationLine),
  ).toContain("underline");
  const icon = page.locator(".credential .disclosure-icon").first();
  expect(
    await icon.evaluate(
      (el) => getComputedStyle(el, "::before").borderTopStyle,
    ),
  ).toBe("solid");
  await page.locator(".credential summary").first().click();
  await expect(page.locator(".credential").first()).toHaveAttribute("open", "");
});

test("continuous motion can be paused, survives navigation and respects system changes", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const emblem = page.locator(".motion-emblem");
  const initial = await emblem.evaluate((el) => getComputedStyle(el).transform);
  await expect
    .poll(() => emblem.evaluate((el) => getComputedStyle(el).transform))
    .not.toBe(initial);
  await page.getByRole("button", { name: "Pause motion" }).click();
  await expect(page.locator("#top")).toHaveAttribute("data-motion", "paused");
  expect(
    await emblem.evaluate((el) => getComputedStyle(el).animationPlayState),
  ).toBe("paused");
  await page.getByRole("link", { name: "Explore Melody", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Resume motion" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Resume motion" }).click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(
    page.getByRole("button", { name: "Motion reduced by system preference" }),
  ).toBeDisabled();
  expect(
    await page
      .locator(".motion-emblem")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator("#top")).toHaveAttribute("data-motion", "running");
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(page.locator("#top")).toHaveAttribute("data-motion", "paused");
});

test("interactive studies work on a narrow viewport without sending text away", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/");
  await page.getByRole("button", { name: "Select Track 02" }).click();
  await expect(page.getByTestId("queue-full")).toContainText("Track 02");
  await expect(page.getByTestId("queue-mini")).toContainText("Track 02");
  const outgoing = [];
  page.on("request", (r) => {
    if (r.method() !== "GET") outgoing.push(r.url());
  });
  await page
    .getByLabel("Text to inspect")
    .fill("Build carefully. Ask better questions!");
  await expect(page.getByTestId("word-count")).toHaveText("5");
  await expect(page.getByTestId("sentence-length")).toHaveText("2.5");
  expect(outgoing).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});
