/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    publicDir: 'static', // Static assets that will be copied to outDir
    build: {
        outDir: 'public',
        emptyOutDir: true, // Safe: static assets from 'static/' will be copied after clearing
    },
    test: {
        globals: true,
        environment: 'jsdom',
        include: ['tests/**/*.{test,spec}.{js,ts,jsx,tsx}'],
        exclude: ['tests/e2e/**', 'node_modules/**'],
    },
})
