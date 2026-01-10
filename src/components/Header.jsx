import { useRef } from 'react'
import ThemeToggle from './ThemeToggle'
import AutoVariableProximity from './AutoVariableProximity'

export default function Header({ visible, activePage, onNavigate, theme, onToggleTheme, reduceMotion }) {
    const containerRef = useRef(null)

    return (
        <header ref={containerRef} className={`app-header ${visible ? 'visible' : ''}`}>
            <AutoVariableProximity containerRef={containerRef} enabled={!reduceMotion}>
                <button
                    type="button"
                    className="brand-name brand-button"
                    onClick={() => onNavigate('home')}
                >
                    Adon Paul Tomy
                </button>

                <nav className="header-nav" aria-label="Primary">
                    <button
                        type="button"
                        className={`header-btn ${activePage === 'home' ? 'active' : ''}`}
                        onClick={() => onNavigate('home')}
                    >
                        Home
                    </button>
                    <button
                        type="button"
                        className={`header-btn ${activePage === 'about' ? 'active' : ''}`}
                        onClick={() => onNavigate('about')}
                    >
                        About
                    </button>
                    <button
                        type="button"
                        className={`header-btn ${activePage === 'projects' ? 'active' : ''}`}
                        onClick={() => onNavigate('projects')}
                    >
                        Projects
                    </button>
                    <button
                        type="button"
                        className={`header-btn ${activePage === 'interesting' ? 'active' : ''}`}
                        onClick={() => onNavigate('interesting')}
                    >
                        Interesting
                    </button>

                    <div className="header-actions">
                        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
                    </div>
                </nav>
            </AutoVariableProximity>
        </header>
    )
}
