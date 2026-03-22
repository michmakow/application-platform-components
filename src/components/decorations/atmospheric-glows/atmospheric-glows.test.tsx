import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { AtmosphericGlows, atmosphericGlowsPositions } from "./atmospheric-glows"

describe("AtmosphericGlows", () => {
  it("uses top-right position by default", () => {
    const { container } = render(<AtmosphericGlows />)
    const root = container.querySelector('[data-slot="atmospheric-glows"]')
    const top = container.querySelector('[data-layer="top"]')
    const bottom = container.querySelector('[data-layer="bottom"]')
    const overlay = container.querySelector('[data-layer="overlay"]')

    expect(root?.getAttribute("data-position")).toBe("top-right")
    expect(top?.className).toContain("right-[-12%]")
    expect(bottom?.className).toContain("left-[-18%]")
    expect(overlay?.className).toContain("circle_at_80%_10%")
  })

  it.each([
    ["top-left", "left-[-12%]", "right-[-18%]", "circle_at_20%_10%"],
    ["top-center", "top-[-18%]", "bottom-[-28%]", "circle_at_50%_10%"],
    ["top-right", "right-[-12%]", "left-[-18%]", "circle_at_80%_10%"],
    ["right-center", "right-[-12%]", "left-[-18%]", "circle_at_90%_50%"],
    ["bottom-right", "right-[-12%]", "left-[-18%]", "circle_at_80%_90%"],
    ["bottom-center", "bottom-[-28%]", "top-[-18%]", "circle_at_50%_90%"],
    ["bottom-left", "left-[-12%]", "right-[-18%]", "circle_at_20%_90%"],
    ["left-center", "left-[-12%]", "right-[-18%]", "circle_at_10%_50%"],
    ["center", "left-1/2", "left-1/2", "circle_at_50%_50%"],
  ] as const)(
    "renders %s position classes",
    (position, topClassToken, bottomClassToken, overlayToken) => {
      const { container } = render(<AtmosphericGlows position={position} />)
      const root = container.querySelector('[data-slot="atmospheric-glows"]')
      const top = container.querySelector('[data-layer="top"]')
      const bottom = container.querySelector('[data-layer="bottom"]')
      const overlay = container.querySelector('[data-layer="overlay"]')

      expect(root?.getAttribute("data-position")).toBe(position)
      expect(top?.className).toContain(topClassToken)
      expect(bottom?.className).toContain(bottomClassToken)
      expect(overlay?.className).toContain(overlayToken)
    }
  )

  it("exposes nine supported positions", () => {
    expect(atmosphericGlowsPositions).toHaveLength(9)
  })
})
