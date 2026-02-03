import { create } from 'zustand'

interface UsersState {
  // Users state will be defined here
}

export const useUsersStore = create<UsersState>()(() => ({
  // Initial state
}))

