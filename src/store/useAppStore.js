import { create } from 'zustand'

const useAppStore = create((set) => ({
  // Navigation State
  splashState: 'intro',
  currentPage: 'home',
  pendingPage: null,
  isTransitioning: false,
  transitionDirection: 'forward',
  
  // Theme & Accessibility
  theme: 'dark',
  reduceMotion: false,
  cursorGlow: true,
  showShootingStars: true,
  fontSize: 'medium',
  highContrast: false,
  showBackground: true,

  // Actions
  setSplashState: (state) => set({ splashState: state }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setPendingPage: (page) => set({ pendingPage: page }),
  setIsTransitioning: (isTransitioning) => set({ isTransitioning }),
  setTransitionDirection: (direction) => set({ transitionDirection: direction }),
  
  setTheme: (theme) => {
    set({ theme })
    localStorage.setItem('theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  },
  
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark'
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    return { theme: newTheme }
  }),

  setReduceMotion: (reduceMotion) => set({ reduceMotion }),
  
  setCursorGlow: (cursorGlow) => {
    set({ cursorGlow })
    localStorage.setItem('cursorGlow', cursorGlow)
    document.documentElement.setAttribute('data-cursor-glow', cursorGlow)
  },
  
  setShowShootingStars: (showShootingStars) => {
    set({ showShootingStars })
    localStorage.setItem('showShootingStars', showShootingStars)
  },
  
  setFontSize: (fontSize) => {
    set({ fontSize })
    localStorage.setItem('fontSize', fontSize)
    document.documentElement.setAttribute('data-font-size', fontSize)
  },
  
  setHighContrast: (highContrast) => {
    set({ highContrast })
    localStorage.setItem('highContrast', highContrast)
    document.documentElement.setAttribute('data-high-contrast', highContrast)
  },
  
  setShowBackground: (showBackground) => {
    set({ showBackground })
    localStorage.setItem('showBackground', showBackground)
  },

  // Initializer to read from localStorage/Media Query
  initializeSettings: () => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    set({ reduceMotion: motionQuery.matches })

    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      set({ theme: savedTheme })
      document.documentElement.setAttribute('data-theme', savedTheme)
    }

    const savedCursorGlow = localStorage.getItem('cursorGlow')
    if (savedCursorGlow !== null) {
        const val = savedCursorGlow === 'true'
        set({ cursorGlow: val })
        document.documentElement.setAttribute('data-cursor-glow', val)
    }

    const savedShootingStars = localStorage.getItem('showShootingStars')
    if (savedShootingStars !== null) set({ showShootingStars: savedShootingStars === 'true' })

    const savedFontSize = localStorage.getItem('fontSize')
    if (savedFontSize) {
        set({ fontSize: savedFontSize })
        document.documentElement.setAttribute('data-font-size', savedFontSize)
    }

    const savedHighContrast = localStorage.getItem('highContrast')
    if (savedHighContrast !== null) {
        const val = savedHighContrast === 'true'
        set({ highContrast: val })
        document.documentElement.setAttribute('data-high-contrast', val)
    }

    const savedShowBackground = localStorage.getItem('showBackground')
    if (savedShowBackground !== null) set({ showBackground: savedShowBackground === 'true' })
  }
}))

export default useAppStore
