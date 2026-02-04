import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from '@/shared/i18n'
import { usePlans } from '../hooks'
import { cn } from '@/shared/utils'
import type { Plan } from '../types'
import { EditPlanModal } from '../components'
import { ConfirmModal } from '@/shared/components/ui'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { plansService } from '../services'

function PlanStatusBadge({ active }: { active: boolean }) {
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
      {active ? t('pages.plans.status.active') : t('pages.plans.status.inactive')}
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

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function PlansPage() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { data, isLoading, error } = usePlans()
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [planToDelete, setPlanToDelete] = useState<Plan | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const deleteMutation = useMutation({
    mutationFn: (id: string) => plansService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] })
      setIsDeleteModalOpen(false)
      setPlanToDelete(null)
    },
  })

  const handleCreate = () => {
    setEditingPlan(null)
    setIsEditModalOpen(true)
  }

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan)
    setIsEditModalOpen(true)
  }

  const handleDelete = (plan: Plan) => {
    setPlanToDelete(plan)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (planToDelete) {
      deleteMutation.mutate(planToDelete.id)
    }
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setEditingPlan(null)
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setPlanToDelete(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">{t('common.errorLoading')}</p>
      </div>
    )
  }

  const plans = data || []

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">
            {t('pages.plans.title')}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t('pages.plans.subtitle')}
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
          {t('pages.plans.createPlan')}
        </button>
      </div>

      {/* Tabla - responsive con scroll horizontal en móvil */}
      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('pages.plans.table.name')}
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('pages.plans.table.speed')}
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('pages.plans.table.price')}
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('pages.plans.table.status')}
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('pages.plans.table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {plans.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 sm:px-6 py-8 text-center text-muted-foreground">
                    {t('pages.plans.noPlansAvailable')}
                  </td>
                </tr>
              ) : (
                plans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-3 sm:px-6 py-4">
                      <div className="text-sm font-medium text-foreground">
                        {plan.name}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-foreground">
                        {plan.speed} {plan.speedUnit}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-foreground">
                        {formatPrice(plan.price)}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <PlanStatusBadge active={plan.isActive} />
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <ActionButton
                          icon={Pencil}
                          onClick={() => handleEdit(plan)}
                        />
                        <ActionButton
                          icon={Trash2}
                          onClick={() => handleDelete(plan)}
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
      <EditPlanModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        plan={editingPlan}
      />

      {/* Modal de confirmación de eliminación */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title={t('pages.plans.deletePlan')}
        message={t('pages.plans.confirmDelete', { name: planToDelete?.name || '' })}
        confirmText={t('pages.plans.delete')}
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}

