import { Suspense, lazy, useRef, useMemo, useEffect, useState } from 'react'
import ShootingStars from './ShootingStars'
import AutoVariableProximity from './AutoVariableProximity'

const Antigravity = lazy(() => import('./Antigravity'))

// Available profile images
const PROFILE_IMAGES = [
    'WEWSITEDARK.png',
    'WEWSITELIGHT.png',
    'wewsite.png'
]

function LandingPage({ theme, reduceMotion, onNavigate, showShootingStars = true }) {
    const year = new Date().getFullYear()
    const containerRef = useRef(null)
    
    // 3D Perspective Refs
    const gridRef = useRef(null)
    const leftCardRef = useRef(null)
    const rightCardRef = useRef(null)
    
    const [photoLoaded, setPhotoLoaded] = useState(false)

    // Randomly select a profile image once on mount
    const profileImage = useMemo(() => {
        const randomIndex = Math.floor(Math.random() * PROFILE_IMAGES.length)
        return PROFILE_IMAGES[randomIndex]
    }, [])

    // Smooth Interactive 3D Perspective + Scene Sway
    useEffect(() => {
        if (reduceMotion || !gridRef.current) return

        let animationFrameId = null
        let isAnimating = false
        let currentX = 0
        let currentY = 0
        let targetX = 0
        let targetY = 0
        let isDesktop = window.innerWidth > 900
        let leftRect = null
        let rightRect = null

        const refreshRects = () => {
            leftRect = leftCardRef.current ? leftCardRef.current.getBoundingClientRect() : null
            rightRect = rightCardRef.current ? rightCardRef.current.getBoundingClientRect() : null
        }

        const applyTransforms = () => {
            if (gridRef.current) {
                // The whole scene slightly pans
                gridRef.current.style.transform = isDesktop
                    ? `perspective(1200px) rotateY(${currentX * 4}deg) rotateX(${-currentY * 2}deg)`
                    : 'none'
            }

            // Inner pop parallax (adds extra dimension)
            if (leftCardRef.current) {
                leftCardRef.current.style.transform = isDesktop
                    ? `rotateY(5deg) rotateX(${currentY * 1.5}deg) translateZ(${Math.abs(currentX) * 10}px)`
                    : 'none'
            }
            if (rightCardRef.current) {
                rightCardRef.current.style.transform = isDesktop
                    ? `rotateY(-5deg) rotateX(${currentY * 1.5}deg) translateZ(${Math.abs(currentX) * 10}px)`
                    : 'none'
            }

            // Expose scene movement to css variables for inner element parallax
            if (gridRef.current) {
                gridRef.current.style.setProperty('--scene-x', currentX)
                gridRef.current.style.setProperty('--scene-y', currentY)
            }
        }

        const ensureAnimation = () => {
            if (isAnimating) return
            isAnimating = true
            animationFrameId = requestAnimationFrame(animate)
        }

        const handleMouseMove = (e) => {
            // Normalized coords -1 to 1
            targetX = (e.clientX / window.innerWidth) * 2 - 1
            targetY = (e.clientY / window.innerHeight) * 2 - 1
            
            // Pass local coordinates for precise radial lighting
            if (leftCardRef.current && leftRect) {
                leftCardRef.current.style.setProperty('--light-x', `${e.clientX - leftRect.left}px`)
                leftCardRef.current.style.setProperty('--light-y', `${e.clientY - leftRect.top}px`)
            }
            if (rightCardRef.current && rightRect) {
                rightCardRef.current.style.setProperty('--light-x', `${e.clientX - rightRect.left}px`)
                rightCardRef.current.style.setProperty('--light-y', `${e.clientY - rightRect.top}px`)
            }

            ensureAnimation()
        }

        const animate = () => {
            // Smooth interpolation (lerp)
            currentX += (targetX - currentX) * 0.05
            currentY += (targetY - currentY) * 0.05

            applyTransforms()

            const remainingX = Math.abs(targetX - currentX)
            const remainingY = Math.abs(targetY - currentY)

            if (remainingX < 0.0005 && remainingY < 0.0005) {
                isAnimating = false
                animationFrameId = null
                return
            }

            animationFrameId = requestAnimationFrame(animate)
        }

        const handleResize = () => {
            isDesktop = window.innerWidth > 900
            refreshRects()
            ensureAnimation()
        }

        refreshRects()
        ensureAnimation()

        window.addEventListener('mousemove', handleMouseMove, { passive: true })
        window.addEventListener('resize', handleResize)
        window.addEventListener('scroll', refreshRects, { passive: true })
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('resize', handleResize)
            window.removeEventListener('scroll', refreshRects)
            if (animationFrameId) cancelAnimationFrame(animationFrameId)
        }
    }, [reduceMotion])

    return (
        <>
            {theme === 'dark' && !reduceMotion && showShootingStars && <ShootingStars />}

            <main ref={containerRef} className="landing-page">
                <AutoVariableProximity containerRef={containerRef} enabled={!reduceMotion}>
                    <div className="hero-grid" ref={gridRef}>
                        {/* Left: Profile Photo in Metal Bezel */}
                        <div className="hero-left">
                            <div className="photo-frame" ref={leftCardRef}>
                                {/* Antigravity particles behind photo */}
                                {!reduceMotion && (
                                    <div className="photo-particles">
                                        <Suspense fallback={null}>
                                            <Antigravity
                                                color={theme === 'dark' ? '#544398' : '#7c5cbf'}
                                                count={150}
                                                ringRadius={80}
                                                particleSize={1.5}
                                                waveAmplitude={0.8}
                                                rotationSpeed={0.08}
                                            />
                                        </Suspense>
                                    </div>
                                )}

                                {/* The photo recessed into the bezel */}
                                <div className="photo-inner">
                                    <img
                                        className={`profile-photo ${photoLoaded ? 'loaded' : ''}`}
                                        src={`${import.meta.env.BASE_URL}images/profile/${profileImage}`}
                                        alt="Portrait of Adon Paul Tomy"
                                        loading="eager"
                                        decoding="async"
                                        fetchPriority="high"
                                        onLoad={() => setPhotoLoaded(true)}
                                    />
                                    <div className="photo-vignette" />
                                    {/* Glossy glare overlay */}
                                    <div className="photo-glare" aria-hidden="true" />
                                </div>

                                {/* Status indicator — inset badge */}
                                <div className="status-badge">
                                    <span className="status-dot" />
                                    <span className="status-text">Available</span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Content Panel */}
                        <div className="hero-right">
                            <div className="hero-card" ref={rightCardRef}>
                                {/* Glossy glare on top */}
                                <div className="hero-card-gloss" aria-hidden="true" />

                                <div className="hero-card-content">
                                    {/* Greeting — debossed small text */}
                                    <p className="hero-greeting stagger-1">Hey, I'm</p>

                                    {/* Name — embossed metallic */}
                                    <h1 className="hero-name stagger-2">
                                        Adon Paul<br />Tomy
                                    </h1>

                                    {/* Role — engraved divider line + text */}
                                    <div className="hero-role stagger-3">
                                        <span className="role-line" />
                                        <span className="role-text">Flutter Developer & CS Student</span>
                                        <span className="role-line" />
                                    </div>

                                    {/* Bio */}
                                    <p className="hero-bio stagger-4">
                                        I build Flutter apps that ship, and break things that shouldn't be breakable.
                                        Final year CS student focused on mobile development and cybersecurity.
                                    </p>
                                </div>
                            </div>
                            
                            {/* Actions / Links detached from card parallax */}
                            <div className="hero-actions stagger-5">
                                {/* Social Links — raised metallic buttons */}
                                <div className="hero-socials">
                                    <a
                                        href="https://linkedin.com/in/adon-paul-tomy"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="social-btn golden-btn glass-panel"
                                        aria-label="LinkedIn"
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                            <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V24h-4V8.5zM8.5 8.5h3.8v2.1h.05c.53-1 1.83-2.1 3.77-2.1 4.03 0 4.78 2.65 4.78 6.1V24h-4v-7.1c0-1.7-.03-3.9-2.38-3.9-2.38 0-2.75 1.86-2.75 3.77V24h-4V8.5z" />
                                        </svg>
                                    </a>
                                    <a
                                        href="https://github.com/Adon-Paul"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="social-btn golden-btn glass-panel"
                                        aria-label="GitHub"
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                            <path d="M12 .5C5.73.5.98 5.24.98 11.5c0 4.85 3.14 8.96 7.49 10.41.55.1.75-.24.75-.53 0-.26-.01-1.11-.02-2.01-3.05.66-3.7-1.3-3.7-1.3-.5-1.26-1.22-1.6-1.22-1.6-.99-.67.08-.65.08-.65 1.1.08 1.68 1.13 1.68 1.13.98 1.67 2.56 1.19 3.19.91.1-.71.38-1.19.69-1.46-2.43-.28-4.98-1.22-4.98-5.44 0-1.2.43-2.18 1.13-2.95-.11-.28-.49-1.42.11-2.95 0 0 .92-.29 3.02 1.12.88-.24 1.82-.36 2.75-.36.93 0 1.86.12 2.74.36 2.1-1.41 3.02-1.12 3.02-1.12.6 1.53.22 2.67.11 2.95.7.77 1.13 1.75 1.13 2.95 0 4.22-2.55 5.16-4.99 5.44.39.33.73.98.73 1.99 0 1.44-.01 2.6-.01 2.95 0 .29.2.64.76.53 4.34-1.45 7.48-5.56 7.48-10.41C23.02 5.24 18.27.5 12 .5z" />
                                        </svg>
                                    </a>
                                </div>
                                
                                {/* CTAs — placed right below the hero card */}
                                <div className="hero-ctas">
                                    <button
                                        type="button"
                                        className="cta-primary glass-panel"
                                        onClick={() => onNavigate('about')}
                                    >
                                        <span>About Me</span>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </button>
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
