import { afterEach, describe, expect, it } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import { GlobalLoadingOverlay } from "./global-loading-overlay"
import { useUtilityStore } from "../../../store/utility/utility-store"

afterEach(() => {
  cleanup()
  useUtilityStore.getState().overlaySpinner.resetLoading()
  useUtilityStore.getState().toast.clear()
})

describe("GlobalLoadingOverlay", () => {
  it("does not render when loading is inactive", () => {
    render(<GlobalLoadingOverlay />)

    expect(screen.queryByRole("status")).toBeNull()
  })

  it("renders default spinner when loading starts", () => {
    useUtilityStore.getState().overlaySpinner.startLoading()
    const { container } = render(<GlobalLoadingOverlay />)
    const overlay = screen.getByRole("status")
    const spinner = container.querySelector(
      '[data-slot="global-loading-spinner"]'
    ) as HTMLSpanElement | null

    expect(overlay).not.toBeNull()
    expect(spinner).not.toBeNull()
    expect(spinner?.getAttribute("data-shape")).toBe("circle")
    expect(spinner?.style.borderTopColor).toBe("transparent")
    expect(spinner?.className).toContain("animate-spin")
    expect(container.querySelector('[data-slot="global-loading-overlay-status-text"]')?.textContent).toBe(
      "Loading"
    )
  })

  it("uses configurable colors, shape and center content from props", () => {
    useUtilityStore.getState().overlaySpinner.startLoading()
    const { container } = render(
      <GlobalLoadingOverlay
        overlayColor="rgba(10, 20, 30, 0.6)"
        overlayOpacity={0.4}
        spinnerColor="#11AA44"
        spinnerGlowColor="rgba(17, 170, 68, 0.45)"
        spinnerShape="square"
        spinnerCenterContent="42"
        spinnerSize={64}
        spinnerThickness={4}
      />
    )

    const overlay = container.querySelector('[data-slot="global-loading-overlay"]') as HTMLDivElement
    const overlayBackdrop = container.querySelector(
      '[data-slot="global-loading-overlay-backdrop"]'
    ) as HTMLSpanElement
    const spinner = container.querySelector('[data-slot="global-loading-spinner"]') as HTMLSpanElement
    const spinnerWrapper = container.querySelector(
      '[data-slot="global-loading-spinner-wrapper"]'
    ) as HTMLSpanElement

    expect(overlayBackdrop.style.backgroundColor).toBe("rgba(10, 20, 30, 0.6)")
    expect(overlayBackdrop.style.opacity).toBe("0.4")
    expect(overlay.style.backdropFilter).toBe("blur(2.4px)")
    expect(spinner.getAttribute("data-shape")).toBe("square")
    expect(spinner.className).toContain("rounded-none")
    expect(spinner.style.borderColor).toBe("rgb(17, 170, 68)")
    expect(spinner.style.borderWidth).toBe("4px")
    expect(spinnerWrapper.style.width).toBe("64px")
    expect(screen.getByText("42")).not.toBeNull()
  })

  it("renders orbit-wave animation mode without spinner rotation", () => {
    useUtilityStore.getState().overlaySpinner.startLoading()
    const { container } = render(<GlobalLoadingOverlay spinnerAnimation="orbit-wave" />)
    const spinner = container.querySelector('[data-slot="global-loading-spinner"]') as HTMLSpanElement
    const waveRing = container.querySelector('[data-slot="global-loading-spinner-wave"]')
    const wavePaths = container.querySelectorAll('[data-slot="global-loading-spinner-wave-path"]')
    const pulseDot = container.querySelector('[data-slot="global-loading-spinner-orbit-dot"]')

    expect(spinner.getAttribute("data-animation")).toBe("orbit-wave")
    expect(spinner.className).not.toContain("animate-spin")
    expect(waveRing).not.toBeNull()
    expect(wavePaths.length).toBe(2)
    expect(pulseDot).toBeNull()
  })

  it("renders orbit-pulse animation mode with orbiting pulse dot", () => {
    useUtilityStore.getState().overlaySpinner.startLoading()
    const { container } = render(<GlobalLoadingOverlay spinnerAnimation="orbit-pulse" />)
    const spinner = container.querySelector('[data-slot="global-loading-spinner"]') as HTMLSpanElement
    const orbitDot = container.querySelector('[data-slot="global-loading-spinner-orbit-dot"]')

    expect(spinner.getAttribute("data-animation")).toBe("orbit-pulse")
    expect(orbitDot).not.toBeNull()
  })

})
