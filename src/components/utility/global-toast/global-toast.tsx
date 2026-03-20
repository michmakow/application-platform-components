import React, { useCallback, useEffect, useRef, useState } from "react"
import type {
  ToastTone,
  UtilityToastMotionDirection,
  UtilityToastQueueItem,
  UtilityToastScreenPosition,
} from "../../../store/utility/utility.types"
import { useScopedUtilityStore } from "../../../store/utility/utility-store-provider"

const TOAST_DURATION_MS = 4200
const TOAST_EXIT_MS = 300

const TOAST_TONE_META: Record<
  ToastTone,
  { label: string; style: string; role: "status" | "alert"; live: "polite" | "assertive" }
> = {
  success: {
    label: "Success",
    style: "border-emerald-400/60 bg-[#0E2B1A]/95 text-emerald-100",
    role: "status",
    live: "polite",
  },
  error: {
    label: "Error",
    style: "border-red-400/50 bg-[#3A0E12]/95 text-red-100",
    role: "alert",
    live: "assertive",
  },
  warning: {
    label: "Warning",
    style: "border-amber-300/60 bg-[#3B2A07]/95 text-amber-100",
    role: "alert",
    live: "assertive",
  },
  information: {
    label: "Information",
    style: "border-sky-300/60 bg-[#0C223B]/95 text-sky-100",
    role: "status",
    live: "polite",
  },
}

const TOAST_DIRECTION_HIDDEN_CLASS: Record<UtilityToastMotionDirection, string> = {
  top: "-translate-y-6",
  bottom: "translate-y-6",
  left: "-translate-x-6",
  right: "translate-x-6",
}
const TOAST_POSITION_CLASS: Record<UtilityToastScreenPosition, string> = {
  top: "fixed left-1/2 top-[10%] -translate-x-1/2",
  right: "fixed right-[4%] top-1/2 -translate-y-1/2",
  bottom: "fixed left-1/2 bottom-[10%] -translate-x-1/2",
  left: "fixed left-[4%] top-1/2 -translate-y-1/2",
}
const TOAST_REPLACE_WIDTH_CLASS: Record<UtilityToastScreenPosition, string> = {
  top: "w-[min(640px,92%)]",
  right: "w-[min(420px,92vw)]",
  bottom: "w-[min(640px,92%)]",
  left: "w-[min(420px,92vw)]",
}
const TOAST_STACK_LAYOUT_CLASS: Record<"stack-vertical" | "stack-horizontal", string> = {
  "stack-horizontal": "flex w-[min(1080px,96%)] flex-wrap items-start justify-center gap-3",
  "stack-vertical": "flex w-[min(640px,92%)] flex-col gap-3",
}
type ReplaceMotionState = "entering" | "visible" | "exiting"

