import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { Separator, separatorNode } from "./separator"

const getRoot = (container: HTMLElement) =>
  container.querySelector('[data-slot="separator"]') as HTMLDivElement

const getDiagonalContainer = (root: HTMLDivElement) =>
  (root.firstElementChild?.firstElementChild as HTMLSpanElement | null) as HTMLSpanElement

describe("Separator", () => {
  afterEach(() => {
    cleanup()
  })

  it("renders default solid separator", () => {
    const { container } = render(<Separator className="custom-separator" data-testid="separator" />)
    const root = getRoot(container)

    expect(root.getAttribute("data-variant")).toBe("solid")
    expect(root.getAttribute("data-separator-orientation")).toBe("horizontal")
    expect(root.className).toContain("custom-separator")
    expect(root.style.height).toBe("1px")
  })

  it("uses legacy fade classes for solid variant (horizontal and vertical)", () => {
    const { container, rerender } = render(<Separator variant="solid" fadeEnds />)
    let root = getRoot(container)

    expect(root.className).toContain("bg-gradient-to-r")
    expect(root.className).toContain("via-border")
    expect(root.style.height).toBe("1px")
    expect(root.style.maskImage).toBe("")

    rerender(<Separator variant="solid" fadeEnds orientation="vertical" />)
    root = getRoot(container)

    expect(root.className).toContain("bg-gradient-to-b")
    expect(root.style.width).toBe("1px")
    expect(root.style.webkitMaskImage ?? "").toBe("")
  })


  it("supports dotted variant for both axes and handles non-numeric string and fallback thickness", () => {
    const { container, rerender } = render(
      <Separator variant="dotted" thickness="0.5rem" color="red" />,
    )
    let root = getRoot(container)

    expect(root.style.backgroundImage).toContain("to right")
    expect(root.style.height).toBe("0.5rem")

    rerender(<Separator variant="dotted" orientation="vertical" thickness={null as any} color="red" />)
    root = getRoot(container)

    expect(root.style.backgroundImage).toContain("to bottom")
    expect(root.style.width).toBe("1px")
  })

  it("applies vertical fade mask in non-legacy branch", () => {
    const { container } = render(
      <Separator variant="dotted" orientation="vertical" fadeEnds color="red" />,
    )
    const root = getRoot(container)
    const styleAttr = root.getAttribute("style") ?? ""

    expect(root.style.maskImage).toContain("to bottom")
    expect(styleAttr).toContain("mask-image: linear-gradient(to bottom")
  })

  it("supports long-dotted variant for both axes and numeric string thickness", () => {
    const { container, rerender } = render(
      <Separator variant="long-dotted" thickness="3" color="red" />,
    )
    let root = getRoot(container)

    expect(root.style.backgroundImage).toContain("to right")
    expect(root.style.backgroundImage).toContain("12px 20px")
    expect(root.style.height).toBe("3px")

    rerender(<Separator variant="long-dotted" orientation="vertical" thickness="3" color="red" />)
    root = getRoot(container)

    expect(root.style.backgroundImage).toContain("to bottom")
    expect(root.style.width).toBe("3px")
  })

  it("supports double variant for both axes", () => {
    const { container, rerender } = render(
      <Separator variant="double" thickness={2} color="red" />,
    )
    let root = getRoot(container)
    let styleAttr = root.getAttribute("style") ?? ""

    expect(root.style.height).toBe("calc(6px)")
    expect(styleAttr).toContain("background-size: 100% 2px, 100% 2px")

    rerender(<Separator variant="double" orientation="vertical" thickness={2} color="red" />)
    root = getRoot(container)
    styleAttr = root.getAttribute("style") ?? ""

    expect(root.style.width).toBe("calc(6px)")
    expect(styleAttr).toContain("background-size: 2px 100%, 2px 100%")
  })

  it("renders ornament center with custom center color and scalable size", () => {
    const { container } = render(
      <Separator
        variant="ornament"
        ornament="flower"
        ornamentCount={1}
        color="red"
        centerColor="blue"
        thickness={2}
      />,
    )
    const root = getRoot(container)
    const centerSlot = root.children[1] as HTMLSpanElement

    expect(centerSlot.getAttribute("aria-hidden")).toBe("false")
    expect(centerSlot.textContent).toBe("✿")
    expect(centerSlot.style.color).toBe("blue")
    expect(centerSlot.style.fontSize).toContain("calc(12px)")
  })

  it("renders configured ornament count with separators between ornaments", () => {
    const { container } = render(
      <Separator variant="ornament" ornament="flower" ornamentCount={3} color="red" thickness={2} />,
    )
    const root = getRoot(container)
    const centerSlots = root.querySelectorAll('span[aria-hidden="false"]')

    expect(centerSlots).toHaveLength(3)
    expect(Array.from(centerSlots).every((slot) => slot.textContent === "✿")).toBe(true)
    expect(root.children).toHaveLength(7)
  })

  it("uses no ornament by default for ornament variant", () => {
    const { container } = render(<Separator variant="ornament" />)
    const root = getRoot(container)
    const centerSlots = root.querySelectorAll('span[aria-hidden="false"]')

    expect(centerSlots).toHaveLength(0)
    expect(root.children).toHaveLength(1)
  })

  it("supports ornament='none' and ornamentCount=0 without center slot", () => {
    const { container } = render(
      <Separator variant="ornament" ornament="none" ornamentCount={0} color="red" thickness={2} />,
    )
    const root = getRoot(container)
    const centerSlots = root.querySelectorAll('span[aria-hidden="false"]')

    expect(centerSlots).toHaveLength(0)
    expect(root.children).toHaveLength(1)
  })

  it("supports selecting ornament from ornament library", () => {
    render(<Separator variant="ornament" ornament="diamond" ornamentCount={1} />)

    expect(screen.getByText("❖")).toBeTruthy()
  })

  it("renders text variant with center label", () => {
    const { container } = render(
      <Separator variant="text" text="Chapter 1" color="red" centerColor="blue" thickness={2} />,
    )
    const root = getRoot(container)
    const centerSlot = root.children[1] as HTMLSpanElement

    expect(screen.getByText("Chapter 1")).toBeTruthy()
    expect(centerSlot.style.color).toBe("blue")
    expect(centerSlot.style.width).toBe("")
    expect(centerSlot.style.height).toBe("")
    expect(root.children).toHaveLength(3)
  })

  it("falls back to default center label for text variant and hides slot for empty string", () => {
    const { container, rerender } = render(<Separator variant="text" />)
    let root = getRoot(container)

    expect(screen.getByText("Section")).toBeTruthy()
    expect(root.children).toHaveLength(3)

    rerender(<Separator variant="text" text="" />)
    root = getRoot(container)

    expect(screen.queryByText("Section")).toBeNull()
    expect(root.children).toHaveLength(1)
  })

  it("renders ornaments on edges when edge content is provided", () => {
    const { container } = render(
      <Separator
        variant="ornament"
        ornament="flower"
        ornamentCount={3}
        edgeStart={separatorNode("✿")}
        edgeEnd={separatorNode("✿")}
        color="red"
        thickness={2}
      />,
    )
    const root = getRoot(container)

    expect(screen.getAllByText("✿")).toHaveLength(5)
    expect(root.children).toHaveLength(9)
  })


  it("renders icon center without mutating custom React node styles", () => {
    render(
      <Separator
        variant="icon"
        thickness={3}
        centerColor="purple"
        icon={separatorNode(<svg data-testid="center-icon" style={{ opacity: 0.4 }} />)}
      />,
    )

    const icon = screen.getByTestId("center-icon")
    const iconStyle = icon.getAttribute("style") ?? ""

    expect(iconStyle).toContain("opacity: 0.4")
    expect(iconStyle).not.toContain("width:")
    expect(iconStyle).not.toContain("height:")
  })

  it("uses default icon symbol when icon prop is missing", () => {
    render(<Separator variant="icon" />)

    expect(screen.getByText("✦")).toBeTruthy()
  })

  it("renders icon sequence in provided order and keeps separators between icons", () => {
    const { container } = render(
      <Separator
        variant="icon"
        icons={[
          separatorNode(<svg key="one" data-testid="icon-one" />),
          separatorNode(<svg key="two" data-testid="icon-two" />),
          separatorNode(<svg key="three" data-testid="icon-three" />),
        ]}
        color="red"
        thickness={2}
      />,
    )
    const root = getRoot(container)
    const centerSlots = root.querySelectorAll('span[aria-hidden="false"]')

    expect(centerSlots).toHaveLength(3)
    expect(centerSlots[0]?.querySelector('[data-testid="icon-one"]')).not.toBeNull()
    expect(centerSlots[1]?.querySelector('[data-testid="icon-two"]')).not.toBeNull()
    expect(centerSlots[2]?.querySelector('[data-testid="icon-three"]')).not.toBeNull()
    expect(root.children).toHaveLength(7)
  })

  it("renders clickable icon buttons and calls icon actions", () => {
    const onFirstClick = vi.fn()
    const onEdgeClick = vi.fn()

    render(
      <Separator
        variant="icon"
        decorative={false}
        edgeStart={{
          kind: "icon-button",
          id: "edge-start",
          icon: <svg aria-hidden />,
          alt: "Edge Start",
          title: "Edge Start",
          description: "Edge start action",
          onClick: onEdgeClick,
        }}
        icons={[
          {
            kind: "icon-button",
            id: "first",
            icon: <svg aria-hidden />,
            alt: "First Action",
            title: "First Action",
            description: "First icon action",
            active: true,
            onClick: onFirstClick,
          },
        ]}
      />,
    )

    const firstButton = screen.getByRole("button", { name: /First Action/ })
    const edgeButton = screen.getByRole("button", { name: /Edge Start/ })

    expect(firstButton.getAttribute("aria-current")).toBe("page")
    fireEvent.click(firstButton)
    fireEvent.click(edgeButton)
    expect(onFirstClick).toHaveBeenCalledTimes(1)
    expect(onEdgeClick).toHaveBeenCalledTimes(1)
  })

  it("renders wave style when curved=true", () => {
    const { container, rerender } = render(
      <Separator curved color="red" thickness={2} />,
    )
    let root = getRoot(container)
    let styleAttr = root.getAttribute("style") ?? ""

    expect(styleAttr).toContain("background-repeat: repeat-x")
    expect(styleAttr).toContain("background-size: 64px")
    expect(styleAttr).toContain("height:")

    rerender(<Separator curved orientation="vertical" color="red" thickness={2} />)
    root = getRoot(container)
    styleAttr = root.getAttribute("style") ?? ""
    expect(styleAttr).toContain("background-repeat: repeat-y")
    expect(styleAttr).toContain("background-size:")
    expect(styleAttr).toContain("width:")
  })

  it("keeps an empty center slot when hideCenterContent=true for center variants", () => {
    const { container, rerender } = render(
      <Separator variant="ornament" ornament="flower" ornamentCount={1} hideCenterContent thickness={2} color="red" />,
    )
    let root = getRoot(container)
    let centerSlot = root.children[1] as HTMLSpanElement

    expect(centerSlot.getAttribute("aria-hidden")).toBe("true")
    expect(centerSlot.textContent).toBe("")
    expect(root.className).toContain("gap-2")

    rerender(<Separator variant="icon" hideCenterContent icon={separatorNode("*")} thickness={2} color="red" />)
    root = getRoot(container)
    centerSlot = root.children[1] as HTMLSpanElement

    expect(centerSlot.getAttribute("aria-hidden")).toBe("true")
    expect(centerSlot.textContent).toBe("")
    expect(screen.queryByText("*")).toBeNull()
  })
  it("renders diagonal-down without center slot for non-center variants and applies horizontal fade mask", () => {
    const { container } = render(
      <Separator
        orientation="diagonal-down"
        variant="dotted"
        fadeEnds
        color="red"
        thickness={2}
      />,
    )
    const root = getRoot(container)
    const diagonalContainer = getDiagonalContainer(root)

    expect(root.getAttribute("data-separator-orientation")).toBe("diagonal-down")
    expect(root.children).toHaveLength(1)
    expect(diagonalContainer.style.transform).toContain("rotate(45deg)")
    expect(diagonalContainer.style.gap).toBe("0px")
    expect(diagonalContainer.style.maskImage).toContain("to right")
    expect(diagonalContainer.children).toHaveLength(2)
  })

  it("renders diagonal-up with center slot and supports hidden center content", () => {
    const { container, rerender } = render(
      <Separator orientation="diagonal-up" variant="ornament" ornament="flower" ornamentCount={1} color="red" thickness={2} />,
    )
    let root = getRoot(container)
    let diagonalContainer = getDiagonalContainer(root)

    expect(root.getAttribute("data-separator-orientation")).toBe("diagonal-up")
    expect(diagonalContainer.style.transform).toContain("rotate(-45deg)")
    expect(diagonalContainer.children).toHaveLength(3)
    expect(root.children).toHaveLength(2)
    expect(screen.getByText("✿")).toBeTruthy()

    rerender(
      <Separator
        orientation="diagonal-up"
        variant="icon"
        hideCenterContent
        icon={separatorNode(<svg data-testid="diag-icon" />)}
        color="red"
        thickness={2}
      />,
    )
    root = getRoot(container)
    diagonalContainer = getDiagonalContainer(root)

    expect(diagonalContainer.children).toHaveLength(3)
    expect(root.children).toHaveLength(1)
    expect(screen.queryByTestId("diag-icon")).toBeNull()
  })

  it("renders vertical icon center with fade gradients on segment lines", () => {
    const { container } = render(
      <Separator variant="icon" orientation="vertical" fadeEnds hideCenterContent color="red" thickness={2} />,
    )
    const root = getRoot(container)
    const firstSegment = root.children[0] as HTMLSpanElement
    const lastSegment = root.children[2] as HTMLSpanElement

    expect(firstSegment.style.backgroundImage).toContain("to bottom")
    expect(lastSegment.style.backgroundImage).toContain("to bottom")
    expect(firstSegment.style.width).toBe("2px")
    expect(lastSegment.style.width).toBe("2px")
  })
  it("normalizes numeric, pixel and unit thickness strings to at least 1px", () => {
    const { container, rerender } = render(<Separator thickness="0" color="red" />)
    let root = getRoot(container)

    expect(root.style.height).toBe("1px")

    rerender(<Separator thickness="-2px" color="red" />)
    root = getRoot(container)

    expect(root.style.height).toBe("1px")

    rerender(<Separator thickness="0rem" color="red" />)
    root = getRoot(container)

    expect(root.style.height).toBe("1px")
  })

  it("ignores unsupported asChild prop and keeps rendering separator root", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})

    try {
      const { container } = render(<Separator {...({ asChild: true } as any)} />)
      const root = getRoot(container)

      expect(root).toBeTruthy()
      expect(warnSpy).toHaveBeenCalledWith(
        "[Separator] `asChild` is not supported in this wrapper and will be ignored.",
      )
    } finally {
      warnSpy.mockRestore()
    }
  })

  it("applies custom trackExtent for vertical center and diagonal variants", () => {
    const { container, rerender } = render(
      <Separator variant="icon" orientation="vertical" trackExtent={88} color="red" />,
    )
    let root = getRoot(container)

    expect(root.style.minHeight).toBe("88px")

    rerender(<Separator orientation="diagonal-down" trackExtent="10rem" color="red" />)
    root = getRoot(container)

    expect(root.style.height).toBe("10rem")
  })
})




