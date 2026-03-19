import { describe, expect, it } from "vitest"

import {
  resolveSeparatorActionButtonSize,
  resolveSeparatorActionButtonVariant,
} from "./separator-action-button"

describe("SeparatorActionButton", () => {
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
})
