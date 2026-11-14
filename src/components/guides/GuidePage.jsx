import { guides, guidePath } from "../../content/guides";
export default function GuidePage({ guide, article }) {
  return (
    <article className="guide-page wrap">
      <a href="/guides/" className="back-link">
        <span aria-hidden="true">← </span>
        <span>All field guides</span>
      </a>
      <header className="guide-heading">
        <div className="section-label">
          <span>{guide.category}</span>
          <span>{guide.group}</span>
        </div>
        <h1>{guide.title}</h1>
        <p className="guide-deck">{guide.description}</p>
        <div className="guide-byline">
          <span>Adon Paul Tomy</span>
          <span>{guide.provenance}</span>
          <span>
            Edited <time dateTime={guide.reviewedAt}>13 Nov 2026</time>
          </span>
        </div>
      </header>
      <div className="guide-reading-grid">
        <aside className="guide-contents">
          <details open>
            <summary>On this page</summary>
            <nav aria-label="Article contents">
              <ol>
                {article?.sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`}>{s.title}</a>
                  </li>
                ))}
              </ol>
            </nav>
          </details>
          <a className="guide-return" href="/guides/">
            Back to the collection ↗
          </a>
        </aside>
        <div
          className="guide-prose"
          dangerouslySetInnerHTML={{ __html: article?.html || "" }}
        />
      </div>
      <footer className="guide-related">
        <span className="eyebrow">KEEP FOLLOWING THE THREAD</span>
        <h2 id="connected-reading">Connected reading.</h2>
        <div>
          {guide.related.map((slug) => {
            const next = guides.find((g) => g.slug === slug);
            return (
              <a key={slug} href={guidePath(next)}>
                <span>{next.category}</span>
                <strong>{next.title}</strong>
                <span aria-hidden="true">↗</span>
              </a>
            );
          })}
        </div>
        <p>
          Have a correction or a useful question?{" "}
          <a href="mailto:adonpaultomy@gmail.com">Get in touch.</a>
        </p>
      </footer>
    </article>
  );
}
