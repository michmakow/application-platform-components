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

const setRect = (
  element: Element,
  rect: Partial<Pick<DOMRect, "top" | "left" | "right" | "bottom" | "width" | "height">> = {},
) => {
  const resolvedRect = {
    x: rect.left ?? 10,
    y: rect.top ?? 10,
    top: rect.top ?? 10,
    left: rect.left ?? 10,
    right: rect.right ?? 130,
    bottom: rect.bottom ?? 46,
    width: rect.width ?? 120,
    height: rect.height ?? 36,
    toJSON: () => ({}),
  } as DOMRect

  Object.defineProperty(element, "getBoundingClientRect", {
    configurable: true,
    value: () => resolvedRect,
  })
}

const getDropdownContainer = () => screen.getByRole("listbox").parentElement as HTMLDivElement

describe("LanguageSwitcher", () => {
  const initialInnerWidth = window.innerWidth

  beforeEach(() => {
    mockI18n.resolvedLanguage = undefined
    mockI18n.changeLanguage.mockReset()
    localStorage.clear()
    document.documentElement.dir = ""
    document.documentElement.lang = ""
    Object.defineProperty(window, "innerWidth", { configurable: true, value: initialInnerWidth })
  })

  afterEach(() => {
    cleanup()
  })

  it("uses default language, applies LTR direction and renders floating classes", () => {
    render(<LanguageSwitcher className="custom-class" />)

    const trigger = screen.getByRole("button", { name: "English" })
    const wrapper = trigger.parentElement?.parentElement

    expect(wrapper?.className).toContain("fixed")
    expect(wrapper?.className).toContain("custom-class")
    expect(document.documentElement.lang).toBe("en-US")
    expect(document.documentElement.dir).toBe("ltr")

    setRect(trigger)
    fireEvent.click(trigger)

    expect(screen.getByRole("listbox")).toBeTruthy()
    expect(screen.getAllByRole("option")).toHaveLength(2)
  })

  it("uses resolved language and applies RTL direction", () => {
    mockI18n.resolvedLanguage = "ar-SA"

    render(<LanguageSwitcher />)

    expect(screen.getByRole("button", { name: "العربية" })).toBeTruthy()
    expect(document.documentElement.lang).toBe("ar-SA")
    expect(document.documentElement.dir).toBe("rtl")
  })

  it("falls back to the first option when stored language is unknown", () => {
    localStorage.setItem("i18nextLng", "zz-ZZ")

    render(<LanguageSwitcher />)

    expect(screen.getByRole("button", { name: "English" })).toBeTruthy()
    expect(document.documentElement.lang).toBe("en-US")
    expect(document.documentElement.dir).toBe("ltr")
  })

  it("selects language in compact mode and persists the selection", () => {
    render(<LanguageSwitcher variant="compact" className="compact-class" />)

    const trigger = screen.getByRole("button", { name: "Change language" })
    const wrapper = trigger.parentElement?.parentElement
    expect(wrapper?.className).toContain("relative")
    expect(wrapper?.className).toContain("compact-class")

    setRect(trigger, { left: 20, width: 60, right: 80, bottom: 60 })
    fireEvent.click(trigger)

    const dropdown = getDropdownContainer()
    expect(dropdown.style.width).toBe("256px")

    fireEvent.click(screen.getByRole("option", { name: /العربية/ }))

    expect(mockI18n.changeLanguage).toHaveBeenCalledWith("ar-SA")
    expect(localStorage.getItem("i18nextLng")).toBe("ar-SA")
    expect(document.documentElement.lang).toBe("ar-SA")
    expect(document.documentElement.dir).toBe("rtl")
    expect(screen.queryByRole("listbox")).toBeNull()
  })

  it("keeps dropdown open when clicking inside and closes on outside click", () => {
    render(<LanguageSwitcher />)

    const trigger = screen.getByRole("button", { name: "English" })
    setRect(trigger)
    fireEvent.click(trigger)

    const listbox = screen.getByRole("listbox")
    fireEvent.mouseDown(listbox)
    expect(screen.getByRole("listbox")).toBeTruthy()

    fireEvent.mouseDown(trigger)
    expect(screen.getByRole("listbox")).toBeTruthy()

    fireEvent.mouseDown(document.body)
    expect(screen.queryByRole("listbox")).toBeNull()
  })

  it("positions floating dropdown from trigger left edge for RTL", () => {
    mockI18n.resolvedLanguage = "ar-SA"
    render(<LanguageSwitcher variant="floating" />)

    const trigger = screen.getByRole("button", { name: "العربية" })
    setRect(trigger, { top: 64, left: 300, right: 420, bottom: 100, width: 120, height: 36 })
    fireEvent.click(trigger)

    const dropdown = getDropdownContainer()
    expect(dropdown.style.left).toBe("300px")
    expect(dropdown.style.top).toBe("108px")
    expect(dropdown.style.width).toBe("240px")
  })

  it("clamps compact dropdown position to viewport padding", () => {
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 280 })

    render(<LanguageSwitcher variant="compact" />)

    const trigger = screen.getByRole("button", { name: "Change language" })
    setRect(trigger, { top: 14, left: 10, right: 50, bottom: 50, width: 40, height: 36 })
    fireEvent.click(trigger)

    const dropdown = getDropdownContainer()
    expect(dropdown.style.left).toBe("8px")
    expect(dropdown.style.top).toBe("62px")
    expect(dropdown.style.width).toBe("256px")
  })

  it("uses documentElement.clientWidth when innerWidth is 0", () => {
    const initialClientWidth = document.documentElement.clientWidth
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 0 })
    Object.defineProperty(document.documentElement, "clientWidth", {
      configurable: true,
      value: 500,
    })

    render(<LanguageSwitcher />)

    const trigger = screen.getByRole("button", { name: "English" })
    setRect(trigger, { left: 100, right: 220, width: 120, bottom: 50 })
    fireEvent.click(trigger)

    const dropdown = getDropdownContainer()
    expect(dropdown.style.left).toBe("8px")

    Object.defineProperty(document.documentElement, "clientWidth", {
      configurable: true,
      value: initialClientWidth,
    })
  })

  it("covers guard branches for missing window, trigger and event target", () => {
    const addWindowListenerSpy = vi.spyOn(window, "addEventListener")
    const addDocumentListenerSpy = vi.spyOn(document, "addEventListener")

    render(<LanguageSwitcher />)

    const trigger = screen.getByRole("button", { name: "English" })
    setRect(trigger)
    fireEvent.click(trigger)

    const resizeHandler = addWindowListenerSpy.mock.calls.find(
      ([eventName]) => eventName === "resize",
    )?.[1] as EventListener
    const mousedownHandler = addDocumentListenerSpy.mock.calls.find(
      ([eventName]) => eventName === "mousedown",
    )?.[1] as EventListener

    const container = trigger.parentElement as HTMLDivElement
    const querySelectorSpy = vi
      .spyOn(container, "querySelector")
      .mockImplementation((selector: string) => {
        if (selector === "button") {
          return null
        }
        return Element.prototype.querySelector.call(container, selector)
      })
    resizeHandler(new Event("resize"))
    querySelectorSpy.mockRestore()

    const savedWindow = globalThis.window
    vi.stubGlobal("window", undefined)
    resizeHandler(new Event("resize"))
    vi.stubGlobal("window", savedWindow)

    mousedownHandler({ target: null } as unknown as Event)
  })
})
