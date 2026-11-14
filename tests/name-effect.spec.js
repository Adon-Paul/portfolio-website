import { test, expect } from "@playwright/test";

test("ADON effects stay on D and O, including click propagation", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const sprites = new WeakMap();
    window.nameEffect = {
      boxes: {},
      outlines: [],
      staticPositions: { A: [], N: [] },
      capture: false,
    };
    for (const method of ["fillText", "strokeText"]) {
      const original = CanvasRenderingContext2D.prototype[method];
      CanvasRenderingContext2D.prototype[method] = function (
        text,
        x,
        y,
        ...args
      ) {
        if (text.length === 1 && "ADON".includes(text)) {
          const measured = this.measureText(text);
          const previous = sprites.get(this.canvas);
          sprites.set(this.canvas, {
            char: text,
            stroke: method === "strokeText" || previous?.stroke,
          });
          window.nameEffect.boxes[text] = {
            x:
              x +
              (measured.actualBoundingBoxRight -
                measured.actualBoundingBoxLeft) /
                2,
            y:
              y -
              (measured.actualBoundingBoxAscent -
                measured.actualBoundingBoxDescent) /
                2,
          };
        }
        return original.call(this, text, x, y, ...args);
      };
    }
    const draw = CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage = function (source, ...args) {
      const sprite = sprites.get(source);
      if (
        window.nameEffect.capture &&
        sprite &&
        this.canvas.classList.contains("tech-text-canvas")
      ) {
        if (sprite.stroke) window.nameEffect.outlines.push(sprite.char);
        else if (sprite.char === "A" || sprite.char === "N")
          window.nameEffect.staticPositions[sprite.char].push(
            `${args[0]},${args[1]}`,
          );
      }
      return draw.call(this, source, ...args);
    };
  });
  await page.goto("/#top");
  await expect(page.locator(".tech-text")).toHaveAttribute(
    "data-ready",
    "true",
  );
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(200);
  await page.evaluate(() => {
    window.nameEffect.capture = true;
  });
  const canvas = await page.locator(".tech-text-canvas").boundingBox();
  const boxes = await page.evaluate(() => window.nameEffect.boxes);
  for (const char of "ADON") {
    await page.mouse.move(canvas.x + boxes[char].x, canvas.y + boxes[char].y);
    await page.waitForTimeout(300);
  }
  await page.mouse.click(canvas.x + boxes.D.x, canvas.y + boxes.D.y);
  await page.waitForTimeout(500);
  const result = await page.evaluate(() => window.nameEffect);
  expect([...new Set(result.outlines)].sort()).toEqual(["D", "O"]);
  for (const char of ["A", "N"]) {
    expect(result.staticPositions[char].length).toBeGreaterThan(1);
    expect(new Set(result.staticPositions[char]).size).toBe(1);
  }
  await expect(page.locator('.hero-glass[data-shape="prism"]')).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("ADON");
});
