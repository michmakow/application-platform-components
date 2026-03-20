import { afterEach, describe, expect, it, vi } from "vitest"
import { act, cleanup, render, screen, waitFor } from "@testing-library/react"
import { GlobalToast } from "./global-toast"
import { useUtilityStore } from "../../../store/utility/utility-store"
import type { ToastTone } from "../../../store/utility/utility.types"

afterEach(() => {
  vi.useRealTimers()
  cleanup()
  useUtilityStore.getState().toast.clear()
  useUtilityStore.getState().toast.setLayout("replace")
  useUtilityStore.getState().toast.setPosition("top")
  useUtilityStore.getState().toast.setEnterFrom("top")
  useUtilityStore.getState().toast.setExitTo("top")
  useUtilityStore.getState().overlaySpinner.resetLoading()
})

describe("GlobalToast", () => {
  it("does not render when toast is not present", () => {
    render(<GlobalToast />)

    expect(screen.queryByRole("status")).toBeNull()
    expect(screen.queryByRole("alert")).toBeNull()
  })

  it.each<
    [ToastTone, "status" | "alert", "polite" | "assertive", string, string]
  >([
    ["success", "status", "polite", "border-emerald-400/60", "Success"],
    ["error", "alert", "assertive", "border-red-400/50", "Error"],
    ["warning", "alert", "assertive", "border-amber-300/60", "Warning"],
    ["information", "status", "polite", "border-sky-300/60", "Information"],
  ])("renders tone=%s with expected semantics and style", (tone, role, live, styleToken, fallbackLabel) => {
    useUtilityStore.getState().toast.enqueue({
      tone,
      subject: "",
      message: `Message for ${tone}`,
    })
    const { container } = render(<GlobalToast />)
    const toast = container.querySelector(`[role="${role}"]`) as HTMLDivElement

    expect(toast).not.toBeNull()
    expect(toast.getAttribute("aria-live")).toBe(live)
    expect(toast.className).toContain(styleToken)
    expect(screen.getByText(fallbackLabel)).not.toBeNull()
    expect(screen.getByText(`Message for ${tone}`)).not.toBeNull()
  })

  it("keeps toasts in queue order and switches on dequeue", async () => {
    const store = useUtilityStore.getState()
    store.toast.enqueue({
      tone: "information",
      subject: "",
      message: "First in queue",
    })
    store.toast.enqueue({
      tone: "warning",
      subject: "",
      message: "Second in queue",
    })
    const { container } = render(<GlobalToast />)

    expect(screen.getByText("First in queue")).not.toBeNull()
    store.toast.dequeue()
    await waitFor(() => {
      expect(screen.getByText("Second in queue")).not.toBeNull()
    })
    expect(container.querySelector('[role="alert"]')).not.toBeNull()
  })

  it("uses configured exit direction before switching to next queued toast", async () => {
    const store = useUtilityStore.getState()
    store.toast.setExitTo("right")
    store.toast.enqueue({
      tone: "information",
      subject: "",
      message: "First queued toast",
    })
    store.toast.enqueue({
      tone: "warning",
      subject: "",
      message: "Second queued toast",
    })

    const { container } = render(<GlobalToast />)
    store.toast.dequeue()

    await waitFor(() => {
      const exitingToast = container.querySelector('[data-slot="global-toast-item"]') as HTMLDivElement
      expect(exitingToast.getAttribute("data-motion-state")).toBe("exiting")
      expect(exitingToast.className).toContain("translate-x-6")
      expect(exitingToast.className).toContain("opacity-0")
    })

    await waitFor(() => {
      expect(screen.getByText("Second queued toast")).not.toBeNull()
    })
  })

  it("renders stacked toasts in vertical mode", () => {
    const store = useUtilityStore.getState()
    store.toast.setLayout("stack-vertical")
    store.toast.enqueue({
      tone: "information",
      subject: "",
      message: "Vertical first",
    })
    store.toast.enqueue({
      tone: "warning",
      subject: "",
      message: "Vertical second",
    })
    const { container } = render(<GlobalToast />)
    const stackContainer = container.querySelector('[data-slot="global-toast-stack"]') as HTMLDivElement

    expect(stackContainer.getAttribute("data-layout")).toBe("stack-vertical")
    expect(screen.getByText("Vertical first")).not.toBeNull()
    expect(screen.getByText("Vertical second")).not.toBeNull()
    expect(container.querySelectorAll('[data-slot="global-toast-item"]').length).toBe(2)
  })

  it("renders stacked toasts in horizontal mode", () => {
    const store = useUtilityStore.getState()
    store.toast.setLayout("stack-horizontal")
    store.toast.enqueue({
      tone: "success",
      subject: "",
      message: "Horizontal first",
    })
    store.toast.enqueue({
      tone: "error",
      subject: "",
      message: "Horizontal second",
    })
    const { container } = render(<GlobalToast />)
    const stackContainer = container.querySelector('[data-slot="global-toast-stack"]') as HTMLDivElement

    expect(stackContainer.getAttribute("data-layout")).toBe("stack-horizontal")
    expect(screen.getByText("Horizontal first")).not.toBeNull()
    expect(screen.getByText("Horizontal second")).not.toBeNull()
    expect(container.querySelectorAll('[data-slot="global-toast-item"]').length).toBe(2)
  })

  it.each([
    ["top", "top-[10%]"],
    ["right", "right-[4%]"],
    ["bottom", "bottom-[10%]"],
    ["left", "left-[4%]"],
  ] as const)("positions replace toast on %s edge", (position, classToken) => {
    const store = useUtilityStore.getState()
    store.toast.setLayout("replace")
    store.toast.setPosition(position)
    store.toast.enqueue({
      tone: "information",
      subject: "",
      message: `Position ${position}`,
    })

    const { container } = render(<GlobalToast />)
    const wrapper = container.querySelector('[data-slot="global-toast-replace"]') as HTMLDivElement
    expect(wrapper.getAttribute("data-position")).toBe(position)
    expect(wrapper.className).toContain(classToken)
  })

  it.each([
    ["top", "top-[10%]"],
    ["right", "right-[4%]"],
    ["bottom", "bottom-[10%]"],
    ["left", "left-[4%]"],
  ] as const)("positions stack container on %s edge", (position, classToken) => {
    const store = useUtilityStore.getState()
    store.toast.setLayout("stack-vertical")
    store.toast.setPosition(position)
    store.toast.enqueue({
      tone: "success",
      subject: "",
      message: `Stack position ${position}`,
    })

    const { container } = render(<GlobalToast />)
    const stackContainer = container.querySelector('[data-slot="global-toast-stack"]') as HTMLDivElement
    expect(stackContainer.getAttribute("data-position")).toBe(position)
    expect(stackContainer.className).toContain(classToken)
  })

  it("supports independent enter and exit directions in replace mode", async () => {
    const store = useUtilityStore.getState()
    store.toast.setEnterFrom("right")
    store.toast.setExitTo("bottom")
    store.toast.enqueue({
      tone: "information",
      subject: "",
      message: "Directional toast",
    })

    const { container } = render(<GlobalToast />)
    const initialToast = container.querySelector('[data-slot="global-toast-item"]') as HTMLDivElement

    expect(initialToast.getAttribute("data-enter-from")).toBe("right")
    expect(initialToast.getAttribute("data-exit-to")).toBe("bottom")

    store.toast.clear()
    await waitFor(() => {
      const exitingToast = container.querySelector('[data-slot="global-toast-item"]') as HTMLDivElement
      expect(exitingToast.className).toContain("translate-y-6")
      expect(exitingToast.className).toContain("opacity-0")
    })
  })

  it("applies configured enter direction when toast is present at mount", () => {
    const store = useUtilityStore.getState()
    store.toast.setEnterFrom("left")
    store.toast.enqueue({
      tone: "information",
      subject: "",
      message: "Mount enter direction",
    })

    const { container } = render(<GlobalToast />)
    const toast = container.querySelector('[data-slot="global-toast-item"]') as HTMLDivElement

    expect(toast.getAttribute("data-motion-state")).toBe("entering")
    expect(toast.className).toContain("-translate-x-6")
    expect(toast.className).toContain("opacity-0")
  })

  it("does not reverse enter top and exit bottom directions", async () => {
    const store = useUtilityStore.getState()
    store.toast.setEnterFrom("top")
    store.toast.setExitTo("bottom")
    store.toast.enqueue({
      tone: "information",
      subject: "",
      message: "Top to bottom direction check",
    })

    const { container } = render(<GlobalToast />)
    const enteringToast = container.querySelector('[data-slot="global-toast-item"]') as HTMLDivElement

    expect(enteringToast.getAttribute("data-motion-state")).toBe("entering")
    expect(enteringToast.className).toContain("-translate-y-6")
    expect(enteringToast.className).toContain("opacity-0")

    store.toast.clear()
    await waitFor(() => {
      const exitingToast = container.querySelector('[data-slot="global-toast-item"]') as HTMLDivElement
      expect(exitingToast.getAttribute("data-motion-state")).toBe("exiting")
      expect(exitingToast.className).toContain("translate-y-6")
      expect(exitingToast.className).toContain("opacity-0")
    })
  })

  it("snapshots enter and exit direction at enqueue time", async () => {
    const store = useUtilityStore.getState()
    store.toast.setEnterFrom("left")
    store.toast.setExitTo("bottom")
    store.toast.enqueue({
      tone: "information",
      subject: "",
      message: "Snapshot motion toast",
    })

    store.toast.setEnterFrom("right")
    store.toast.setExitTo("top")

    const { container } = render(<GlobalToast />)
    const enteringToast = container.querySelector('[data-slot="global-toast-item"]') as HTMLDivElement
    expect(enteringToast.getAttribute("data-enter-from")).toBe("left")
    expect(enteringToast.getAttribute("data-exit-to")).toBe("bottom")

    store.toast.clear()
    await waitFor(() => {
      const exitingToast = container.querySelector('[data-slot="global-toast-item"]') as HTMLDivElement
      expect(exitingToast.className).toContain("translate-y-6")
    })
  })

  it("starts replace enter when toast appears after mount and auto-dismisses by timer", async () => {
    vi.useFakeTimers()
    const store = useUtilityStore.getState()
    const { container } = render(<GlobalToast />)

    act(() => {
      store.toast.enqueue({
        tone: "information",
        subject: "",
        message: "Appears after mount",
      })
    })
    const enteringToast = container.querySelector('[data-slot="global-toast-item"]') as HTMLDivElement
    expect(enteringToast.getAttribute("data-motion-state")).toBe("entering")

    act(() => {
      vi.advanceTimersByTime(34)
    })
    const visibleToast = container.querySelector('[data-slot="global-toast-item"]') as HTMLDivElement
    expect(visibleToast.getAttribute("data-motion-state")).toBe("visible")

    act(() => {
      vi.advanceTimersByTime(4200)
    })
    const exitingToast = container.querySelector('[data-slot="global-toast-item"]') as HTMLDivElement
    expect(exitingToast.getAttribute("data-motion-state")).toBe("exiting")

    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(screen.queryByText("Appears after mount")).toBeNull()
    expect(store.toast.queue.length).toBe(0)
  })

  it("stack mode auto-dismisses with exit animation", () => {
    vi.useFakeTimers()
    const store = useUtilityStore.getState()
    store.toast.setLayout("stack-vertical")
    store.toast.setEnterFrom("left")
    store.toast.setExitTo("right")
    store.toast.enqueue({
      tone: "warning",
      subject: "",
      message: "Stack auto dismiss",
    })

    const { container } = render(<GlobalToast />)

    act(() => {
      vi.advanceTimersByTime(4200)
    })
    const exitingToast = container.querySelector('[data-slot="global-toast-item"]') as HTMLDivElement
    expect(exitingToast.getAttribute("data-motion-state")).toBe("exiting")
    expect(exitingToast.className).toContain("translate-x-6")

    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(screen.queryByText("Stack auto dismiss")).toBeNull()
  })

  it("clears stack exit timers when queue is emptied before exit completes", () => {
    vi.useFakeTimers()
    const store = useUtilityStore.getState()
    store.toast.setLayout("stack-vertical")
    store.toast.enqueue({
      tone: "information",
      subject: "",
      message: "Stack clear case",
    })

    const { container } = render(<GlobalToast />)

    act(() => {
      vi.advanceTimersByTime(4200)
    })
    const exitingToast = container.querySelector('[data-slot="global-toast-item"]') as HTMLDivElement
    expect(exitingToast.getAttribute("data-motion-state")).toBe("exiting")

    act(() => {
      store.toast.clear()
    })
    expect(container.querySelector('[data-slot="global-toast-item"]')).toBeNull()
  })

  it("cancels and re-schedules stack enter frames on rapid updates", () => {
    vi.useFakeTimers()
    const store = useUtilityStore.getState()
    store.toast.setLayout("stack-vertical")
    render(<GlobalToast />)

    act(() => {
      store.toast.enqueue({
        tone: "information",
        subject: "",
        message: "Stack first",
      })
    })

    act(() => {
      store.toast.enqueue({
        tone: "warning",
        subject: "",
        message: "Stack second",
      })
    })

    act(() => {
      store.toast.setLayout("replace")
    })

    expect(useUtilityStore.getState().toast.layout).toBe("replace")
  })

  it("cancels replace enter frame when exit starts before first frame flush", () => {
    vi.useFakeTimers()
    const store = useUtilityStore.getState()
    const cancelAnimationFrameSpy = vi.spyOn(window, "cancelAnimationFrame")
    render(<GlobalToast />)

    act(() => {
      store.toast.enqueue({
        tone: "information",
        subject: "",
        message: "Frame cancel case",
      })
    })

    act(() => {
      store.toast.clear()
    })

    expect(cancelAnimationFrameSpy).toHaveBeenCalled()
  })

  it("marks next toast as visible after replace exit transition frame", () => {
    vi.useFakeTimers()
    const store = useUtilityStore.getState()
    store.toast.enqueue({
      tone: "information",
      subject: "",
      message: "First transition toast",
    })
    store.toast.enqueue({
      tone: "warning",
      subject: "",
      message: "Second transition toast",
    })

    const { container } = render(<GlobalToast />)

    act(() => {
      store.toast.dequeue()
    })
    act(() => {
      vi.advanceTimersByTime(300)
    })
    act(() => {
      vi.advanceTimersByTime(34)
    })

    const activeToast = container.querySelector('[data-slot="global-toast-item"]') as HTMLDivElement
    expect(activeToast.getAttribute("data-motion-state")).toBe("visible")
    expect(screen.getByText("Second transition toast")).not.toBeNull()
  })

  it("keeps then removes stack exit timers based on queue membership", () => {
    vi.useFakeTimers()
    const store = useUtilityStore.getState()
    store.toast.setLayout("stack-vertical")
    store.toast.enqueue({
      tone: "information",
      subject: "",
      message: "Timer branch first",
    })
    render(<GlobalToast />)

    act(() => {
      vi.advanceTimersByTime(4200)
    })
    act(() => {
      store.toast.enqueue({
        tone: "warning",
        subject: "",
        message: "Timer branch second",
      })
    })
    act(() => {
      store.toast.clear()
    })

    expect(store.toast.queue.length).toBe(0)
  })
})
