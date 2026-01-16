import { useRef, useState } from 'react'
import ShootingStars from './ShootingStars'
import CardSwap, { Card } from './CardSwap'
import AutoVariableProximity from './AutoVariableProximity'

export default function ProjectsPage({ theme, reduceMotion, showShootingStars = true }) {
    const [year] = useState(new Date().getFullYear())
    const containerRef = useRef(null)

    return (
        <>
            {theme === 'dark' && !reduceMotion && showShootingStars && <ShootingStars />}

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
                                        <h2>What you'll find here</h2>
                                        <p>
                                            I'm currently curating write-ups, screenshots, and technical breakdowns for my best work.
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
                                                            src={`${import.meta.env.BASE_URL}videos/style-transfer-ai.mp4`}
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
