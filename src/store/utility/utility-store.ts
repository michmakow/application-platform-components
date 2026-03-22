import { useStore } from "zustand"
import type { StateCreator, StoreApi } from "zustand"
import { createStore } from "zustand/vanilla"
import type { UtilityState } from "./utility.types"

export type {
  ToastTone,
  UtilityOverlaySpinnerState,
  UtilityState,
  UtilityToast,
  UtilityToastMotionDirection,
  UtilityToastQueueItem,
  UtilityToastQueueLayout,
  UtilityToastScreenPosition,
  UtilityToastState,
} from "./utility.types"

export type UtilityStoreApi = StoreApi<UtilityState>

let toastIdCounter = 0
const createToastId = () => {
  toastIdCounter += 1
  return `utility-toast-${toastIdCounter}`
}

const createUtilityState: StateCreator<UtilityState> = (set) => ({
  overlaySpinner: {
    isLoading: false,
    pendingRequests: 0,
    startLoading: () =>
      set((state) => {
        const pendingRequests = state.overlaySpinner.pendingRequests + 1
        return {
          overlaySpinner: {
            ...state.overlaySpinner,
            pendingRequests,
            isLoading: pendingRequests > 0,
          },
        }
      }),
    stopLoading: () =>
      set((state) => {
        const pendingRequests = Math.max(0, state.overlaySpinner.pendingRequests - 1)
        return {
          overlaySpinner: {
            ...state.overlaySpinner,
            pendingRequests,
            isLoading: pendingRequests > 0,
          },
        }
      }),
    resetLoading: () =>
      set((state) => ({
        overlaySpinner: {
          ...state.overlaySpinner,
          pendingRequests: 0,
          isLoading: false,
        },
      })),
  },
  toast: {
    layout: "replace",
    enterFrom: "top",
    exitTo: "top",
    position: "top",
    queue: [],
    setLayout: (layout) =>
      set((state) => ({
        toast: {
          ...state.toast,
          layout,
        },
      })),
    setEnterFrom: (direction) =>
      set((state) => ({
        toast: {
          ...state.toast,
          enterFrom: direction,
        },
      })),
    setExitTo: (direction) =>
      set((state) => ({
        toast: {
          ...state.toast,
          exitTo: direction,
        },
      })),
    setPosition: (position) =>
      set((state) => ({
        toast: {
          ...state.toast,
          position,
        },
      })),
    enqueue: (toast) =>
      set((state) => ({
        toast: {
          ...state.toast,
          queue: [
            ...state.toast.queue,
            {
              ...toast,
              id: createToastId(),
              enterFrom: state.toast.enterFrom,
              exitTo: state.toast.exitTo,
            },
          ],
        },
      })),
    dequeue: () =>
      set((state) => ({
        toast: {
          ...state.toast,
          queue: state.toast.queue.slice(1),
        },
      })),
    dismiss: (id) =>
      set((state) => ({
        toast: {
          ...state.toast,
          queue: state.toast.queue.filter((toast) => toast.id !== id),
        },
      })),
    clear: () =>
      set((state) => ({
        toast: {
          ...state.toast,
          queue: [],
        },
      })),
  },
})

export const createUtilityStore = (): UtilityStoreApi => createStore<UtilityState>(createUtilityState)

export const utilityStore = createUtilityStore()

type UtilityStoreHook = {
  <T>(selector: (state: UtilityState) => T): T
  getState: UtilityStoreApi["getState"]
  setState: UtilityStoreApi["setState"]
  subscribe: UtilityStoreApi["subscribe"]
}

export const useUtilityStore: UtilityStoreHook = Object.assign(
  <T>(selector: (state: UtilityState) => T): T => useStore(utilityStore, selector),
  {
    getState: utilityStore.getState,
    setState: utilityStore.setState,
    subscribe: utilityStore.subscribe,
  }
)
