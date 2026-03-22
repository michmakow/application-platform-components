import { createRef } from "react"
import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { IconSlot } from "./icon-slot"

describe("IconSlot", () => {
  it("renders default position and slot attribute", () => {
    const { container } = render(
      <IconSlot>
        <svg />
      </IconSlot>
    )
    const slot = container.querySelector('[data-slot="icon"]')

    expect(slot).not.toBeNull()
    expect(slot?.getAttribute("data-position")).toBe("left")
  })

  it("respects the position prop", () => {
    const { container } = render(
      <IconSlot position="right">
        <svg />
      </IconSlot>
    )
    const slot = container.querySelector('[data-slot="icon"]')

    expect(slot?.getAttribute("data-position")).toBe("right")
  })

  it("forwards refs and merges className", () => {
    const ref = createRef<HTMLSpanElement>()
    const { container } = render(
      <IconSlot ref={ref} className="h-4 w-4" data-testid="icon-slot">
        <svg />
      </IconSlot>
    )
    const slot = container.querySelector('[data-slot="icon"]')

    expect(ref.current).toBe(slot)
    expect(slot?.getAttribute("data-testid")).toBe("icon-slot")
    expect(slot?.className).toContain("h-4")
    expect(slot?.className).toContain("w-4")
  })
})
