import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  MapPin,
  Wifi,
  Phone,
  Users,
  Settings,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
} from 'lucide-react'
import { cn } from '@/shared/utils'
import { useSidebar } from '@/shared/hooks'
import { useTranslation } from '@/shared/i18n'
import { useThemeStore, useLanguageStore } from '@/shared/store'
import logoClaro from '@/assets/images/logo-claro.png'

interface NavItem {
  icon: typeof LayoutDashboard
  labelKey: string
  path: string
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, labelKey: 'sidebar.dashboard', path: '/' },
  { icon: MapPin, labelKey: 'sidebar.zones', path: '/zonas' },
  { icon: Wifi, labelKey: 'sidebar.plans', path: '/planes' },
  { icon: Phone, labelKey: 'sidebar.contact', path: '/contacto' },
  { icon: Users, labelKey: 'sidebar.users', path: '/usuarios' },
  { icon: Settings, labelKey: 'sidebar.settings', path: '/configuracion' },
]

export function Sidebar() {
  const { isOpen, isMobile, toggle, close } = useSidebar()
  const { t } = useTranslation()
  const { theme, toggleTheme } = useThemeStore()
  const { language, setLanguage } = useLanguageStore()

  const handleLogout = () => {
    // Lógica de logout se implementará después
    console.log('Logout')
  }

  return (
    <>
      {/* Overlay para móvil */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - En móvil es un modal completo, en desktop es sidebar lateral */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full z-50 transition-all duration-300 ease-in-out',
          // En móvil: modal completo
          isMobile && (isOpen ? 'w-full translate-x-0' : '-translate-x-full'),
          // En desktop: sidebar lateral
          !isMobile && (isOpen ? 'w-64 translate-x-0' : 'w-20 translate-x-0')
        )}
        style={{
          backgroundColor: 'hsl(var(--sidebar-bg))',
          color: 'hsl(var(--sidebar-foreground))',
        }}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className={cn(
            "flex items-center justify-between p-4 sm:p-6 border-b border-sidebar-border",
            !isMobile && "min-h-[80px]"
          )}>
            {isOpen && (
              <div className={cn(
                "flex flex-1 items-center",
                isMobile && "justify-center"
              )}>
                <img
                  src={logoClaro}
                  alt="Mecatronics Ingeniería y Soluciones"
                  className={cn(
                    "object-contain",
                    isMobile ? "h-24 sm:h-32" : "h-20 max-w-full"
                  )}
                />
              </div>
            )}
            {!isOpen && !isMobile && (
              <div className="flex items-center justify-center w-full">
                <img
                  src={logoClaro}
                  alt="Mecatronics"
                  className="h-16 w-16 object-contain"
                />
              </div>
            )}
            {/* Botón toggle sidebar */}
            <div className={cn(
              "flex items-center gap-2 flex-shrink-0",
              !isOpen && !isMobile && "w-full justify-center"
            )} style={{ 
              color: 'hsl(var(--sidebar-foreground))' 
            }}>
              {isMobile ? (
                <button
                  onClick={close}
                  className="p-2 rounded-md hover:bg-sidebar-hover transition-colors"
                  aria-label="Cerrar menú"
                  style={{ color: 'inherit' }}
                >
                  <X className="w-5 h-5" style={{ color: 'inherit' }} />
                </button>
              ) : (
                <button
                  onClick={toggle}
                  className="p-2 rounded-md hover:bg-sidebar-hover transition-colors"
                  aria-label={isOpen ? 'Colapsar sidebar' : 'Expandir sidebar'}
                  title={isOpen ? 'Colapsar' : 'Expandir'}
                  style={{ color: 'inherit' }}
                >
                  {isOpen ? (
                    <ChevronLeft className="w-5 h-5" style={{ color: 'inherit' }} />
                  ) : (
                    <ChevronRight className="w-5 h-5" style={{ color: 'inherit' }} />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Navegación */}
          <nav className={cn(
            "flex-1 overflow-y-auto",
            isMobile ? "py-6 px-4" : "py-4"
          )}>
            <ul className={cn(
              "space-y-1",
              isMobile ? "px-0" : "px-2"
            )}>
              {navItems.map((item) => {
                const Icon = item.icon
                const label = t(item.labelKey)
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      onClick={isMobile ? close : undefined}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative group',
                          'hover:bg-sidebar-hover',
                          isActive
                            ? 'bg-sidebar-active font-semibold'
                            : 'opacity-70',
                          !isOpen && !isMobile && 'justify-center'
                        )
                      }
                      style={{
                        color: 'hsl(var(--sidebar-foreground))',
                      }}
                      title={!isOpen && !isMobile ? label : undefined}
                    >
                      {({ isActive }) => (
                        <>
                          <div
                            className="absolute inset-0 rounded-lg transition-colors"
                            style={{
                              backgroundColor: isActive ? 'hsl(var(--sidebar-active))' : 'transparent',
                            }}
                          />
                          <Icon 
                            className="w-5 h-5 flex-shrink-0 relative z-10" 
                            style={{ 
                              color: 'hsl(var(--sidebar-foreground))',
                              stroke: 'hsl(var(--sidebar-foreground))',
                            }} 
                          />
                          {(isOpen || isMobile) && (
                            <span 
                              className="whitespace-nowrap relative z-10"
                              style={{ color: 'hsl(var(--sidebar-foreground))' }}
                            >
                              {label}
                            </span>
                          )}
                          {/* Tooltip cuando está colapsado en desktop */}
                          {!isOpen && !isMobile && (
                            <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                              {label}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer - En móvil muestra controles adicionales */}
          {isMobile ? (
            <div className="border-t border-sidebar-border p-4 space-y-4">
              {/* Selector de idioma y tema */}
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as 'es' | 'en')}
                    className="w-full px-4 py-2 pr-10 rounded-lg border border-sidebar-border text-sm appearance-none cursor-pointer"
                    style={{
                      backgroundColor: 'hsl(var(--sidebar-accent))',
                      color: 'hsl(var(--sidebar-foreground))',
                    }}
                  >
                    <option 
                      value="es"
                      style={{
                        backgroundColor: 'hsl(var(--sidebar-bg))',
                        color: 'hsl(var(--sidebar-foreground))',
                      }}
                    >
                      ES
                    </option>
                    <option 
                      value="en"
                      style={{
                        backgroundColor: 'hsl(var(--sidebar-bg))',
                        color: 'hsl(var(--sidebar-foreground))',
                      }}
                    >
                      EN
                    </option>
                  </select>
                  {/* Chevron down icon */}
                  <div 
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: 'hsl(var(--sidebar-foreground))' }}
                  >
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg border border-sidebar-border hover:bg-sidebar-hover transition-colors"
                  style={{
                    backgroundColor: 'hsl(var(--sidebar-accent))',
                    color: 'hsl(var(--sidebar-foreground))',
                  }}
                >
                  {theme === 'dark' ? (
                    <Sun className="h-5 w-5" style={{ color: 'inherit' }} />
                  ) : (
                    <Moon className="h-5 w-5" style={{ color: 'inherit' }} />
                  )}
                </button>
              </div>
              
              {/* Botón de logout */}
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg transition-colors opacity-70 hover:bg-sidebar-hover hover:opacity-100"
                style={{
                  color: 'hsl(var(--sidebar-foreground))',
                }}
              >
                <LogOut className="w-5 h-5" style={{ color: 'inherit' }} />
                <span>{t('common.logout')}</span>
              </button>
            </div>
          ) : (
            <div className="border-t border-sidebar-border p-4">
              <button
                onClick={handleLogout}
                className={cn(
                  'flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors relative group',
                  'opacity-70 hover:bg-sidebar-hover hover:opacity-100',
                  !isOpen && 'justify-center'
                )}
                style={{ color: 'hsl(var(--sidebar-foreground))' }}
                title={!isOpen ? t('common.logout') : undefined}
              >
                <LogOut className="w-5 h-5 flex-shrink-0" style={{ color: 'inherit' }} />
                {isOpen && <span className="whitespace-nowrap">{t('common.logout')}</span>}
                {/* Tooltip cuando está colapsado */}
                {!isOpen && (
                  <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                    {t('common.logout')}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
      </aside>

    </>
  )
}

