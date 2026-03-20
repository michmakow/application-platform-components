import { create } from "zustand"

export type ToastTone = "success" | "error"

export type UtilityToast = {
  tone: ToastTone
  subject: string
  message: string
}

interface UtilityState {
  isLoading: boolean
  pendingRequests: number
  toast: UtilityToast | null
  startLoading: () => void
  stopLoading: () => void
  resetLoading: () => void
  showToast: (toast: UtilityToast) => void
  clearToast: () => void
}

export const useUtilityStore = create<UtilityState>((set) => ({
  isLoading: false,
  pendingRequests: 0,
  toast: null,
  startLoading: () =>
    set((state) => {
      const pendingRequests = state.pendingRequests + 1
      return { pendingRequests, isLoading: pendingRequests > 0 }
    }),
  stopLoading: () =>
    set((state) => {
      const pendingRequests = Math.max(0, state.pendingRequests - 1)
      return { pendingRequests, isLoading: pendingRequests > 0 }
    }),
  resetLoading: () => set({ pendingRequests: 0, isLoading: false }),
  showToast: (toast) => set({ toast }),
  clearToast: () => set({ toast: null }),
}))
