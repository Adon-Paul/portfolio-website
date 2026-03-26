import { useRef } from 'react'
import ShootingStars from './ShootingStars'
import CardSwap, { Card } from './CardSwap'
import AutoVariableProximity from './AutoVariableProximity'

export default function ProjectsPage({ theme, reduceMotion, showShootingStars = true }) {
    const year = new Date().getFullYear()
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
                                        <h2>How I Build</h2>
                                        <p>
                                            Every project starts with a real problem. I architect for production from day one
                                            — proper state management, secure auth flows, and edge-case handling. No tutorials,
                                            no toy demos.
                                        </p>
                                        <p>
                                            My stack centers on <strong>Flutter + Dart</strong> for mobile, with
                                            <strong> Supabase</strong> and <strong>Firebase</strong> on the backend.
                                            For AI work, I reach for <strong>Python</strong> with local LLM integration.
                                        </p>
                                        <div className="links">
                                            <a
                                                href="https://github.com/Adon-Paul?tab=repositories"
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                Browse all repositories →
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
                                                    <h3>Melody Music Player</h3>
                                                    <div className="projects-card__media" aria-label="Melody Music Player demo video">
                                                        <video
                                                            src={`${import.meta.env.BASE_URL}videos/melody music player.mp4`}
                                                            autoPlay
                                                            muted
                                                            loop
                                                            playsInline
                                                            preload="metadata"
                                                        />
                                                    </div>
                                                </Card>
                                                <Card className="projects-card">
                                                    <h3>E-Commerce Platform</h3>
                                                    <div className="projects-card__description">
                                                        <p>Full-stack Flutter marketplace with Razorpay payments, Google OAuth, and real-time Supabase sync.</p>
                                                        <div className="projects-card__tags">
                                                            <span className="tag">Flutter</span>
                                                            <span className="tag">Supabase</span>
                                                            <span className="tag">Razorpay</span>
                                                        </div>
                                                    </div>
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
