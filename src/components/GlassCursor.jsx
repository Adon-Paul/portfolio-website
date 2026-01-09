import { useEffect, useRef, useState } from 'react'

/**
 * GlassCursor - A CSS-based glass lens effect that follows the cursor
 * Uses backdrop-filter for the frosted glass effect on DOM content
 */
function GlassCursor({ size = 140 }) {
    const cursorRef = useRef(null)
    const [isVisible, setIsVisible] = useState(true) // Start visible
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

        const animate = () => {
            // Smooth easing towards target
            positionRef.current.x += (targetRef.current.x - positionRef.current.x) * 0.12
            positionRef.current.y += (targetRef.current.y - positionRef.current.y) * 0.12

            // Center the cursor on the mouse position
            const x = positionRef.current.x - size / 2
            const y = positionRef.current.y - size / 2

            cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`

            rafRef.current = requestAnimationFrame(animate)
        }

        const handleMouseMove = (e) => {
            targetRef.current.x = e.clientX
            targetRef.current.y = e.clientY
            if (!isVisible) setIsVisible(true)
        }

        const handleMouseLeave = () => {
            setIsVisible(false)
        }

        const handleMouseEnter = () => {
            setIsVisible(true)
        }

        window.addEventListener('mousemove', handleMouseMove, { passive: true })
        window.addEventListener('mouseleave', handleMouseLeave)
        window.addEventListener('mouseenter', handleMouseEnter)

        // Start animation loop
        rafRef.current = requestAnimationFrame(animate)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseleave', handleMouseLeave)
            window.removeEventListener('mouseenter', handleMouseEnter)
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
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
