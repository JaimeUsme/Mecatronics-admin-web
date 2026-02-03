import { useEffect } from 'react'
import { useSidebarStore } from '@/shared/store'

export function useSidebar() {
  const { isOpen, isMobile, toggle, close, open, setIsMobile } = useSidebarStore()

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [setIsMobile])

  return {
    isOpen,
    isMobile,
    toggle,
    close,
    open,
  }
}

