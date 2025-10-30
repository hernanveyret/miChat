import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'robots.txt',
        'apple-touch-icon.png',
        'icons/icon-192x192.png',
        'icons/icon-512x512.png'
      ],
      manifest: {
        name: 'MiChat',
        short_name: 'MiChat',
        description: 'Una app de chat al estilo WhatsApp creada con React y Vite',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#25D366', // verde estilo WhatsApp
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'firebase-data',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 1 día
              }
            }
          },
          {
            urlPattern: /^https:\/\/firebasestorage\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'firebase-storage',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 1 semana
              }
            }
          }
        ]
      }
    })
  ]
})
