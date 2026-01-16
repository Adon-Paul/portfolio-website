import { useRef, useState } from 'react'
import ShootingStars from './ShootingStars'
import AutoVariableProximity from './AutoVariableProximity'

export default function InterestingPage({
    theme,
    reduceMotion,
    onToggleTheme,
    onToggleMotion,
    cursorGlow,
    onToggleCursorGlow,
    showShootingStars,
    onToggleShootingStars,
    fontSize,
    onChangeFontSize,
    highContrast,
    onToggleHighContrast,
    showBackground,
    onToggleBackground
}) {
    const [year] = useState(new Date().getFullYear())
    const containerRef = useRef(null)

    const fontSizeOptions = ['small', 'medium', 'large']
    const nextFontSize = () => {
        const currentIndex = fontSizeOptions.indexOf(fontSize)
        const nextIndex = (currentIndex + 1) % fontSizeOptions.length
        onChangeFontSize(fontSizeOptions[nextIndex])
    }

    const fontSizeLabels = { small: 'Small', medium: 'Medium', large: 'Large' }

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
                                    {/* Theme */}
                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <span className="setting-label">Theme</span>
                                            <span className="setting-description">Switch between dark and light mode</span>
                                        </div>
                                        <button
                                            className="setting-toggle"
                                            onClick={onToggleTheme}
                                            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                                        >
                                            <span className="toggle-text">{theme === 'dark' ? 'Dark' : 'Light'}</span>
                                        </button>
                                    </div>

                                    {/* Reduce Motion */}
                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <span className="setting-label">Reduce Motion</span>
                                            <span className="setting-description">Disable animations for accessibility</span>
                                        </div>
                                        <button
                                            className="setting-toggle"
                                            onClick={onToggleMotion}
                                            aria-label={`${reduceMotion ? 'Enable' : 'Disable'} animations`}
                                        >
                                            <span className="toggle-text">{reduceMotion ? 'Off' : 'On'}</span>
                                        </button>
                                    </div>

                                    {/* Cursor Glow */}
                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <span className="setting-label">Cursor Glow</span>
                                            <span className="setting-description">Glass lens effect following cursor</span>
                                        </div>
                                        <button
                                            className="setting-toggle"
                                            onClick={onToggleCursorGlow}
                                            aria-label={`${cursorGlow ? 'Disable' : 'Enable'} cursor glow`}
                                        >
                                            <span className="toggle-text">{cursorGlow ? 'On' : 'Off'}</span>
                                        </button>
                                    </div>

                                    {/* Shooting Stars */}
                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <span className="setting-label">Shooting Stars</span>
                                            <span className="setting-description">Animated stars in dark mode</span>
                                        </div>
                                        <button
                                            className="setting-toggle"
                                            onClick={onToggleShootingStars}
                                            aria-label={`${showShootingStars ? 'Disable' : 'Enable'} shooting stars`}
                                        >
                                            <span className="toggle-text">{showShootingStars ? 'On' : 'Off'}</span>
                                        </button>
                                    </div>

                                    {/* Background Effects */}
                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <span className="setting-label">Background Effects</span>
                                            <span className="setting-description">Animated gradient background</span>
                                        </div>
                                        <button
                                            className="setting-toggle"
                                            onClick={onToggleBackground}
                                            aria-label={`${showBackground ? 'Disable' : 'Enable'} background effects`}
                                        >
                                            <span className="toggle-text">{showBackground ? 'On' : 'Off'}</span>
                                        </button>
                                    </div>

                                    {/* Font Size */}
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
                                            <span className="toggle-text">{fontSizeLabels[fontSize]}</span>
                                        </button>
                                    </div>

                                    {/* High Contrast */}
                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <span className="setting-label">High Contrast</span>
                                            <span className="setting-description">Increase text visibility</span>
                                        </div>
                                        <button
                                            className="setting-toggle"
                                            onClick={onToggleHighContrast}
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
