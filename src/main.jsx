import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Render principal
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)

// 👇 Registro del Service Worker (PWA)
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('Hay una nueva versión de MiChat disponible. ¿Actualizar ahora?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('✅ MiChat está lista para usarse sin conexión')
  },
})
