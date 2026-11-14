import { test, expect } from "@playwright/test";

test("unconfigured shared likes never display a fabricated count or accept a local-only vote", async ({
  page,
}) => {
  const configResponse = page.waitForResponse("**/site-likes.json");
  await page.goto("/#portfolio-likes");
  await configResponse;
  const likes = page.locator("#portfolio-likes");
  await expect(likes).toHaveCount(0);
});

import AxeBuilder from "@axe-core/playwright";
import { likesService } from "./helpers/likes-service";
const endpoint = "https://likes-fixture.supabase.co";
async function connectFixture(context, service) {
  await context.route("**/site-likes.json", (route) =>
    route.fulfill({
      json: { url: endpoint, publishableKey: "sb_publishable_test" },
    }),
  );
  await context.route(`${endpoint}/**`, async (route) => {
    const request = route.request(),
      url = new URL(request.url());
    const result = service.handle(
      url.pathname + url.search,
      request.headers(),
      request.postDataJSON() || {},
    );
    await route.fulfill({ status: result.status, json: result.json });
  });
}
const likesButton = (page) =>
  page
    .locator("#portfolio-likes")
    .getByRole("button", { name: /Like this portfolio/ });

test("two independent visitors see shared likes and an unlike without losing their identities", async ({
  browser,
}) => {
  const service = likesService();
  const a = await browser.newContext(),
    b = await browser.newContext();
  await connectFixture(a, service);
  await connectFixture(b, service);
  const first = await a.newPage(),
    second = await b.newPage();
  await first.goto("/#portfolio-likes");
  await second.goto("/#portfolio-likes");
  await expect(likesButton(first)).toHaveAccessibleName(
    "Like this portfolio, 0",
  );
  await likesButton(first).click();
  await expect(likesButton(first)).toHaveAttribute("aria-pressed", "true");
  await second.reload();
  await expect(likesButton(second)).toHaveAccessibleName(
    "Like this portfolio, 1",
  );
  await likesButton(second).click();
  await expect(likesButton(second)).toHaveAccessibleName(
    "Like this portfolio, 2",
  );
  await first.reload();
  await expect(likesButton(first)).toHaveAccessibleName(
    "Like this portfolio, 2",
  );
  await expect(likesButton(first)).toHaveAttribute("aria-pressed", "true");
  await likesButton(first).click();
  await expect(likesButton(first)).toHaveAccessibleName(
    "Like this portfolio, 1",
  );
  await second.reload();
  await expect(likesButton(second)).toHaveAccessibleName(
    "Like this portfolio, 1",
  );
  await expect(likesButton(second)).toHaveAttribute("aria-pressed", "true");
  expect(service.signups).toBe(2);
  await a.close();
  await b.close();
});

test("failed saves roll back both the like and visible count", async ({
  page,
  context,
}) => {
  const service = likesService();
  await connectFixture(context, service);
  await page.goto("/#portfolio-likes");
  await expect(likesButton(page)).toHaveAccessibleName(
    "Like this portfolio, 0",
  );
  service.failNextWrite();
  await likesButton(page).click();
  await expect(page.locator(".site-likes-message")).toHaveText(
    "Your like wasn’t saved. Try again.",
  );
  await expect(likesButton(page)).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator(".pulse-heart__count")).toHaveText("0");
  await page.getByRole("button", { name: "Retry likes" }).click();
  await expect(page.locator(".site-likes-message")).toHaveText(
    "Leave a little appreciation.",
  );
  await likesButton(page).click();
  await expect(likesButton(page)).toHaveAccessibleName(
    "Like this portfolio, 1",
  );
});

test("the original pulse follows palette, pause and reduced motion on mobile", async ({
  page,
  context,
}) => {
  const service = likesService();
  await connectFixture(context, service);
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/#portfolio-likes");
  await expect(likesButton(page)).toHaveAccessibleName(
    "Like this portfolio, 0",
  );
  await likesButton(page).click();
  await expect(likesButton(page)).toHaveAttribute("data-running", "");
  await page.getByRole("button", { name: "Pause motion", exact: true }).click();
  await expect(likesButton(page)).not.toHaveAttribute("data-running", "");
  await expect(likesButton(page)).toHaveAttribute("data-liked", "true");
  await page.getByRole("button", { name: "Open palette controls" }).click();
  await page.getByLabel("Preset", { exact: true }).selectOption("cobalt");
  await page.getByRole("button", { name: "Close palette controls" }).click();
  await expect(page.locator(".pulse-heart__heart")).toHaveCSS(
    "color",
    "rgb(139, 183, 255)",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await likesButton(page).click();
  await expect(likesButton(page)).not.toHaveAttribute("data-running", "");
  await expect(likesButton(page)).toHaveAccessibleName(
    "Like this portfolio, 0",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(
    (await new AxeBuilder({ page }).include("#portfolio-likes").analyze())
      .violations,
  ).toEqual([]);
});
