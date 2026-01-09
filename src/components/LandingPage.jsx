import { useState } from 'react'
import ShootingStars from './ShootingStars'

function LandingPage({ theme, reduceMotion }) {
    const [year] = useState(new Date().getFullYear())

    return (
        <>
            {/* Shooting Stars (dark mode only) */}
            {theme === 'dark' && !reduceMotion && <ShootingStars />}

            <main>
                <div className="coming-grid">
                    <div className="left">
                        <div className="photo-wrap">
                            <img
                                className="profile-photo"
                                id="heroPhoto"
                                src="/images/profile/WEWSITEDARK.png"
                                alt="Portrait of Adon Paul Tomy"
                                loading="lazy"
                                decoding="async"
                            />
                        </div>
                    </div>

                    <div className="right content-card">
                        <h1 id="mainHeading" data-text="ADON PAUL TOMY">Adon Paul Tomy</h1>
                        <div className="subtitle">Flutter Developer | Computer Science Student</div>
                        <p>Website is currently under development.</p>
                        <p>In the meantime, you can find me on:</p>

                        <div className="links">
                            <a href="https://linkedin.com/in/adon-paul-tomy" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V24h-4V8.5zM8.5 8.5h3.8v2.1h.05c.53-1 1.83-2.1 3.77-2.1 4.03 0 4.78 2.65 4.78 6.1V24h-4v-7.1c0-1.7-.03-3.9-2.38-3.9-2.38 0-2.75 1.86-2.75 3.77V24h-4V8.5z" />
                                </svg>
                                <span>LinkedIn</span>
                            </a>
                            <a href="https://github.com/Adon-Paul" target="_blank" rel="noreferrer" aria-label="GitHub">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    <path d="M12 .5C5.73.5.98 5.24.98 11.5c0 4.85 3.14 8.96 7.49 10.41.55.1.75-.24.75-.53 0-.26-.01-1.11-.02-2.01-3.05.66-3.7-1.3-3.7-1.3-.5-1.26-1.22-1.6-1.22-1.6-.99-.67.08-.65.08-.65 1.1.08 1.68 1.13 1.68 1.13.98 1.67 2.56 1.19 3.19.91.1-.71.38-1.19.69-1.46-2.43-.28-4.98-1.22-4.98-5.44 0-1.2.43-2.18 1.13-2.95-.11-.28-.49-1.42.11-2.95 0 0 .92-.29 3.02 1.12.88-.24 1.82-.36 2.75-.36.93 0 1.86.12 2.74.36 2.1-1.41 3.02-1.12 3.02-1.12.6 1.53.22 2.67.11 2.95.7.77 1.13 1.75 1.13 2.95 0 4.22-2.55 5.16-4.99 5.44.39.33.73.98.73 1.99 0 1.44-.01 2.6-.01 2.95 0 .29.2.64.76.53 4.34-1.45 7.48-5.56 7.48-10.41C23.02 5.24 18.27.5 12 .5z" />
                                </svg>
                                <span>GitHub</span>
                            </a>
                        </div>

                        <div className="enter">
                            <a href="/home.html" aria-label="Enter site (homepage)">enter site →</a>
                        </div>
                    </div>
                </div>
            </main>

            <footer>© {year} Adon Paul</footer>
        </>
    )
}

export default LandingPage
