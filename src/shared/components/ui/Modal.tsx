import { X } from 'lucide-react'
import { cn } from '@/shared/utils'
import type { ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Modal */}
      <div
        className={cn(
          'relative bg-card border border-border rounded-lg shadow-lg',
          'w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto',
          'z-50'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border sticky top-0 bg-card z-10">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground pr-2">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-muted transition-colors flex-shrink-0"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  )
}

