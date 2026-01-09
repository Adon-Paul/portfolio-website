function ThemeToggle({ theme, onToggle }) {
    return (
        <button
            className="theme-toggle"
            onClick={onToggle}
            aria-label="Toggle dark and light mode"
            aria-pressed={theme === 'light'}
        >
            <span className="knob" aria-hidden="true"></span>
        </button>
    )
}

export default ThemeToggle
