import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light'
          // Aplicar el tema al documento
          if (typeof document !== 'undefined') {
            if (newTheme === 'dark') {
              document.documentElement.classList.add('dark')
            } else {
              document.documentElement.classList.remove('dark')
            }
          }
          return { theme: newTheme }
        }),
      setTheme: (theme: Theme) => {
        if (typeof document !== 'undefined') {
          if (theme === 'dark') {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
        }
        set({ theme })
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        // Aplicar el tema al cargar desde el storage
        if (state && typeof document !== 'undefined') {
          if (state.theme === 'dark') {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
        }
      },
    }
  )
)

