import { useState, useEffect, useRef, useCallback } from 'react'

function SplashScreen({ state, onComplete, reduceMotion, theme, toggleTheme }) {
    const [displayText, setDisplayText] = useState('')
    const [progress, setProgress] = useState(0)
    const [phase, setPhase] = useState('typing') // typing | ready | exiting
    const [isEntering, setIsEntering] = useState(false)
    const [selectedTheme, setSelectedTheme] = useState(null)

    // Direct DOM manipulation for ultra-smooth animation
    const overlayRef = useRef(null)
    const currentRadius = useRef(150)
    const targetRadius = useRef(150)
    const velocity = useRef(0)
    const progressRingRef = useRef(null)

    const targetText = "Adon Paul Tomy"
    const speed = 85

    // Typewriter effect
    useEffect(() => {
        if (reduceMotion) {
            setDisplayText(targetText)
            setProgress(100)
            setPhase('ready')
            onComplete()
            return
        }

        let index = 0
        let lastTime = 0
        let rafId

        const animate = (timestamp) => {
            if (!lastTime) lastTime = timestamp

            if (timestamp - lastTime > speed && index < targetText.length) {
                index++
                setDisplayText(targetText.substring(0, index))
                const pct = (index / targetText.length) * 100
                setProgress(pct)

                // Update progress ring via DOM
                if (progressRingRef.current) {
                    const circumference = 2 * Math.PI * 58
                    progressRingRef.current.style.strokeDashoffset = circumference - (pct / 100) * circumference
                }
                lastTime = timestamp
            }

            if (index < targetText.length) {
                rafId = requestAnimationFrame(animate)
            } else {
                setPhase('ready')
            }
        }

        rafId = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(rafId)
    }, [reduceMotion])

    // Removed auto-dismiss timer - User must explicitly choose a theme now.
    const proceedTimerRef = useRef(null)

    // Lock Body Scroll
    useEffect(() => {
        if (state !== 'dashboard') {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [state])

    // ULTRA-SMOOTH SPRING PHYSICS ANIMATION
    useEffect(() => {
        if (!overlayRef.current) return

        const stiffness = 0.012
        const damping = 0.87

        let animationId

        const animate = () => {
            const displacement = targetRadius.current - currentRadius.current
            const springForce = displacement * stiffness
            velocity.current = (velocity.current + springForce) * damping
            currentRadius.current += velocity.current

            if (overlayRef.current) {
                const opacity = currentRadius.current > 20 ? 1 : Math.max(currentRadius.current / 20, 0)
                const clipValue = `circle(${currentRadius.current}% at 50% 50%)`
                overlayRef.current.style.webkitClipPath = clipValue
                overlayRef.current.style.clipPath = clipValue
                overlayRef.current.style.opacity = opacity
            }

            if (currentRadius.current <= 5 && state !== 'dashboard') {
                onComplete()
            }

            animationId = requestAnimationFrame(animate)
        }

        animationId = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(animationId)
    }, [state, onComplete])

    // Handle scroll
    useEffect(() => {
        if (phase !== 'ready' || state === 'dashboard') return

        const handleWheel = (e) => {
            const scrollDelta = e.deltaY * 0.35
            // Allow manual pulling down of the circle for fun, but don't enter automatically
            targetRadius.current = Math.max(Math.min(targetRadius.current - scrollDelta, 150), 0)
        }

        window.addEventListener('wheel', handleWheel, { passive: true })
        return () => window.removeEventListener('wheel', handleWheel)
    }, [phase, state])

    // Touch support for mobile
    useEffect(() => {
        if (phase !== 'ready' || state === 'dashboard') return

        let touchStartY = 0
        const handleTouchStart = (e) => { touchStartY = e.touches[0].clientY }
        const handleTouchMove = (e) => {
            const delta = (touchStartY - e.touches[0].clientY) * 0.5
            targetRadius.current = Math.max(Math.min(targetRadius.current - delta, 150), 0)
            touchStartY = e.touches[0].clientY
        }

        window.addEventListener('touchstart', handleTouchStart, { passive: true })
        window.addEventListener('touchmove', handleTouchMove, { passive: true })
        return () => {
            window.removeEventListener('touchstart', handleTouchStart)
            window.removeEventListener('touchmove', handleTouchMove)
        }
    }, [phase, state])

    // Click handler - Removed immediate skip so user is forced to pick a theme
    const handleClick = useCallback(() => {
        // Disabled immediate skip.
    }, [])

    // Dashboard state - immediate hide
    useEffect(() => {
        if (state === 'dashboard') {
            targetRadius.current = 0
            if (proceedTimerRef.current) clearTimeout(proceedTimerRef.current)
        }
    }, [state])
    // Theme toggle handler triggers the exit sequence

    const handleThemeSelection = (choice) => {
        if (phase !== 'ready') return

        setSelectedTheme(choice)

        if (choice !== theme) {
            toggleTheme()
        }

        setIsEntering(true)

        if (proceedTimerRef.current) clearTimeout(proceedTimerRef.current)
        proceedTimerRef.current = setTimeout(() => {
            setPhase('exiting')
            targetRadius.current = 0
        }, 800)
    }

    const circumference = 2 * Math.PI * 58

    return (
        <div
            ref={overlayRef}
            id="splash-overlay"
            className={phase === 'exiting' ? 'splash-exiting' : ''}
            style={{
                WebkitClipPath: 'circle(150% at 50% 50%)',
                clipPath: 'circle(150% at 50% 50%)',
                pointerEvents: state === 'dashboard' ? 'none' : 'auto'
            }}
            aria-hidden={state === 'dashboard'}
        >
            {/* Subtle noise texture overlay */}
            <div className="splash-noise" aria-hidden="true" />

            {/* Ambient orbs */}
            <div className="splash-orbs" aria-hidden="true">
                <div className="orb orb-1" />
                <div className="orb orb-2" />
            </div>

            <div className="splash-content">
                <div
                    className="splash-center"
                    onClick={handleClick}
                    role="button"
                    tabIndex={0}
                    aria-label="Click to enter site"
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick() }}
                >
                    {/* Skeuomorphic embossed panel */}
                    <div className="splash-panel">
                        {/* Glossy highlight on panel top */}
                        <div className="splash-panel-gloss" aria-hidden="true" />

                        {/* Central gauge ring */}
                        <div className={`splash-ring ${phase === 'ready' ? 'ring-complete' : ''}`}>
                            <svg className="splash-ring-svg" viewBox="0 0 128 128">
                                {/* Ambient track */}
                                <circle
                                    cx="64" cy="64" r="58"
                                    fill="none"
                                    stroke="rgba(255,255,255,0.08)"
                                    strokeWidth="1.5"
                                />
                                {/* Progress fill */}
                                <circle
                                    ref={progressRingRef}
                                    cx="64" cy="64" r="58"
                                    fill="none"
                                    stroke="url(#ringGrad)"
                                    strokeWidth="3.5"
                                    strokeLinecap="round"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={circumference}
                                    className="progress-ring-circle"
                                    transform="rotate(-90 64 64)"
                                />
                                <defs>
                                    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#00d4ff" />
                                        <stop offset="50%" stopColor="#a855f7" />
                                        <stop offset="100%" stopColor="#ff00a0" />
                                    </linearGradient>
                                </defs>
                            </svg>

                            {/* Initials — embossed into the surface */}
                            <div className="splash-ring-initials">
                                <span className={progress > 0 ? 'visible' : ''}>A</span>
                                <span className={progress > 50 ? 'visible' : ''}>P</span>
                            </div>
                        </div>

                        {/* Name — debossed / engraved into metal */}
                        <div className="splash-name-container">
                            <h1 className={`splash-name ${phase === 'ready' ? 'name-complete' : ''}`} data-text={targetText}>
                                {displayText}
                                {phase === 'typing' && <span className="splash-cursor" />}
                            </h1>
                        </div>

                        {/* Inset progress track */}
                        <div className="splash-track">
                            <div className="splash-track-fill" style={{ width: `${progress}%` }} />
                            <div className="splash-track-shine" aria-hidden="true" />
                        </div>

                        {/* Subtitle — letterpress style */}
                        <p className={`splash-subtitle ${phase === 'ready' ? 'subtitle-visible' : ''}`}>
                            Developer &middot; Student &middot; Builder
                        </p>
                    </div>

                    {/* Removed manual enter prompt as user must select theme */}
                </div>

                {/* Innovative Skeuomorphic Theme Slider - Centered underneath */}
                <div className={`splash-theme-dock ${phase === 'ready' ? 'visible' : ''}`} onClick={(e) => e.stopPropagation()}>
                    <p className="theme-dock-prompt">
                        {isEntering ? "Crafting your experience..." : "Select Your Desired Experience"}
                    </p>
                    
                    <div className="theme-slider-container">
                        <span 
                            className={`theme-label label-dark ${selectedTheme === 'dark' ? 'active' : ''}`} 
                            onClick={(e) => { e.stopPropagation(); handleThemeSelection('dark'); }}
                        >
                            NEON DARK
                        </span>
                        
                        <div 
                            className={`theme-slider-track ${selectedTheme ?? 'unset'}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (selectedTheme === 'dark') handleThemeSelection('light');
                                else handleThemeSelection('dark');
                            }}
                        >
                            {/* Underglow based on theme */}
                            <div className={`theme-slider-glow ${selectedTheme ?? 'unset'}`} />
                            
                            <div 
                                className={`theme-slider-knob ${selectedTheme ?? 'unset'}`}
                                role="button"
                                aria-label="Choose theme"
                                tabIndex={0}
                            >
                                <div className="knob-texture">
                                    <div className="knob-ridges"></div>
                                    <div className="knob-indicator"></div>
                                </div>
                            </div>
                        </div>

                        <span 
                            className={`theme-label label-light ${selectedTheme === 'light' ? 'active' : ''}`} 
                            onClick={(e) => { e.stopPropagation(); handleThemeSelection('light'); }}
                        >
                            SOLARIZED LIGHT
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SplashScreen
