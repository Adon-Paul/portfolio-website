import { guides, guidePath } from "../../content/guides";
export default function GuideIndex() {
  const groups = [...new Set(guides.map((g) => g.group))];
  return (
    <section className="guide-library wrap">
      <div className="section-label">
        <span>FIELD GUIDES / THE WORK BEHIND THE LEARNING</span>
        <span>LINUX · LABS · OSINT</span>
      </div>
      <div className="guide-library-intro">
        <h1>
          Learn it.
          <br />
          <em>Trace it.</em>
          <br />
          Explain it.
        </h1>
        <div>
          <p className="guide-deck">The notes behind the practice.</p>
          <p>
            Room walkthroughs, command-line studies and the questions that made
            me look closer. Written to revisit—and useful enough to share.
          </p>
          <p className="guide-small">
            From my study vault. Original notes preserved where practical;
            Sakura and Bandit rewritten for this collection. Sources and
            editorial context travel with every article.
          </p>
        </div>
      </div>
      <nav className="guide-category-nav" aria-label="Guide categories">
        {groups.map((group, i) => (
          <a key={group} href={`#collection-${i}`}>
            {group}
            <span aria-hidden="true"> ↘</span>
          </a>
        ))}
      </nav>
      {groups.map((group, i) => (
        <section
          className="guide-collection"
          id={`collection-${i}`}
          key={group}
        >
          <div className="guide-collection-title">
            <span className="eyebrow">0{i + 1} / COLLECTION</span>
            <h2>{group}</h2>
          </div>
          <div>
            {guides
              .filter((g) => g.group === group)
              .map((g) => (
                <a className="guide-row" href={guidePath(g)} key={g.slug}>
                  <span className="eyebrow">{g.category}</span>
                  <h3>{g.title}</h3>
                  <p>{g.description}</p>
                  <span className="guide-row-end">
                    Read guide <span aria-hidden="true">↗</span>
                  </span>
                </a>
              ))}
          </div>
        </section>
      ))}
      <div className="guide-library-footer">
        <p>Building and investigating belong together.</p>
        <p>
          <a href="mailto:adonpaultomy@gmail.com">
            Share a question or correction
          </a>
        </p>
        <a className="inline-link" href="/#work">
          Explore the projects <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
