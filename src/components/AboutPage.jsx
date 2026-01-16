import { useRef, useState } from 'react'
import ShootingStars from './ShootingStars'
import Lanyard from './Lanyard'
import AutoVariableProximity from './AutoVariableProximity'

export default function AboutPage({ theme, reduceMotion, showShootingStars = true }) {
    const [year] = useState(new Date().getFullYear())
    const containerRef = useRef(null)

    return (
        <>
            {theme === 'dark' && !reduceMotion && showShootingStars && <ShootingStars />}

            <div ref={containerRef}>
                <AutoVariableProximity containerRef={containerRef} enabled={!reduceMotion}>
                    <main className="about-page">
                        {!reduceMotion && (
                            <aside className="about-lanyard-float" aria-hidden="true">
                                <Lanyard cameraDistance={9} fov={30} />
                            </aside>
                        )}

                        <div className="content-container about-content">
                            {/* Hero Header */}
                            <header className="about-hero glass-panel">
                                <p className="about-tagline">Mobile Developer. Security-Conscious. Currently Shipping.</p>
                                <h1>The <span className="highlight">"About Me"</span></h1>
                                <p className="about-manifesto">
                                    I don't just write code—I <strong>ship products</strong> that people can actually use.
                                </p>
                            </header>

                            {/* Bio Section */}
                            <section className="about-section glass-panel">
                                <p>
                                    I'm <strong>Adon Paul Tomy</strong>, a final-year Computer Science student at
                                    <strong> VISAT Engineering College</strong> with a focus that has always been clear:
                                    <em> build first, theorize later</em>.
                                </p>
                                <p>
                                    While many students optimize for perfect GPAs, I spent my time optimizing payment flows,
                                    debugging state management race conditions, and figuring out how to make Razorpay webhooks
                                    actually work in production.
                                </p>
                                <blockquote className="about-quote">
                                    I believe the best way to learn isn't by reading documentation; it's by building
                                    something complex enough to break, and then fixing it.
                                </blockquote>
                            </section>

                            {/* What I've Built */}
                            <section className="about-section glass-panel">
                                <h2>What I've Built</h2>
                                <p className="lead">
                                    My GitHub isn't a graveyard of "Hello World" tutorials. It is a collection of
                                    <strong> production-ready applications</strong>.
                                </p>

                                <div className="about-projects-grid">
                                    <article className="about-project-card">
                                        <h3>E-Commerce Platform</h3>
                                        <span className="about-project-stack">Flutter + Supabase</span>
                                        <p>
                                            A full-stack mobile marketplace. This isn't a demo; it features Google OAuth
                                            authentication, a PostgreSQL backend for inventory management, and secure
                                            Razorpay payment integration. It handles real-time data sync and is
                                            architected to scale.
                                        </p>
                                    </article>

                                    <article className="about-project-card">
                                        <h3>Melody Music Player</h3>
                                        <span className="about-project-stack">Flutter</span>
                                        <p>
                                            A local audio player with Spotify API integration. I built this to master
                                            advanced state management and seamless third-party library integration.
                                            It prioritizes performance on low-end devices, ensuring a smooth UX
                                            regardless of hardware.
                                        </p>
                                    </article>

                                    <article className="about-project-card">
                                        <h3>Style Transfer AI</h3>
                                        <span className="about-project-stack">Python</span>
                                        <p>
                                            A deep stylometry analysis system that earned state-level qualification in a
                                            Karnataka buildathon. It features local LLM integration (Ollama) and a custom
                                            GUI. The challenge wasn't just the NLP—it was making 25-point linguistic
                                            analysis run efficiently on standard consumer hardware.
                                        </p>
                                    </article>
                                </div>
                            </section>

                            {/* Security */}
                            <section className="about-section glass-panel">
                                <h2>Why Security Matters to Me</h2>
                                <p>
                                    I came to mobile development through an unconventional route: <strong>Cybersecurity</strong>.
                                </p>
                                <p>
                                    I have completed formal coursework in network reconnaissance and ethical hacking
                                    (Nmap, Wireshark, Metasploit), which fundamentally changed how I write code. When I
                                    architect an authentication flow, I'm not just thinking about the user experience—I'm
                                    thinking about session hijacking, token refresh vulnerabilities, and OAuth implementation flaws.
                                </p>
                                <p>
                                    This isn't theoretical. I've practiced penetration testing on Hack The Box VMs. I know
                                    what attackers look for. So when I build a feature, I am paranoid about the right things:
                                    <strong> input validation, webhook signature verification, and secure data storage</strong>.
                                </p>
                            </section>

                            {/* The Reality */}
                            <section className="about-section glass-panel about-reality">
                                <h2>The Reality of My Path</h2>
                                <p>
                                    I'm graduating in 2026, but I'll be honest: my academic record doesn't reflect my
                                    technical ability.
                                </p>
                                <p>
                                    I prioritized building real-world software over optimizing for exam scores. That was a
                                    choice, and in some ways, a mistake I am owning. But here is what my transcript
                                    <em> won't </em> show you:
                                </p>
                                <ul className="about-bullets">
                                    <li>I have built and maintained complex applications from scratch.</li>
                                    <li>I have integrated third-party APIs that have terrible documentation and made them work anyway.</li>
                                    <li>I have debugged issues in production-ready code at 2 AM.</li>
                                    <li>I have learned <strong>how to learn</strong>, which matters infinitely more than what I memorized for a test.</li>
                                </ul>
                            </section>

                            {/* What I'm Looking For */}
                            <section className="about-section glass-panel">
                                <h2>What I'm Looking For</h2>
                                <p className="lead">
                                    I am not looking for a company that cares about my CGPA. I am looking for a team
                                    that cares about <strong>what I can build</strong>.
                                </p>
                                <p>I want to work with a team that:</p>
                                <ul className="about-bullets">
                                    <li>Values <strong>shipping over perfection</strong>.</li>
                                    <li>Understands that builders learn differently than test-takers.</li>
                                    <li>Gives me real problems to solve, not tutorials to complete.</li>
                                    <li>Has senior engineers I can learn from—because I know I don't know everything yet.</li>
                                </ul>
                                <p>
                                    I am most interested in <strong>mobile-first products</strong>, security-conscious
                                    engineering teams, and companies building in <strong>Flutter</strong> or working
                                    with <strong>Edge AI</strong>.
                                </p>
                            </section>

                            {/* CTA */}
                            <section className="about-cta glass-panel">
                                <h2>Let's Build Something.</h2>
                                <p>
                                    If you are looking for someone with a perfect academic record, I am not your person.
                                </p>
                                <p>
                                    But if you are looking for someone who can take a feature from concept to deployment,
                                    who writes security-conscious code by default, and who has proven they can
                                    ship—<strong>let's talk</strong>.
                                </p>
                                <div className="about-links">
                                    <a
                                        href="https://github.com/Adon-Paul"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="about-link-primary"
                                    >
                                        View My GitHub
                                    </a>
                                    <a
                                        href="mailto:adonpaul@example.com"
                                        className="about-link-secondary"
                                    >
                                        Email Me
                                    </a>
                                    <a
                                        href="https://linkedin.com/in/adon-paul"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="about-link-secondary"
                                    >
                                        LinkedIn
                                    </a>
                                </div>
                            </section>
                        </div>
                    </main>

                    <footer className="page-footer">© {year} Adon Paul</footer>
                </AutoVariableProximity>
            </div>
        </>
    )
}
