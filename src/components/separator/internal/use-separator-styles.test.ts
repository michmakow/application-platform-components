import { afterEach, describe, expect, it } from "vitest"

import { resolveWaveColorFromDocument } from "./use-separator-styles"

describe("resolveWaveColorFromDocument", () => {
  const variableName = "--separator-wave-test"

  afterEach(() => {
    document.documentElement.style.removeProperty(variableName)
  })

  it("resolves CSS variable values from document root", () => {
    document.documentElement.style.setProperty(variableName, "rgb(255, 0, 0)")

    const result = resolveWaveColorFromDocument(`var(${variableName})`)

    expect(result.color).toBe("rgb(255, 0, 0)")
    expect(result.unresolvedVariable).toBe(false)
  })

  it("uses fallback from var() syntax when token is missing", () => {
    const result = resolveWaveColorFromDocument(`var(${variableName}, #00f)`)

    expect(result.color).toBe("#00f")
    expect(result.unresolvedVariable).toBe(false)
  })

  it("marks unresolved variable when token and fallback are missing", () => {
    const result = resolveWaveColorFromDocument(`var(${variableName})`)

    expect(result.color).toBe(`var(${variableName})`)
    expect(result.unresolvedVariable).toBe(true)
  })
})
