import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // GitHub Pages serves this repository under /TUI/; use / locally and in previews.
  base: process.env.GITHUB_ACTIONS === 'true' ? '/TUI/' : '/',
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
  },
})
