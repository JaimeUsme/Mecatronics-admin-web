import { create } from 'zustand'

interface RolesState {
  // Roles state will be defined here
}

export const useRolesStore = create<RolesState>()(() => ({
  // Initial state
}))

