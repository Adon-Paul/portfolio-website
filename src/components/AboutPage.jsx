import { useRef } from 'react'
import ShootingStars from './ShootingStars'
import Lanyard from './Lanyard'
import AutoVariableProximity from './AutoVariableProximity'
import LogoLoop from './LogoLoop'

const TECH_LOGOS = [
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg', alt: 'Flutter' },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg', alt: 'Dart' },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', alt: 'React' },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg', alt: 'Firebase' },
    { src: 'https://cdn.simpleicons.org/supabase/3ECF8E', alt: 'Supabase' },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg', alt: 'GCP' },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', alt: 'PostgreSQL' },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', alt: 'Python' },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg', alt: 'Java' },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg', alt: 'Kotlin' },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg', alt: 'C++' },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', alt: 'JavaScript' },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg', alt: 'Android' },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', alt: 'Docker' },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg', alt: 'Postman' },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg', alt: 'VS Code' },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', alt: 'Git' },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg', alt: 'Linux' },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg', alt: 'Figma' },
]

export default function AboutPage({ theme, reduceMotion, showShootingStars = true }) {
    const year = new Date().getFullYear()
    const containerRef = useRef(null)

    return (
        <>
            {theme === 'dark' && !reduceMotion && showShootingStars && <ShootingStars />}

            <div ref={containerRef}>
                <AutoVariableProximity containerRef={containerRef} enabled={!reduceMotion}>
                    <main className="about-page">
                        <div className="about-split-layout">

                            {/* ── Lanyard — UNTOUCHED ── */}
                            {!reduceMotion && (
                                <aside className="about-lanyard-side" aria-hidden="true">
                                    <div className="about-lanyard-sticky">
                                        <Lanyard cameraDistance={9} fov={30} />
                                    </div>
                                </aside>
                            )}

                            {/* ── Bento Grid ── */}
                            <div className="about-content-side">
                                <div className="about-bento">

                                    {/* [1] Hero — 4 cols */}
                                    <header className="bento-cell bento-hero about-hero">
                                        <div className="about-hero-meta">
                                            <span className="about-status-dot" aria-hidden="true" />
                                            <p className="about-tagline">Mobile Dev · Security-Conscious · Currently Shipping</p>
                                        </div>
                                        <h1>The <span className="highlight">"About Me"</span></h1>
                                        <p className="about-manifesto">
                                            I don't just write code—I <strong>ship products</strong> that people can actually use.
                                        </p>
                                    </header>

                                    {/* [2] Stats — 2 cols */}
                                    <div className="bento-cell bento-stats" aria-label="Key stats">
                                        <div className="bento-stat">
                                            <span className="bento-stat-num">3+</span>
                                            <span className="bento-stat-label">Production Apps</span>
                                        </div>
                                        <div className="bento-stat-sep" aria-hidden="true" />
                                        <div className="bento-stat">
                                            <span className="bento-stat-num">SIH</span>
                                            <span className="bento-stat-label">2025 Winner</span>
                                        </div>
                                        <div className="bento-stat-sep" aria-hidden="true" />
                                        <div className="bento-stat">
                                            <span className="bento-stat-num">370+</span>
                                            <span className="bento-stat-label">PyPI Downloads</span>
                                        </div>
                                    </div>

                                    {/* [3] Bio — 3 cols */}
                                    <div className="bento-cell bento-bio">
                                        <p>
                                            I'm <strong>Adon Paul Tomy</strong>, a final-year CS student at{' '}
                                            <strong>VISAT Engineering College</strong>. My focus has always been clear:{' '}
                                            <em>build first, theorize later</em>.
                                        </p>
                                        <p>
                                            Beyond shipping code, I led the campus cybersecurity community as{' '}
                                            <strong>MuLearn Cybersecurity IG Lead</strong>, mentoring students in ethical
                                            hacking and Kali Linux — and served as <strong>IEEE Finance Chair</strong>.
                                        </p>
                                    </div>

                                    {/* [4] Quote — 3 cols */}
                                    <div className="bento-cell bento-quote">
                                        <span className="bento-quote-mark" aria-hidden="true">"</span>
                                        <blockquote>
                                            The best way to learn isn't by reading documentation; it's by building
                                            something complex enough to break, and then fixing it.
                                        </blockquote>
                                    </div>

                                    {/* [5] Terminal — 6 cols */}
                                    <div className="bento-cell bento-terminal" aria-label="Security toolkit">
                                        <div className="terminal-bar">
                                            <span className="t-dot t-red" />
                                            <span className="t-dot t-yellow" />
                                            <span className="t-dot t-green" />
                                            <span className="terminal-title">security-toolkit.sh</span>
                                            <span className="bento-terminal-note">
                                                MuLearn Cybersecurity IG Lead · Kali Linux instructor · HTB practitioner
                                            </span>
                                        </div>
                                        <div className="terminal-body">
                                            <div className="terminal-line">
                                                <span className="t-prompt">~$</span> nmap --script vuln &lt;target&gt;
                                            </div>
                                            <div className="terminal-line">
                                                <span className="t-prompt">~$</span> wireshark -i eth0 -f "tcp port 443"
                                            </div>
                                            <div className="terminal-line">
                                                <span className="t-prompt">~$</span> msfconsole -q -x "use exploit/..."
                                            </div>
                                            <div className="terminal-line t-comment">
                                                # Mentored 20+ students · vulnerability assessment · ethical hacking workshops
                                            </div>
                                        </div>
                                    </div>

                                    {/* [6] Skills — 3 cols */}
                                    <div className="bento-cell bento-skills">
                                        <h2 className="bento-cell-heading">Tech Stack</h2>
                                        <div className="bento-skills-groups">
                                            <div className="skills-group">
                                                <span className="skills-group-label">Mobile</span>
                                                <div className="skills-tags">
                                                    <span className="skill-tag skill-tag--primary">Flutter</span>
                                                    <span className="skill-tag skill-tag--primary">Dart</span>
                                                </div>
                                            </div>
                                            <div className="skills-group">
                                                <span className="skills-group-label">Backend &amp; Cloud</span>
                                                <div className="skills-tags">
                                                    <span className="skill-tag">Supabase</span>
                                                    <span className="skill-tag">Firebase</span>
                                                    <span className="skill-tag">GCP</span>
                                                    <span className="skill-tag">PostgreSQL</span>
                                                </div>
                                            </div>
                                            <div className="skills-group">
                                                <span className="skills-group-label">Languages</span>
                                                <div className="skills-tags">
                                                    <span className="skill-tag">Python</span>
                                                    <span className="skill-tag">Java</span>
                                                    <span className="skill-tag">C++</span>
                                                    <span className="skill-tag">JavaScript</span>
                                                </div>
                                            </div>
                                            <div className="skills-group">
                                                <span className="skills-group-label">Tools &amp; Infra</span>
                                                <div className="skills-tags">
                                                    <span className="skill-tag">Git</span>
                                                    <span className="skill-tag">Linux</span>
                                                    <span className="skill-tag">REST APIs</span>
                                                    <span className="skill-tag">Figma</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bento-logoloop-wrapper">
                                            <LogoLoop
                                                logos={TECH_LOGOS}
                                                speed={60}
                                                logoHeight={28}
                                                gap={32}
                                                pauseOnHover
                                                scaleOnHover
                                                fadeOut
                                                reduceMotion={reduceMotion}
                                                renderItem={(item) => (
                                                    <>
                                                        <img
                                                            src={item.src}
                                                            alt={item.alt}
                                                            title={item.alt}
                                                            loading="lazy"
                                                            decoding="async"
                                                            draggable={false}
                                                        />
                                                        <span className="logoloop__item-label">{item.alt}</span>
                                                    </>
                                                )}
                                                ariaLabel="Tech stack logos"
                                            />
                                        </div>
                                    </div>

                                    {/* [7] Achievements — 3 cols */}
                                    <div className="bento-cell bento-achievements">
                                        <h2 className="bento-cell-heading">Achievements</h2>
                                        <ul className="achievement-list">
                                            <li className="achievement-item achievement-item--gold">
                                                <span className="achievement-dot" aria-hidden="true" />
                                                <div>
                                                    <strong>SIH Internal Round Winner</strong>
                                                    <span className="achievement-meta">Smart India Hackathon · 2025</span>
                                                </div>
                                            </li>
                                            <li className="achievement-item achievement-item--cyan">
                                                <span className="achievement-dot" aria-hidden="true" />
                                                <div>
                                                    <strong>Gen AI Buildathon</strong>
                                                    <span className="achievement-meta">State Level Qualifier · OpenAI Academy, Bangalore</span>
                                                </div>
                                            </li>
                                            <li className="achievement-item achievement-item--purple">
                                                <span className="achievement-dot" aria-hidden="true" />
                                                <div>
                                                    <strong>Flutter Intern · WeCodeLife</strong>
                                                    <span className="achievement-meta">Industry internship · 2023</span>
                                                </div>
                                            </li>
                                            <li className="achievement-item achievement-item--warm">
                                                <span className="achievement-dot" aria-hidden="true" />
                                                <div>
                                                    <strong>NASA Space Apps Challenge</strong>
                                                    <span className="achievement-meta">Volunteer &amp; 2025 Participant</span>
                                                </div>
                                            </li>
                                            <li className="achievement-item achievement-item--green">
                                                <span className="achievement-dot" aria-hidden="true" />
                                                <div>
                                                    <strong>5+ Open Source Repos</strong>
                                                    <span className="achievement-meta">Hacktoberfest 2025 · active maintainer</span>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* [8–10] Project cells — 2 cols each */}
                                    <article className="bento-cell bento-project bento-project--cyan">
                                        <div className="bento-project-preview" aria-hidden="true" />
                                        <div className="bento-project-body">
                                            <h3>E-Commerce Platform</h3>
                                            <span className="about-project-stack">Flutter + Supabase</span>
                                            <p>Google OAuth, PostgreSQL inventory, Razorpay payments. Cross-platform, optimized for low-end devices.</p>
                                        </div>
                                    </article>

                                    <article className="bento-cell bento-project bento-project--purple">
                                        <div className="bento-project-preview" aria-hidden="true" />
                                        <div className="bento-project-body">
                                            <h3>Melody Music Player</h3>
                                            <span className="about-project-stack">Flutter + Firebase</span>
                                            <p>High-res audio, Spotify API, Firebase auth. Built to master advanced state management.</p>
                                        </div>
                                    </article>

                                    <article className="bento-cell bento-project bento-project--warm">
                                        <div className="bento-project-preview" aria-hidden="true" />
                                        <div className="bento-project-body">
                                            <h3>Style Transfer AI</h3>
                                            <span className="about-project-stack">Python · PyPI</span>
                                            <p>Stylometry CLI — <strong>370+ downloads</strong> on PyPI. State-level Karnataka buildathon qualifier.</p>
                                        </div>
                                    </article>

                                    {/* [11] Reality — 3 cols */}
                                    <div className="bento-cell bento-reality">
                                        <h2 className="bento-cell-heading">The Reality</h2>
                                        <p>Graduating 2026. My transcript won't show:</p>
                                        <ul className="about-bullets about-bullets--checked">
                                            <li>Production apps built and shipped from scratch</li>
                                            <li>Led a campus-wide cybersecurity community</li>
                                            <li>Interned in Flutter at a real company</li>
                                            <li>Learned <strong>how to learn</strong> — not how to pass tests</li>
                                        </ul>
                                    </div>

                                    {/* [12] CTA — 3 cols */}
                                    <div className="bento-cell bento-cta">
                                        <h2 className="bento-cta-heading">Let's Build Something.</h2>
                                        <p>Looking for a team that values <strong>shipping over perfection</strong>. Flutter, mobile-first, security-aware.</p>
                                        <div className="about-interest-tags">
                                            <span className="interest-tag">Flutter</span>
                                            <span className="interest-tag">Mobile-First</span>
                                            <span className="interest-tag">Edge AI</span>
                                            <span className="interest-tag">Security</span>
                                        </div>
                                        <div className="about-links">
                                            <a
                                                href="mailto:adonpaultomy@gmail.com"
                                                className="about-link-primary"
                                            >
                                                Email Me
                                            </a>
                                            <a
                                                href="https://github.com/Adon-Paul"
                                                target="_blank"
                                                rel="noreferrer"
                                                className="about-link-secondary"
                                            >
                                                GitHub
                                            </a>
                                            <a
                                                href="https://linkedin.com/in/adon-paul-tomy"
                                                target="_blank"
                                                rel="noreferrer"
                                                className="about-link-secondary"
                                            >
                                                LinkedIn
                                            </a>
                                        </div>
                                    </div>

                                </div>
                                <footer className="page-footer">© {year} Adon Paul Tomy · adonpaultomy@gmail.com</footer>
                            </div>
                        </div>
                    </main>
                </AutoVariableProximity>
            </div>
        </>
    )
}
