import { Marked } from "marked";
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const safeHref = (href) =>
  /^(https?:\/\/|mailto:|\/(?!\/)|#)/i.test(href) &&
  !/[\u0000-\u0020\\]/.test(href);
export function compileGuide(markdown) {
  if (/\[\[|\]\]/.test(markdown)) throw new Error("Unresolved vault link");
  let tableIndex = 0;
  const sections = [],
    counts = new Map();
  const parser = new Marked({
    gfm: true,
    extensions: [
      {
        name: "guideBlock",
        level: "block",
        start(source) {
          return source.indexOf(":::");
        },
        tokenizer(source) {
          const match =
            /^:::(hint|flow) ([^\n]+)\n([\s\S]*?)\n:::(?:\n|$)/.exec(source);
          if (match)
            return {
              type: "guideBlock",
              raw: match[0],
              kind: match[1],
              title: match[2],
              tokens: this.lexer.blockTokens(match[3]),
            };
        },
        renderer(token) {
          const body = this.parser.parse(token.tokens);
          return token.kind === "hint"
            ? `<details class="guide-hint"><summary>${escape(token.title)}</summary>${body}</details>\n`
            : `<figure class="guide-flow"><figcaption>${escape(token.title)}</figcaption>${body}</figure>\n`;
        },
      },
    ],
    renderer: {
      html({ text }) {
        return escape(text);
      },
      heading({ tokens, depth }) {
        const title = tokens
          .map((t) => t.text || "")
          .join("")
          .replace(/<[^>]*>/g, "");
        const base =
          title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "") || "section";
        const count = (counts.get(base) || 0) + 1;
        counts.set(base, count);
        const id = base + (count > 1 ? `-${count}` : "");
        const level = Math.max(2, depth);
        if (level === 2) sections.push({ id, title });
        return `<h${level} id="${id}">${this.parser.parseInline(tokens)}</h${level}>\n`;
      },
      link({ href, tokens }) {
        const label = this.parser.parseInline(tokens);
        return safeHref(href)
          ? `<a href="${escape(href)}">${label}</a>`
          : label;
      },
      image() {
        throw new Error(
          "Guide image needs explicit review and rendering support",
        );
      },
      code({ text, lang }) {
        if (lang === "mermaid")
          throw new Error(
            "Convert diagram to accessible editorial markup before publishing",
          );
        return `<div class="guide-code"><span class="guide-code-label">${escape(lang || "text")}</span><pre tabindex="0" aria-label="${escape(lang || "Text")} example"><code>${escape(text)}</code></pre></div>\n`;
      },
      table({ header, rows }) {
        const cell = (item, tag) =>
          `<${tag}${tag === "th" ? ' scope="col"' : ""}>${this.parser.parseInline(item.tokens)}</${tag}>`;
        return `<div class="guide-table" role="region" aria-label="Reference table ${++tableIndex}" tabindex="0"><table><thead><tr>${header.map((c) => cell(c, "th")).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((c) => cell(c, "td")).join("")}</tr>`).join("")}</tbody></table></div>\n`;
      },
    },
  });
  const html = parser.parse(markdown);
  return { html, sections };
}
export function guideMarkdownPlugin() {
  return {
    name: "reviewed-guide-markdown",
    enforce: "pre",
    transform(source, id) {
      if (
        !id.replaceAll("\\", "/").includes("/src/guides/articles/") ||
        !id.endsWith(".md")
      )
        return;
      return {
        code: `export default ${JSON.stringify(compileGuide(source))};`,
        map: null,
      };
    },
  };
}
