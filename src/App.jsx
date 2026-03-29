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
import { useShallow } from 'zustand/react/shallow'
import './App.css'

// Page order for scroll navigation
const PAGE_ORDER = ['home', 'about', 'projects', 'interesting']

// Must match CSS animation duration in App.css
const TRANSITION_DURATION_MS = 500

function App() {
    const {
        splashState, setSplashState,
        currentPage, setCurrentPage,
        pendingPage, setPendingPage,
        isTransitioning, setIsTransitioning,
        transitionDirection, setTransitionDirection,
        theme, toggleTheme,
        reduceMotion,
        showShootingStars,
        showBackground,
        navPosition, toggleNavPosition,
        initializeSettings
    } = useAppStore(useShallow((state) => ({
        splashState: state.splashState,
        setSplashState: state.setSplashState,
        currentPage: state.currentPage,
        setCurrentPage: state.setCurrentPage,
        pendingPage: state.pendingPage,
        setPendingPage: state.setPendingPage,
        isTransitioning: state.isTransitioning,
        setIsTransitioning: state.setIsTransitioning,
        transitionDirection: state.transitionDirection,
        setTransitionDirection: state.setTransitionDirection,
        theme: state.theme,
        toggleTheme: state.toggleTheme,
        reduceMotion: state.reduceMotion,
        showShootingStars: state.showShootingStars,
        showBackground: state.showBackground,
        navPosition: state.navPosition,
        toggleNavPosition: state.toggleNavPosition,
        initializeSettings: state.initializeSettings,
    })))

    const pageContainerRef = useRef(null)

    useEffect(() => {
        initializeSettings()
    }, [initializeSettings])

    const handleSplashComplete = useCallback(() => {
        setSplashState('dashboard')
    }, [setSplashState])

    const handleNavigate = useCallback((page, direction = null) => {
        if (page === currentPage || isTransitioning) {
            return
        }

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

        setTimeout(() => {
            setCurrentPage(page)
            setPendingPage(null)
            setIsTransitioning(false)
            window.scrollTo(0, 0)
        }, TRANSITION_DURATION_MS)
    }, [reduceMotion, currentPage, isTransitioning, setCurrentPage, setPendingPage, setIsTransitioning, setTransitionDirection])

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

    // Shared page renderer — eliminates duplication between current/pending
    const renderPage = (pageId) => {
        switch (pageId) {
            case 'home':
                return (
                    <LandingPage
                        theme={theme}
                        reduceMotion={reduceMotion}
                        onNavigate={handleNavigate}
                        showShootingStars={showShootingStars}
                    />
                )
            case 'about':
                return (
                    <AboutPage
                        theme={theme}
                        reduceMotion={reduceMotion}
                        showShootingStars={showShootingStars}
                    />
                )
            case 'projects':
                return (
                    <ProjectsPage
                        theme={theme}
                        reduceMotion={reduceMotion}
                        showShootingStars={showShootingStars}
                    />
                )
            case 'interesting':
                return <InterestingPage />
            default:
                return null
        }
    }

    return (
        <>
            {/* Background - DarkVeil dynamically maps colors for dark/light mode */}
            {!reduceMotion && showBackground && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 0, backgroundColor: theme === 'dark' ? '#0b0b12' : '#fdf6e3' }}>
                    <DarkVeil
                        theme={theme}
                        hueShift={theme === 'dark' ? 35 : 0}
                        animateHue={theme === 'dark'}
                        hueSpeed={3}
                        hueMin={320}
                        hueMax={40}
                        noiseIntensity={theme === 'dark' ? 0.02 : 0.02}
                        scanlineIntensity={0}
                        scanlineFrequency={0}
                        speed={theme === 'dark' ? 0.2 : 0.25}
                        warpAmount={theme === 'dark' ? 0 : 0.45}
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
                navPosition={navPosition}
                onToggleNavPosition={toggleNavPosition}
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
                        {renderPage(currentPage)}
                    </div>

                    {/* Incoming Page - slides in */}
                    {isTransitioning && pendingPage && (
                        <div className={`page-wrapper ${getEnteringClass()}`}>
                            {renderPage(pendingPage)}
                        </div>
                    )}
                </div>
            )}
        </>
    )
}

export default App
