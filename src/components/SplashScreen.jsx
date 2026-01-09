import { useState, useEffect, useRef, useCallback } from 'react'

function SplashScreen({ state, onComplete, reduceMotion }) {
    const [displayText, setDisplayText] = useState('')
    const [progress, setProgress] = useState(0)
    const [isGlitchActive, setIsGlitchActive] = useState(false)
    const [showScrollHint, setShowScrollHint] = useState(false)

    // Direct DOM manipulation for ultra-smooth animation
    const overlayRef = useRef(null)
    const currentRadius = useRef(150)
    const targetRadius = useRef(150)
    const velocity = useRef(0)

    const targetText = "Adon Paul Tomy"
    const speed = 100

    // Typewriter effect
    useEffect(() => {
        if (reduceMotion) {
            setDisplayText(targetText)
            setProgress(100)
            setIsGlitchActive(true)
            onComplete()
            return
        }

        let index = 0
        let lastTime = 0
        let rafId;

        const animate = (timestamp) => {
            if (!lastTime) lastTime = timestamp

            if (timestamp - lastTime > speed && index < targetText.length) {
                index++
                setDisplayText(targetText.substring(0, index))
                setProgress((index / targetText.length) * 100)
                lastTime = timestamp
            }

            if (index < targetText.length) {
                rafId = requestAnimationFrame(animate)
            } else {
                setIsGlitchActive(true)
                setTimeout(() => setShowScrollHint(true), 500)
            }
        }

        rafId = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(rafId)
    }, [reduceMotion])

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
    // Directly manipulates DOM to bypass React's render cycle
    useEffect(() => {
        if (!overlayRef.current) return

        const stiffness = 0.015  // Lower = slower, smoother
        const damping = 0.85     // Higher = more resistance, smoother stop

        let animationId

        const animate = () => {
            // Spring physics
            const displacement = targetRadius.current - currentRadius.current
            const springForce = displacement * stiffness
            velocity.current = (velocity.current + springForce) * damping
            currentRadius.current += velocity.current

            // Apply directly to DOM (bypasses React render)
            if (overlayRef.current) {
                const opacity = currentRadius.current > 20 ? 1 : Math.max(currentRadius.current / 20, 0)
                overlayRef.current.style.clipPath = `circle(${currentRadius.current}% at 50% 50%)`
                overlayRef.current.style.opacity = opacity
            }

            // Check if animation should trigger complete
            if (currentRadius.current <= 5 && state !== 'dashboard') {
                onComplete()
            }

            animationId = requestAnimationFrame(animate)
        }

        animationId = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(animationId)
    }, [state, onComplete])

    // Handle scroll - just updates target, doesn't trigger re-render
    useEffect(() => {
        if (!showScrollHint || state === 'dashboard') return

        const handleWheel = (e) => {
            const scrollDelta = e.deltaY * 0.3  // Sensitivity
            targetRadius.current = Math.max(Math.min(targetRadius.current - scrollDelta, 150), 0)
        }

        window.addEventListener('wheel', handleWheel, { passive: true })
        return () => window.removeEventListener('wheel', handleWheel)
    }, [showScrollHint, state])

    // Click handler
    const handleClick = useCallback(() => {
        targetRadius.current = 0
    }, [])

    // Dashboard state - immediate hide
    useEffect(() => {
        if (state === 'dashboard') {
            targetRadius.current = 0
        }
    }, [state])

    return (
        <div
            ref={overlayRef}
            id="splash-overlay"
            style={{
                clipPath: 'circle(150% at 50% 50%)',
                pointerEvents: state === 'dashboard' ? 'none' : 'auto'
            }}
            aria-hidden={state === 'dashboard'}
        >
            {/* Animated gradient orbs for depth */}
            <div className="splash-orbs" aria-hidden="true">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
                <div className="orb orb-3"></div>
            </div>

            <div className="splash-content">
                <div
                    className="splash-center"
                    style={{ cursor: 'pointer' }}
                    onClick={handleClick}
                    title="Click to enter"
                >
                    <div className={`typewriter-text ${isGlitchActive ? 'glitch-active' : ''}`} data-text={targetText}>
                        {displayText}
                    </div>
                    <div className="loading-bar-container">
                        <div className="loading-bar" style={{ width: `${progress}%` }}></div>
                    </div>

                    {isGlitchActive && (
                        <p className="splash-hint">Click or scroll to continue</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SplashScreen
