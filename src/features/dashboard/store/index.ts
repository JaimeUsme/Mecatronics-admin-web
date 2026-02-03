import { create } from 'zustand'

interface DashboardState {
  // Dashboard state will be defined here
}

export const useDashboardStore = create<DashboardState>()(() => ({
  // Initial state
}))

