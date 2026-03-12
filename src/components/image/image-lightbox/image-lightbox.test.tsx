import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { ImageLightbox } from "./image-lightbox"

const findOverlay = (alt: string) => {
  const images = screen.getAllByAltText(alt)
  const modalImage = images[1] as HTMLImageElement | undefined
  return modalImage?.parentElement?.parentElement as HTMLDivElement | undefined
}

describe("ImageLightbox", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(0)
      return 1
    })
  })

  afterEach(() => {
    cleanup()
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it("renders defaults, opens modal, keeps it open on content click, and closes on backdrop click", () => {
    const { container } = render(<ImageLightbox src="/image.png" alt="Preview image" />)

    const hint = screen.getByText("Click to enlarge")
    expect(hint.className).toContain("text-[11px]")
    expect(container.querySelectorAll("img")).toHaveLength(1)

    fireEvent.click(screen.getByRole("button"))
    let overlay = findOverlay("Preview image")

    expect(overlay).toBeTruthy()
    expect(overlay?.className).toContain("opacity-100")

    const modalImage = screen.getAllByAltText("Preview image")[1] as HTMLImageElement
    expect(modalImage.className).toContain("opacity-100")
    expect(modalImage.className).toContain("scale-100")

    fireEvent.click(modalImage)
    overlay = findOverlay("Preview image")
    expect(overlay).toBeTruthy()

    fireEvent.click(overlay as HTMLDivElement)
    overlay = findOverlay("Preview image")
    expect(overlay?.className).toContain("opacity-0")
    expect(modalImage.className).toContain("opacity-0")
    expect(modalImage.className).toContain("scale-[0.98]")

    act(() => {
      vi.advanceTimersByTime(150)
    })
    expect(container.querySelectorAll("img")).toHaveLength(1)
  })

  it("uses custom hint props and closes only on Escape", () => {
    const addListenerSpy = vi.spyOn(window, "addEventListener")
    const removeListenerSpy = vi.spyOn(window, "removeEventListener")

    render(
      <ImageLightbox
        src="/custom.png"
        alt="Custom image"
        className="custom-thumbnail"
        hint="Zoom this image"
        hintSize="2xl"
      />,
    )

    const hint = screen.getByText("Zoom this image")
    expect(hint.className).toContain("text-2xl")
    expect((screen.getAllByAltText("Custom image")[0] as HTMLImageElement).className).toContain(
      "custom-thumbnail",
    )

    fireEvent.click(screen.getByRole("button"))
    expect(
      addListenerSpy.mock.calls.some(
        ([eventName, handler]) => eventName === "keydown" && typeof handler === "function",
      ),
    ).toBe(true)

    fireEvent.keyDown(window, { key: "Enter" })
    expect(findOverlay("Custom image")).toBeTruthy()

    fireEvent.keyDown(window, { key: "Escape" })
    act(() => {
      vi.advanceTimersByTime(150)
    })
    expect(findOverlay("Custom image")).toBeUndefined()
    expect(removeListenerSpy.mock.calls.some(([eventName]) => eventName === "keydown")).toBe(true)
  })

  it.each([
    ["xs", "text-[11px]"],
    ["sm", "text-xs"],
    ["base", "text-sm"],
    ["lg", "text-base"],
    ["xl", "text-xl"],
    ["2xl", "text-2xl"],
    ["3xl", "text-3xl"],
    ["4xl", "text-4xl"],
  ] as const)("applies hint size %s", (hintSize, expectedClass) => {
    render(<ImageLightbox src="/size.png" alt={`Size ${hintSize}`} hint="Hint text" hintSize={hintSize} />)

    expect(screen.getByText("Hint text").className).toContain(expectedClass)
  })
})
