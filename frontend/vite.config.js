import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'https://smart-campus-lost-found-n7sx.onrender.com',
      '/uploads': 'https://smart-campus-lost-found-n7sx.onrender.com',
    },
  },
})
