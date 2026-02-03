import { z } from 'zod'

export const zoneSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  phone: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  address: z.string().nullable().optional(),
  freeInstallation: z.boolean(),
  noCommitment: z.boolean(),
  isActive: z.boolean(),
})

export type ZoneFormData = z.infer<typeof zoneSchema>

