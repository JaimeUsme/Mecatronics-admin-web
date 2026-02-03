import { useQuery } from '@tanstack/react-query'
import { zonesService } from '../services'

export function useZones() {
  return useQuery({
    queryKey: ['zones'],
    queryFn: () => zonesService.getAll(),
  })
}

