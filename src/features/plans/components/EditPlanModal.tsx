import { useEffect, useState, useRef } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, ChevronDown, Search } from 'lucide-react'
import { Modal } from '@/shared/components/ui'
import { plansService } from '../services'
import { planSchema, type PlanFormData } from '../validators'
import type { Plan } from '../types'
import { useTranslation } from '@/shared/i18n'
import { cn } from '@/shared/utils'
import { lucideIcons, getLucideIcon } from '@/shared/utils/lucideIcons'
import { useZones } from '@/features/zones/hooks'

interface PlanModalProps {
  isOpen: boolean
  onClose: () => void
  plan?: Plan | null
}

export function EditPlanModal({ isOpen, onClose, plan }: PlanModalProps) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { data: zonesData } = useZones()
  const isEditMode = !!plan

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PlanFormData>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: '',
      price: 0,
      speed: 0,
      speedUnit: 'Mbps',
      benefits: [{ icon: 'gift', description: '' }],
      isActive: true,
      isRecommended: false,
      zoneId: '',
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'benefits',
  })

  const createMutation = useMutation({
    mutationFn: (data: PlanFormData) => {
      const body = {
        name: data.name,
        price: data.price,
        speed: data.speed,
        speedUnit: data.speedUnit,
        benefits: data.benefits,
        isActive: data.isActive,
        isRecommended: data.isRecommended,
        zoneId: data.zoneId,
      }
      return plansService.create(body)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] })
      onClose()
    },
  })

  const onSubmit = (data: PlanFormData) => {
    if (isEditMode) {
      // TODO: Implementar update cuando esté disponible
      console.log('Update plan', data)
    } else {
      createMutation.mutate(data)
    }
  }

  // Reset form when plan changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (plan) {
        // Edit mode: populate with plan data
        reset({
          name: plan.name,
          price: plan.price,
          speed: plan.speed,
          speedUnit: plan.speedUnit as 'Mbps' | 'Gbps',
          benefits: plan.benefits.length > 0 ? plan.benefits : [{ icon: 'gift', description: '' }],
          isActive: plan.isActive,
          isRecommended: plan.isRecommended,
          zoneId: plan.zoneId,
        })
      } else {
        // Create mode: reset to default values
        reset({
          name: '',
          price: 0,
          speed: 0,
          speedUnit: 'Mbps',
          benefits: [{ icon: 'gift', description: '' }],
          isActive: true,
          isRecommended: false,
          zoneId: zonesData?.zones?.[0]?.id || '',
        })
      }
    }
  }, [plan?.id, isOpen, reset, zonesData])

  const zones = zonesData?.zones || []

  // Componente de selector de iconos personalizado
  function IconSelector({
    value,
    onChange,
    error,
  }: {
    value: string
    onChange: (value: string) => void
    error?: string
  }) {
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const dropdownRef = useRef<HTMLDivElement>(null)
    const searchInputRef = useRef<HTMLInputElement>(null)
    const SelectedIcon = getLucideIcon(value || 'gift')

    // Filtrar iconos basado en la búsqueda
    const filteredIcons = lucideIcons.filter((iconName) =>
      iconName.toLowerCase().includes(searchQuery.toLowerCase())
    )

    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false)
          setSearchQuery('')
        }
      }

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside)
        // Enfocar el input de búsqueda cuando se abre el dropdown
        setTimeout(() => {
          searchInputRef.current?.focus()
        }, 100)
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [isOpen])

    // Resetear búsqueda cuando se cierra el dropdown
    useEffect(() => {
      if (!isOpen) {
        setSearchQuery('')
      }
    }, [isOpen])

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'w-full rounded-lg border border-input bg-background px-3 py-2 pr-10',
            'text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            'flex items-center justify-between',
            error && 'border-destructive'
          )}
        >
          <div className="flex items-center gap-2">
            <SelectedIcon className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{value || 'Seleccionar icono'}</span>
          </div>
          <ChevronDown
            className={cn(
              'w-4 h-4 text-muted-foreground transition-transform',
              isOpen && 'transform rotate-180'
            )}
          />
        </button>
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-80 overflow-hidden flex flex-col">
            {/* Buscador */}
            <div className="p-2 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('pages.plans.form.searchIcon')}
                  className={cn(
                    'w-full pl-9 pr-3 py-2 rounded-md border border-input bg-background',
                    'text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0',
                    'placeholder:text-muted-foreground'
                  )}
                />
              </div>
            </div>
            {/* Grid de iconos */}
            <div className="overflow-y-auto max-h-60 p-2">
              {filteredIcons.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  {t('pages.plans.form.noIconsFound')}
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {filteredIcons.map((iconName) => {
                    const IconComponent = getLucideIcon(iconName)
                    const isSelected = value === iconName
                    return (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => {
                          onChange(iconName)
                          setIsOpen(false)
                          setSearchQuery('')
                        }}
                        className={cn(
                          'p-2 rounded-md border transition-colors',
                          'hover:bg-muted flex items-center justify-center',
                          isSelected
                            ? 'border-primary bg-primary/10'
                            : 'border-input bg-background'
                        )}
                        title={iconName}
                      >
                        <IconComponent className="w-5 h-5 text-foreground" />
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? t('pages.plans.editPlan') : t('pages.plans.createPlan')}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t('pages.plans.form.name')}
          </label>
          <input
            {...register('name')}
            type="text"
            className={cn(
              'w-full rounded-lg border border-input bg-background px-3 sm:px-4 py-2',
              'text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              errors.name && 'border-destructive'
            )}
          />
          {errors.name && (
            <p className="mt-1 text-xs sm:text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        {/* Precio y Velocidad */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('pages.plans.form.price')}
            </label>
            <input
              {...register('price', { valueAsNumber: true })}
              type="number"
              min="0"
              step="0.01"
              className={cn(
                'w-full rounded-lg border border-input bg-background px-3 sm:px-4 py-2',
                'text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                errors.price && 'border-destructive'
              )}
            />
            {errors.price && (
              <p className="mt-1 text-xs sm:text-sm text-destructive">{errors.price.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('pages.plans.form.speed')}
              </label>
              <input
                {...register('speed', { valueAsNumber: true })}
                type="number"
                min="0"
                step="0.01"
                className={cn(
                  'w-full rounded-lg border border-input bg-background px-3 sm:px-4 py-2',
                  'text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                  errors.speed && 'border-destructive'
                )}
              />
              {errors.speed && (
                <p className="mt-1 text-xs sm:text-sm text-destructive">{errors.speed.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('pages.plans.form.speedUnit')}
              </label>
              <Controller
                name="speedUnit"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className={cn(
                      'w-full rounded-lg border border-input bg-background px-3 sm:px-4 py-2',
                      'text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                      errors.speedUnit && 'border-destructive'
                    )}
                  >
                    <option value="Mbps">Mbps</option>
                    <option value="Gbps">Gbps</option>
                  </select>
                )}
              />
              {errors.speedUnit && (
                <p className="mt-1 text-xs sm:text-sm text-destructive">{errors.speedUnit.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Zona */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t('pages.plans.form.zone')}
          </label>
          <Controller
            name="zoneId"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className={cn(
                  'w-full rounded-lg border border-input bg-background px-3 sm:px-4 py-2',
                  'text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                  errors.zoneId && 'border-destructive'
                )}
              >
                <option value="">{t('pages.plans.form.selectZone')}</option>
                {zones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.zoneId && (
            <p className="mt-1 text-xs sm:text-sm text-destructive">{errors.zoneId.message}</p>
          )}
        </div>

        {/* Beneficios */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-foreground">
              {t('pages.plans.form.benefits')}
            </label>
            <button
              type="button"
              onClick={() => append({ icon: 'gift', description: '' })}
              className="flex items-center gap-1 px-2 py-1 text-xs text-primary hover:text-primary/80 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {t('pages.plans.form.addBenefit')}
            </button>
          </div>
          <div className="space-y-3">
            {fields.map((field, index) => {
              return (
                <div
                  key={field.id}
                  className="flex items-start gap-2 p-3 rounded-lg border border-input bg-background"
                >
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        {t('pages.plans.form.benefitIcon')}
                      </label>
                      <Controller
                        name={`benefits.${index}.icon`}
                        control={control}
                        render={({ field: iconField }) => (
                          <IconSelector
                            value={iconField.value}
                            onChange={iconField.onChange}
                            error={errors.benefits?.[index]?.icon?.message}
                          />
                        )}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        {t('pages.plans.form.benefitDescription')}
                      </label>
                      <input
                        {...register(`benefits.${index}.description`)}
                        type="text"
                        className={cn(
                          'w-full rounded-lg border border-input bg-background px-3 py-2',
                          'text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                          errors.benefits?.[index]?.description && 'border-destructive'
                        )}
                        placeholder={t('pages.plans.form.benefitDescriptionPlaceholder')}
                      />
                      {errors.benefits?.[index]?.description && (
                        <p className="mt-1 text-xs text-destructive">
                          {errors.benefits[index]?.description?.message}
                        </p>
                      )}
                    </div>
                  </div>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-2 rounded-md hover:bg-destructive/10 text-destructive transition-colors flex-shrink-0"
                      aria-label={t('pages.plans.form.removeBenefit')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )
            })}
          </div>
          {errors.benefits && typeof errors.benefits.message === 'string' && (
            <p className="mt-1 text-xs sm:text-sm text-destructive">{errors.benefits.message}</p>
          )}
        </div>

        {/* Estado y Recomendado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              {...register('isActive')}
              type="checkbox"
              id="isActive"
              className="w-4 h-4 rounded border-input"
            />
            <label htmlFor="isActive" className="text-sm text-foreground">
              {t('pages.plans.form.isActive')}
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              {...register('isRecommended')}
              type="checkbox"
              id="isRecommended"
              className="w-4 h-4 rounded border-input"
            />
            <label htmlFor="isRecommended" className="text-sm text-foreground">
              {t('pages.plans.form.isRecommended')}
            </label>
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-4 pt-4 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-input bg-background hover:bg-muted text-foreground transition-colors w-full sm:w-auto"
          >
            {t('pages.plans.form.cancel')}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg text-white transition-colors font-medium disabled:opacity-50 w-full sm:w-auto"
            style={{
              backgroundColor: 'hsl(var(--sidebar-active))',
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.opacity = '0.9'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1'
            }}
          >
            {isSubmitting
              ? isEditMode
                ? t('pages.plans.form.saving')
                : t('pages.plans.form.creating')
              : t('pages.plans.form.save')}
          </button>
        </div>
      </form>
    </Modal>
  )
}

