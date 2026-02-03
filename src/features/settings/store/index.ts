import { create } from 'zustand'

interface SettingsState {
  // Settings state will be defined here
}

export const useSettingsStore = create<SettingsState>()(() => ({
  // Initial state
}))

