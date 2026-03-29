import { useRef } from 'react'
import ThemeToggle from './ThemeToggle'
import AutoVariableProximity from './AutoVariableProximity'

export default function Header({ visible, activePage, onNavigate, onPrefetchPage, theme, onToggleTheme, reduceMotion, navPosition, onToggleNavPosition }) {
    const containerRef = useRef(null)

    return (
        <header ref={containerRef} className={`app-header ${visible ? 'visible' : ''} ${navPosition === 'bottom' ? 'nav-bottom' : ''}`}>
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
                        title="Home"
                    >
                        <img 
                            src={`${import.meta.env.BASE_URL}images/icons/home.png`} 
                            alt="" 
                            className="header-btn-icon" 
                            aria-hidden="true"
                        />
                        <span className="header-btn-text">Home</span>
                    </button>
                    <button
                        type="button"
                        className={`header-btn ${activePage === 'about' ? 'active' : ''}`}
                        onClick={() => onNavigate('about')}
                        onMouseEnter={() => onPrefetchPage?.('about')}
                        onFocus={() => onPrefetchPage?.('about')}
                        title="About"
                    >
                        <img 
                            src={`${import.meta.env.BASE_URL}images/icons/letter-a.gif`} 
                            alt="" 
                            className="header-btn-icon" 
                            aria-hidden="true"
                        />
                        <span className="header-btn-text">About</span>
                    </button>
                    <button
                        type="button"
                        className={`header-btn ${activePage === 'projects' ? 'active' : ''}`}
                        onClick={() => onNavigate('projects')}
                        onMouseEnter={() => onPrefetchPage?.('projects')}
                        onFocus={() => onPrefetchPage?.('projects')}
                        title="Projects"
                    >
                        <img 
                            src={`${import.meta.env.BASE_URL}images/icons/project.png`} 
                            alt="" 
                            className="header-btn-icon" 
                            aria-hidden="true"
                        />
                        <span className="header-btn-text">Projects</span>
                    </button>
                    <button
                        type="button"
                        className={`header-btn ${activePage === 'interesting' ? 'active' : ''}`}
                        onClick={() => onNavigate('interesting')}
                        onMouseEnter={() => onPrefetchPage?.('interesting')}
                        onFocus={() => onPrefetchPage?.('interesting')}
                        title="Interesting"
                    >
                        <img 
                            src={`${import.meta.env.BASE_URL}images/icons/location.png`} 
                            alt="" 
                            className="header-btn-icon" 
                            aria-hidden="true"
                        />
                        <span className="header-btn-text">Interesting</span>
                    </button>

                    <div className="header-actions">
                        <button
                            type="button"
                            className="nav-position-toggle"
                            onClick={onToggleNavPosition}
                            title={navPosition === 'top' ? 'Move nav to bottom' : 'Move nav to top'}
                            aria-label={navPosition === 'top' ? 'Move navigation to bottom' : 'Move navigation to top'}
                        >
                            {navPosition === 'top' ? '↓' : '↑'}
                        </button>
                        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
                    </div>
                </nav>
            </AutoVariableProximity>
        </header>
    )
}
