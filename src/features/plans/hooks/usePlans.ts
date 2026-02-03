import { useQuery } from '@tanstack/react-query'
import { plansService } from '../services'

export const usePlans = () => {
  return useQuery({
    queryKey: ['plans'],
    queryFn: () => plansService.getAll(),
  })
}

