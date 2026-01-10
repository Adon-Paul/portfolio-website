import { useRef, useState } from 'react'
import ShootingStars from './ShootingStars'
import AutoVariableProximity from './AutoVariableProximity'

export default function InterestingPage({ theme, reduceMotion }) {
    const [year] = useState(new Date().getFullYear())
    const containerRef = useRef(null)

    return (
        <>
            {theme === 'dark' && !reduceMotion && <ShootingStars />}

            <div ref={containerRef}>
                <AutoVariableProximity containerRef={containerRef} enabled={!reduceMotion}>
                    <main className="interesting-page">
                        <div className="content-container">
                            <div className="page-header glass-panel">
                                <h1>Interesting Stuff</h1>
                                <p className="lead">Experiments, notes, and small builds — coming soon.</p>
                            </div>

                    <div className="glass-panel page-section">
                        <h2>In progress</h2>
                        <p>
                            This section will include quick demos, learning notes, and visual experiments.
                            Until then, the latest updates will be on GitHub.
                        </p>
                        <div className="links">
                            <a
                                href="https://github.com/Adon-Paul"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Visit my GitHub →
                            </a>
                        </div>
                    </div>
                        </div>
                    </main>

                    <footer className="page-footer">© {year} Adon Paul</footer>
                </AutoVariableProximity>
            </div>
        </>
    )
}
