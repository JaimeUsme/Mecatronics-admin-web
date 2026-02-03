import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Modal } from '@/shared/components/ui'
import { zonesService } from '../services'
import { zoneSchema, type ZoneFormData } from '../validators'
import type { Zone } from '../types'
import { useTranslation } from '@/shared/i18n'
import { cn } from '@/shared/utils'

interface ZoneModalProps {
  isOpen: boolean
  onClose: () => void
  zone?: Zone | null
}

export function EditZoneModal({ isOpen, onClose, zone }: ZoneModalProps) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const isEditMode = !!zone

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm<ZoneFormData>({
    resolver: zodResolver(zoneSchema),
    defaultValues: {
      name: '',
      description: '',
      latitude: undefined,
      longitude: undefined,
      phone: '',
      email: '',
      address: '',
      freeInstallation: false,
      noCommitment: false,
      isActive: true,
    },
  })

  const createMutation = useMutation({
    mutationFn: (data: ZoneFormData) => {
      // Preparar el body según el formato requerido por el backend
      // No incluir isActive en la creación, solo en la actualización
      const body: {
        name: string
        description?: string
        latitude?: number
        longitude?: number
        phone?: string
        email?: string
        address?: string | null
        freeInstallation: boolean
        noCommitment: boolean
      } = {
        name: data.name,
        description: data.description || undefined,
        latitude: data.latitude,
        longitude: data.longitude,
        phone: data.phone || undefined,
        email: data.email || undefined,
        address: data.address || null,
        freeInstallation: data.freeInstallation,
        noCommitment: data.noCommitment,
      }
      // Eliminar campos undefined para que no se envíen en el body
      Object.keys(body).forEach((key) => {
        const typedKey = key as keyof typeof body
        if (body[typedKey] === undefined) {
          delete body[typedKey]
        }
      })
      return zonesService.create(body)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zones'] })
      onClose()
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: ZoneFormData) => {
      if (!zone) throw new Error('Zone is required')
      return zonesService.update(zone.id, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zones'] })
      onClose()
    },
  })

  const onSubmit = (data: ZoneFormData) => {
    if (isEditMode) {
      updateMutation.mutate(data)
    } else {
      createMutation.mutate(data)
    }
  }

  // Reset form when zone changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (zone) {
        // Edit mode: populate with zone data
        reset({
          name: zone.name,
          description: zone.description || '',
          latitude: zone.latitude,
          longitude: zone.longitude,
          phone: zone.phone || '',
          email: zone.email || '',
          address: zone.address || '',
          freeInstallation: zone.freeInstallation ?? false,
          noCommitment: zone.noCommitment ?? false,
          isActive: zone.isActive ?? true,
        })
      } else {
        // Create mode: reset to default values
        reset({
          name: '',
          description: '',
          latitude: undefined,
          longitude: undefined,
          phone: '',
          email: '',
          address: '',
          freeInstallation: false,
          noCommitment: false,
          isActive: true,
        })
      }
    }
  }, [zone?.id, isOpen, reset])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? t('pages.zones.editZone') : t('pages.zones.createZone')}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t('pages.zones.form.name')}
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

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t('pages.zones.form.description')}
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className={cn(
              'w-full rounded-lg border border-input bg-background px-3 sm:px-4 py-2',
              'text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              errors.description && 'border-destructive'
            )}
          />
          {errors.description && (
            <p className="mt-1 text-xs sm:text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>

        {/* Latitud y Longitud */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('pages.zones.form.latitude')}
            </label>
            <input
              {...register('latitude', { valueAsNumber: true })}
              type="number"
              step="any"
              className={cn(
                'w-full rounded-lg border border-input bg-background px-4 py-2',
                'text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                errors.latitude && 'border-destructive'
              )}
            />
            {errors.latitude && (
              <p className="mt-1 text-sm text-destructive">{errors.latitude.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('pages.zones.form.longitude')}
            </label>
            <input
              {...register('longitude', { valueAsNumber: true })}
              type="number"
              step="any"
              className={cn(
                'w-full rounded-lg border border-input bg-background px-4 py-2',
                'text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                errors.longitude && 'border-destructive'
              )}
            />
            {errors.longitude && (
              <p className="mt-1 text-sm text-destructive">{errors.longitude.message}</p>
            )}
          </div>
        </div>

        {/* Teléfono y Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('pages.zones.form.phone')}
            </label>
            <input
              {...register('phone')}
              type="tel"
              className={cn(
                'w-full rounded-lg border border-input bg-background px-4 py-2',
                'text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                errors.phone && 'border-destructive'
              )}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('pages.zones.form.email')}
            </label>
            <input
              {...register('email')}
              type="email"
              className={cn(
                'w-full rounded-lg border border-input bg-background px-4 py-2',
                'text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                errors.email && 'border-destructive'
              )}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* Dirección */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t('pages.zones.form.address')}
          </label>
          <input
            {...register('address')}
            type="text"
            className={cn(
              'w-full rounded-lg border border-input bg-background px-4 py-2',
              'text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              errors.address && 'border-destructive'
            )}
          />
          {errors.address && (
            <p className="mt-1 text-sm text-destructive">{errors.address.message}</p>
          )}
        </div>

        {/* Checkboxes */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              {...register('freeInstallation')}
              type="checkbox"
              id="freeInstallation"
              className="w-4 h-4 rounded border-input"
            />
            <label htmlFor="freeInstallation" className="text-sm text-foreground">
              {t('pages.zones.form.freeInstallation')}
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              {...register('noCommitment')}
              type="checkbox"
              id="noCommitment"
              className="w-4 h-4 rounded border-input"
            />
            <label htmlFor="noCommitment" className="text-sm text-foreground">
              {t('pages.zones.form.noCommitment')}
            </label>
          </div>
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t('pages.zones.form.status')}
          </label>
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                value={field.value ? 'true' : 'false'}
                onChange={(e) => field.onChange(e.target.value === 'true')}
                className={cn(
                  'w-full rounded-lg border border-input bg-background px-4 py-2',
                  'text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                  errors.isActive && 'border-destructive'
                )}
              >
                <option value="true">{t('pages.zones.status.active')}</option>
                <option value="false">{t('pages.zones.status.inactive')}</option>
              </select>
            )}
          />
          {errors.isActive && (
            <p className="mt-1 text-sm text-destructive">{errors.isActive.message}</p>
          )}
        </div>

        {/* Botones */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-4 pt-4 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-input bg-background hover:bg-muted text-foreground transition-colors w-full sm:w-auto"
          >
            {t('pages.zones.form.cancel')}
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
                ? t('pages.zones.form.saving')
                : t('pages.zones.form.creating')
              : t('pages.zones.form.save')}
          </button>
        </div>
      </form>
    </Modal>
  )
}

