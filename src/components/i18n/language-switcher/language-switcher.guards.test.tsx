import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"

describe("LanguageSwitcher guards", () => {
  afterEach(() => {
    cleanup()
    localStorage.clear()
    document.documentElement.lang = ""
    document.documentElement.dir = ""
    vi.resetModules()
  })

  it("returns early when no supported language options are available", async () => {
    const changeLanguage = vi.fn()

    vi.doMock("react-i18next", () => ({
      useTranslation: () => ({ i18n: { resolvedLanguage: undefined, changeLanguage } }),
    }))
    vi.doMock("../../../lib/i18n", () => ({
      supportedLngs: [],
    }))
    vi.doMock("../../dropdown", () => ({
      Dropdown: () => <div data-testid="dropdown-stub" />,
    }))

    const { LanguageSwitcher } = await import("./language-switcher")

    render(<LanguageSwitcher />)

    expect(screen.getByTestId("dropdown-stub")).toBeTruthy()
    expect(changeLanguage).not.toHaveBeenCalled()
    expect(document.documentElement.lang).toBe("")
    expect(document.documentElement.dir).toBe("")
  })

  it("ignores empty and unknown values from dropdown change callback", async () => {
    const changeLanguage = vi.fn()

    vi.doMock("react-i18next", () => ({
      useTranslation: () => ({ i18n: { resolvedLanguage: undefined, changeLanguage } }),
    }))
    vi.doMock("../../../lib/i18n", () => ({
      supportedLngs: ["en-US"],
    }))
    vi.doMock("../../dropdown", () => ({
      Dropdown: ({ onValueChange }: { onValueChange?: (value: string | string[]) => void }) => (
        <div>
          <button type="button" onClick={() => onValueChange?.("")}>
            Emit empty
          </button>
          <button type="button" onClick={() => onValueChange?.([])}>
            Emit empty array
          </button>
          <button type="button" onClick={() => onValueChange?.("xx-XX")}>
            Emit unknown
          </button>
        </div>
      ),
    }))

    const { LanguageSwitcher } = await import("./language-switcher")

    render(<LanguageSwitcher />)

    fireEvent.click(screen.getByRole("button", { name: "Emit empty" }))
    fireEvent.click(screen.getByRole("button", { name: "Emit empty array" }))
    fireEvent.click(screen.getByRole("button", { name: "Emit unknown" }))

    expect(changeLanguage).not.toHaveBeenCalled()
    expect(localStorage.getItem("i18nextLng")).toBeNull()
    expect(document.documentElement.lang).toBe("en-US")
    expect(document.documentElement.dir).toBe("ltr")
  })
})
