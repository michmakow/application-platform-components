import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { ButtonSlot } from "./button-slot"

describe("ButtonSlot", () => {
  it("returns null when there is no icon and spinner is disabled", () => {
    const { container } = render(<ButtonSlot />)
    expect(container.firstChild).toBeNull()
  })

  it("renders icon and spinner states when loading", () => {
    const { container } = render(
      <ButtonSlot icon={<svg data-testid="slot-icon" aria-hidden />} showSpinner isLoading />
    )

    const icon = container.querySelector('[data-slot="icon"]') as HTMLSpanElement
    const spinner = container.querySelector('[data-slot="spinner"]') as HTMLSpanElement

    expect(icon).toBeTruthy()
    expect(icon.className).toContain("opacity-0")
    expect(spinner).toBeTruthy()
    expect(spinner.className).toContain("absolute")
    expect(spinner.className).toContain("opacity-100")
  })

  it("keeps spinner hidden when not loading", () => {
    const { container } = render(<ButtonSlot showSpinner isLoading={false} />)
    const spinner = container.querySelector('[data-slot="spinner"]') as HTMLSpanElement

    expect(spinner.className).toContain("opacity-0")
    expect(spinner.className).not.toContain("absolute")
  })
})
