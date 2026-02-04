import { z } from 'zod'

export const planBenefitSchema = z.object({
  icon: z.string().min(1, 'El icono es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
})

export const planSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
  speed: z.number().min(0, 'La velocidad debe ser mayor o igual a 0'),
  speedUnit: z.enum(['Mbps', 'Gbps']),
  benefits: z.array(planBenefitSchema).min(1, 'Debe tener al menos un beneficio'),
  isActive: z.boolean(),
  isRecommended: z.boolean(),
  zoneId: z.string().min(1, 'La zona es requerida'),
})

export type PlanFormData = z.infer<typeof planSchema>
export type PlanBenefitFormData = z.infer<typeof planBenefitSchema>

