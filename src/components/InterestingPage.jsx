import { useRef } from 'react'
import ShootingStars from './ShootingStars'
import AutoVariableProximity from './AutoVariableProximity'
import useAppStore from '../store/useAppStore'

const FONT_SIZE_OPTIONS = ['small', 'medium', 'large']
const FONT_SIZE_LABELS = { small: 'Small', medium: 'Medium', large: 'Large' }

export default function InterestingPage() {
    const containerRef = useRef(null)
    const year = new Date().getFullYear()

    const {
        theme, toggleTheme,
        reduceMotion, toggleReduceMotion,
        cursorGlow, setCursorGlow,
        showShootingStars, setShowShootingStars,
        fontSize, setFontSize,
        highContrast, setHighContrast,
        showBackground, setShowBackground,
    } = useAppStore()

    const nextFontSize = () => {
        const currentIndex = FONT_SIZE_OPTIONS.indexOf(fontSize)
        const nextIndex = (currentIndex + 1) % FONT_SIZE_OPTIONS.length
        setFontSize(FONT_SIZE_OPTIONS[nextIndex])
    }

    return (
        <>
            {theme === 'dark' && !reduceMotion && showShootingStars && <ShootingStars />}

            <div ref={containerRef}>
                <AutoVariableProximity containerRef={containerRef} enabled={!reduceMotion}>
                    <main className="interesting-page">
                        <div className="content-container">
                            <div className="page-header glass-panel">
                                <h1>Interesting Stuff</h1>
                                <p className="lead">Experiments, notes, and small builds — coming soon.</p>
                            </div>

                            <div className="glass-panel page-section">
                                <h2>In progress</h2>
                                <p>
                                    This section will include quick demos, learning notes, and visual experiments.
                                    Until then, the latest updates will be on GitHub.
                                </p>
                                <div className="links">
                                    <a
                                        href="https://github.com/Adon-Paul"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Visit my GitHub →
                                    </a>
                                </div>
                            </div>

                            {/* Settings Section */}
                            <div className="glass-panel page-section settings-section">
                                <h2>Settings</h2>
                                <p className="lead">Customize your experience</p>

                                <div className="settings-grid">
                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <span className="setting-label">Theme</span>
                                            <span className="setting-description">Switch between dark and light mode</span>
                                        </div>
                                        <button
                                            className="setting-toggle"
                                            onClick={toggleTheme}
                                            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                                        >
                                            <span className="toggle-text">{theme === 'dark' ? 'Dark' : 'Light'}</span>
                                        </button>
                                    </div>

                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <span className="setting-label">Reduce Motion</span>
                                            <span className="setting-description">Disable animations for accessibility</span>
                                        </div>
                                        <button
                                            className="setting-toggle"
                                            onClick={toggleReduceMotion}
                                            aria-label={`${reduceMotion ? 'Enable' : 'Disable'} animations`}
                                        >
                                            <span className="toggle-text">{reduceMotion ? 'Off' : 'On'}</span>
                                        </button>
                                    </div>

                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <span className="setting-label">Cursor Glow</span>
                                            <span className="setting-description">Glass lens effect following cursor</span>
                                        </div>
                                        <button
                                            className="setting-toggle"
                                            onClick={() => setCursorGlow(!cursorGlow)}
                                            aria-label={`${cursorGlow ? 'Disable' : 'Enable'} cursor glow`}
                                        >
                                            <span className="toggle-text">{cursorGlow ? 'On' : 'Off'}</span>
                                        </button>
                                    </div>

                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <span className="setting-label">Shooting Stars</span>
                                            <span className="setting-description">Animated stars in dark mode</span>
                                        </div>
                                        <button
                                            className="setting-toggle"
                                            onClick={() => setShowShootingStars(!showShootingStars)}
                                            aria-label={`${showShootingStars ? 'Disable' : 'Enable'} shooting stars`}
                                        >
                                            <span className="toggle-text">{showShootingStars ? 'On' : 'Off'}</span>
                                        </button>
                                    </div>

                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <span className="setting-label">Background Effects</span>
                                            <span className="setting-description">Animated gradient background</span>
                                        </div>
                                        <button
                                            className="setting-toggle"
                                            onClick={() => setShowBackground(!showBackground)}
                                            aria-label={`${showBackground ? 'Disable' : 'Enable'} background effects`}
                                        >
                                            <span className="toggle-text">{showBackground ? 'On' : 'Off'}</span>
                                        </button>
                                    </div>

                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <span className="setting-label">Font Size</span>
                                            <span className="setting-description">Adjust text size for readability</span>
                                        </div>
                                        <button
                                            className="setting-toggle"
                                            onClick={nextFontSize}
                                            aria-label={`Change font size, current: ${fontSize}`}
                                        >
                                            <span className="toggle-text">{FONT_SIZE_LABELS[fontSize]}</span>
                                        </button>
                                    </div>

                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <span className="setting-label">High Contrast</span>
                                            <span className="setting-description">Increase text visibility</span>
                                        </div>
                                        <button
                                            className="setting-toggle"
                                            onClick={() => setHighContrast(!highContrast)}
                                            aria-label={`${highContrast ? 'Disable' : 'Enable'} high contrast`}
                                        >
                                            <span className="toggle-text">{highContrast ? 'On' : 'Off'}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>

                    <footer className="page-footer">© {year} Adon Paul</footer>
                </AutoVariableProximity>
            </div>
        </>
    )
}
