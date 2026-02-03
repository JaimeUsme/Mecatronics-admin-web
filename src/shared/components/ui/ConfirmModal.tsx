import { X, AlertTriangle } from 'lucide-react'
import { cn } from '@/shared/utils'
import type { ReactNode } from 'react'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string | ReactNode
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'danger'
  isLoading?: boolean
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'default',
  isLoading = false,
}: ConfirmModalProps) {
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
          'w-full max-w-md',
          'z-50'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
          <div className="flex items-center gap-3">
            {variant === 'danger' && (
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
            )}
            <h2 className="text-lg sm:text-xl font-semibold text-foreground pr-2">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-muted transition-colors flex-shrink-0"
            aria-label="Cerrar"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <div className="text-sm sm:text-base text-muted-foreground">
            {message}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-4 p-4 sm:p-6 pt-0 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg border border-input bg-background hover:bg-muted text-foreground transition-colors w-full sm:w-auto disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              'px-4 py-2 rounded-lg text-white transition-colors font-medium w-full sm:w-auto disabled:opacity-50',
              variant === 'danger'
                ? 'bg-destructive hover:bg-destructive/90'
                : 'bg-primary hover:bg-primary/90'
            )}
            style={
              variant === 'default'
                ? {
                    backgroundColor: 'hsl(var(--sidebar-active))',
                  }
                : undefined
            }
            onMouseEnter={(e) => {
              if (!isLoading && variant === 'default') {
                e.currentTarget.style.opacity = '0.9'
              }
            }}
            onMouseLeave={(e) => {
              if (variant === 'default') {
                e.currentTarget.style.opacity = '1'
              }
            }}
          >
            {isLoading ? 'Procesando...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