export const GlobalToast: React.FC = () => {
  const toastQueue = useScopedUtilityStore((state) => state.toast.queue)
  const toastLayout = useScopedUtilityStore((state) => state.toast.layout)
  const toastPosition = useScopedUtilityStore((state) => state.toast.position)
  const dequeueToast = useScopedUtilityStore((state) => state.toast.dequeue)
  const dismissToast = useScopedUtilityStore((state) => state.toast.dismiss)

  const activeToast = toastQueue[0] ?? null
  const isReplaceMode = toastLayout === "replace"

  const [visibleToast, setVisibleToast] = useState<UtilityToastQueueItem | null>(activeToast)
  const [replaceMotionState, setReplaceMotionState] = useState<ReplaceMotionState>(
    activeToast ? "entering" : "visible"
  )
  const [stackPendingEnterIds, setStackPendingEnterIds] = useState<string[]>([])
  const [stackExitingIds, setStackExitingIds] = useState<string[]>([])

  const replaceExitTimerRef = useRef<number | null>(null)
  const replaceEnterRafRef = useRef<number | null>(null)
  const replaceNextToastRef = useRef<UtilityToastQueueItem | null>(null)

  const stackAutoTimerRef = useRef<Record<string, number>>({})
  const stackExitTimerRef = useRef<Record<string, number>>({})
  const stackEnterRafRef = useRef<number | null>(null)
  const stackKnownIdsRef = useRef<Set<string>>(new Set())

  const scheduleReplaceVisibleState = useCallback(() => {
    window.cancelAnimationFrame(replaceEnterRafRef.current ?? -1)
    replaceEnterRafRef.current = window.requestAnimationFrame(() => {
      replaceEnterRafRef.current = window.requestAnimationFrame(() => {
        setReplaceMotionState("visible")
        replaceEnterRafRef.current = null
      })
    })
  }, [])

  const startReplaceEnter = useCallback((toast: UtilityToastQueueItem) => {
    replaceNextToastRef.current = null
    setVisibleToast(toast)
    setReplaceMotionState("entering")
    scheduleReplaceVisibleState()
  }, [scheduleReplaceVisibleState])

  const startReplaceExit = useCallback((nextToast: UtilityToastQueueItem | null) => {
    replaceNextToastRef.current = nextToast
    window.clearTimeout(replaceExitTimerRef.current ?? -1)
    window.cancelAnimationFrame(replaceEnterRafRef.current ?? -1)
    replaceEnterRafRef.current = null
    setReplaceMotionState("exiting")

    replaceExitTimerRef.current = window.setTimeout(() => {
      const pendingToast = replaceNextToastRef.current
      replaceNextToastRef.current = null
      replaceExitTimerRef.current = null

      if (!pendingToast) {
        setVisibleToast(null)
        setReplaceMotionState("visible")
        return
      }

      setVisibleToast(pendingToast)
      setReplaceMotionState("entering")
      scheduleReplaceVisibleState()
    }, TOAST_EXIT_MS)
  }, [scheduleReplaceVisibleState])

  const startStackExit = useCallback(
    (toastId: string) => {
      setStackPendingEnterIds((previous) => previous.filter((id) => id !== toastId))
      setStackExitingIds((previous) => Array.from(new Set([...previous, toastId])))
      window.clearTimeout(stackExitTimerRef.current[toastId] ?? -1)
      stackExitTimerRef.current[toastId] = window.setTimeout(() => {
        dismissToast(toastId)
        delete stackExitTimerRef.current[toastId]
        setStackExitingIds((previous) => previous.filter((id) => id !== toastId))
      }, TOAST_EXIT_MS)
    },
    [dismissToast]
  )

  useEffect(() => {
    if (!isReplaceMode) return

    if (!visibleToast && activeToast) {
      startReplaceEnter(activeToast)
      return
    }

    if (visibleToast && activeToast && visibleToast.id !== activeToast.id) {
      startReplaceExit(activeToast)
      return
    }

    if (visibleToast && !activeToast) {
      startReplaceExit(null)
    }
  }, [isReplaceMode, activeToast, visibleToast, startReplaceEnter, startReplaceExit])

  useEffect(() => {
    if (!isReplaceMode) return
    if (!visibleToast) return
    if (replaceMotionState !== "visible") return

    const timer = window.setTimeout(() => {
      dequeueToast()
    }, TOAST_DURATION_MS)

    return () => window.clearTimeout(timer)
  }, [isReplaceMode, visibleToast?.id, replaceMotionState, dequeueToast, visibleToast])

  useEffect(() => {
    if (isReplaceMode) {
      Object.values(stackAutoTimerRef.current).forEach((timerId) => window.clearTimeout(timerId))
      stackAutoTimerRef.current = {}
      Object.values(stackExitTimerRef.current).forEach((timerId) => window.clearTimeout(timerId))
      stackExitTimerRef.current = {}
      if (stackEnterRafRef.current) {
        window.cancelAnimationFrame(stackEnterRafRef.current)
        stackEnterRafRef.current = null
      }
      stackKnownIdsRef.current.clear()
      setStackPendingEnterIds([])
      setStackExitingIds([])
      return
    }

    const currentIds = new Set(toastQueue.map((toast) => toast.id))

    const newIds: string[] = []
    for (const toast of toastQueue) {
      if (stackKnownIdsRef.current.has(toast.id)) continue
      stackKnownIdsRef.current.add(toast.id)
      newIds.push(toast.id)
    }

    if (newIds.length > 0) {
      setStackPendingEnterIds((previous) => Array.from(new Set([...previous, ...newIds])))
      window.cancelAnimationFrame(stackEnterRafRef.current ?? -1)
      stackEnterRafRef.current = window.requestAnimationFrame(() => {
        setStackPendingEnterIds((previous) => previous.filter((id) => !newIds.includes(id)))
        stackEnterRafRef.current = null
      })
    }

    for (const knownId of Array.from(stackKnownIdsRef.current)) {
      if (currentIds.has(knownId)) continue
      stackKnownIdsRef.current.delete(knownId)
    }

    for (const toast of toastQueue) {
      if (stackAutoTimerRef.current[toast.id]) continue
      stackAutoTimerRef.current[toast.id] = window.setTimeout(() => {
        startStackExit(toast.id)
      }, TOAST_DURATION_MS)
    }

    for (const toastId of Object.keys(stackAutoTimerRef.current)) {
      if (currentIds.has(toastId)) continue
      window.clearTimeout(stackAutoTimerRef.current[toastId])
      delete stackAutoTimerRef.current[toastId]
    }

    for (const toastId of Object.keys(stackExitTimerRef.current)) {
      if (currentIds.has(toastId)) continue
      window.clearTimeout(stackExitTimerRef.current[toastId])
      delete stackExitTimerRef.current[toastId]
    }

    setStackPendingEnterIds((previous) => previous.filter((id) => currentIds.has(id)))
    setStackExitingIds((previous) => previous.filter((id) => currentIds.has(id)))
  }, [isReplaceMode, toastQueue, startStackExit])

  useEffect(() => {
    return () => {
      if (replaceExitTimerRef.current) {
        window.clearTimeout(replaceExitTimerRef.current)
      }
      if (replaceEnterRafRef.current) {
        window.cancelAnimationFrame(replaceEnterRafRef.current)
      }
      Object.values(stackAutoTimerRef.current).forEach((timerId) => window.clearTimeout(timerId))
      stackAutoTimerRef.current = {}
      Object.values(stackExitTimerRef.current).forEach((timerId) => window.clearTimeout(timerId))
      stackExitTimerRef.current = {}
      if (stackEnterRafRef.current) {
        window.cancelAnimationFrame(stackEnterRafRef.current)
      }
      stackEnterRafRef.current = null
    }
  }, [])

  if (!isReplaceMode && toastQueue.length === 0) return null
  if (isReplaceMode && !visibleToast) return null

  const renderToastCard = (
    toast: UtilityToastQueueItem,
    mode: "replace" | "stack-vertical" | "stack-horizontal"
  ) => {
    const toneMeta = TOAST_TONE_META[toast.tone]
    const hiddenEnterStyle = `${TOAST_DIRECTION_HIDDEN_CLASS[toast.enterFrom]} opacity-0 pointer-events-none`
    const hiddenExitStyle = `${TOAST_DIRECTION_HIDDEN_CLASS[toast.exitTo]} opacity-0 pointer-events-none`

    const isStackEntering = mode !== "replace" && stackPendingEnterIds.includes(toast.id)
    const isStackExiting = mode !== "replace" && stackExitingIds.includes(toast.id)
    const motionStyle =
      mode === "replace"
        ? replaceMotionState === "visible"
          ? "translate-x-0 translate-y-0 opacity-100"
          : replaceMotionState === "exiting"
            ? hiddenExitStyle
            : hiddenEnterStyle
        : isStackExiting
          ? hiddenExitStyle
          : isStackEntering
            ? hiddenEnterStyle
            : "translate-x-0 translate-y-0 opacity-100"
    const widthClass = mode === "stack-horizontal" ? "w-[min(320px,95vw)]" : "w-[min(640px,92%)]"
    const motionState =
      mode === "replace"
        ? replaceMotionState
        : isStackExiting
          ? "exiting"
          : isStackEntering
            ? "entering"
            : "visible"

    return (
      <div
        key={toast.id}
        className={`${widthClass} rounded-2xl border px-4 py-3 text-sm shadow-[0_18px_40px_rgba(0,0,0,0.45)] transition-all duration-300 ease-out transform-gpu ${toneMeta.style} ${motionStyle}`}
        role={toneMeta.role}
        aria-live={toneMeta.live}
        data-slot="global-toast-item"
        data-layout={mode}
        data-enter-from={toast.enterFrom}
        data-exit-to={toast.exitTo}
        data-motion-state={motionState}
      >
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-80">
          {toast.subject || toneMeta.label}
        </div>
        <div className="mt-1 font-semibold whitespace-pre-line">{toast.message}</div>
      </div>
    )
  }

  if (!isReplaceMode) {
    const stackLayoutClass = TOAST_STACK_LAYOUT_CLASS[toastLayout]

    return (
      <div
        className={`${TOAST_POSITION_CLASS[toastPosition]} z-[120] ${stackLayoutClass}`}
        data-slot="global-toast-stack"
        data-layout={toastLayout}
        data-position={toastPosition}
      >
        {toastQueue.map((toast) => renderToastCard(toast, toastLayout))}
      </div>
    )
  }

  return (
    <div
      className={`${TOAST_POSITION_CLASS[toastPosition]} z-[120] ${TOAST_REPLACE_WIDTH_CLASS[toastPosition]}`}
      data-slot="global-toast-replace"
      data-position={toastPosition}
    >
      {renderToastCard(visibleToast, "replace")}
    </div>
  )
}
