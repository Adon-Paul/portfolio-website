import { useRef, useState } from 'react'
import ShootingStars from './ShootingStars'
import CardSwap, { Card } from './CardSwap'
import AutoVariableProximity from './AutoVariableProximity'

export default function ProjectsPage({ theme, reduceMotion, showShootingStars = true }) {
    const year = new Date().getFullYear()
    const containerRef = useRef(null)
    const [expandedPreview, setExpandedPreview] = useState(false)

    const projects = [
        {
            title: 'style-transfer-ai',
            video: `${import.meta.env.BASE_URL}videos/style-transfer-ai.mp4`,
            videoLabel: 'style-transfer-ai demo video',
        },
        {
            title: 'Melody Music Player',
            video: `${import.meta.env.BASE_URL}videos/melody music player.mp4`,
            videoLabel: 'Melody Music Player demo video',
        },
        {
            title: 'E-Commerce Platform',
            description: 'Full-stack Flutter marketplace with Razorpay payments, Google OAuth, and real-time Supabase sync.',
            tags: ['Flutter', 'Supabase', 'Razorpay'],
        },
    ]

    const openExpandedPreview = () => setExpandedPreview(true)
    const closeExpandedPreview = () => setExpandedPreview(false)

    const handleStageKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            openExpandedPreview()
        }
    }

    const renderProjectBody = (project) => {
        if (project.video) {
            return (
                <div className="projects-card__media" aria-label={project.videoLabel}>
                    <video
                        src={project.video}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                    />
                </div>
            )
        }

        return (
            <div className="projects-card__description">
                <p>{project.description}</p>
                <div className="projects-card__tags">
                    {project.tags.map((tag) => (
                        <span key={tag} className="tag">{tag}</span>
                    ))}
                </div>
            </div>
        )
    }

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
                                    </div>

                                    {!expandedPreview ? (
                                        <>
                                            <div
                                                className="projects-cards__stage projects-cards__stage--interactive"
                                                role="button"
                                                tabIndex={0}
                                                aria-label="Open separate project previews"
                                                onClick={openExpandedPreview}
                                                onKeyDown={handleStageKeyDown}
                                            >
                                                <div className="projects-cards__swap">
                                                    <CardSwap
                                                        width={620}
                                                        height={420}
                                                        cardDistance={42}
                                                        verticalDistance={78}
                                                        delay={3000}
                                                        skewAmount={12}
                                                        pauseOnHover
                                                        easing="elastic"
                                                    >
                                                        {projects.map((project) => (
                                                            <Card key={project.title} className="projects-card">
                                                                <h3>{project.title}</h3>
                                                                {renderProjectBody(project)}
                                                            </Card>
                                                        ))}
                                                    </CardSwap>
                                                </div>
                                            </div>
                                            <p className="projects-cards__hint">Click preview to expand all projects</p>
                                        </>
                                    ) : (
                                        <>
                                            <div className="projects-cards__expanded" aria-label="Expanded project previews">
                                                {projects.map((project) => (
                                                    <article key={project.title} className="projects-card projects-card--expanded">
                                                        <h3>{project.title}</h3>
                                                        {renderProjectBody(project)}
                                                    </article>
                                                ))}
                                            </div>
                                            <button
                                                type="button"
                                                className="projects-preview-toggle"
                                                onClick={closeExpandedPreview}
                                            >
                                                Back to rolling preview
                                            </button>
                                        </>
                                    )}
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
