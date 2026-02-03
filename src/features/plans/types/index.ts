export interface PlanBenefit {
  icon: string
  description: string
}

export interface Plan {
  id: string
  name: string
  price: number
  speed: number
  speedUnit: string
  benefits: PlanBenefit[]
  isRecommended: number
  zoneId: string
  createdAt: string
  updatedAt: string
}

export type PlansResponse = Plan[]

