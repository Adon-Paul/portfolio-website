import { projects, projectPath } from "../content/projects";
import ProjectMedia from "./ProjectMedia";
import SignalStudy from "./SignalStudy";
import TechText from "./TechText";
import Workbench from "./Workbench";
import Credentials from "./Credentials";

function IdentityGraphic() {
  return (
    <svg
      className="identity-graphic"
      viewBox="0 0 700 700"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="identity-ink"
          x1="80"
          y1="80"
          x2="650"
          y2="620"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--p-hero-light)" />
          <stop offset=".45" stopColor="var(--p-accent)" />
          <stop offset="1" stopColor="var(--p-hero-dark)" />
        </linearGradient>
      </defs>
      <g className="identity-filament" transform="rotate(-28 350 350)">
        {Array.from({ length: 44 }, (_, i) => (
          <ellipse
            key={i}
            cx={350}
            cy={350}
            rx={72 + i * 5.5}
            ry={275 - i * 3.4}
            stroke="url(#identity-ink)"
            strokeWidth={i % 7 === 0 ? 1.3 : 0.65}
            transform={`rotate(${i * 3.3} 350 350)`}
          />
        ))}
      </g>
      <path
        d="M350 14V686M14 350H686"
        stroke="var(--p-hero-grid)"
        strokeOpacity=".25"
        strokeDasharray="3 9"
      />
      <circle
        cx="350"
        cy="350"
        r="326"
        stroke="var(--p-hero-grid)"
        strokeOpacity=".2"
      />
      <circle cx="350" cy="24" r="5" fill="var(--p-accent)" />
      <path
        d="M32 40H60M46 26V54M640 660H668M654 646V674"
        stroke="var(--p-accent)"
      />
    </svg>
  );
}

