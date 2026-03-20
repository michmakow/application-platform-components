import { useEffect } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { useUtilityStore } from "../store/utility/utility-store"
import { Button } from "../components/blocks/button"
import { GlobalToast } from "../components/utility/global-toast"
import type {
  UtilityToastMotionDirection,
  UtilityToastQueueLayout,
  UtilityToastScreenPosition,
} from "../store/utility/utility.types"

const TOAST_DIRECTIONS: UtilityToastMotionDirection[] = ["top", "bottom", "left", "right"]
const TOAST_POSITIONS: UtilityToastScreenPosition[] = ["top", "right", "bottom", "left"]

const meta: Meta<typeof GlobalToast> = {
  title: "Platform Components/System Feedback/GlobalToast",
  component: GlobalToast,
}

export default meta
type Story = StoryObj<typeof GlobalToast>

export const Default: Story = {
  render: (args) => {
    const enqueueToast = useUtilityStore((state) => state.toast.enqueue)
    const toastLayout = useUtilityStore((state) => state.toast.layout)
    const toastEnterFrom = useUtilityStore((state) => state.toast.enterFrom)
    const toastExitTo = useUtilityStore((state) => state.toast.exitTo)
    const toastPosition = useUtilityStore((state) => state.toast.position)
    const setToastLayout = useUtilityStore((state) => state.toast.setLayout)
    const setToastEnterFrom = useUtilityStore((state) => state.toast.setEnterFrom)
    const setToastExitTo = useUtilityStore((state) => state.toast.setExitTo)
    const setToastPosition = useUtilityStore((state) => state.toast.setPosition)
    const clearToasts = useUtilityStore((state) => state.toast.clear)
    const applyEnterDirection = (direction: UtilityToastMotionDirection) => {
      clearToasts()
      setToastEnterFrom(direction)
    }
    const applyLayout = (layout: UtilityToastQueueLayout) => {
      setToastLayout(layout)
      clearToasts()
    }

    useEffect(() => {
      const previousToastState = useUtilityStore.getState().toast
      const previousLayout = previousToastState.layout
      const previousEnterFrom = previousToastState.enterFrom
      const previousExitTo = previousToastState.exitTo
      const previousPosition = previousToastState.position
      const previousQueue = [...previousToastState.queue]

      setToastLayout("replace")
      setToastEnterFrom("top")
      setToastExitTo("top")
      setToastPosition("top")
      clearToasts()
      return () => {
        useUtilityStore.setState((state) => ({
          toast: {
            ...state.toast,
            layout: previousLayout,
            enterFrom: previousEnterFrom,
            exitTo: previousExitTo,
            position: previousPosition,
            queue: previousQueue,
          },
        }))
      }
    }, [setToastLayout, setToastEnterFrom, setToastExitTo, setToastPosition, clearToasts])

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs uppercase tracking-[0.18em] opacity-70">
            Layout: {toastLayout}
          </span>
          <Button
            className="cursor-pointer"
            variant={toastLayout === "replace" ? "primary" : "secondary"}
            onClick={() => applyLayout("replace")}
          >
            Replace one place
          </Button>
          <Button
            className="cursor-pointer"
            variant={toastLayout === "stack-vertical" ? "primary" : "secondary"}
            onClick={() => applyLayout("stack-vertical")}
          >
            Stack vertical
          </Button>
          <Button
            className="cursor-pointer"
            variant={toastLayout === "stack-horizontal" ? "primary" : "secondary"}
            onClick={() => applyLayout("stack-horizontal")}
          >
            Stack horizontal
          </Button>
        </div>
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-[0.18em] opacity-70">Position: {toastPosition}</div>
          <div className="flex flex-wrap gap-3">
            {TOAST_POSITIONS.map((position) => (
              <Button
                key={`position-${position}`}
                className="cursor-pointer"
                variant={toastPosition === position ? "primary" : "secondary"}
                onClick={() => setToastPosition(position)}
              >
                Position {position}
              </Button>
            ))}
          </div>
          <div className="text-xs uppercase tracking-[0.18em] opacity-70">
            Enter from: {toastEnterFrom}
          </div>
          <div className="flex flex-wrap gap-3">
            {TOAST_DIRECTIONS.map((direction) => (
              <Button
                key={`enter-${direction}`}
                className="cursor-pointer"
                variant={toastEnterFrom === direction ? "primary" : "secondary"}
                onClick={() => applyEnterDirection(direction)}
              >
                Enter {direction}
              </Button>
            ))}
          </div>
          <div className="text-xs uppercase tracking-[0.18em] opacity-70">Exit to: {toastExitTo}</div>
          <div className="flex flex-wrap gap-3">
            {TOAST_DIRECTIONS.map((direction) => (
              <Button
                key={`exit-${direction}`}
                className="cursor-pointer"
                variant={toastExitTo === direction ? "primary" : "secondary"}
                onClick={() => setToastExitTo(direction)}
              >
                Exit {direction}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            className="cursor-pointer"
            onClick={() =>
              enqueueToast({
                tone: "success",
                subject: "Saved",
                message: "Your changes have been applied.",
              })
            }
          >
            Show success
          </Button>
          <Button
            className="cursor-pointer"
            variant="secondary"
            onClick={() =>
              enqueueToast({
                tone: "error",
                subject: "Failed",
                message: "Something went wrong. Please try again.",
              })
            }
          >
            Show error
          </Button>
          <Button
            className="cursor-pointer"
            variant="secondary"
            onClick={() =>
              enqueueToast({
                tone: "warning",
                subject: "Heads up",
                message: "Please review your inputs before continuing.",
              })
            }
          >
            Show warning
          </Button>
          <Button
            className="cursor-pointer"
            variant="secondary"
            onClick={() =>
              enqueueToast({
                tone: "information",
                subject: "FYI",
                message: "System status is normal and all services are online.",
              })
            }
          >
            Show information
          </Button>
          <Button
            className="cursor-pointer"
            variant="secondary"
            onClick={() => {
              enqueueToast({
                tone: "information",
                subject: "Queue",
                message: "First queued toast. This one appears first.",
              })
              enqueueToast({
                tone: "warning",
                subject: "Queue",
                message: "Second queued toast. Layout decides if it stacks or waits.",
              })
              enqueueToast({
                tone: "success",
                subject: "Queue",
                message: "Third queued toast. Useful to validate queue policy.",
              })
            }}
          >
            Queue 3 toasts
          </Button>
          <Button className="cursor-pointer" variant="link" onClick={() => clearToasts()}>
            Clear
          </Button>
        </div>
        <GlobalToast {...args} />
      </div>
    )
  },
}
