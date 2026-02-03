import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import es from './locales/es.json'
import en from './locales/en.json'

const resources = {
  es: {
    translation: es,
  },
  en: {
    translation: en,
  },
}

const savedLanguage = localStorage.getItem('language-storage')
let initialLanguage = 'es'

if (savedLanguage) {
  try {
    const parsed = JSON.parse(savedLanguage)
    if (parsed.state?.language) {
      initialLanguage = parsed.state.language
    }
  } catch {
    // Si hay error, usar español por defecto
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLanguage,
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n