export default function Home() {
  const [lumi, melody, style] = projects;
  return (
    <>
      <section className="hero wrap" aria-labelledby="hero-title">
        <div className="hero-topline">
          <span>INDEPENDENT DEVELOPER</span>
          <span>KERALA, INDIA ↘</span>
        </div>
        <div className="identity-stage">
          <IdentityGraphic />
          <h1 id="hero-title">
            <span className="given-name tech-adon">
              <span className="tech-adon-fallback">ADON</span>
              <TechText
                text="ADON"
                fontFamily="Space, Arial, sans-serif"
                fontWeight={600}
                fontSize={360}
                align="left"
                accentColor="var(--p-accent)"
                reveal="letter"
                dashLength={4}
                dashGap={2}
                specks={15}
                intro="none"
                clickKick
                guides={false}
              />
            </span>
            <span className="family-name">
              PAUL TOMY
              <span className="identity-mark" aria-hidden="true">
                ✳
              </span>
            </span>
          </h1>
          <div className="hero-coordinate" aria-hidden="true">
            FORM / FUNCTION
            <br />A WORK IN PROGRESS
          </div>
        </div>
        <div className="hero-bottom">
          <p>
            I build software.
            <br />
            <span>Then look beneath the surface.</span>
          </p>
          <div className="hero-intro">
            <p>
              Mobile development, applied AI and a growing practice in
              cybersecurity. Curious about how things work—and where they break.
            </p>
            <a className="inline-link" href="#work">
              Enter the work <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
        <div className="hero-index">
          <span>SELECTED WORK / 01—03</span>
          <span>BUILD · OBSERVE · QUESTION</span>
        </div>
      </section>

      <section id="work" className="work-section">
        <div className="wrap">
          <div className="section-label">
            <span>01 / SELECTED WORK</span>
            <span>SOURCE OPEN. THINKING INCLUDED.</span>
          </div>
          <div className="work-heading">
            <h2>
              Ideas with
              <br />
              <em>an inside.</em>
            </h2>
            <p>
              Three projects. Different inputs.
              <br />
              The same urge to figure things out.
            </p>
          </div>
          <article className="lumi-feature">
            <div className="project-heading">
              <span className="project-number">01</span>
              <div>
                <span className="eyebrow">
                  ASSISTIVE TECHNOLOGY / FINAL-YEAR PROJECT
                </span>
                <h3>
                  LumiSense<span className="accent">.</span>
                </h3>
              </div>
              <span className="project-year">SEE → UNDERSTAND → SPEAK</span>
            </div>
            <SignalStudy />
            <div className="lumi-decisions">
              <div>
                <span>01 / LATENCY</span>
                <h4>Keep the simple tasks close.</h4>
                <p>
                  OCR and barcode reading use on-device ML Kit. A cloud request
                  is not necessary for every camera frame.
                </p>
              </div>
              <div>
                <span>02 / CONTEXT</span>
                <h4>Choose the right route.</h4>
                <p>
                  Richer scene descriptions use configurable AI providers. Local
                  models are an option, with device and download tradeoffs.
                </p>
              </div>
              <div>
                <span>03 / ATTENTION</span>
                <h4>Know when to stay quiet.</h4>
                <p>
                  Speech chunking and debounced detections aim to prevent useful
                  information becoming a stream of interruptions.
                </p>
              </div>
            </div>
            <div className="feature-caption">
              <h4>
                A little more of the world,
                <br />
                within reach.
              </h4>
              <div>
                <p>{lumi.summary}</p>
                <p className="role-note">
                  Application built by me with AI assistance. A team academic
                  project.
                </p>
                <div className="project-links">
                  <a href={projectPath(lumi)} className="inline-link">
                    Explore LumiSense <span aria-hidden="true">↗</span>
                  </a>
                  <a href={lumi.repository} className="subtle-link">
                    GitHub source <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            </div>
          </article>
          <div className="recordings-heading">
            <span className="eyebrow">FROM THE ACTUAL BUILDS</span>
            <p>Press play. See the rough edges, too.</p>
          </div>
          <div className="recorded-projects">
            {[melody, style].map((project, i) => (
              <article
                className={`recorded-project recorded-${project.slug}`}
                key={project.slug}
              >
                <div className="recording-top">
                  <span>
                    0{i + 2} / {i === 0 ? "SOUND" : "LANGUAGE"}
                  </span>
                  <span>{i === 0 ? "01:51" : "00:23"} / SILENT DEMO</span>
                </div>
                <ProjectMedia project={project} />
                <div className="recording-caption">
                  <span className="eyebrow">{project.category}</span>
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                  <details className="build-notes">
                    <summary>Decisions behind the interface</summary>
                    <dl>
                      {project.decisions.slice(0, 2).map(([title, detail]) => (
                        <div key={title}>
                          <dt>{title}</dt>
                          <dd>{detail}</dd>
                        </div>
                      ))}
                    </dl>
                    <p>{project.next}</p>
                  </details>
                  <div className="project-links">
                    <a className="inline-link" href={projectPath(project)}>
                      Explore {project.title} <span aria-hidden="true">↗</span>
                    </a>
                    <a className="subtle-link" href={project.repository}>
                      Source <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <Workbench />
          <a
            href="https://github.com/Adon-Paul/NitroMax"
            className="archive-link"
          >
            <span>LINUX / WORK IN PROGRESS</span>
            <span>
              NitroMax — Acer laptop controls with Avalonia, C# and Python,
              powered by Linuwu Sense
            </span>
            <span aria-hidden="true">↗</span>
          </a>
          <a href="/work/luxecart/" className="archive-link">
            <span>FROM THE ARCHIVE</span>
            <span>LuxeCart — an early Flutter learning project</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <section id="field-notes" className="field-section wrap">
        <div className="section-label">
          <span>02 / THE OTHER SIDE OF BUILDING</span>
          <span>CURRENT STUDY / CYBERSECURITY</span>
        </div>
        <div className="field-intro">
          <h2>
            To build better,
            <br />
            <em>look closer.</em>
          </h2>
          <p>
            I’m studying cybersecurity through Linux practice and deliberately
            vulnerable labs. The useful part is tracing a failure back to a
            decision—and understanding how to fix it.
          </p>
        </div>
        <article className="field-note">
          <div className="field-note-heading">
            <span className="eyebrow">
              FIELD NOTE 001 / AUTHORISED TRAINING LAB
            </span>
            <h3>
              One small permission.
              <br />A much bigger consequence.
            </h3>
            <p>Sunset · VulnHub · local VirtualBox environment</p>
          </div>
          <ol className="attack-path">
            <li>
              <span>01 / EXPOSURE</span>
              <strong>Anonymous FTP</strong>
              <p>A readable backup exposed credentials.</p>
            </li>
            <li>
              <span>02 / ACCESS</span>
              <strong>SSH session</strong>
              <p>Weak credentials became a foothold.</p>
            </li>
            <li>
              <span>03 / PRIVILEGE</span>
              <strong>Over-permissive sudo</strong>
              <p>An allowed editor became a path to root.</p>
            </li>
          </ol>
          <details className="field-details">
            <summary>
              <span>What I took away</span>
              <span className="disclosure-icon" aria-hidden="true" />
            </summary>
            <div>
              <p>
                The exploit chain crossed three boundaries: publicly readable
                files, account access and privileged command execution. Each
                step depended on a configuration decision.
              </p>
              <ul>
                <li>
                  Remove sensitive backups from publicly accessible services.
                </li>
                <li>Use unique credentials and restrict remote access.</li>
                <li>
                  Review sudo rules by what a tool can do, including launching
                  subprocesses.
                </li>
              </ul>
              <p>
                This is a learning write-up from an intentionally vulnerable
                machine. Credentials and lab identifiers are omitted.
              </p>
            </div>
          </details>
        </article>
        <div className="study-strip">
          <span className="eyebrow">CURRENTLY EXPLORING</span>
          <p>
            Linux permissions <span>/</span> Network enumeration <span>/</span>{" "}
            Privilege boundaries
          </p>
        </div>
      </section>

      <section id="about" className="about-section">
        <div className="wrap">
          <div className="section-label">
            <span>03 / THE PERSON BEHIND IT</span>
            <span>MORE THAN A STACK</span>
          </div>
          <div className="about-grid">
            <h2>
              A builder’s hands.
              <br />
              <em>
                A beginner’s
                <br />
                curiosity.
              </em>
            </h2>
            <div className="about-copy">
              <p className="large-copy">
                I like the moment a system starts to make sense.
              </p>
              <p>
                A queue that stays in sync. A camera frame that becomes speech.
                A Linux permission that explains an entire attack path. That’s
                the thread running through my work.
              </p>
              <p>
                I’m Adon, a developer from Kerala, India. My work spans Flutter
                applications and Python experiments; my current studies take me
                deeper into cybersecurity.
              </p>
              <p>
                I use AI as part of my building process. The decisions,
                verification and responsibility for what I ship stay with me.
              </p>
              <dl className="about-facts">
                <div>
                  <dt>TOOLS I REACH FOR</dt>
                  <dd>Flutter / Dart / Python / Git / Linux</dd>
                </div>
                <div>
                  <dt>COMMUNITY EXPERIENCE</dt>
                  <dd>
                    Cybersecurity IG Lead · µLearn
                    <br />
                    Finance Chair · IEEE student branch
                  </dd>
                </div>
                <div>
                  <dt>LOOKING FOR</dt>
                  <dd>
                    A development role with room to build, question and keep
                    learning.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          <Credentials />
        </div>
      </section>
    </>
  );
}
