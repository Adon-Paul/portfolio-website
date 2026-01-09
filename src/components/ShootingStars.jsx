import { useEffect, useRef } from 'react'

function ShootingStars() {
    const containerRef = useRef(null)

    useEffect(() => {
        const createShootingStar = () => {
            if (!containerRef.current) return

            const star = document.createElement('div')
            star.className = 'shooting-star'
            star.setAttribute('aria-hidden', 'true')

            // Random position
            star.style.top = Math.random() * 50 + '%'
            star.style.left = Math.random() * 100 + '%'

            // Random animation duration
            const duration = Math.random() * 1.5 + 0.8
            star.style.setProperty('--duration', duration + 's')

            containerRef.current.appendChild(star)

            // Remove after animation
            setTimeout(() => {
                star.remove()
            }, duration * 1000)
        }

        const scheduleNextStar = () => {
            const delay = Math.random() * 4000 + 2000
            setTimeout(() => {
                createShootingStar()
                scheduleNextStar()
            }, delay)
        }

        // Start the cycle
        scheduleNextStar()
        setTimeout(createShootingStar, 2000)

        return () => {
            // Cleanup handled by component unmount
        }
    }, [])

    return <div ref={containerRef} className="shooting-stars-container" />
}

export default ShootingStars
