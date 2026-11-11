import { profile } from "./content/profile";
import { projects, projectAtPath, projectPath } from "./content/projects";
import Home from "./components/Home";
import SignalStudy from "./components/SignalStudy";
import ProjectMedia from "./components/ProjectMedia";

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}
function Header() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="header wrap">
        <a className="wordmark" href="/" aria-label="Adon Paul Tomy — home">
          adon<span className="wordmark-dot">.</span>
          <span className="wordmark-note">PAUL TOMY</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="/#work">
            Work <span>01</span>
          </a>
          <a href="/#about">
            About <span>03</span>
          </a>
          <a href="/#contact">
            Let’s talk <Arrow />
          </a>
        </nav>
      </header>
    </>
  );
}
function Footer() {
  return (
    <footer className="footer wrap">
      <a href="/" className="footer-name">
        Adon Paul Tomy
      </a>
      <span>Build. Observe. Question.</span>
      <a href="#top">Back to top ↑</a>
    </footer>
  );
}
function Contact() {
  return (
    <section id="contact" className="contact wrap">
      <div className="section-label">
        <span>04 / START A CONVERSATION</span>
        <span aria-hidden="true">↘</span>
      </div>
      <div className="contact-heading">
        <h2>
          A good place
          <br />
          to <em>start.</em>
        </h2>
        <a
          className="contact-arrow"
          href={`mailto:${profile.email}`}
          aria-label="Email Adon"
        >
          <Arrow />
        </a>
      </div>
      <div className="contact-bottom">
        <div>
          <p>Have a role, a project, or a particularly good question?</p>
          <a className="email" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
        </div>
        <div className="socials">
          <a href={profile.github}>
            GitHub <Arrow />
          </a>
          <a href={profile.linkedin}>
            LinkedIn <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}
function CaseStudy({ project }) {
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return (
    <>
      <article className={`case-study wrap case-${project.slug}`}>
        <a href="/#work" className="back-link">
          ← All selected work
        </a>
        <div className="section-label">
          <span>{project.category}</span>
          <span>{project.status}</span>
        </div>
        <h1>
          {project.title}
          <span className="blue-dot">.</span>
        </h1>
        <p className="case-intro">{project.intro}</p>
        <div className="case-meta">
          <div>
            <span className="eyebrow">Built with</span>
            <p>{project.stack.join(" / ")}</p>
          </div>
          <a className="round-link" href={project.repository}>
            View source{" "}
            <span>
              <Arrow />
            </span>
          </a>
        </div>
        {project.role && <p className="case-role">{project.role}</p>}
        {project.slug === "lumisense" && (
          <SignalStudy id="case-signal" headingTag="h2" />
        )}
        <div className="case-body">
          <section>
            <span className="eyebrow">01 / The starting point</span>
            <h2>{project.label}</h2>
            <p>{project.problem}</p>
          </section>
          <section>
            <span className="eyebrow">02 / Inside the build</span>
            <h2>A few decisions.</h2>
            <div className="decisions">
              {project.decisions.map(([title, text], index) => (
                <div key={title}>
                  <span className="decision-number">0{index + 1}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <ProjectMedia project={project} />
          {project.manuscript && (
            <section className="manuscript-note">
              <span className="eyebrow">COMPANION RESEARCH</span>
              <h2>The thinking, written down.</h2>
              <p>
                The completed final-year manuscript explores a smartphone-based
                hybrid assistive system: local perception for specific tasks,
                with model-assisted scene understanding. Its evaluation
                describes one Android device; the current repository has since
                expanded the provider and local-model options.
              </p>
              <p className="manuscript-status">
                Completed final-year manuscript · Not submitted or published
              </p>
              <a className="text-link" href={project.manuscript}>
                Read the project manuscript (PDF) <Arrow />
              </a>
            </section>
          )}

          <section>
            <span className="eyebrow">03 / Where it stands</span>
            <h2>Work, with context.</h2>
            <p>{project.outcome}</p>
            <a className="text-link" href={project.repository}>
              {project.evidence} <Arrow />
            </a>
          </section>
          <section>
            <span className="eyebrow">04 / The next question</span>
            <h2>There’s more to figure out.</h2>
            <p>{project.next}</p>
          </section>
        </div>
        <a className="next-project" href={projectPath(next)}>
          <span className="eyebrow">Next project</span>
          <span>
            {next.title} <Arrow />
          </span>
        </a>
      </article>
      <Contact />
    </>
  );
}
export default function App({ path = "/" }) {
  const project = projectAtPath(path);
  return (
    <div id="top">
      <Header />
      <main id="main">
        {path === "/" ? (
          <>
            <Home />
            <Contact />
          </>
        ) : project ? (
          <CaseStudy project={project} />
        ) : (
          <section className="not-found wrap">
            <span className="eyebrow">404 / OFF THE MAP</span>
            <h1>Page not found.</h1>
            <p>
              There’s no page at this address. Head home to find the projects.
            </p>
            <a className="round-link" href="/">
              Back to home <span>↗</span>
            </a>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
