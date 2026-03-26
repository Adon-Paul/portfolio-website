import { useEffect, useRef } from 'react'

function ShootingStars() {
    const containerRef = useRef(null)

    useEffect(() => {
        let isActive = true
        const timeoutIds = new Set()

        const trackTimeout = (fn, delay) => {
            const id = setTimeout(() => {
                timeoutIds.delete(id)
                fn()
            }, delay)
            timeoutIds.add(id)
            return id
        }

        const createShootingStar = () => {
            if (!isActive || !containerRef.current) return

            const star = document.createElement('div')
            star.className = 'shooting-star'
            star.setAttribute('aria-hidden', 'true')

            star.style.top = Math.random() * 50 + '%'
            star.style.left = Math.random() * 100 + '%'

            const duration = Math.random() * 1.5 + 0.8
            star.style.setProperty('--duration', duration + 's')

            containerRef.current.appendChild(star)

            trackTimeout(() => {
                if (star.parentNode) star.remove()
            }, duration * 1000)
        }

        const scheduleNextStar = () => {
            if (!isActive) return
            const delay = Math.random() * 4000 + 2000
            trackTimeout(() => {
                createShootingStar()
                scheduleNextStar()
            }, delay)
        }

        scheduleNextStar()
        trackTimeout(createShootingStar, 2000)

        return () => {
            isActive = false
            timeoutIds.forEach(id => clearTimeout(id))
            timeoutIds.clear()
            if (containerRef.current) {
                containerRef.current.innerHTML = ''
            }
        }
    }, [])

    return <div ref={containerRef} className="shooting-stars-container" />
}

export default ShootingStars
