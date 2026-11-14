import { test, expect } from "@playwright/test";

test("hero preserves the original filament with FluidGlass in the foreground", async ({
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
  await expect(
    page.locator(".hero-glass[data-shape='cube'] .fluid-glass"),
  ).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(page.locator(".hero-glass[data-shape='cube']")).toHaveAttribute(
    "data-ready",
    "true",
    { timeout: 15000 },
  );
  await expect(
    page.locator(".hero-glass[data-shape='cube'] canvas"),
  ).toBeVisible();
  await expect(page.locator(".identity-filament ellipse")).toHaveCount(44);
  await expect(page.locator("svg.identity-graphic")).toBeVisible();
  expect(
    await page
      .locator(".hero-glass[data-shape='cube']")
      .evaluate((el) => Number(getComputedStyle(el).zIndex)),
  ).toBeGreaterThan(0);
  await expect(
    page.getByRole("heading", { name: /ADON.*PAUL TOMY/ }),
  ).toBeVisible();
  await expect(page.locator(".hero-glass[data-shape='prism']")).toHaveCount(0);
  expect(videos).toEqual([]);
});

test("hero glass follows site pause, reduced motion and live palette on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#top");
  await expect(page.locator(".hero-glass[data-shape='cube']")).toHaveAttribute(
    "data-ready",
    "true",
    { timeout: 15000 },
  );
  await page.getByRole("button", { name: "Pause motion", exact: true }).click();
  await expect(
    page.locator(".hero-glass[data-shape='cube'] .fluid-glass"),
  ).toHaveAttribute("data-paused", "true");
  await expect
    .poll(async () => {
      const glass = await page
        .locator(".hero-glass[data-shape='cube'] .fluid-glass__handle")
        .boundingBox();
      const stage = await page.locator(".identity-stage").boundingBox();
      return (
        glass.x >= stage.x &&
        glass.y >= stage.y &&
        glass.x + glass.width <= stage.x + stage.width &&
        glass.y + glass.height <= stage.y + stage.height
      );
    })
    .toBe(true);
  await page.getByRole("button", { name: "Open palette controls" }).click();
  await page.getByLabel("Preset", { exact: true }).selectOption("cobalt");
  await page.getByRole("button", { name: "Close palette controls" }).click();
  await expect(page.locator(".hero-glass[data-shape='cube']")).toHaveAttribute(
    "data-accent",
    "#8bb7ff",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(
    page.locator(".hero-glass[data-shape='cube'] .fluid-glass"),
  ).toHaveAttribute("data-paused", "true");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("static hero remains visible without WebGL or JavaScript", async ({
  page,
  browser,
}) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      return type === "webgl2" ? null : original.call(this, type, ...args);
    };
  });
  await page.goto("/#top");
  await expect(
    page.locator(".hero-glass[data-shape='cube'] .hero-glass-fallback"),
  ).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const context = await browser.newContext({ javaScriptEnabled: false });
  const nojs = await context.newPage();
  await nojs.goto("/");
  await expect(
    nojs.locator(".hero-glass[data-shape='cube'] .hero-glass-fallback"),
  ).toBeVisible();
  await expect(nojs.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(
    nojs.locator(".hero-glass[data-shape='cube'] .fluid-glass"),
  ).toHaveCount(0);
  await context.close();
});

test("glass retains original high-DPI rendering quality", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  await page.goto("/#top");
  await expect(page.locator(".hero-glass[data-shape='cube']")).toHaveAttribute(
    "data-ready",
    "true",
    { timeout: 20000 },
  );
  const ratio = await page
    .locator(".hero-glass[data-shape='cube'] canvas")
    .evaluate((canvas) => canvas.width / canvas.getBoundingClientRect().width);
  expect(ratio).toBeGreaterThan(1.95);
  await expect(page.locator(".identity-filament ellipse")).toHaveCount(44);
  await context.close();
});

test("glass refracts the live ADON canvas rather than a faint substitute texture", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.heroBackdropDraws = 0;
    const draw = CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage = function (source, ...args) {
      if (
        this.canvas.dataset.heroBackdrop &&
        source.classList?.contains("tech-text-canvas")
      )
        window.heroBackdropDraws++;
      return draw.call(this, source, ...args);
    };
  });
  await page.goto("/#top");
  await expect(page.locator(".hero-glass[data-shape='cube']")).toHaveAttribute(
    "data-ready",
    "true",
    { timeout: 20000 },
  );
  await expect
    .poll(() => page.evaluate(() => window.heroBackdropDraws))
    .toBeGreaterThan(1);
});

for (const shape of ["cube"]) {
  for (const width of [390, 1440]) {
    test(`${shape} bounces independently within its visible confines at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/#top");
      const glass = page.locator(
        `.hero-glass[data-shape='${shape}'] .fluid-glass`,
      );
      await expect(glass).toHaveAttribute("data-interaction", "bounce");
      await expect(
        page.locator(`.hero-glass[data-shape='${shape}']`),
      ).toHaveAttribute("data-ready", "true", { timeout: 20000 });
      await page.mouse.move(width - 5, 10);
      const samples = await page.evaluate(async (shape) => {
        const samples = [];
        const root = document.querySelector(
          `.hero-glass[data-shape='${shape}']`,
        );
        for (let i = 0; i < 6; i++) {
          await new Promise((resolve) => setTimeout(resolve, 150));
          samples.push({
            box: root
              .querySelector(".fluid-glass__handle")
              .getBoundingClientRect()
              .toJSON(),
            stage: document
              .querySelector(".identity-stage")
              .getBoundingClientRect()
              .toJSON(),
            circle: root.getBoundingClientRect().toJSON(),
          });
        }
        return samples;
      }, shape);
      const positions = [];
      for (const { box, stage, circle } of samples) {
        expect(box.x).toBeGreaterThanOrEqual(stage.x - 1);
        expect(box.y).toBeGreaterThanOrEqual(stage.y - 1);
        expect(box.x + box.width).toBeLessThanOrEqual(
          stage.x + stage.width + 1,
        );
        expect(box.y + box.height).toBeLessThanOrEqual(
          stage.y + stage.height + 1,
        );
        expect(
          Math.hypot(
            box.x + box.width / 2 - circle.x - circle.width / 2,
            box.y + box.height / 2 - circle.y - circle.height / 2,
          ) +
            box.width / 2,
        ).toBeLessThanOrEqual(circle.width / 2 + 1);
        positions.push(box);
      }
      await expect
        .poll(
          async () => {
            const box = await glass
              .locator(".fluid-glass__handle")
              .boundingBox();
            return Math.hypot(box.x - positions[0].x, box.y - positions[0].y);
          },
          { timeout: 15000 },
        )
        .toBeGreaterThan(8);
      const pause = page.getByRole("button", {
        name: "Pause motion",
        exact: true,
      });
      await pause.focus();
      await page.keyboard.press("Enter");
      await expect(glass).toHaveAttribute("data-paused", "true");
      await page.waitForTimeout(300);
      const stopped = await page
        .locator(`.hero-glass[data-shape='${shape}'] .fluid-glass__handle`)
        .boundingBox();
      await page.mouse.move(width / 2, 350);
      await page.waitForTimeout(300);
      expect(
        await page
          .locator(`.hero-glass[data-shape='${shape}'] .fluid-glass__handle`)
          .boundingBox(),
      ).toEqual(stopped);
    });
  }
}
