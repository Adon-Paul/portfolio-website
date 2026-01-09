import { useState, useEffect } from 'react'
import SplashScreen from './components/SplashScreen'
import LandingPage from './components/LandingPage'
import FluidGlass from './components/FluidGlass'
import Header from './components/Header'
import DarkVeil from './components/DarkVeil'

function App() {
    const [splashState, setSplashState] = useState('intro') // 'intro' | 'dashboard'
    const [theme, setTheme] = useState('dark')
    const [reduceMotion, setReduceMotion] = useState(false)

    useEffect(() => {
        // Check for reduced motion preference
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
        setReduceMotion(motionQuery.matches)

        // Check for saved theme
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme) {
            setTheme(savedTheme)
            document.documentElement.setAttribute('data-theme', savedTheme)
        }
    }, [])

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark'
        setTheme(newTheme)
        localStorage.setItem('theme', newTheme)
        document.documentElement.setAttribute('data-theme', newTheme)
    }

    const handleSplashComplete = () => {
        setSplashState('dashboard')
    }

    return (
        <>
            {/* Background - DarkVeil only in dark mode */}
            {theme === 'dark' && !reduceMotion && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 0, backgroundColor: '#0b0b12' }}>
                    <DarkVeil
                        hueShift={35} // Adjusted for Blue (was 215 which was Yellow)
                        noiseIntensity={0.02}
                        scanlineIntensity={0} // Removed scanlines
                        scanlineFrequency={0}
                        speed={0.2} // Slow movement for background
                    />
                </div>
            )}

            {/* Persistent Header - appears on dashboard */}
            <Header
                visible={splashState === 'dashboard'}
                theme={theme}
                onToggle={toggleTheme}
            />

            {/* Splash Screen */}
            <SplashScreen
                state={splashState}
                onComplete={handleSplashComplete}
                reduceMotion={reduceMotion}
            />

            {/* Main Content */}
            {splashState === 'dashboard' && (
                <LandingPage
                    theme={theme}
                    // onThemeToggle removed (moved to header)
                    reduceMotion={reduceMotion}
                />
            )}

            {/* Fluid Glass Lens - Only in dark mode after splash */}
            {splashState === 'dashboard' && !reduceMotion && theme === 'dark' && (
                <FluidGlass
                    size={180}
                    distortion={40}
                    blur={0.5}
                />
            )}
        </>
    )
}

export default App
