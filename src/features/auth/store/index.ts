import { create } from 'zustand'

interface AuthState {
  // Auth state will be defined here
}

export const useAuthStore = create<AuthState>()(() => ({
  // Initial state
}))

