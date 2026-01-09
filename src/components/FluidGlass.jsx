import { useEffect, useRef, useState } from 'react'

/**
 * FluidGlass - A cursor-following lens with actual distortion effect
 * Uses SVG filter for displacement - only content inside is distorted
 */
export default function FluidGlass({
    size = 150,
    distortion = 30,
    blur = 0.5
}) {
    const lensRef = useRef(null)
    const [isVisible, setIsVisible] = useState(true)
    const positionRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
    const targetRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
    const rafRef = useRef(null)

    useEffect(() => {
        // Check for reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return
        }

        const lens = lensRef.current
        if (!lens) return

        const animate = () => {
            // Smooth easing towards target
            positionRef.current.x += (targetRef.current.x - positionRef.current.x) * 0.12
            positionRef.current.y += (targetRef.current.y - positionRef.current.y) * 0.12

            // Center the lens on the cursor
            const x = positionRef.current.x - size / 2
            const y = positionRef.current.y - size / 2

            lens.style.transform = `translate3d(${x}px, ${y}px, 0)`

            rafRef.current = requestAnimationFrame(animate)
        }

        const handleMouseMove = (e) => {
            targetRef.current.x = e.clientX
            targetRef.current.y = e.clientY

            // Check if cursor is over a content card or element with data-no-lens
            const target = e.target
            const isOverCard = target.closest('.content-card, .glass-panel, .left, [data-no-lens]')

            if (isOverCard) {
                if (isVisible) setIsVisible(false)
            } else {
                if (!isVisible) setIsVisible(true)
            }
        }

        const handleMouseLeave = () => setIsVisible(false)
        const handleMouseEnter = () => setIsVisible(true)

        window.addEventListener('mousemove', handleMouseMove, { passive: true })
        window.addEventListener('mouseleave', handleMouseLeave)
        window.addEventListener('mouseenter', handleMouseEnter)

        rafRef.current = requestAnimationFrame(animate)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseleave', handleMouseLeave)
            window.removeEventListener('mouseenter', handleMouseEnter)
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
        }
    }, [size, isVisible])

    return (
        <>
            {/* SVG Filter for lens distortion - applied only to inner content */}
            <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                <defs>
                    <filter id="lens-distortion" x="-50%" y="-50%" width="200%" height="200%">
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.015"
                            numOctaves="3"
                            result="noise"
                        />
                        <feDisplacementMap
                            in="SourceGraphic"
                            in2="noise"
                            scale={distortion}
                            xChannelSelector="R"
                            yChannelSelector="G"
                        />
                    </filter>
                </defs>
            </svg>

            {/* Main Container - positions the lens */}
            <div
                ref={lensRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: size,
                    height: size,
                    pointerEvents: 'none',
                    zIndex: 9999,
                    opacity: isVisible ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                }}
                aria-hidden="true"
            >
                {/* Inner distortion layer - this gets the SVG filter */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        backdropFilter: `blur(${blur}px) saturate(1.2) brightness(1.02)`,
                        WebkitBackdropFilter: `blur(${blur}px) saturate(1.2) brightness(1.02)`,
                        filter: 'url(#lens-distortion)',
                    }}
                />

                {/* Outer ring - clean, no distortion */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '50%',
                        border: '1.5px solid rgba(0, 231, 255, 0.35)',
                        boxShadow: `
              0 0 ${size * 0.25}px rgba(0, 231, 255, 0.12),
              0 0 ${size * 0.5}px rgba(0, 231, 255, 0.06),
              inset 0 0 ${size * 0.15}px rgba(0, 231, 255, 0.08)
            `,
                        pointerEvents: 'none',
                    }}
                />

                {/* Highlight reflection - clean, no distortion */}
                <div
                    style={{
                        position: 'absolute',
                        top: '8%',
                        left: '12%',
                        width: '35%',
                        height: '25%',
                        background: 'radial-gradient(ellipse, rgba(255,255,255,0.25) 0%, transparent 70%)',
                        borderRadius: '50%',
                        transform: 'rotate(-25deg)',
                        pointerEvents: 'none',
                    }}
                />
            </div>
        </>
    )
}
