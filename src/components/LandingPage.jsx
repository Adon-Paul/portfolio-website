import { useRef, useMemo, useEffect, useState } from 'react'
import ShootingStars from './ShootingStars'
import Antigravity from './Antigravity'
import AutoVariableProximity from './AutoVariableProximity'

// Available profile images
const PROFILE_IMAGES = [
    'WEWSITEDARK.png',
    'WEWSITELIGHT.png',
    'wewsite.png'
]

const SKILLS = [
    { label: 'Flutter', icon: '📱' },
    { label: 'Dart', icon: '🎯' },
    { label: 'Firebase', icon: '🔥' },
    { label: 'Python', icon: '🐍' },
    { label: 'React', icon: '⚛️' },
    { label: 'Cybersecurity', icon: '🔒' }
]

function LandingPage({ theme, reduceMotion, onNavigate, showShootingStars = true }) {
    const year = new Date().getFullYear()
    const containerRef = useRef(null)
    const photoRef = useRef(null)
    const [photoLoaded, setPhotoLoaded] = useState(false)

    // Randomly select a profile image once on mount
    const profileImage = useMemo(() => {
        const randomIndex = Math.floor(Math.random() * PROFILE_IMAGES.length)
        return PROFILE_IMAGES[randomIndex]
    }, [])

    // Subtle parallax on mouse move for the photo frame
    useEffect(() => {
        if (reduceMotion || !photoRef.current) return

        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 12
            const y = (e.clientY / window.innerHeight - 0.5) * 8
            if (photoRef.current) {
                photoRef.current.style.transform = `perspective(800px) rotateY(${x * 0.3}deg) rotateX(${-y * 0.3}deg) translateZ(0)`
            }
        }

        window.addEventListener('mousemove', handleMouseMove, { passive: true })
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [reduceMotion])

    return (
        <>
            {theme === 'dark' && !reduceMotion && showShootingStars && <ShootingStars />}

            <main ref={containerRef} className="landing-page">
                <AutoVariableProximity containerRef={containerRef} enabled={!reduceMotion}>
                    <div className="hero-grid">
                        {/* Left: Profile Photo with Skeuomorphic Frame */}
                        <div className="hero-left">
                            <div className="photo-frame" ref={photoRef}>
                                {/* Metallic frame border */}
                                <div className="photo-frame-border" />

                                {/* Antigravity particles behind photo */}
                                {!reduceMotion && (
                                    <div className="photo-particles">
                                        <Antigravity
                                            color={theme === 'dark' ? '#544398' : '#7c5cbf'}
                                            count={150}
                                            ringRadius={80}
                                            particleSize={1.5}
                                            waveAmplitude={0.8}
                                            rotationSpeed={0.08}
                                        />
                                    </div>
                                )}

                                <div className="photo-inner">
                                    <img
                                        className={`profile-photo ${photoLoaded ? 'loaded' : ''}`}
                                        src={`${import.meta.env.BASE_URL}images/profile/${profileImage}`}
                                        alt="Portrait of Adon Paul Tomy"
                                        loading="eager"
                                        decoding="async"
                                        onLoad={() => setPhotoLoaded(true)}
                                    />
                                    {/* Bottom vignette */}
                                    <div className="photo-vignette" />
                                </div>

                                {/* Status indicator */}
                                <div className="status-badge">
                                    <span className="status-dot" />
                                    <span className="status-text">Available</span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Content Card */}
                        <div className="hero-right">
                            <div className="hero-card">
                                {/* Card shine effect */}
                                <div className="hero-card-shine" aria-hidden="true" />

                                {/* Card inner bevel highlight */}
                                <div className="hero-card-bevel" aria-hidden="true" />

                                <div className="hero-card-content">
                                    {/* Greeting */}
                                    <p className="hero-greeting stagger-1">Hey, I'm</p>

                                    <h1 className="hero-name stagger-2" data-text="ADON PAUL TOMY">
                                        Adon Paul<br />Tomy
                                    </h1>

                                    <div className="hero-role stagger-3">
                                        <span className="role-badge">Flutter Developer</span>
                                        <span className="role-divider">&</span>
                                        <span className="role-badge">CS Student</span>
                                    </div>

                                    <p className="hero-bio stagger-4">
                                        I build Flutter apps that ship, and break things that shouldn't be breakable.
                                        Final year CS student focused on mobile development and cybersecurity.
                                    </p>

                                    {/* Skill pills */}
                                    <div className="hero-skills stagger-4">
                                        {SKILLS.map((skill) => (
                                            <span key={skill.label} className="skill-pill">
                                                <span className="skill-icon">{skill.icon}</span>
                                                {skill.label}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Social Links */}
                                    <div className="hero-socials stagger-5">
                                        <a
                                            href="https://linkedin.com/in/adon-paul-tomy"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="social-link social-linkedin"
                                            aria-label="LinkedIn"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                                <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V24h-4V8.5zM8.5 8.5h3.8v2.1h.05c.53-1 1.83-2.1 3.77-2.1 4.03 0 4.78 2.65 4.78 6.1V24h-4v-7.1c0-1.7-.03-3.9-2.38-3.9-2.38 0-2.75 1.86-2.75 3.77V24h-4V8.5z" />
                                            </svg>
                                            <span>LinkedIn</span>
                                        </a>
                                        <a
                                            href="https://github.com/Adon-Paul"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="social-link social-github"
                                            aria-label="GitHub"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                                <path d="M12 .5C5.73.5.98 5.24.98 11.5c0 4.85 3.14 8.96 7.49 10.41.55.1.75-.24.75-.53 0-.26-.01-1.11-.02-2.01-3.05.66-3.7-1.3-3.7-1.3-.5-1.26-1.22-1.6-1.22-1.6-.99-.67.08-.65.08-.65 1.1.08 1.68 1.13 1.68 1.13.98 1.67 2.56 1.19 3.19.91.1-.71.38-1.19.69-1.46-2.43-.28-4.98-1.22-4.98-5.44 0-1.2.43-2.18 1.13-2.95-.11-.28-.49-1.42.11-2.95 0 0 .92-.29 3.02 1.12.88-.24 1.82-.36 2.75-.36.93 0 1.86.12 2.74.36 2.1-1.41 3.02-1.12 3.02-1.12.6 1.53.22 2.67.11 2.95.7.77 1.13 1.75 1.13 2.95 0 4.22-2.55 5.16-4.99 5.44.39.33.73.98.73 1.99 0 1.44-.01 2.6-.01 2.95 0 .29.2.64.76.53 4.34-1.45 7.48-5.56 7.48-10.41C23.02 5.24 18.27.5 12 .5z" />
                                            </svg>
                                            <span>GitHub</span>
                                        </a>
                                    </div>

                                    {/* CTAs */}
                                    <div className="hero-ctas stagger-5">
                                        <button
                                            type="button"
                                            className="cta-primary"
                                            onClick={() => onNavigate('about')}
                                        >
                                            <span>About Me</span>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                <path d="M5 12h14M12 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                        <button
                                            type="button"
                                            className="cta-secondary"
                                            onClick={() => onNavigate('projects')}
                                        >
                                            View Projects
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </AutoVariableProximity>
            </main>

            <footer className="page-footer">&copy; {year} Adon Paul</footer>
        </>
    )
}

export default LandingPage
