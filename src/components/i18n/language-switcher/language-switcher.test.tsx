import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { LanguageSwitcher } from "./language-switcher"

const mockI18n = vi.hoisted(() => ({
  resolvedLanguage: undefined as string | undefined,
  changeLanguage: vi.fn(),
}))

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ i18n: mockI18n }),
}))

vi.mock("../../../lib/i18n", () => ({
  supportedLngs: ["en-US", "ar-SA", "xx-XX", "en-US"],
}))

const getRoot = () =>
  document.querySelector('[data-slot="language-switcher-root"]') as HTMLDivElement

const getDropdownRoot = () =>
  document.querySelector('[data-slot="dropdown-root"]') as HTMLDivElement

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    mockI18n.resolvedLanguage = undefined
    mockI18n.changeLanguage.mockReset()
    localStorage.clear()
    document.documentElement.lang = ""
    document.documentElement.dir = ""
  })

  afterEach(() => {
    cleanup()
  })

  it("renders floating variant by default and applies initial LTR language", () => {
    render(<LanguageSwitcher className="custom-class" />)

    expect(getRoot().className).toContain("fixed")
    expect(getRoot().className).toContain("custom-class")

    expect(screen.getByRole("button", { name: "English" })).toBeTruthy()
    expect(document.documentElement.lang).toBe("en-US")
    expect(document.documentElement.dir).toBe("ltr")
  })

  it("renders compact variant classes", () => {
    render(<LanguageSwitcher variant="compact" className="compact-class" />)

    expect(getRoot().className).toContain("relative")
    expect(getRoot().className).toContain("w-fit")
    expect(getRoot().className).toContain("compact-class")
    expect(getDropdownRoot().className).toContain("w-10")
    expect(document.querySelector('[data-slot="dropdown-selected-icon-only"]')).toBeTruthy()
    expect(document.querySelector('[data-slot="dropdown-chevron"]')).toBeNull()
  })

  it("supports compact fill icon mode where trigger crops full flag image", () => {
    render(<LanguageSwitcher variant="compact" compactFillIcon />)

    const triggerShell = document.querySelector(
      '[data-slot="dropdown-trigger"]'
    )?.parentElement as HTMLDivElement
    const iconOnly = document.querySelector(
      '[data-slot="dropdown-selected-icon-only"]'
    ) as HTMLSpanElement
    const flagImage = iconOnly.querySelector("img") as HTMLImageElement

    expect(triggerShell.className).toContain("p-0")
    expect(triggerShell.className).toContain("overflow-hidden")
    expect(iconOnly.className).toContain("!h-full")
    expect(flagImage.className).toContain("h-full")
    expect(flagImage.className).toContain("w-full")
    expect(flagImage.className).toContain("object-cover")
  })

  it("uses stored language before resolved language and applies RTL direction", () => {
    localStorage.setItem("i18nextLng", "ar-SA")
    mockI18n.resolvedLanguage = "en-US"

    render(<LanguageSwitcher />)

    expect(screen.getByRole("button", { name: "العربية" })).toBeTruthy()
    expect(document.documentElement.lang).toBe("ar-SA")
    expect(document.documentElement.dir).toBe("rtl")
  })

  it("matches stored language case-insensitively", () => {
    localStorage.setItem("i18nextLng", "AR-sa")

    render(<LanguageSwitcher />)

    expect(screen.getByRole("button", { name: "العربية" })).toBeTruthy()
    expect(document.documentElement.lang).toBe("ar-SA")
    expect(document.documentElement.dir).toBe("rtl")
  })

  it("falls back to first option when stored and resolved languages are unknown", () => {
    localStorage.setItem("i18nextLng", "zz-ZZ")
    mockI18n.resolvedLanguage = "xx-XX"

    render(<LanguageSwitcher />)

    expect(screen.getByRole("button", { name: "English" })).toBeTruthy()
    expect(document.documentElement.lang).toBe("en-US")
    expect(document.documentElement.dir).toBe("ltr")
  })

  it("changes language through dropdown selection and closes menu", () => {
    render(<LanguageSwitcher />)

    fireEvent.click(screen.getByRole("button", { name: "English" }))

    expect(screen.getByRole("listbox")).toBeTruthy()
    expect(screen.getAllByRole("option")).toHaveLength(2)

    fireEvent.click(screen.getByRole("option", { name: "العربية" }))

    expect(mockI18n.changeLanguage).toHaveBeenCalledWith("ar-SA")
    expect(localStorage.getItem("i18nextLng")).toBe("ar-SA")
    expect(document.documentElement.lang).toBe("ar-SA")
    expect(document.documentElement.dir).toBe("rtl")
    expect(screen.queryByRole("listbox")).toBeNull()
    expect(screen.getByRole("button", { name: "العربية" })).toBeTruthy()
  })

  it("renders flag icons on selected value and list options", () => {
    render(<LanguageSwitcher />)

    expect(
      document.querySelector('[data-slot="dropdown-selected-icon-left"]')
    ).toBeTruthy()

    fireEvent.click(screen.getByRole("button", { name: "English" }))

    expect(
      document.querySelectorAll('[data-slot="dropdown-option-icon-left"]').length
    ).toBe(2)
    expect(
      document.querySelectorAll('[data-slot="dropdown-option-icon-right"]').length
    ).toBe(0)
  })
})
