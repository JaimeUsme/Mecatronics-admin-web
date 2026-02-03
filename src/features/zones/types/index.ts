export interface Zone {
  id: string
  name: string
  description: string
  latitude: number
  longitude: number
  phone: string
  email: string
  address: string | null
  freeInstallation: boolean
  noCommitment: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ZonesResponse {
  version: number
  zones: Zone[]
}

