import { it, expect } from "vitest";
import { guides, guideAtPath, guidePath } from "../content/guides";
import { loadGuide } from "./loadGuide";
it("resolves exact public guide routes and rejects unknown or nested paths", () => {
  expect(guideAtPath("/guides/sunset/").slug).toBe("sunset");
  for (const path of [
    "/guides/",
    "/guides/sunset/extra/",
    "/guides/%2e%2e/",
    "/guides/private/",
  ])
    expect(guideAtPath(path)).toBeUndefined();
  expect(new Set(guides.map((g) => g.slug)).size).toBe(guides.length);
});
it("loads every published article with complete sections and public related links", async () => {
  for (const guide of guides) {
    const data = await loadGuide(guide.slug);
    expect(data.html.length).toBeGreaterThan(1000);
    expect(data.sections.length).toBeGreaterThan(1);
    for (const section of data.sections)
      expect(data.html).toContain(`id="${section.id}"`);
    for (const related of guide.related)
      expect(guideAtPath(`/guides/${related}/`)).toBeDefined();
    expect(guidePath(guide)).toBe(`/guides/${guide.slug}/`);
    expect(data.html).not.toMatch(
      /\[\[|flag\{[^}]+\}|192\.168\.|cheer14|redteamlinux|blackhawkready/,
    );
  }
  expect(await loadGuide("unknown")).toBeUndefined();
});
