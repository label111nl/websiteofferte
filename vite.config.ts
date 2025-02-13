import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': [
            'react',
            '@tanstack/react-router',
            '@tanstack/react-query',
          ],
          'ui': [
            '@/components/ui',
          ],
          'auth': [
            '@/store/authStore',
            '@/store/adminAuthStore',
          ],
          'dashboard': [
            '@/components/dashboard',
          ],
        },
      },
    },
  },
  server: {
    port: 3020
  }
}) 