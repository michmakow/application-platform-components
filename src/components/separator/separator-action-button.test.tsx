import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import {
  SeparatorActionButton,
  resolveSeparatorActionButtonSize,
  resolveSeparatorActionButtonVariant,
} from "./separator-action-button"

describe("SeparatorActionButton", () => {
  afterEach(() => {
    cleanup()
  })

  it("maps separator variants to button variants", () => {
    expect(resolveSeparatorActionButtonVariant(undefined)).toBe("secondary")
    expect(resolveSeparatorActionButtonVariant("ghost")).toBe("utility")
    expect(resolveSeparatorActionButtonVariant("outline")).toBe("secondary")
    expect(resolveSeparatorActionButtonVariant("solid")).toBe("primary")
  })

  it("maps separator sizes with safe fallback", () => {
    expect(resolveSeparatorActionButtonSize(undefined)).toBe("xs")
    expect(resolveSeparatorActionButtonSize("xs")).toBe("xs")
    expect(resolveSeparatorActionButtonSize("sm")).toBe("sm")
    expect(resolveSeparatorActionButtonSize("md")).toBe("md")
    expect(resolveSeparatorActionButtonSize("lg")).toBe("lg")
  })

  it("uses alt/title/description fallbacks and passes click to icon button", () => {
    const onClick = vi.fn()

    render(
      <SeparatorActionButton
        config={{
          kind: "icon-button",
          id: "edge-start",
          icon: <svg aria-hidden data-testid="edge-icon" />,
          onClick,
        }}
      />,
    )

    const button = screen.getByRole("button", { name: "edge-start" })
    expect(button).toBeTruthy()
    expect(screen.getByTestId("edge-icon")).toBeTruthy()

    fireEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
