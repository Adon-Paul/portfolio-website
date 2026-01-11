import { useState, useEffect, useCallback } from 'react'
import SplashScreen from './components/SplashScreen'
import LandingPage from './components/LandingPage'
import Header from './components/Header'
import DarkVeil from './components/DarkVeil'
import AboutPage from './components/AboutPage'
import ProjectsPage from './components/ProjectsPage'
import InterestingPage from './components/InterestingPage'
import GradualBlur from './components/GradualBlur'
import './App.css'

function App() {
    const [splashState, setSplashState] = useState('intro') // 'intro' | 'dashboard'
    const [currentPage, setCurrentPage] = useState('home') // 'home' | 'about' | 'projects' | 'interesting'
    const [pendingPage, setPendingPage] = useState(null)
    const [isTransitioning, setIsTransitioning] = useState(false)
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

    // Handle page navigation with slide transition
    const handleNavigate = useCallback((page) => {
        if (page === currentPage || isTransitioning) {
            return
        }
        
        if (reduceMotion) {
            setCurrentPage(page)
            return
        }
        
        setPendingPage(page)
        setIsTransitioning(true)
        
        // After animation completes, update current page
        setTimeout(() => {
            setCurrentPage(page)
            setPendingPage(null)
            setIsTransitioning(false)
        }, 500)
    }, [reduceMotion, currentPage, isTransitioning])

    return (
        <>
            {/* Background - DarkVeil only in dark mode */}
            {theme === 'dark' && !reduceMotion && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 0, backgroundColor: '#0b0b12' }}>
                    <DarkVeil
                        hueShift={35} // Base hue
                        animateHue
                        hueSpeed={3}
                        hueMin={320}
                        hueMax={40}
                        noiseIntensity={0.02}
                        scanlineIntensity={0} // Removed scanlines
                        scanlineFrequency={0}
                        speed={0.2} // Slow movement for background
                    />
                </div>
            )}

            {/* Splash Screen */}
            <SplashScreen
                state={splashState}
                onComplete={handleSplashComplete}
                reduceMotion={reduceMotion}
            />

            {/* Persistent Header - appears on dashboard */}
            <Header
                visible={splashState === 'dashboard'}
                activePage={currentPage}
                onNavigate={handleNavigate}
                theme={theme}
                onToggleTheme={toggleTheme}
                reduceMotion={reduceMotion}
            />

            {/* Main Content with Slide Transitions */}
            {splashState === 'dashboard' && (
                <div className="page-container">
                    <GradualBlur
                        target="page"
                        position="bottom"
                        height="6rem"
                        strength={2}
                        divCount={6}
                        curve="bezier"
                        exponential
                        opacity={1}
                        zIndex={5}
                    />
                    {/* Current Page - slides out */}
                    <div className={`page-wrapper ${isTransitioning ? 'page-wrapper--exiting' : ''}`}>
                        {currentPage === 'home' && (
                            <LandingPage
                                theme={theme}
                                reduceMotion={reduceMotion}
                                onNavigate={handleNavigate}
                            />
                        )}
                        {currentPage === 'about' && (
                            <AboutPage
                                theme={theme}
                                reduceMotion={reduceMotion}
                            />
                        )}
                        {currentPage === 'projects' && (
                            <ProjectsPage
                                theme={theme}
                                reduceMotion={reduceMotion}
                            />
                        )}
                        {currentPage === 'interesting' && (
                            <InterestingPage
                                theme={theme}
                                reduceMotion={reduceMotion}
                            />
                        )}
                    </div>
                    
                    {/* Incoming Page - slides in */}
                    {isTransitioning && pendingPage && (
                        <div className="page-wrapper page-wrapper--entering">
                            {pendingPage === 'home' && (
                                <LandingPage
                                    theme={theme}
                                    reduceMotion={reduceMotion}
                                    onNavigate={handleNavigate}
                                />
                            )}
                            {pendingPage === 'about' && (
                                <AboutPage
                                    theme={theme}
                                    reduceMotion={reduceMotion}
                                />
                            )}
                            {pendingPage === 'projects' && (
                                <ProjectsPage
                                    theme={theme}
                                    reduceMotion={reduceMotion}
                                />
                            )}
                            {pendingPage === 'interesting' && (
                                <InterestingPage
                                    theme={theme}
                                    reduceMotion={reduceMotion}
                                />
                            )}
                        </div>
                    )}
                </div>
            )}


        </>
    )
}

export default App
