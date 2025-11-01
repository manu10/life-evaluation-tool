import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Register service worker for notifications (alarm) if supported
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    try { navigator.serviceWorker.register('/immersive-sw.js'); } catch {}
  });
}
