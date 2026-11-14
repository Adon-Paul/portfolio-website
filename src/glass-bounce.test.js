import { describe, expect, it } from "vitest";
import { advanceBounce } from "./components/glassBounce";
const bounds = {
  cx: 150,
  cy: 150,
  radius: 100,
  left: 65,
  right: 235,
  top: 90,
  bottom: 220,
  speed: 70,
};
describe("bounded glass motion", () => {
  it("stays within the circle and visible hero for a sustained run", () => {
    const body = { x: 150, y: 110 };
    const clipped = { ...bounds, top: 65, bottom: 120 };
    let hits = 0;
    for (let i = 0; i < 36000; i++) {
      hits += advanceBounce(body, 1 / 60, clipped, () => 0.23) ? 1 : 0;
      expect(Math.hypot(body.x - 150, body.y - 150)).toBeLessThanOrEqual(
        100.00001,
      );
      expect(body.x).toBeGreaterThanOrEqual(bounds.left);
      expect(body.x).toBeLessThanOrEqual(bounds.right);
      expect(body.y).toBeGreaterThanOrEqual(clipped.top);
      expect(body.y).toBeLessThanOrEqual(clipped.bottom);
    }
    expect(hits).toBeGreaterThan(20);
  });
  it("reflects at a wall and freezes when time is paused", () => {
    const body = { x: 234, y: 150, bounceAngle: 0 };
    expect(advanceBounce(body, 0.05, bounds, () => 0.5)).toBe(true);
    expect(body.vx).toBeLessThan(0);
    const { x, y } = body;
    advanceBounce(body, 0, bounds);
    expect(body.x).toBe(x);
    expect(body.y).toBe(y);
  });
});
