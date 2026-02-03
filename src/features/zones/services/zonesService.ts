import type { ZonesResponse, Zone } from '../types'
import { API_BASE_URL } from '@/shared/config/api'

export const zonesService = {
  getAll: async (): Promise<ZonesResponse> => {
    const response = await fetch(`${API_BASE_URL}/zones`)
    if (!response.ok) {
      throw new Error('Failed to fetch zones')
    }
    return response.json()
  },
  create: async (data: {
    name: string
    description?: string
    latitude?: number
    longitude?: number
    phone?: string
    email?: string
    address?: string | null
    freeInstallation: boolean
    noCommitment: boolean
  }): Promise<Zone> => {
    const response = await fetch(`${API_BASE_URL}/zones`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to create zone')
    }
    return response.json()
  },
  update: async (id: string, data: Partial<Zone>): Promise<Zone> => {
    const response = await fetch(`${API_BASE_URL}/zones/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to update zone')
    }
    return response.json()
  },
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/zones/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to delete zone')
    }
  },
}

