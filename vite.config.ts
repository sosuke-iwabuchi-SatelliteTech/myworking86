/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const getBuildVersion = () => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('ja-JP', {
        timeZone: 'Asia/Tokyo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    const parts = formatter.formatToParts(now);
    const getPart = (type: string) => parts.find(p => p.type === type)?.value || '00';
    return `v${getPart('year')}${getPart('month')}${getPart('day')}-${getPart('hour')}${getPart('minute')}`;
};

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    define: {
        __BUILD_VERSION__: JSON.stringify(getBuildVersion()),
    },
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
