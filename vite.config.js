import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    base: './',
    plugins: [react()],
    assetsInclude: ['**/*.glb'],
    server: {
        port: 3000,
        open: true
    },
    build: {
        outDir: 'dist',
        rollupOptions: {
            output: {
                manualChunks: {
                    'three-stack': ['three', '@react-three/fiber', '@react-three/drei', '@react-three/rapier', 'meshline'],
                    'animation-stack': ['gsap', 'motion'],
                    'ogl-stack': ['ogl']
                }
            }
        }
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/test/setup.js',
        css: true,
    }
})