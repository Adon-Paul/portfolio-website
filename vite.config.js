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
        outDir: 'dist'
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/test/setup.js',
        css: true,
    }
})