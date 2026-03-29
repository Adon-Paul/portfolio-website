import { useRef } from 'react'
import ShootingStars from './ShootingStars'
import AutoVariableProximity from './AutoVariableProximity'
import useAppStore from '../store/useAppStore'
import { useShallow } from 'zustand/react/shallow'
import '../styles/components/projects.css'

const FONT_SIZE_OPTIONS = ['small', 'medium', 'large']
const FONT_SIZE_LABELS = { small: 'S', medium: 'M', large: 'L' }

function ToggleSwitch({ isOn, onToggle, ariaLabel }) {
    return (
        <button
            className={`toggle-switch ${isOn ? 'toggle-on' : ''}`}
            onClick={onToggle}
            aria-label={ariaLabel}
            role="switch"
            aria-checked={isOn}
        >
            <span className="toggle-knob" />
        </button>
    )
}

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
    } = useAppStore(useShallow((state) => ({
        theme: state.theme,
        toggleTheme: state.toggleTheme,
        reduceMotion: state.reduceMotion,
        toggleReduceMotion: state.toggleReduceMotion,
        cursorGlow: state.cursorGlow,
        setCursorGlow: state.setCursorGlow,
        showShootingStars: state.showShootingStars,
        setShowShootingStars: state.setShowShootingStars,
        fontSize: state.fontSize,
        setFontSize: state.setFontSize,
        highContrast: state.highContrast,
        setHighContrast: state.setHighContrast,
        showBackground: state.showBackground,
        setShowBackground: state.setShowBackground,
    })))

    return (
        <>
            {theme === 'dark' && !reduceMotion && showShootingStars && <ShootingStars />}

            <div ref={containerRef}>
                <AutoVariableProximity containerRef={containerRef} enabled={!reduceMotion}>
                    <main className="interesting-page">
                        <div className="content-container">
                            <div className="page-header glass-panel">
                                <h1>Experiments & Customization</h1>
                                <p className="lead">Quick demos, visual experiments, and site personalization.</p>
                            </div>

                            <div className="glass-panel page-section">
                                <h2>About This Site</h2>
                                <p>
                                    This portfolio is built with React, Vite, and cutting-edge web tech including
                                    Three.js for 3D physics, OGL for generative WebGL shaders, and GSAP for card animations.
                                    It's designed to be fast, accessible, and visually engaging.
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
                                <h2>Personalize</h2>
                                <p className="lead">Make this site yours</p>

                                <div className="settings-group">
                                    <h3 className="settings-group-title">Appearance</h3>
                                    <div className="settings-grid">
                                        <div className="setting-item">
                                            <div className="setting-info">
                                                <span className="setting-label">Dark Mode</span>
                                                <span className="setting-description">Switch between dark and light</span>
                                            </div>
                                            <ToggleSwitch
                                                isOn={theme === 'dark'}
                                                onToggle={toggleTheme}
                                                ariaLabel={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                                            />
                                        </div>

                                        <div className="setting-item">
                                            <div className="setting-info">
                                                <span className="setting-label">High Contrast</span>
                                                <span className="setting-description">Increase text visibility</span>
                                            </div>
                                            <ToggleSwitch
                                                isOn={highContrast}
                                                onToggle={() => setHighContrast(!highContrast)}
                                                ariaLabel={`${highContrast ? 'Disable' : 'Enable'} high contrast`}
                                            />
                                        </div>

                                        <div className="setting-item">
                                            <div className="setting-info">
                                                <span className="setting-label">Font Size</span>
                                                <span className="setting-description">Adjust text size</span>
                                            </div>
                                            <div className="font-size-selector">
                                                {FONT_SIZE_OPTIONS.map((size) => (
                                                    <button
                                                        key={size}
                                                        className={`font-size-btn ${fontSize === size ? 'active' : ''}`}
                                                        onClick={() => setFontSize(size)}
                                                        aria-label={`Set font size to ${size}`}
                                                    >
                                                        {FONT_SIZE_LABELS[size]}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="settings-group">
                                    <h3 className="settings-group-title">Effects</h3>
                                    <div className="settings-grid">
                                        <div className="setting-item">
                                            <div className="setting-info">
                                                <span className="setting-label">Background Effects</span>
                                                <span className="setting-description">Animated gradient background</span>
                                            </div>
                                            <ToggleSwitch
                                                isOn={showBackground}
                                                onToggle={() => setShowBackground(!showBackground)}
                                                ariaLabel={`${showBackground ? 'Disable' : 'Enable'} background effects`}
                                            />
                                        </div>

                                        <div className="setting-item">
                                            <div className="setting-info">
                                                <span className="setting-label">Shooting Stars</span>
                                                <span className="setting-description">Animated stars in dark mode</span>
                                            </div>
                                            <ToggleSwitch
                                                isOn={showShootingStars}
                                                onToggle={() => setShowShootingStars(!showShootingStars)}
                                                ariaLabel={`${showShootingStars ? 'Disable' : 'Enable'} shooting stars`}
                                            />
                                        </div>

                                        <div className="setting-item">
                                            <div className="setting-info">
                                                <span className="setting-label">Cursor Glow</span>
                                                <span className="setting-description">Glass lens following cursor</span>
                                            </div>
                                            <ToggleSwitch
                                                isOn={cursorGlow}
                                                onToggle={() => setCursorGlow(!cursorGlow)}
                                                ariaLabel={`${cursorGlow ? 'Disable' : 'Enable'} cursor glow`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="settings-group">
                                    <h3 className="settings-group-title">Accessibility</h3>
                                    <div className="settings-grid">
                                        <div className="setting-item">
                                            <div className="setting-info">
                                                <span className="setting-label">Reduce Motion</span>
                                                <span className="setting-description">Disable animations</span>
                                            </div>
                                            <ToggleSwitch
                                                isOn={reduceMotion}
                                                onToggle={toggleReduceMotion}
                                                ariaLabel={`${reduceMotion ? 'Enable' : 'Disable'} animations`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>

                    <footer className="page-footer">&copy; {year} Adon Paul</footer>
                </AutoVariableProximity>
            </div>
        </>
    )
}
