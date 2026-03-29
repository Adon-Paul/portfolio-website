import { memo, useState, useEffect, useRef, useCallback } from 'react'
import useAppStore from '../store/useAppStore'
import BorderGlow from './BorderGlow'
import DarkVeil from './DarkVeil'

function SplashScreen({ state, onComplete, reduceMotion }) {
    const setTheme = useAppStore((s) => s.setTheme)
    const [displayText, setDisplayText] = useState('')
    const [progress, setProgress] = useState(0)
    const [phase, setPhase] = useState('typing') // typing | ready | exiting
    const [isEntering, setIsEntering] = useState(false)
    const [selectedTheme, setSelectedTheme] = useState(null)
    const [craftingDots, setCraftingDots] = useState('.')

    // Direct DOM manipulation for ultra-smooth animation
    const overlayRef = useRef(null)
    const currentRadius = useRef(150)
    const targetRadius = useRef(150)
    const velocity = useRef(0)
    const springRafRef = useRef(null)
    const springAnimateRef = useRef(null)
    const progressRingRef = useRef(null)

    // Knob drag refs
    const knobRef = useRef(null)
    const isDragging = useRef(false)
    const dragStartX = useRef(0)
    const dragStartLeft = useRef(4)
    // Track: 400px, padding: 4px, knob: 110px → travel 4..286
    const KNOB_MIN = 4
    const KNOB_MAX = 286
    const KNOB_CENTER = 145

    const targetText = "Adon Paul Tomy"
    const speed = 85

    const requestSpringFrame = useCallback(() => {
        if (springRafRef.current != null) return
        if (typeof springAnimateRef.current !== 'function') return
        springRafRef.current = requestAnimationFrame(springAnimateRef.current)
    }, [])

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

    useEffect(() => {
        return () => {
            if (proceedTimerRef.current) clearTimeout(proceedTimerRef.current)
        }
    }, [])

    // Animated crafting dots
    useEffect(() => {
        if (!isEntering) return
        let step = 0
        const frames = ['.', '..', '...', '..']
        const id = setInterval(() => {
            step = (step + 1) % frames.length
            setCraftingDots(frames[step])
        }, 400)
        return () => clearInterval(id)
    }, [isEntering])

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

        const animate = () => {
            springRafRef.current = null

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

            if (Math.abs(displacement) < 0.02 && Math.abs(velocity.current) < 0.02) {
                currentRadius.current = targetRadius.current
                velocity.current = 0
                return
            }

            springRafRef.current = requestAnimationFrame(animate)
        }

        springAnimateRef.current = animate
        requestSpringFrame()

        return () => {
            if (springRafRef.current != null) {
                cancelAnimationFrame(springRafRef.current)
                springRafRef.current = null
            }
            if (springAnimateRef.current === animate) {
                springAnimateRef.current = null
            }
        }
    }, [state, onComplete, requestSpringFrame])

    // Handle scroll
    useEffect(() => {
        if (phase !== 'ready' || state === 'dashboard') return

        const handleWheel = (e) => {
            const scrollDelta = e.deltaY * 0.35
            const minRadius = selectedTheme ? 0 : 10
            targetRadius.current = Math.max(Math.min(targetRadius.current - scrollDelta, 150), minRadius)
            requestSpringFrame()
        }

        window.addEventListener('wheel', handleWheel, { passive: true })
        return () => window.removeEventListener('wheel', handleWheel)
    }, [phase, state, selectedTheme])

    // Touch support for mobile
    useEffect(() => {
        if (phase !== 'ready' || state === 'dashboard') return

        let touchStartY = 0
        const handleTouchStart = (e) => { touchStartY = e.touches[0].clientY }
        const handleTouchMove = (e) => {
            const delta = (touchStartY - e.touches[0].clientY) * 0.5
            const minRadius = selectedTheme ? 0 : 10
            targetRadius.current = Math.max(Math.min(targetRadius.current - delta, 150), minRadius)
            touchStartY = e.touches[0].clientY
            requestSpringFrame()
        }

        window.addEventListener('touchstart', handleTouchStart, { passive: true })
        window.addEventListener('touchmove', handleTouchMove, { passive: true })
        return () => {
            window.removeEventListener('touchstart', handleTouchStart)
            window.removeEventListener('touchmove', handleTouchMove)
        }
    }, [phase, state, selectedTheme, requestSpringFrame])

    // Click handler - Removed immediate skip so user is forced to pick a theme
    const handleClick = useCallback(() => {
        // Disabled immediate skip.
    }, [])

    // Dashboard state - immediate hide
    useEffect(() => {
        if (state === 'dashboard') {
            targetRadius.current = 0
            requestSpringFrame()
            if (proceedTimerRef.current) clearTimeout(proceedTimerRef.current)
        }
    }, [state, requestSpringFrame])

    // Theme selection — triggers DarkVeil preview + exit countdown
    const handleThemeSelection = useCallback((choice) => {
        if (phase !== 'ready') return

        // Clear any inline drag positioning so CSS class takes over
        if (knobRef.current) {
            knobRef.current.style.left = ''
            knobRef.current.style.transition = ''
        }

        setSelectedTheme(choice)
        setTheme(choice)
        setIsEntering(true)

        if (proceedTimerRef.current) clearTimeout(proceedTimerRef.current)
        proceedTimerRef.current = setTimeout(() => {
            setPhase('exiting')
            targetRadius.current = 0
            requestSpringFrame()
        }, 5000)
    }, [phase, setTheme, requestSpringFrame])

    const handleKnobPointerDown = useCallback((e) => {
        e.stopPropagation()
        if (phase !== 'ready') return
        isDragging.current = true
        dragStartX.current = e.clientX
        const knob = knobRef.current
        if (!knob) return
        const currentLeft = parseFloat(knob.style.left) || KNOB_MIN
        dragStartLeft.current = currentLeft
        knob.setPointerCapture(e.pointerId)
        knob.style.transition = 'none'
    }, [phase])

    const handleKnobPointerMove = useCallback((e) => {
        if (!isDragging.current || !knobRef.current) return
        const delta = e.clientX - dragStartX.current
        const newLeft = Math.max(KNOB_MIN, Math.min(KNOB_MAX, dragStartLeft.current + delta))
        knobRef.current.style.left = `${newLeft}px`
    }, [])

    const handleKnobPointerUp = useCallback((e) => {
        if (!isDragging.current || !knobRef.current) return
        isDragging.current = false
        knobRef.current.style.transition = ''
        const currentLeft = parseFloat(knobRef.current.style.left) || KNOB_MIN
        knobRef.current.style.left = ''
        handleThemeSelection(currentLeft < KNOB_CENTER ? 'dark' : 'light')
    }, [handleThemeSelection])

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
            {/* DarkVeil preview — fades in when user picks a theme */}
            {selectedTheme && !reduceMotion && (
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 1,
                    backgroundColor: selectedTheme === 'dark' ? '#0b0b12' : '#fdf6e3',
                    transition: 'background-color 0.4s ease',
                    animation: 'splashVeilFadeIn 0.5s ease forwards'
                }}>
                    <DarkVeil
                        theme={selectedTheme}
                        hueShift={selectedTheme === 'dark' ? 35 : 0}
                        animateHue={selectedTheme === 'dark'}
                        hueSpeed={3}
                        hueMin={320}
                        hueMax={40}
                        noiseIntensity={0.02}
                        scanlineIntensity={0}
                        scanlineFrequency={0}
                        speed={selectedTheme === 'dark' ? 0.2 : 0.25}
                        warpAmount={selectedTheme === 'dark' ? 0 : 0.45}
                    />
                </div>
            )}

            <div className="splash-content">
                <div
                    className="splash-center"
                    onClick={handleClick}
                    role="button"
                    tabIndex={0}
                    aria-label="Click to enter site"
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick() }}
                >
                    {/* Skeuomorphic embossed panel with border glow */}
                    <BorderGlow
                        animated={phase === 'ready'}
                        edgeSensitivity={10}
                        glowIntensity={3.0}
                        glowRadius={80}
                        glowColor="180 100 60"
                        colors={['#00ffff', '#ff00ff', '#ff0066', '#7700ff']}
                        backgroundColor="#0a0a0a"
                        borderRadius={30}
                        fillOpacity={0}
                        coneSpread={18}
                        className="splash-border-glow"
                    >
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
                    </BorderGlow>

                    {/* Removed manual enter prompt as user must select theme */}
                </div>

                {/* Innovative Skeuomorphic Theme Slider - Centered underneath */}
                <div className={`splash-theme-dock ${phase === 'ready' ? 'visible' : ''}`} onClick={(e) => e.stopPropagation()}>
                    <p className={`theme-dock-prompt ${isEntering ? 'prompt-crafting' : ''}`}>
                        {isEntering
                            ? <><span className="prompt-crafting-text">Crafting your experience</span><span className="prompt-crafting-dots">{craftingDots}</span></>
                            : "Select Your Desired Experience"
                        }
                    </p>
                    
                    <div className="theme-slider-container">
                        <div
                            className={`theme-slider-track ${selectedTheme ?? 'unset'}`}
                            onClick={(e) => { e.stopPropagation(); }}
                        >
                            {/* Engraved labels inside the track */}
                            <span
                                className="theme-label-engraved label-dark"
                                onClick={(e) => { e.stopPropagation(); handleThemeSelection('dark'); }}
                            >
                                NEON DARK
                            </span>
                            <span
                                className="theme-label-engraved label-light"
                                onClick={(e) => { e.stopPropagation(); handleThemeSelection('light'); }}
                            >
                                SOLARIZED LIGHT
                            </span>

                            {/* Underglow based on theme */}
                            <div className={`theme-slider-glow ${selectedTheme ?? 'unset'}`} />

                            <div
                                ref={knobRef}
                                className={`theme-slider-knob ${selectedTheme ?? 'unset'}`}
                                role="button"
                                aria-label="Choose theme"
                                tabIndex={0}
                                onPointerDown={handleKnobPointerDown}
                                onPointerMove={handleKnobPointerMove}
                                onPointerUp={handleKnobPointerUp}
                            >
                                <div className="knob-texture">
                                    <div className="knob-ridges"></div>
                                    <div className="knob-indicator"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

SplashScreen.displayName = 'SplashScreen'

export default memo(SplashScreen)
