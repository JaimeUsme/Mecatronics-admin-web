import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from '@/shared/i18n'
import { useZones } from '../hooks'
import { zonesService } from '../services'
import { cn } from '@/shared/utils'
import type { Zone } from '../types'
import { EditZoneModal } from '../components'
import { ConfirmModal } from '@/shared/components/ui'

function ZoneStatusBadge({ active }: { active: boolean }) {
  const { t } = useTranslation()
  
  return (
    <span
      className={cn(
        'px-3 py-1 rounded-full text-xs font-medium text-white',
        active
          ? 'bg-green-500'
          : 'bg-red-500'
      )}
    >
      {active ? t('pages.zones.status.active') : t('pages.zones.status.inactive')}
    </span>
  )
}

function ActionButton({
  icon: Icon,
  onClick,
  variant = 'default',
}: {
  icon: typeof Pencil
  onClick: () => void
  variant?: 'default' | 'danger'
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'p-2 rounded transition-colors',
        variant === 'danger'
          ? 'bg-red-500 hover:bg-red-600 text-white'
          : 'bg-blue-500 hover:bg-blue-600 text-white'
      )}
      aria-label={variant === 'danger' ? 'Eliminar' : 'Editar'}
    >
      <Icon className="w-4 h-4" />
    </button>
  )
}

export function ZonesPage() {
  const { t } = useTranslation()
  const { data, isLoading, error } = useZones()
  const queryClient = useQueryClient()
  const [editingZone, setEditingZone] = useState<Zone | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [zoneToDelete, setZoneToDelete] = useState<Zone | null>(null)

  const deleteMutation = useMutation({
    mutationFn: (id: string) => zonesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zones'] })
      setZoneToDelete(null)
    },
  })

  const handleCreate = () => {
    setEditingZone(null)
    setIsEditModalOpen(true)
  }

  const handleEdit = (zone: Zone) => {
    setEditingZone(zone)
    setIsEditModalOpen(true)
  }

  const handleDelete = (zone: Zone) => {
    setZoneToDelete(zone)
  }

  const handleConfirmDelete = () => {
    if (zoneToDelete) {
      deleteMutation.mutate(zoneToDelete.id)
    }
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setEditingZone(null)
  }

  const handleCloseDeleteModal = () => {
    if (!deleteMutation.isPending) {
      setZoneToDelete(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Cargando zonas...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">Error al cargar las zonas</p>
      </div>
    )
  }

  const zones = data?.zones || []

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">
            {t('pages.zones.title')}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t('pages.zones.subtitle')}
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium text-white w-full sm:w-auto"
          style={{
            backgroundColor: 'hsl(var(--sidebar-active))',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.9'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1'
          }}
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">{t('pages.zones.createZone')}</span>
          <span className="sm:hidden">{t('pages.zones.createZone')}</span>
        </button>
      </div>

      {/* Tabla - responsive con scroll horizontal en móvil */}
      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('pages.zones.table.name')}
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('pages.zones.table.status')}
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('pages.zones.table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {zones.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-3 sm:px-6 py-8 text-center text-muted-foreground">
                    No hay zonas disponibles
                  </td>
                </tr>
              ) : (
                zones.map((zone) => (
                  <tr key={zone.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-3 sm:px-6 py-4">
                      <div className="text-sm font-medium text-foreground">
                        {zone.name}
                      </div>
                      {zone.description && (
                        <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                          {zone.description}
                        </div>
                      )}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <ZoneStatusBadge active={zone.isActive} />
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <ActionButton
                          icon={Pencil}
                          onClick={() => handleEdit(zone)}
                        />
                        <ActionButton
                          icon={Trash2}
                          onClick={() => handleDelete(zone)}
                          variant="danger"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de edición */}
      <EditZoneModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        zone={editingZone}
      />

      {/* Modal de confirmación de eliminación */}
      <ConfirmModal
        isOpen={!!zoneToDelete}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title={t('pages.zones.deleteZone')}
        message={
          zoneToDelete
            ? t('pages.zones.confirmDelete', { name: zoneToDelete.name }) ||
              `¿Estás seguro de que deseas eliminar la zona "${zoneToDelete.name}"?`
            : ''
        }
        confirmText={t('pages.zones.delete')}
        cancelText={t('pages.zones.form.cancel')}
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}

