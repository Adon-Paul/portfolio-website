// A reflected path inside the circle and its visible hero rectangle.
export function advanceBounce(body, dt, bounds, random = Math.random) {
  const { cx, cy, radius, left, right, top, bottom, speed } = bounds;
  body.bounceAngle ??= random() * Math.PI * 2;
  let vx = Math.cos(body.bounceAngle),
    vy = Math.sin(body.bounceAngle);
  let x = body.x + vx * speed * dt,
    y = body.y + vy * speed * dt;
  let hit = false;
  if (x < left || x > right) {
    vx = x < left ? Math.abs(vx) : -Math.abs(vx);
    hit = true;
  }
  if (y < top || y > bottom) {
    vy = y < top ? Math.abs(vy) : -Math.abs(vy);
    hit = true;
  }
  x = Math.min(right, Math.max(left, x));
  y = Math.min(bottom, Math.max(top, y));
  const distance = Math.hypot(x - cx, y - cy);
  if (distance > radius) {
    const nx = (x - cx) / distance,
      ny = (y - cy) / distance;
    x = cx + nx * radius;
    y = cy + ny * radius;
    const dot = vx * nx + vy * ny;
    if (dot > 0) {
      vx -= 2 * dot * nx;
      vy -= 2 * dot * ny;
    }
    hit = true;
  }
  // The visible hero can cut across the circle away from its centre.
  // Re-project onto that intersection after the circular reflection.
  y = Math.min(bottom, Math.max(top, y));
  const half = Math.sqrt(Math.max(0, radius * radius - (y - cy) ** 2));
  const minX = Math.max(left, cx - half),
    maxX = Math.min(right, cx + half);
  if (x < minX || x > maxX) {
    vx = x < minX ? Math.abs(vx) : -Math.abs(vx);
    x = Math.min(maxX, Math.max(minX, x));
    hit = true;
  }
  // Vary pace after impacts, while reflection keeps the direction inward.
  body.bounceAngle = Math.atan2(vy, vx);
  body.bounceSpeed = hit ? 0.8 + random() * 0.4 : (body.bounceSpeed ?? 1);
  body.x = x;
  body.y = y;
  body.vx = vx * speed;
  body.vy = vy * speed;
  return hit;
}
