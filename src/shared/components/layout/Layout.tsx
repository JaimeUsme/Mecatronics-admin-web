import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { useSidebar } from '@/shared/hooks'
import { cn } from '@/shared/utils'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { isOpen, isMobile } = useSidebar()

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div
        className={cn(
          'flex-1 flex flex-col transition-all duration-300',
          isMobile
            ? 'w-full ml-0'
            : isOpen
              ? 'ml-64'
              : 'ml-20'
        )}
        style={{
          width: isMobile
            ? '100%'
            : isOpen
              ? 'calc(100% - 16rem)'
              : 'calc(100% - 5rem)',
        }}
      >
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="p-3 sm:p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}

