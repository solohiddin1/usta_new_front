import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const target = env.VITE_BACKEND_URL || env.VITE_API_URL || 'http://127.0.0.1:8000'

  return {
    plugins: [react()],
    server: {
      host: true,
      allowedHosts: true,
      proxy: {
        '/ru/api': {
          target,
          changeOrigin: true,
        },
        '/uz/api': {
          target,
          changeOrigin: true,
        },
        '/media': {
          target,
          changeOrigin: true,
        },
        '/static': {
          target,
          changeOrigin: true,
        },
      },
    },
  }
})
