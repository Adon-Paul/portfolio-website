import { useEffect, useRef, useState } from 'react'

/**
 * GlassCursor - A CSS-based glass lens effect that follows the cursor
 * Uses backdrop-filter for the frosted glass effect on DOM content
 */
function GlassCursor({ size = 140 }) {
    const cursorRef = useRef(null)
    const [isVisible, setIsVisible] = useState(true) // Start visible
    const visibleRef = useRef(true)
    const positionRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
    const targetRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
    const rafRef = useRef(null)

    useEffect(() => {
        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return
        }

        const cursor = cursorRef.current
        if (!cursor) return

        // Set initial position
        cursor.style.left = '0px'
        cursor.style.top = '0px'

        let isAnimating = false

        const ensureAnimation = () => {
            if (isAnimating) return
            isAnimating = true
            rafRef.current = requestAnimationFrame(animate)
        }

        const animate = () => {
            // Smooth easing towards target
            positionRef.current.x += (targetRef.current.x - positionRef.current.x) * 0.12
            positionRef.current.y += (targetRef.current.y - positionRef.current.y) * 0.12

            // Center the cursor on the mouse position
            const x = positionRef.current.x - size / 2
            const y = positionRef.current.y - size / 2

            cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`

            const dx = Math.abs(targetRef.current.x - positionRef.current.x)
            const dy = Math.abs(targetRef.current.y - positionRef.current.y)

            if (dx < 0.1 && dy < 0.1) {
                isAnimating = false
                rafRef.current = null
                return
            }

            rafRef.current = requestAnimationFrame(animate)
        }

        const handleMouseMove = (e) => {
            targetRef.current.x = e.clientX
            targetRef.current.y = e.clientY
            if (!visibleRef.current) {
                visibleRef.current = true
                setIsVisible(true)
            }
            ensureAnimation()
        }

        const handleMouseLeave = () => {
            if (!visibleRef.current) return
            visibleRef.current = false
            setIsVisible(false)
        }

        const handleMouseEnter = () => {
            if (visibleRef.current) return
            visibleRef.current = true
            setIsVisible(true)
            ensureAnimation()
        }

        window.addEventListener('mousemove', handleMouseMove, { passive: true })
        window.addEventListener('mouseleave', handleMouseLeave)
        window.addEventListener('mouseenter', handleMouseEnter)

        // Start animation loop
        ensureAnimation()

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseleave', handleMouseLeave)
            window.removeEventListener('mouseenter', handleMouseEnter)
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
            isAnimating = false
        }
    }, [size]) // Remove isVisible from deps to prevent re-running

    return (
        <div
            ref={cursorRef}
            className={`glass-cursor ${isVisible ? 'visible' : ''}`}
            style={{
                width: size,
                height: size,
            }}
            aria-hidden="true"
        />
    )
}

export default GlassCursor
