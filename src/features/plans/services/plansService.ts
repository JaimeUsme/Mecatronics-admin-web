import type { PlansResponse, Plan } from '../types'
import { API_BASE_URL } from '@/shared/config/api'

export const plansService = {
  getAll: async (): Promise<PlansResponse> => {
    const response = await fetch(`${API_BASE_URL}/plans`)
    if (!response.ok) {
      throw new Error('Failed to fetch plans')
    }
    const data = await response.json()
    // El backend devuelve un array directamente, no un objeto con version y plans
    return Array.isArray(data) ? data : []
  },
  create: async (data: {
    name: string
    price: number
    speed: number
    speedUnit: 'Mbps' | 'Gbps'
    benefits: Array<{ icon: string; description: string }>
    isRecommended: boolean
    zoneId: string
  }): Promise<Plan> => {
    const response = await fetch(`${API_BASE_URL}/plans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to create plan')
    }
    return response.json()
  },
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/plans/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to delete plan')
    }
  },
}

