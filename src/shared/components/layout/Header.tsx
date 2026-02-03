import { Search, Moon, Sun, Bell, Menu } from 'lucide-react'
import { useThemeStore, useLanguageStore } from '@/shared/store'
import { useTranslation } from '@/shared/i18n'
import { useSidebar } from '@/shared/hooks'
import { cn } from '@/shared/utils'

export function Header() {
  const { theme, toggleTheme } = useThemeStore()
  const { language, setLanguage } = useLanguageStore()
  const { t } = useTranslation()
  const { isOpen, isMobile, toggle } = useSidebar()

  return (
    <header className="sticky top-0 z-40 border-b bg-background w-full">
      <div className="flex h-16 items-center justify-between gap-2 sm:gap-4 px-3 sm:px-6 w-full">
        {/* Botón hamburguesa para móvil */}
        {isMobile && !isOpen && (
          <button
            onClick={toggle}
            className="p-2 rounded-md hover:bg-accent transition-colors md:hidden"
            aria-label={t('common.openMenu')}
            title={t('common.openMenu')}
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        {/* Campo de búsqueda - oculto en móvil muy pequeño */}
        <div className="hidden sm:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder={t('common.search')}
              className={cn(
                'w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2',
                'text-sm placeholder:text-muted-foreground',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
              )}
            />
          </div>
        </div>

        {/* Acciones del header - alineadas a la derecha */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4 ml-auto">
          {/* Toggle de tema */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-accent transition-colors"
            aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* Selector de idioma - más compacto en móvil */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'es' | 'en')}
            className={cn(
              'px-2 sm:px-3 py-2 rounded-md border border-input bg-background text-xs sm:text-sm',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              'cursor-pointer'
            )}
            aria-label="Seleccionar idioma"
          >
            <option value="es">ES</option>
            <option value="en">EN</option>
          </select>

          {/* Notificaciones */}
          <button
            className="relative p-2 rounded-md hover:bg-accent transition-colors"
            aria-label={t('common.notifications')}
            title={t('common.notifications')}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* Información del usuario - oculto en móvil pequeño, solo avatar en móvil */}
          <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-semibold text-foreground">{t('common.adminUser')}</span>
              <span className="text-xs text-muted-foreground">{t('common.administrator')}</span>
            </div>
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-xs sm:text-sm">
              AU
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

