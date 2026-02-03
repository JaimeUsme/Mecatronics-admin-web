import { create } from 'zustand'

interface ReportsState {
  // Reports state will be defined here
}

export const useReportsStore = create<ReportsState>()(() => ({
  // Initial state
}))

