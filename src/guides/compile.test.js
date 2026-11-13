import { describe, it, expect } from "vitest";
import { compileGuide } from "../../scripts/guides/compile.mjs";

describe("reviewed Markdown compilation", () => {
  it("creates stable unique section anchors and accessible tables", () => {
    const result = compileGuide(
      "## Start here\n\nA **useful** explanation.\n\n## Start here\n\n| Command | Meaning |\n|---|---|\n| `pwd` | Location |",
    );
    expect(result.sections.map((s) => s.id)).toEqual([
      "start-here",
      "start-here-2",
    ]);
    expect(result.html).toContain("<strong>useful</strong>");
    expect(result.html).toContain('tabindex="0"');
    expect(result.html).toContain('scope="col"');
  });
  it("escapes raw HTML and rejects executable links", () => {
    const result = compileGuide(
      '<script>alert(1)</script>\n\n[bad](javascript:alert)\n\n```bash\necho "<hello>"\n```',
    );
    expect(result.html).not.toContain("<script>");
    expect(result.html).not.toContain('href="javascript:');
    expect(result.html).toContain("&lt;hello&gt;");
  });
  it("renders native hints and accessible flow figures without trusting raw HTML", () => {
    const result = compileGuide(
      ":::hint Try this first\nInspect the file with `file`.\n:::\n\n:::flow The access path\n- FTP → Backup\n- Backup → User access\n:::",
    );
    expect(result.html).toContain('<details class="guide-hint">');
    expect(result.html).toContain("<summary>Try this first</summary>");
    expect(result.html).toContain('<figure class="guide-flow">');
    expect(result.html).toContain("<figcaption>The access path</figcaption>");
  });
  it("rejects vault syntax and unreviewed media rather than publishing broken embeds", () => {
    expect(() => compileGuide("See [[Private note]]")).toThrow(/vault/i);
    expect(() =>
      compileGuide("![photo](https://example.com/unreviewed.png)"),
    ).toThrow(/image/i);
  });
});
