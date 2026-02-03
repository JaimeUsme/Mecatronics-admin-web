import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './shared/i18n/config'
import App from './app/App.tsx'

// Inicializar el tema antes de renderizar
const initializeTheme = () => {
  const storedTheme = localStorage.getItem('theme-storage')
  if (storedTheme) {
    try {
      const parsed = JSON.parse(storedTheme)
      if (parsed.state?.theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    } catch {
      document.documentElement.classList.remove('dark')
    }
  } else {
    // Por defecto, tema claro
    document.documentElement.classList.remove('dark')
  }
}

initializeTheme()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
