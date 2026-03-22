import { afterEach, describe, expect, it } from "vitest"
import { cleanup, render } from "@testing-library/react"

import { CrystalFacets } from "./crystal-facets"

afterEach(() => {
  cleanup()
})

const getLayers = (container: HTMLElement) =>
  Array.from(container.querySelectorAll(":scope > div")) as HTMLDivElement[]

describe("CrystalFacets", () => {
  it("renders default layers and className", () => {
    const { container } = render(<CrystalFacets className="custom-facets" />)
    const root = container.firstElementChild as HTMLDivElement
    const layers = getLayers(root)

    expect(root.className).toContain("custom-facets")
    expect(layers).toHaveLength(4)
    expect(layers[0].style.backgroundImage).toContain("rgba(255,210,111,0.1)")
  })

  it("supports 3-digit hex color parsing", () => {
    const { container } = render(<CrystalFacets crystalColor="#abc" />)
    const root = container.firstElementChild as HTMLDivElement
    const layers = getLayers(root)

    expect(layers[0].style.backgroundImage).toContain("rgba(170,187,204,0.1)")
  })

  it("supports 6-digit hex color parsing and rounds facet size", () => {
    const { container } = render(<CrystalFacets color="#112233" facetSize={21.6} />)
    const root = container.firstElementChild as HTMLDivElement
    const layers = getLayers(root)

    expect(layers[0].style.backgroundImage).toContain("rgba(17,34,51,0.1)")
    expect(layers[1].style.backgroundImage).toContain("22px")
  })

  it("supports rgb/rgba comma syntax and clamps channels", () => {
    const { container } = render(<CrystalFacets color="rgba(280, 12, 500, 0.4)" facetSize={4} />)
    const root = container.firstElementChild as HTMLDivElement
    const layers = getLayers(root)

    expect(layers[0].style.backgroundImage).toContain("rgba(255,12,255,0.1)")
    expect(layers[1].style.backgroundImage).toContain("8px")
    expect(layers[2].style.backgroundImage).toContain("10px")
  })

  it("supports rgb space syntax and max facet size clamp", () => {
    const { container } = render(<CrystalFacets color="rgb(10 20 30 / 50%)" facetSize={500} />)
    const root = container.firstElementChild as HTMLDivElement
    const layers = getLayers(root)

    expect(layers[0].style.backgroundImage).toContain("rgba(10,20,30,0.1)")
    expect(layers[1].style.backgroundImage).toContain("72px")
    expect(layers[2].style.backgroundImage).toContain("92px")
  })

  it("falls back to raw color token when parsing fails", () => {
    const { container } = render(<CrystalFacets color="var(--brand-crystal)" />)
    const root = container.firstElementChild as HTMLDivElement
    const layers = getLayers(root)

    expect(layers[0].style.backgroundImage).toContain("var(--brand-crystal)")
    expect(layers[3].style.backgroundImage).toContain("var(--brand-crystal)")
  })

  it("falls back to default color when provided color is empty", () => {
    const { container } = render(<CrystalFacets color="   " />)
    const root = container.firstElementChild as HTMLDivElement
    const layers = getLayers(root)

    expect(layers[0].style.backgroundImage).toContain("rgba(255,210,111,0.1)")
  })
})
