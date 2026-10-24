import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: { input: { showcase: 'index.html', library: 'library.html', gradientCovers: 'examples/noise-gradient-cover-wall.html' } },
  },
})
