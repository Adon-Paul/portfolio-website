import { useEffect, useCallback, useRef } from 'react'
import SplashScreen from './components/SplashScreen'
import LandingPage from './components/LandingPage'
import Header from './components/Header'
import DarkVeil from './components/DarkVeil'
import AboutPage from './components/AboutPage'
import ProjectsPage from './components/ProjectsPage'
import InterestingPage from './components/InterestingPage'
import GradualBlur from './components/GradualBlur'
import useAppStore from './store/useAppStore'
import './App.css'

// Page order for scroll navigation
const PAGE_ORDER = ['home', 'about', 'projects', 'interesting']

function App() {
    const {
        splashState, setSplashState,
        currentPage, setCurrentPage,
        pendingPage, setPendingPage,
        isTransitioning, setIsTransitioning,
        transitionDirection, setTransitionDirection,
        theme, toggleTheme,
        reduceMotion,
        cursorGlow, setCursorGlow,
        showShootingStars, setShowShootingStars,
        fontSize, setFontSize,
        highContrast, setHighContrast,
        showBackground, setShowBackground,
        initializeSettings
    } = useAppStore()

    // Refs for scroll detection
    const pageContainerRef = useRef(null)

    useEffect(() => {
        initializeSettings()
    }, [initializeSettings])

    const handleSplashComplete = () => {
        setSplashState('dashboard')
    }

    // Get next/previous page
    const getAdjacentPage = useCallback((direction) => {
        const currentIndex = PAGE_ORDER.indexOf(currentPage)
        if (direction === 'next' && currentIndex < PAGE_ORDER.length - 1) {
            return PAGE_ORDER[currentIndex + 1]
        }
        if (direction === 'prev' && currentIndex > 0) {
            return PAGE_ORDER[currentIndex - 1]
        }
        return null
    }, [currentPage])

    // Handle page navigation with slide transition
    const handleNavigate = useCallback((page, direction = null) => {
        if (page === currentPage || isTransitioning) {
            return
        }

        // Determine direction if not specified
        if (!direction) {
            const currentIndex = PAGE_ORDER.indexOf(currentPage)
            const targetIndex = PAGE_ORDER.indexOf(page)
            direction = targetIndex > currentIndex ? 'forward' : 'backward'
        }

        if (reduceMotion) {
            setCurrentPage(page)
            return
        }

        setTransitionDirection(direction)
        setPendingPage(page)
        setIsTransitioning(true)

        // After animation completes, update current page
        setTimeout(() => {
            setCurrentPage(page)
            setPendingPage(null)
            setIsTransitioning(false)
            // Reset scroll position for new page
            window.scrollTo(0, 0)
        }, 500)
    }, [reduceMotion, currentPage, isTransitioning, setCurrentPage, setPendingPage, setIsTransitioning, setTransitionDirection])

    // Determine animation classes based on direction
    const getExitingClass = () => {
        return transitionDirection === 'forward'
            ? 'page-wrapper--exiting'
            : 'page-wrapper--exiting-reverse'
    }

    const getEnteringClass = () => {
        return transitionDirection === 'forward'
            ? 'page-wrapper--entering'
            : 'page-wrapper--entering-reverse'
    }

    return (
        <>
            {/* Background - DarkVeil only in dark mode when enabled */}
            {theme === 'dark' && !reduceMotion && showBackground && (
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
                <div className="page-container" ref={pageContainerRef}>
                    <GradualBlur
                        target="page"
                        position="bottom"
                        height="6rem"
                        strength={1.2}
                        divCount={6}
                        curve="bezier"
                        exponential
                        opacity={0.45}
                        zIndex={5}
                    />
                    {/* Current Page - slides out */}
                    <div className={`page-wrapper ${isTransitioning ? getExitingClass() : ''}`}>
                        {currentPage === 'home' && (
                            <LandingPage
                                theme={theme}
                                reduceMotion={reduceMotion}
                                onNavigate={handleNavigate}
                                showShootingStars={showShootingStars}
                            />
                        )}
                        {currentPage === 'about' && (
                            <AboutPage
                                theme={theme}
                                reduceMotion={reduceMotion}
                                showShootingStars={showShootingStars}
                            />
                        )}
                        {currentPage === 'projects' && (
                            <ProjectsPage
                                theme={theme}
                                reduceMotion={reduceMotion}
                                showShootingStars={showShootingStars}
                            />
                        )}
                        {currentPage === 'interesting' && (
                            <InterestingPage
                                theme={theme}
                                reduceMotion={reduceMotion}
                                onToggleTheme={toggleTheme}
                                onToggleMotion={() => useAppStore.getState().setReduceMotion(!reduceMotion)}
                                cursorGlow={cursorGlow}
                                onToggleCursorGlow={() => setCursorGlow(!cursorGlow)}
                                showShootingStars={showShootingStars}
                                onToggleShootingStars={() => setShowShootingStars(!showShootingStars)}
                                fontSize={fontSize}
                                onChangeFontSize={setFontSize}
                                highContrast={highContrast}
                                onToggleHighContrast={() => setHighContrast(!highContrast)}
                                showBackground={showBackground}
                                onToggleBackground={() => setShowBackground(!showBackground)}
                            />
                        )}
                    </div>

                    {/* Incoming Page - slides in */}
                    {isTransitioning && pendingPage && (
                        <div className={`page-wrapper ${getEnteringClass()}`}>
                            {pendingPage === 'home' && (
                                <LandingPage
                                    theme={theme}
                                    reduceMotion={reduceMotion}
                                    onNavigate={handleNavigate}
                                    showShootingStars={showShootingStars}
                                />
                            )}
                            {pendingPage === 'about' && (
                                <AboutPage
                                    theme={theme}
                                    reduceMotion={reduceMotion}
                                    showShootingStars={showShootingStars}
                                />
                            )}
                            {pendingPage === 'projects' && (
                                <ProjectsPage
                                    theme={theme}
                                    reduceMotion={reduceMotion}
                                    showShootingStars={showShootingStars}
                                />
                            )}
                            {pendingPage === 'interesting' && (
                                <InterestingPage
                                    theme={theme}
                                    reduceMotion={reduceMotion}
                                    onToggleTheme={toggleTheme}
                                    onToggleMotion={() => useAppStore.getState().setReduceMotion(!reduceMotion)}
                                    cursorGlow={cursorGlow}
                                    onToggleCursorGlow={() => setCursorGlow(!cursorGlow)}
                                    showShootingStars={showShootingStars}
                                    onToggleShootingStars={() => setShowShootingStars(!showShootingStars)}
                                    fontSize={fontSize}
                                    onChangeFontSize={setFontSize}
                                    highContrast={highContrast}
                                    onToggleHighContrast={() => setHighContrast(!highContrast)}
                                    showBackground={showBackground}
                                    onToggleBackground={() => setShowBackground(!showBackground)}
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
