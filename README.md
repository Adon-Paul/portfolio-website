# Portfolio Website

A modern, animated React portfolio website showcasing my projects, skills, and professional journey. Built with Vite, React, and featuring premium visual effects.

## 🌐 Live Site

**[adonpaultomy.wiki](https://adonpaultomy.wiki)**

## ✨ Features

- **Animated Splash Screen**: Typewriter effect with spring physics transitions
- **WebGL Background**: Dynamic nebula shader using OGL
- **Glassmorphism Design**: Modern frosted glass UI components
- **Dark Theme**: Sleek dark mode with neon accents
- **Responsive Design**: Mobile-first approach
- **Smooth Animations**: CSS animations with reduced motion support
- **Client-side Routing**: React-based page navigation

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 18 |
| **Build Tool** | Vite 6 |
| **Styling** | CSS3 (Glassmorphism, Animations) |
| **WebGL** | OGL (Shader background) |
| **Fonts** | Inter, Quantico, Space Grotesk |
| **Deployment** | GitHub Pages |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/Adon-Paul/portfolio-website.git
cd portfolio-website

# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at **http://localhost:3000**

### Build for Production
```bash
npm run build
npm run preview
```

## 🗂️ Project Structure

```
portfolio-website/
├── index.html              # Vite entry point
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies
│
├── src/
│   ├── main.jsx            # React entry point
│   ├── App.jsx             # Main app component
│   ├── components/
│   │   ├── SplashScreen.jsx    # Animated intro
│   │   ├── LandingPage.jsx     # Home page
│   │   ├── AboutPage.jsx       # About me page
│   │   ├── ProjectsPage.jsx    # Projects page (placeholder)
│   │   ├── InterestingPage.jsx # Interesting page (placeholder)
│   │   ├── Header.jsx          # Navigation header
│   │   ├── DarkVeil.jsx        # WebGL shader background
│   │   ├── ShootingStars.jsx   # Star animations
│   │   ├── FluidGlass.jsx      # Cursor lens effect
│   │   ├── GlassCursor.jsx     # Glass cursor follower
│   │   └── ThemeToggle.jsx     # Theme switcher
│   └── styles/
│       └── landing.css         # All styles
│
├── images/
│   └── profile/            # Profile photos
│
├── public/
│   └── CNAME               # Custom domain config
│
└── .github/
    └── workflows/
        └── deploy.yml      # GitHub Pages deployment
```

## 🎨 Key Components

### SplashScreen
Typewriter animation with spring physics for smooth circle-wipe transition.

### DarkVeil
WebGL CPPN neural network shader creating flowing nebula background effect.

### LandingPage
Hero section with profile image, glassmorphism content card, and social links.

### AboutPage
Biography, tech stack display, and architecture expertise showcase.

## 📱 Pages

| Page | Description |
|------|-------------|
| **Home** | Profile hero with social links |
| **About** | Bio, skills, and expertise |
| **Projects** | Placeholder page (links to GitHub) |
| **Interesting Stuff** | Placeholder page (links to GitHub) |

## 🚀 Deployment

The site automatically deploys to GitHub Pages when pushing to `main`:

1. GitHub Actions builds the Vite project
2. Output is deployed to GitHub Pages
3. Custom domain `adonpaultomy.wiki` is configured via CNAME

## 📞 Contact

- **GitHub**: [@Adon-Paul](https://github.com/Adon-Paul)
- **Email**: [adonpaultomy@gmail.com](mailto:adonpaultomy@gmail.com)
- **LinkedIn**: [Adon Paul Tomy](https://linkedin.com/in/adon-paul-tomy)
- **Website**: [adonpaultomy.wiki](https://adonpaultomy.wiki)

---

⭐ Star this repository if you find it helpful!
