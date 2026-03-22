import * as React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import {
  SeparatorCenterContent,
  SeparatorDiagonalTrack,
  defaultRenderIconButton,
  isSeparatorIconButtonConfig,
} from "./separator-components"

describe("separator-components", () => {
  it("renders default icon button dot, badge and click handler", () => {
    const onClick = vi.fn()
    const node = defaultRenderIconButton({
      kind: "icon-button",
      id: "alpha",
      icon: <span data-testid="separator-icon">*</span>,
      alt: "Alpha",
      title: "Alpha action",
      description: "Alpha description",
      showDot: true,
      dotTitle: "New",
      badgeContent: 3,
      onClick,
      size: "sm",
      variant: "solid",
    })

    render(<>{node}</>)

    const button = screen.getByRole("button", { name: "Alpha. Alpha description" })
    expect(button.getAttribute("title")).toBe("Alpha action")
    expect(screen.getByTestId("separator-icon")).toBeTruthy()
    expect(screen.getByTitle("New")).toBeTruthy()
    expect(screen.getByText("3")).toBeTruthy()

    fireEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("disables icon button and builds defaults for comingSoon variant", () => {
    const onClick = vi.fn()
    const node = defaultRenderIconButton({
      kind: "icon-button",
      id: "beta",
      icon: <span aria-hidden>#</span>,
      comingSoon: "Soon",
      onClick,
      size: "xx" as any,
      variant: "mystery" as any,
    })

    render(<>{node}</>)

    const button = screen.getByRole("button", { name: "beta. Coming soon: Soon" })
    expect((button as HTMLButtonElement).disabled).toBe(true)
    expect(button.getAttribute("title")).toBe("beta (Soon)")
    expect(button.className).toContain("h-6 w-6")
    expect(button.className).toContain("border-current/35")

    fireEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it("builds accessible label without description fallback", () => {
    const node = defaultRenderIconButton({
      kind: "icon-button",
      id: "gamma",
      icon: <span aria-hidden>!</span>,
      alt: "Gamma",
    })

    render(<>{node}</>)
    const button = screen.getByRole("button", { name: "Gamma" })

    expect(button.getAttribute("aria-description")).toBeNull()
  })

  it("returns icon-button decoration from type guard", () => {
    expect(
      isSeparatorIconButtonConfig({
        kind: "icon-button",
        id: "guard",
        icon: <span aria-hidden />,
      })
    ).toBe(true)
    expect(isSeparatorIconButtonConfig({ kind: "node", content: "text" } as any)).toBe(false)
  })

  it("maps icon-button center content through render callback defaults", () => {
    const renderIconButton = vi.fn(() => <button type="button">rendered</button>)

    const result = SeparatorCenterContent({
      decoration: { kind: "icon-button", id: "center", icon: <span aria-hidden>*</span> },
      fallbackLabel: "Fallback center",
      renderIconButton,
    })

    render(<>{result}</>)
    expect(screen.getByRole("button", { name: "rendered" })).toBeTruthy()
    expect(renderIconButton).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Fallback center",
        description: "Separator action",
      })
    )
  })

  it("renders node center content and ignores unknown decoration kinds", () => {
    const nodeResult = SeparatorCenterContent({
      decoration: { kind: "node", content: <span data-testid="center-node">Node</span> },
      fallbackLabel: "center",
      renderIconButton: () => null,
    })

    const unknownResult = SeparatorCenterContent({
      decoration: { kind: "unknown" } as any,
      fallbackLabel: "center",
      renderIconButton: () => null,
    })

    const { container } = render(
      <>
        {nodeResult}
        {unknownResult}
      </>
    )

    expect(screen.getByTestId("center-node")).toBeTruthy()
    expect(container.textContent).toContain("Node")
  })

  it("handles diagonal center style for interactive and non-interactive content", () => {
    const baseProps = {
      orientation: "diagonal-down" as const,
      variant: "solid" as const,
      fadeEnds: false,
      decorative: false,
      diagonalContainerStyle: { width: "100%" } as React.CSSProperties,
      diagonalLineStyle: { borderTop: "1px solid red" } as React.CSSProperties,
      showCenterSlot: true,
      centerPlaceholderStyle: { width: "20px" } as React.CSSProperties,
      showCenterContent: true,
      centerStyle: { width: "30px" } as React.CSSProperties,
      renderIconButton: () => <button type="button">x</button>,
    }

    const { container, rerender } = render(
      <SeparatorDiagonalTrack
        {...baseProps}
        interactiveCenter={false}
        centerContent={{ kind: "node", content: <span>Center</span> }}
      />
    )

    const nonInteractive = container.querySelector("span.pointer-events-none.text-sm.leading-none")
    expect(nonInteractive?.getAttribute("style")).toContain("width: 30px")

    rerender(
      <SeparatorDiagonalTrack
        {...baseProps}
        interactiveCenter
        centerContent={{ kind: "icon-button", id: "ic", icon: <span aria-hidden>*</span> }}
      />
    )

    expect(container.querySelector("span.pointer-events-none.text-sm.leading-none")).toBeNull()
  })
})
