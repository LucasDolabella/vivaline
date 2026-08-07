import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Vivaline',
        short_name: 'Vivaline',
        description: "A visual timeline of a patient's medication history",
        theme_color: '#3b6e64',
        background_color: '#f7f5f0',
        display: 'standalone',
        icons: [],
      },
    }),
  ],
})