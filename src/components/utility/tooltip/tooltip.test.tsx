import * as React from "react"
import { afterEach, describe, expect, it } from "vitest"
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver
}

if (!globalThis.PointerEvent) {
  globalThis.PointerEvent = MouseEvent as unknown as typeof PointerEvent
}

afterEach(() => {
  cleanup()
})

const getTooltipContentByText = (text: string) => {
  const content = Array.from(
    document.querySelectorAll<HTMLElement>('[data-slot="tooltip-content"]')
  ).find((node) => node.textContent?.includes(text))

  if (!content) {
    throw new Error(`Unable to find tooltip content for text: ${text}`)
  }
  return content
}

describe("Tooltip", () => {
  it("injects tooltip keyframes style only once", () => {
    render(
      <>
        <Tooltip open>
          <TooltipTrigger>Trigger one</TooltipTrigger>
          <TooltipContent>First content</TooltipContent>
        </Tooltip>
        <Tooltip open>
          <TooltipTrigger>Trigger two</TooltipTrigger>
          <TooltipContent>Second content</TooltipContent>
        </Tooltip>
      </>
    )

    expect(document.querySelectorAll("#ud-tooltip-animation-keyframes")).toHaveLength(1)
  })

  it("runs default animation for tooltip content", () => {
    render(
      <Tooltip open>
        <TooltipTrigger>Trigger default</TooltipTrigger>
        <TooltipContent side="bottom">Default animation content</TooltipContent>
      </Tooltip>
    )

    const content = getTooltipContentByText("Default animation content")

    expect(content.getAttribute("data-animation")).toBe("default")
    expect(content.className).toContain("ud-tooltip-default-in")
    expect(content.className).toContain("ud-tooltip-default-out")
    expect(content.style.getPropertyValue("--ud-tooltip-enter-y")).toBe("-8px")
    expect(content.style.getPropertyValue("--ud-tooltip-animation-duration")).toBe("180ms")
  })

  it("applies selected side to tooltip content", () => {
    render(
      <Tooltip open>
        <TooltipTrigger>Trigger side</TooltipTrigger>
        <TooltipContent side="left">Left side content</TooltipContent>
      </Tooltip>
    )

    const content = getTooltipContentByText("Left side content")
    expect(content.getAttribute("data-side")).toBe("left")
    expect(content.style.getPropertyValue("--ud-tooltip-enter-x")).toBe("8px")
    expect(content.style.getPropertyValue("--ud-tooltip-enter-y")).toBe("0px")
  })

  it("does not animate when animation is set to none", () => {
    render(
      <Tooltip open>
        <TooltipTrigger>Trigger none</TooltipTrigger>
        <TooltipContent animation="none">No animation content</TooltipContent>
      </Tooltip>
    )

    const content = getTooltipContentByText("No animation content")

    expect(content.getAttribute("data-animation")).toBe("none")
    expect(content.className).toContain("![animation:none]")
  })

  it("supports fade-only animation preset", () => {
    render(
      <Tooltip open>
        <TooltipTrigger>Trigger fade</TooltipTrigger>
        <TooltipContent animation="fade">Fade animation content</TooltipContent>
      </Tooltip>
    )

    const content = getTooltipContentByText("Fade animation content")

    expect(content.getAttribute("data-animation")).toBe("fade")
    expect(content.className).toContain("ud-tooltip-fade-in")
    expect(content.className).toContain("ud-tooltip-fade-out")
  })

  it("supports slide animation preset", () => {
    render(
      <Tooltip open>
        <TooltipTrigger>Trigger slide</TooltipTrigger>
        <TooltipContent animation="slide">Slide animation content</TooltipContent>
      </Tooltip>
    )

    const content = getTooltipContentByText("Slide animation content")

    expect(content.getAttribute("data-animation")).toBe("slide")
    expect(content.className).toContain("ud-tooltip-slide-in")
    expect(content.className).toContain("ud-tooltip-slide-out")
    expect(content.style.getPropertyValue("--ud-tooltip-enter-y")).toBe("8px")
  })

  it("supports custom animation duration", () => {
    render(
      <Tooltip open>
        <TooltipTrigger>Trigger duration</TooltipTrigger>
        <TooltipContent animation="zoom" animationDurationMs={420}>
          Duration content
        </TooltipContent>
      </Tooltip>
    )

    const content = getTooltipContentByText("Duration content")

    expect(content.className).toContain("ud-tooltip-zoom-in")
    expect(content.className).toContain("ud-tooltip-zoom-out")
    expect(content.style.getPropertyValue("--ud-tooltip-animation-duration")).toBe("420ms")
  })

  it("applies reverse animation class when tooltip closes after hover out", async () => {
    const HoverTooltipHarness: React.FC = () => {
      const [open, setOpen] = React.useState(false)

      return (
        <Tooltip open={open} onOpenChange={setOpen}>
          <TooltipTrigger asChild>
            <button
              type="button"
              onMouseEnter={() => setOpen(true)}
              onMouseLeave={() => setOpen(false)}
            >
              Hover trigger
            </button>
          </TooltipTrigger>
          <TooltipContent animation="zoom" animationDurationMs={250} forceMount>
            Hover content
          </TooltipContent>
        </Tooltip>
      )
    }

    render(
      <HoverTooltipHarness />
    )

    const trigger = screen.getByRole("button", { name: "Hover trigger" })
    const content = getTooltipContentByText("Hover content")

    expect(content.getAttribute("data-state")).toBe("closed")
    expect(content.className).toContain("ud-tooltip-zoom-in")
    expect(content.className).toContain("ud-tooltip-zoom-out")

    fireEvent.mouseEnter(trigger)

    await waitFor(() => {
      expect(content.getAttribute("data-state")).not.toBe("closed")
    })

    fireEvent.mouseLeave(trigger)

    await waitFor(() => {
      expect(content.getAttribute("data-state")).toBe("closed")
    })
  })

  it("does not create nested provider when tooltip is already inside TooltipProvider", () => {
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>Trigger provider</TooltipTrigger>
          <TooltipContent>Provider content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )

    const content = getTooltipContentByText("Provider content")
    expect(content).toBeTruthy()
  })
})
