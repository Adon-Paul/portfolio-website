import { profile } from "./content/profile";
import { projects, projectAtPath, projectPath } from "./content/projects";
import SignatureInteraction from "./components/SignatureInteraction";
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
            About <span>02</span>
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
      <span>Made with curiosity. Refined with care.</span>
      <a href="#top">Back to top ↑</a>
    </footer>
  );
}
function Contact() {
  return (
    <section id="contact" className="contact wrap">
      <div className="section-label">
        <span>03 / Make something matter</span>
        <span aria-hidden="true">↘</span>
      </div>
      <div className="contact-heading">
        <h2>
          Good things start
          <br />
          with a <em>hello.</em>
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
function Home() {
  return (
    <>
      <section className="hero wrap" aria-labelledby="hero-title">
        <div className="hero-kicker">
          <span className="eyebrow">
            <span className="status-dot" /> Independent mind. Developer’s hands.
          </span>
          <span className="eyebrow hero-location">
            Kerala, India / Open to opportunities
          </span>
        </div>
        <div className="hero-composition">
          <h1 id="hero-title">
            A curious mind.
            <br />A <em>builder’s</em>
            <br />
            <span className="last-line">
              instinct<span className="blue-dot">.</span>
            </span>
          </h1>
          <figure className="portrait">
            <div className="portrait-grid" />
            <img
              src="/media/adon-640.webp"
              srcSet="/media/adon-400.webp 400w, /media/adon-640.webp 640w"
              sizes="(max-width: 600px) 210px, 350px"
              alt="Illustrated portrait of Adon Paul Tomy"
              width="640"
              height="753"
              fetchpriority="high"
            />
            <figcaption>
              <span>FIG. 01 — ADON</span>
              <span>Always figuring it out.</span>
            </figcaption>
            <span className="portrait-cross" aria-hidden="true">
              +
            </span>
          </figure>
          <div className="hero-stamp" aria-hidden="true">
            <span>BUILT WITH</span>
            <b>✳</b>
            <span>A LITTLE SOUL</span>
          </div>
        </div>
        <div className="hero-bottom">
          <p>
            I’m Adon. I build mobile experiences and explore
            <br className="desktop-break" /> the space where software, security
            and curiosity meet.
          </p>
          <a className="round-link" href="#work">
            Explore selected work <span>↓</span>
          </a>
          <span className="hero-index eyebrow">
            SCROLL TO DISCOVER
            <br />A FEW THINGS I’VE MADE
          </span>
        </div>
      </section>
      <div className="discipline-strip" aria-label="Areas of interest">
        <div className="wrap">
          <span>Mobile development</span>
          <b aria-hidden="true">✳</b>
          <span>Security-minded</span>
          <b aria-hidden="true">✳</b>
          <span>Curiosity-driven</span>
          <b aria-hidden="true">✳</b>
          <span>Always learning</span>
        </div>
      </div>
      <section id="work" className="work wrap">
        <div className="section-label">
          <span>01 / Selected work</span>
          <span>Ideas, made tangible.</span>
        </div>
        <div className="section-heading">
          <h2>
            Less talk.
            <br />
            <em>More making.</em>
          </h2>
          <p>
            A few things I’ve built, what’s inside them,
            <br />
            and the questions they left me with.
          </p>
        </div>
        <article className="featured-project">
          <SignatureInteraction />
          <div className="project-description">
            <div>
              <span className="eyebrow">
                {projects[0].category} / Personal project
              </span>
              <h3>
                Melody<span className="blue-dot">.</span>
              </h3>
              <p>{projects[0].summary}</p>
            </div>
            <a className="round-link" href={projectPath(projects[0])}>
              Explore Melody{" "}
              <span>
                <Arrow />
              </span>
            </a>
          </div>
        </article>
        <div className="project-pair">
          <article>
            <a
              className="style-surface project-visual"
              href={projectPath(projects[1])}
            >
              <span className="sr-only">Explore Style Transfer AI. </span>
              <span className="eyebrow">02 / An experiment in language</span>
              <div className="type-study">
                <span>Same words.</span>
                <em>Different voice.</em>
                <span className="type-cursor" aria-hidden="true">
                  _
                </span>
              </div>
              <div className="language-tags">
                <span>rhythm</span>
                <span>vocabulary</span>
                <span>structure</span>
              </div>
              <span className="visual-arrow" aria-hidden="true">
                ↗
              </span>
            </a>
            <ProjectCaption project={projects[1]} />
          </article>
          <article>
            <a
              className="commerce-surface project-visual"
              href={projectPath(projects[2])}
            >
              <span className="sr-only">Explore LuxeCart. </span>
              <span className="eyebrow">03 / From the early sketchbook</span>
              <div className="receipt" aria-hidden="true">
                <span>LUXECART</span>
                <div className="receipt-rule" />
                <p>A few lessons, added to cart.</p>
                <div className="receipt-row">
                  <span>Flutter interfaces</span>
                  <span>01</span>
                </div>
                <div className="receipt-row">
                  <span>Local persistence</span>
                  <span>02</span>
                </div>
                <div className="receipt-row">
                  <span>Connecting the pieces</span>
                  <span>03</span>
                </div>
                <div className="barcode" />
                <small>WORK IN PROGRESS, LIKE ME.</small>
              </div>
              <span className="visual-arrow" aria-hidden="true">
                ↗
              </span>
            </a>
            <ProjectCaption project={projects[2]} />
          </article>
        </div>
        <a className="text-link github-more" href={profile.github}>
          More experiments on GitHub <Arrow />
        </a>
      </section>
      <section id="about" className="about">
        <div className="wrap">
          <div className="section-label">
            <span>02 / The person behind the pixels</span>
            <span aria-hidden="true">✳</span>
          </div>
          <div className="about-grid">
            <h2>
              I like knowing
              <br />
              how things <em>work.</em>
              <br />
              Then making
              <br />
              them <em>better.</em>
            </h2>
            <div className="about-copy">
              <p className="lead">
                Mobile development is my starting point. Curiosity tends to take
                it from there.
              </p>
              <p>
                I’m Adon Paul Tomy, a developer from Kerala. I work with
                Flutter, explore security, and build small tools to follow
                questions that catch my attention.
              </p>
              <p>
                My projects range from a local music player to an experiment in
                writing style. I care about the details people interact with,
                and the systems that make those details reliable.
              </p>
              <a className="text-link" href={profile.linkedin}>
                A little more about me <Arrow />
              </a>
              <div className="experience">
                <div>
                  <span>Building</span>
                  <p>
                    Flutter development intern
                    <br />
                    <strong>WeCodeLife · 2023</strong>
                  </p>
                </div>
                <div>
                  <span>Community</span>
                  <p>
                    Cybersecurity IG Lead · MuLearn
                    <br />
                    Finance Chair · IEEE
                  </p>
                </div>
                <div>
                  <span>Learning</span>
                  <p>
                    Smart India Hackathon
                    <br />
                    <strong>Internal round winner · 2025</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="toolbox">
            <span className="eyebrow">Frequently on my workbench</span>
            <p>
              Flutter <i>/</i> Dart <i>/</i> Python <i>/</i> Firebase <i>/</i>{" "}
              Git <i>/</i> Linux
            </p>
          </div>
        </div>
      </section>
      <Contact />
    </>
  );
}
function ProjectCaption({ project }) {
  return (
    <div className="project-caption">
      <span className="eyebrow">{project.category}</span>
      <h3>
        <a href={projectPath(project)}>
          {project.title} <Arrow />
        </a>
      </h3>
      <p>{project.summary}</p>
    </div>
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
          <span className="eyebrow">Next from the workbench</span>
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
          <Home />
        ) : project ? (
          <CaseStudy project={project} />
        ) : (
          <section className="not-found wrap">
            <span className="eyebrow">404 / A loose end</span>
            <h1>Page not found.</h1>
            <p>
              This part of the workshop doesn’t exist. The good stuff is back on
              the workbench.
            </p>
            <a className="round-link" href="/">
              Back to the workshop <span>↗</span>
            </a>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
