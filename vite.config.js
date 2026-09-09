import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// En local, les routes /api/* sont sur Vercel (serverless).
// On les proxifie vers la prod pour que l’admin puisse charger/sauver.
const API_PROXY_TARGET =
  process.env.VITE_API_PROXY || 'https://greenfit-nu.vercel.app'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: API_PROXY_TARGET,
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
