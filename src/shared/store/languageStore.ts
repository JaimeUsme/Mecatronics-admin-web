import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import i18n from '@/shared/i18n/config'

type Language = 'es' | 'en'

interface LanguageState {
  language: Language
  setLanguage: (language: Language) => void
}

const getInitialLanguage = (): Language => {
  const saved = localStorage.getItem('language-storage')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (parsed.state?.language) {
        return parsed.state.language
      }
    } catch {
      // Si hay error, usar español por defecto
    }
  }
  return 'es'
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: getInitialLanguage(),
      setLanguage: (language: Language) => {
        i18n.changeLanguage(language)
        set({ language })
      },
    }),
    {
      name: 'language-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          i18n.changeLanguage(state.language)
        }
      },
    }
  )
)

