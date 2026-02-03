import { create } from 'zustand'

interface SidebarState {
  isOpen: boolean
  isMobile: boolean
  toggle: () => void
  close: () => void
  open: () => void
  setIsMobile: (isMobile: boolean) => void
}

// Estado inicial basado en el tamaño de pantalla
const getInitialState = () => {
  if (typeof window === 'undefined') {
    return { isOpen: true, isMobile: false }
  }
  const isMobile = window.innerWidth < 768
  return {
    isOpen: !isMobile, // Abierto en desktop, cerrado en móvil
    isMobile,
  }
}

export const useSidebarStore = create<SidebarState>((set) => ({
  ...getInitialState(),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  close: () => set({ isOpen: false }),
  open: () => set({ isOpen: true }),
  setIsMobile: (isMobile: boolean) =>
    set((state) => {
      // En móvil, cerrar sidebar; en desktop, abrir si estaba cerrado por ser móvil
      if (isMobile) {
        return { isMobile, isOpen: false }
      }
      // Al cambiar de móvil a desktop, abrir el sidebar
      if (state.isMobile && !isMobile) {
        return { isMobile, isOpen: true }
      }
      return { isMobile }
    }),
}))

