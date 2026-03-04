import { createRef } from "react"
import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ButtonSpinner } from "./button-spinner"

describe("ButtonSpinner", () => {
  it("renders default size and aria-hidden", () => {
    const { container } = render(<ButtonSpinner />)
    const spinner = container.querySelector('[data-slot="spinner"]')

    expect(spinner).not.toBeNull()
    expect(spinner?.getAttribute("data-size")).toBe("md")
    expect(spinner?.getAttribute("aria-hidden")).toBe("true")
    expect(spinner?.className).toContain("h-4")
    expect(spinner?.className).toContain("w-4")
    expect(spinner?.className).toContain("border-[2px]")
  })

  it("respects the size prop", () => {
    const { container } = render(<ButtonSpinner size="lg" />)
    const spinner = container.querySelector('[data-slot="spinner"]')

    expect(spinner?.getAttribute("data-size")).toBe("lg")
    expect(spinner?.className).toContain("h-5")
    expect(spinner?.className).toContain("w-5")
    expect(spinner?.className).toContain("border-[3px]")
  })

  it("allows aria-hidden to be overridden", () => {
    const { container } = render(<ButtonSpinner aria-hidden={false} />)
    const spinner = container.querySelector('[data-slot="spinner"]')

    expect(spinner?.getAttribute("aria-hidden")).toBe("false")
  })

  it("forwards refs and merges className", () => {
    const ref = createRef<HTMLSpanElement>()
    const { container } = render(
      <ButtonSpinner ref={ref} className="text-foreground" data-testid="spinner" />
    )
    const spinner = container.querySelector('[data-slot="spinner"]')

    expect(ref.current).toBe(spinner)
    expect(spinner?.getAttribute("data-testid")).toBe("spinner")
    expect(spinner?.className).toContain("text-foreground")
  })
})
