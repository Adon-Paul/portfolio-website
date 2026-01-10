import { useRef, useState } from 'react'
import ShootingStars from './ShootingStars'
import CardSwap, { Card } from './CardSwap'
import AutoVariableProximity from './AutoVariableProximity'

export default function ProjectsPage({ theme, reduceMotion }) {
    const [year] = useState(new Date().getFullYear())
    const containerRef = useRef(null)

    return (
        <>
            {theme === 'dark' && !reduceMotion && <ShootingStars />}

            <div ref={containerRef}>
                <AutoVariableProximity containerRef={containerRef} enabled={!reduceMotion}>
                    <main className="projects-page">
                        <div className="content-container">
                            <div className="projects-split">
                                <div className="projects-main">
                                    <div className="page-header glass-panel">
                                        <h1>Projects</h1>
                                        <p className="lead">Case studies and builds — more coming soon.</p>
                                    </div>

                            <div className="glass-panel page-section">
                                <h2>Style Transfer AI:  Stylommetric Analyser (v1.1.0)  </h2>
                                <p className="lead">A privacy-first analysis engine that treats writing style like a biometric fingerprint.</p>

                                <h3>The Concept</h3>
                                <p>
                                    In an era where data privacy is scarce, I built a system that bridges the gap between advanced AI analysis and
                                    local security. Style Transfer AI breaks down text into 25 distinct point linguistic metrics ranging —from “Rhetorical
                                    Weaponry” to “Cognitive Patterns”—to create a unique stylometric fingerprint profile of any writer.
                                </p>
                                <p>
                                    Crucially, it is architecture-agnostic: users can choose between the raw power of Cloud APIs (OpenAI/Gemini)
                                    or complete, offline privacy using Local LLMs (Ollama).
                                    This Project Won a State Level Qualification In Karnataka in a buildathon hosted by openAI Academy and NXTWave in S-VYASA University Bangalore.
                                    (Certificate Available in github repository)
                                </p>

                                <h3>Key Innovations</h3>
                                <ul className="projects-bullets">
                                    <li>
                                        <strong>Privacy-First Architecture:</strong> Orchestrated a hybrid pipeline that allows users to switch
                                        instant “Air-Gapped” mode, running complex inference locally without data ever leaving the machine.
                                    </li>
                                    <li>
                                        <strong>The “One-Line” Experience:</strong> Engineered a custom PowerShell automation script that installs
                                        the package, manages dependencies, and configures system PATH variables in a single command.
                                    </li>
                                    <li>
                                        <strong>Dual Interface Design:</strong> Built for both power users and casuals—featuring a scriptable CLI
                                        for automation pipelines and a modern, threaded Desktop GUI (CustomTkinter) for visual analysis.
                                    </li>
                                </ul>

                                <h3>Engineering Spotlight: The Distribution Challenge</h3>
                                <p>
                                    The hardest part wasn’t the AI; it was the delivery. To prove this was production-ready software, I published
                                    it to PyPI. and Got around 372 total downloads in the first 3 months. I also wrote a self-healing installation script that detects the user’s environment and handles the
                                    setup automatically, reducing the deployment time from 10 minutes to 10 seconds.
                                </p>

                                <p className="projects-meta">
                                    <strong>Tech Stack:</strong> Python 3.13 • Ollama (Local Inference) • CustomTkinter • REST APIs • PowerShell
                                    Automation • PyPI Packaging
                                </p>
                            </div>

                            <div className="glass-panel page-section">
                                <h2>What you’ll find here</h2>
                                <p>
                                    I’m currently curating write-ups, screenshots, and technical breakdowns for my best work.
                                    For now, you can browse my repositories on GitHub.
                                </p>
                                <div className="links">
                                    <a
                                        href="https://github.com/Adon-Paul?tab=repositories"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        View repositories →
                                    </a>
                                </div>
                            </div>
                        </div>

                        <aside className="projects-cards" aria-label="Featured projects preview">
                            <div className="projects-cards__header">
                                <h2>Featured</h2>
                                <p className="lead">Preview stack</p>
                            </div>

                            <div className="projects-cards__stage">
                                <div className="projects-cards__swap">
                                    <CardSwap
                                        width={700}
                                        height={480}
                                        cardDistance={52}
                                        verticalDistance={96}
                                        delay={3000}
                                        skewAmount={12}
                                        pauseOnHover
                                        easing="elastic"
                                    >
                                        <Card className="projects-card">
                                            <h3>style-transfer-ai</h3>
                                            <div className="projects-card__media" aria-label="style-transfer-ai demo video">
                                                <video
                                                    src="/videos/style-transfer-ai.mp4"
                                                    autoPlay
                                                    muted
                                                    loop
                                                    playsInline
                                                    preload="metadata"
                                                />
                                            </div>
                                        </Card>
                                        <Card className="projects-card">
                                            <h3>Card 2</h3>
                                        </Card>
                                        <Card className="projects-card">
                                            <h3>Card 3</h3>
                                        </Card>
                                        <Card className="projects-card">
                                            <h3>Card 4</h3>
                                        </Card>
                                    </CardSwap>
                                </div>
                            </div>
                                </aside>
                            </div>
                        </div>
                    </main>

                    <footer className="page-footer">© {year} Adon Paul</footer>
                </AutoVariableProximity>
            </div>
        </>
    )
}
