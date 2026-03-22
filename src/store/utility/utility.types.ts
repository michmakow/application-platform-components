export type ToastTone = "success" | "error" | "warning" | "information"

export type UtilityToast = {
  tone: ToastTone
  subject: string
  message: string
}

export type UtilityToastQueueLayout = "replace" | "stack-vertical" | "stack-horizontal"
export type UtilityToastMotionDirection = "top" | "bottom" | "left" | "right"
export type UtilityToastScreenPosition = "top" | "right" | "bottom" | "left"
export type UtilityToastQueueItem = UtilityToast & {
  id: string
  enterFrom: UtilityToastMotionDirection
  exitTo: UtilityToastMotionDirection
}

export interface UtilityOverlaySpinnerState {
  isLoading: boolean
  pendingRequests: number
  startLoading: () => void
  stopLoading: () => void
  resetLoading: () => void
}

export interface UtilityToastState {
  layout: UtilityToastQueueLayout
  enterFrom: UtilityToastMotionDirection
  exitTo: UtilityToastMotionDirection
  position: UtilityToastScreenPosition
  queue: UtilityToastQueueItem[]
  setLayout: (layout: UtilityToastQueueLayout) => void
  setEnterFrom: (direction: UtilityToastMotionDirection) => void
  setExitTo: (direction: UtilityToastMotionDirection) => void
  setPosition: (position: UtilityToastScreenPosition) => void
  enqueue: (toast: UtilityToast) => void
  dequeue: () => void
  dismiss: (id: string) => void
  clear: () => void
}

export interface UtilityState {
  overlaySpinner: UtilityOverlaySpinnerState
  toast: UtilityToastState
}
