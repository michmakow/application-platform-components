import * as React from "react"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { Dropdown, type DropdownOption, type DropdownValue } from "./dropdown"

const ICON_OPTIONS: DropdownOption[] = [
  {
    value: "clarity",
    label: "Clarity",
    leftIcon: <span data-testid="icon-left-clarity">*</span>,
    rightIcon: <span data-testid="icon-right-clarity">+</span>,
  },
  {
    value: "structure",
    label: "Structure",
    icon: <span data-testid="icon-structure">#</span>,
  },
  {
    value: "empathy",
    label: "Empathy",
    icon: <span data-testid="icon-empathy">@</span>,
  },
]

afterEach(() => {
  cleanup()
})

const getTrigger = () =>
  document.querySelector('[data-slot="dropdown-trigger"]') as HTMLButtonElement

describe("Dropdown", () => {
  it("supports icon placement for selected value and menu options", () => {
    render(
      <Dropdown
        options={ICON_OPTIONS}
        defaultValue="clarity"
        selectedIconPlacement="both"
        itemIconPlacement="both"
      />
    )

    expect(
      document.querySelector('[data-slot="dropdown-selected-icon-left"]')
    ).toBeTruthy()
    expect(
      document.querySelector('[data-slot="dropdown-selected-icon-right"]')
    ).toBeTruthy()

    const trigger = getTrigger()
    fireEvent.click(trigger)

    expect(screen.getByRole("listbox")).toBeTruthy()
    expect(
      document.querySelectorAll('[data-slot="dropdown-option-icon-left"]').length
    ).toBeGreaterThan(0)
    expect(
      document.querySelectorAll('[data-slot="dropdown-option-icon-right"]').length
    ).toBeGreaterThan(0)
  })

  it("always shows explicit rightIcon on list items", () => {
    render(
      <Dropdown
        options={ICON_OPTIONS}
        defaultValue="clarity"
        itemIconPlacement="left"
        selectedIconPlacement="left"
      />
    )

    fireEvent.click(getTrigger())

    const clarityOption = screen.getByRole("option", { name: /Clarity/ })
    const rightIcon = clarityOption.querySelector(
      '[data-slot="dropdown-option-icon-right"]'
    )
    expect(rightIcon).toBeTruthy()
  })

  it("shows right-side list icons when option has only leftIcon and placement is both", () => {
    const LEFT_ONLY_OPTIONS: DropdownOption[] = [
      {
        value: "left-only",
        label: "Left only",
        leftIcon: <span data-testid="icon-left-only">L</span>,
      },
    ]

    render(<Dropdown options={LEFT_ONLY_OPTIONS} itemIconPlacement="both" />)

    fireEvent.click(getTrigger())

    expect(
      document.querySelectorAll('[data-slot="dropdown-option-icon-left"]').length
    ).toBe(1)
    expect(
      document.querySelectorAll('[data-slot="dropdown-option-icon-right"]').length
    ).toBe(1)
  })

  it("uses selected icon placement for list items when item placement is not provided", () => {
    render(
      <Dropdown
        options={ICON_OPTIONS}
        defaultValue="clarity"
        selectedIconPlacement="both"
      />
    )

    fireEvent.click(getTrigger())

    expect(
      document.querySelectorAll('[data-slot="dropdown-option-icon-left"]').length
    ).toBeGreaterThan(0)
    expect(
      document.querySelectorAll('[data-slot="dropdown-option-icon-right"]').length
    ).toBeGreaterThan(0)
  })

  it("filters options by label when searchable mode is enabled", () => {
    render(<Dropdown options={ICON_OPTIONS} searchable />)

    fireEvent.click(screen.getByRole("button"))

    const search = screen.getByPlaceholderText("Search...")
    fireEvent.change(search, { target: { value: "stru" } })

    expect(screen.getByRole("option", { name: "Structure" })).toBeTruthy()
    expect(screen.queryByRole("option", { name: "Clarity" })).toBeNull()
    expect(screen.queryByRole("option", { name: "Empathy" })).toBeNull()
  })

  it("supports multiSelect mode and renders selected values as pills", () => {
    const onValueChange = vi.fn()

    render(
      <Dropdown
        options={ICON_OPTIONS}
        multiSelect
        defaultValue={["clarity"]}
        onValueChange={onValueChange}
      />
    )

    const selectedContainer = document.querySelector(
      '[data-slot="dropdown-selected"]'
    ) as HTMLElement
    expect(selectedContainer.textContent).toContain("Clarity")

    fireEvent.click(getTrigger())
    fireEvent.click(screen.getByRole("option", { name: "Empathy" }))

    expect(onValueChange).toHaveBeenLastCalledWith(["clarity", "empathy"])
    expect(selectedContainer.textContent).toContain("Empathy")
    expect(document.querySelectorAll('[data-slot="dropdown-pill"]').length).toBe(2)
  })

  it("allows removing selected multi-select pills with x control", () => {
    const onValueChange = vi.fn()

    render(
      <Dropdown
        options={ICON_OPTIONS}
        multiSelect
        defaultValue={["clarity", "empathy"]}
        onValueChange={onValueChange}
      />
    )

    const removeButtons = document.querySelectorAll('[data-slot="dropdown-pill-remove"]')
    expect(removeButtons.length).toBe(2)

    fireEvent.mouseDown(removeButtons[0] as HTMLElement)
    fireEvent.click(removeButtons[0] as HTMLElement)

    expect(onValueChange).toHaveBeenLastCalledWith(["empathy"])
    expect(screen.queryByRole("listbox")).toBeNull()
    expect(getTrigger().contains(removeButtons[0] as Node)).toBe(false)
  })

  it("applies presets as selectable pills", () => {
    const onValueChange = vi.fn()

    render(
      <Dropdown
        options={ICON_OPTIONS}
        multiSelect
        presets={[
          { id: "core", label: "Core", values: ["clarity", "structure"] },
          { id: "all", label: "All", values: ["clarity", "structure", "empathy"] },
        ]}
        onValueChange={onValueChange}
      />
    )

    fireEvent.click(getTrigger())
    fireEvent.click(screen.getByRole("button", { name: "Core" }))

    const selectedContainer = document.querySelector(
      '[data-slot="dropdown-selected"]'
    ) as HTMLElement

    expect(onValueChange).toHaveBeenLastCalledWith(["clarity", "structure"])
    expect(selectedContainer.textContent).toContain("Clarity")
    expect(selectedContainer.textContent).toContain("Structure")
    expect(document.querySelectorAll('[data-slot="dropdown-pill"]').length).toBe(2)
  })

  it("rotates chevron on open and close", () => {
    render(<Dropdown options={ICON_OPTIONS} />)

    const trigger = getTrigger()
    const chevron = document.querySelector('[data-slot="dropdown-chevron"]')

    expect(chevron?.getAttribute("class")).not.toContain("rotate-180")

    fireEvent.click(trigger)
    expect(chevron?.getAttribute("class")).toContain("rotate-180")

    fireEvent.click(trigger)
    expect(chevron?.getAttribute("class")).not.toContain("rotate-180")
  })

  it("uses pointer cursor on interactive dropdown elements", () => {
    render(
      <Dropdown
        options={ICON_OPTIONS}
        presets={[{ id: "core", label: "Core", values: ["clarity", "structure"] }]}
      />
    )

    const trigger = getTrigger()
    expect(trigger.className).toContain("cursor-pointer")

    fireEvent.click(trigger)

    expect(screen.getByRole("button", { name: "Core" }).className).toContain(
      "cursor-pointer"
    )
    expect(screen.getByRole("option", { name: /Clarity/ }).className).toContain(
      "cursor-pointer"
    )
  })

  it("allows configuring colors via color tokens", () => {
    render(
      <Dropdown
        options={ICON_OPTIONS}
        colors={{
          triggerBackground: "rgb(1, 2, 3)",
          chevron: "#123456",
          itemSelectedBackground: "rgba(20, 30, 40, 0.9)",
        }}
      />
    )

    const root = document.querySelector('[data-slot="dropdown-root"]') as HTMLElement
    expect(root.style.getPropertyValue("--ud-dropdown-trigger-bg")).toBe("rgb(1, 2, 3)")
    expect(root.style.getPropertyValue("--ud-dropdown-chevron")).toBe("#123456")
    expect(root.style.getPropertyValue("--ud-dropdown-item-selected-bg")).toBe(
      "rgba(20, 30, 40, 0.9)"
    )
  })

  it("returns single-select value and closes menu after choosing option", () => {
    const onValueChange = vi.fn()

    render(<Dropdown options={ICON_OPTIONS} onValueChange={onValueChange} />)

    fireEvent.click(getTrigger())
    fireEvent.click(screen.getByRole("option", { name: "Structure" }))

    expect(onValueChange).toHaveBeenLastCalledWith("structure")
    expect(screen.queryByRole("listbox")).toBeNull()
  })

  it("updates controlled single-select value and closes menu when parent state changes", () => {
    const ControlledHarness = () => {
      const [value, setValue] = React.useState<DropdownValue>("clarity")

      return (
        <Dropdown
          options={ICON_OPTIONS}
          value={value}
          onValueChange={(nextValue) => setValue(nextValue)}
        />
      )
    }

    render(<ControlledHarness />)

    expect(document.querySelector('[data-slot="dropdown-selected"]')?.textContent).toContain(
      "Clarity"
    )

    fireEvent.click(getTrigger())
    fireEvent.click(screen.getByRole("option", { name: "Empathy" }))

    expect(document.querySelector('[data-slot="dropdown-selected"]')?.textContent).toContain(
      "Empathy"
    )
    expect(screen.queryByRole("listbox")).toBeNull()
  })

  it("renders custom search fallback text when no match is found", () => {
    render(
      <Dropdown
        options={ICON_OPTIONS}
        searchable
        searchNoResultsText="Nothing found"
      />
    )

    fireEvent.click(screen.getByRole("button"))
    fireEvent.change(screen.getByPlaceholderText("Search..."), {
      target: { value: "zzzz" },
    })

    expect(screen.getByText("Nothing found")).toBeTruthy()
  })

  it("supports controlled value and onSelectionChange callback", () => {
    const onValueChange = vi.fn()
    const onSelectionChange = vi.fn()

    render(
      <Dropdown
        options={ICON_OPTIONS}
        value="structure"
        onValueChange={onValueChange}
        onSelectionChange={onSelectionChange}
      />
    )

    expect(document.querySelector('[data-slot="dropdown-selected"]')?.textContent).toContain(
      "Structure"
    )

    fireEvent.click(getTrigger())
    fireEvent.click(screen.getByRole("option", { name: /Empathy/ }))

    expect(onValueChange).toHaveBeenLastCalledWith("empathy")
    expect(onSelectionChange).toHaveBeenLastCalledWith([
      expect.objectContaining({ value: "empathy", label: "Empathy" }),
    ])
  })

  it("closes menu on outside click and Escape and reports open state", () => {
    const onOpenChange = vi.fn()

    render(
      <div>
        <Dropdown options={ICON_OPTIONS} searchable onOpenChange={onOpenChange} />
        <button type="button" data-testid="outside-target">
          outside
        </button>
      </div>
    )

    fireEvent.click(getTrigger())
    expect(screen.getByRole("listbox")).toBeTruthy()
    expect(onOpenChange).toHaveBeenLastCalledWith(true)

    fireEvent.mouseDown(screen.getByTestId("outside-target"))
    expect(screen.queryByRole("listbox")).toBeNull()
    expect(onOpenChange).toHaveBeenLastCalledWith(false)

    fireEvent.click(getTrigger())
    expect(screen.getByRole("listbox")).toBeTruthy()
    fireEvent.keyDown(document, { key: "Escape" })
    expect(screen.queryByRole("listbox")).toBeNull()
  })

  it("clears search query when menu is closed and opened again", () => {
    render(<Dropdown options={ICON_OPTIONS} searchable />)

    fireEvent.click(getTrigger())
    const searchInput = screen.getByPlaceholderText("Search...") as HTMLInputElement
    fireEvent.change(searchInput, { target: { value: "stru" } })
    expect(searchInput.value).toBe("stru")
    expect(screen.queryByRole("option", { name: /Clarity/ })).toBeNull()

    fireEvent.click(getTrigger())
    fireEvent.click(getTrigger())

    const searchInputAfterReopen = screen.getByPlaceholderText("Search...") as HTMLInputElement
    expect(searchInputAfterReopen.value).toBe("")
    expect(screen.getByRole("option", { name: /Clarity/ })).toBeTruthy()
  })

  it("closes menu when focus moves outside the dropdown", () => {
    render(
      <div>
        <Dropdown options={ICON_OPTIONS} searchable />
        <button type="button" data-testid="outside-focus-target">
          Outside focus
        </button>
      </div>
    )

    fireEvent.click(getTrigger())
    expect(screen.getByRole("listbox")).toBeTruthy()

    const outsideTarget = screen.getByTestId("outside-focus-target")
    outsideTarget.focus()
    fireEvent.focusIn(outsideTarget)

    expect(screen.queryByRole("listbox")).toBeNull()
  })

  it("supports keyboard navigation inside open listbox", () => {
    const NAV_OPTIONS: DropdownOption[] = [
      { value: "first", label: "First" },
      { value: "disabled", label: "Disabled", disabled: true },
      { value: "last", label: "Last" },
    ]

    render(<Dropdown options={NAV_OPTIONS} />)

    fireEvent.keyDown(getTrigger(), { key: "ArrowDown" })

    const listbox = screen.getByRole("listbox")
    const firstOption = screen.getByRole("option", { name: "First" })
    const lastOption = screen.getByRole("option", { name: "Last" })

    expect(document.activeElement).toBe(firstOption)

    fireEvent.keyDown(listbox, { key: "ArrowDown" })
    expect(document.activeElement).toBe(lastOption)

    fireEvent.keyDown(listbox, { key: "Home" })
    expect(document.activeElement).toBe(firstOption)

    fireEvent.keyDown(listbox, { key: "End" })
    expect(document.activeElement).toBe(lastOption)

    fireEvent.keyDown(listbox, { key: "ArrowUp" })
    expect(document.activeElement).toBe(firstOption)

    fireEvent.keyDown(listbox, { key: "Escape" })
    expect(screen.queryByRole("listbox")).toBeNull()
    expect(document.activeElement).toBe(getTrigger())
  })

  it("opens from trigger with ArrowUp and focuses last enabled option", () => {
    const NAV_OPTIONS: DropdownOption[] = [
      { value: "first", label: "First" },
      { value: "disabled", label: "Disabled", disabled: true },
      { value: "last", label: "Last" },
    ]

    render(<Dropdown options={NAV_OPTIONS} />)

    fireEvent.keyDown(getTrigger(), { key: "ArrowUp" })

    expect(screen.getByRole("listbox")).toBeTruthy()
    expect(document.activeElement).toBe(screen.getByRole("option", { name: "Last" }))
  })

  it("moves focus from trigger arrows when menu is already open", () => {
    const NAV_OPTIONS: DropdownOption[] = [
      { value: "first", label: "First" },
      { value: "disabled", label: "Disabled", disabled: true },
      { value: "last", label: "Last" },
    ]

    render(<Dropdown options={NAV_OPTIONS} />)

    fireEvent.click(getTrigger())
    const trigger = getTrigger()
    trigger.focus()

    fireEvent.keyDown(trigger, { key: "ArrowDown" })
    expect(document.activeElement).toBe(screen.getByRole("option", { name: "First" }))

    fireEvent.keyDown(trigger, { key: "ArrowUp" })
    expect(document.activeElement).toBe(screen.getByRole("option", { name: "Last" }))
  })

  it("updates active option on mouse enter only for enabled options", () => {
    const NAV_OPTIONS: DropdownOption[] = [
      { value: "first", label: "First" },
      { value: "disabled", label: "Disabled", disabled: true },
      { value: "last", label: "Last" },
    ]

    render(<Dropdown options={NAV_OPTIONS} />)

    fireEvent.click(getTrigger())

    const listbox = screen.getByRole("listbox")
    const disabledOption = screen.getByRole("option", { name: "Disabled" })
    const lastOption = screen.getByRole("option", { name: "Last" })

    expect(listbox.getAttribute("aria-activedescendant")).toContain("-option-0")

    fireEvent.mouseEnter(disabledOption)
    expect(listbox.getAttribute("aria-activedescendant")).toContain("-option-0")

    fireEvent.mouseEnter(lastOption)
    expect(listbox.getAttribute("aria-activedescendant")).toContain("-option-2")
  })

  it("handles search input keyboard navigation and Escape close", () => {
    const NAV_OPTIONS: DropdownOption[] = [
      { value: "first", label: "First" },
      { value: "disabled", label: "Disabled", disabled: true },
      { value: "last", label: "Last" },
    ]

    render(<Dropdown options={NAV_OPTIONS} searchable />)

    fireEvent.click(getTrigger())

    const searchInput = screen.getByPlaceholderText("Search...")
    const firstOption = screen.getByRole("option", { name: "First" })
    const lastOption = screen.getByRole("option", { name: "Last" })

    expect(document.activeElement).toBe(searchInput)

    fireEvent.keyDown(searchInput, { key: "ArrowDown" })
    expect(document.activeElement).toBe(lastOption)

    fireEvent.keyDown(searchInput, { key: "ArrowUp" })
    expect(document.activeElement).toBe(firstOption)

    fireEvent.keyDown(searchInput, { key: "Escape" })
    expect(screen.queryByRole("listbox")).toBeNull()
    expect(document.activeElement).toBe(getTrigger())
  })

  it("handles search arrows when no option can be active", () => {
    const DISABLED_OPTIONS: DropdownOption[] = [
      { value: "a", label: "A", disabled: true },
      { value: "b", label: "B", disabled: true },
    ]

    render(<Dropdown options={DISABLED_OPTIONS} searchable />)

    fireEvent.click(getTrigger())
    const searchInput = screen.getByPlaceholderText("Search...")
    const listbox = screen.getByRole("listbox")

    fireEvent.keyDown(searchInput, { key: "ArrowDown" })
    fireEvent.keyDown(searchInput, { key: "ArrowUp" })

    expect(listbox.getAttribute("aria-activedescendant")).toBeNull()
  })

  it("handles search arrows when query returns no options", () => {
    render(<Dropdown options={ICON_OPTIONS} searchable />)

    fireEvent.click(getTrigger())
    const searchInput = screen.getByPlaceholderText("Search...")
    const listbox = screen.getByRole("listbox")

    fireEvent.change(searchInput, { target: { value: "no-match-value" } })
    expect(screen.getByText("No results")).toBeTruthy()

    fireEvent.keyDown(searchInput, { key: "ArrowDown" })
    fireEvent.keyDown(searchInput, { key: "ArrowUp" })

    expect(listbox.getAttribute("aria-activedescendant")).toBeNull()
  })

  it("keeps no active descendant when all options are disabled and arrows are pressed", () => {
    const DISABLED_OPTIONS: DropdownOption[] = [
      { value: "a", label: "A", disabled: true },
      { value: "b", label: "B", disabled: true },
    ]

    render(<Dropdown options={DISABLED_OPTIONS} />)

    fireEvent.click(getTrigger())
    const listbox = screen.getByRole("listbox")

    fireEvent.keyDown(listbox, { key: "ArrowDown" })
    fireEvent.keyDown(listbox, { key: "ArrowUp" })
    fireEvent.keyDown(getTrigger(), { key: "ArrowUp" })

    expect(listbox.getAttribute("aria-activedescendant")).toBeNull()
  })

  it("removes stale values when options list changes before publishing selection", () => {
    const onValueChange = vi.fn()
    const { rerender } = render(
      <Dropdown
        options={ICON_OPTIONS}
        multiSelect
        defaultValue={["clarity", "structure"]}
        onValueChange={onValueChange}
      />
    )

    rerender(
      <Dropdown
        options={[ICON_OPTIONS[0], ICON_OPTIONS[2]]}
        multiSelect
        defaultValue={["clarity", "structure"]}
        onValueChange={onValueChange}
      />
    )

    const selectedContainer = document.querySelector(
      '[data-slot="dropdown-selected"]'
    ) as HTMLElement
    expect(selectedContainer.textContent).not.toContain("Structure")

    fireEvent.click(getTrigger())
    fireEvent.click(screen.getByRole("option", { name: "Empathy" }))

    expect(onValueChange).toHaveBeenLastCalledWith(["clarity", "empathy"])
  })

  it("supports keyboard open and ignores interactions when disabled", () => {
    const { rerender } = render(<Dropdown options={ICON_OPTIONS} />)

    fireEvent.keyDown(getTrigger(), { key: "x" })
    expect(screen.queryByRole("listbox")).toBeNull()

    fireEvent.keyDown(getTrigger(), { key: "Enter" })
    expect(screen.getByRole("listbox")).toBeTruthy()
    fireEvent.keyDown(getTrigger(), { key: "Enter" })
    expect(screen.queryByRole("listbox")).toBeNull()

    fireEvent.keyDown(getTrigger(), { key: " " })
    expect(screen.getByRole("listbox")).toBeTruthy()
    fireEvent.keyDown(getTrigger(), { key: " " })
    expect(screen.queryByRole("listbox")).toBeNull()

    fireEvent.keyDown(getTrigger(), { key: "ArrowDown" })
    expect(screen.getByRole("listbox")).toBeTruthy()
    fireEvent.click(getTrigger())
    expect(screen.queryByRole("listbox")).toBeNull()

    rerender(<Dropdown options={ICON_OPTIONS} disabled />)

    const disabledTrigger = getTrigger()
    expect(disabledTrigger.getAttribute("tabindex")).toBe("-1")
    expect(disabledTrigger.className).toContain("cursor-not-allowed")

    const disabledChevron = document.querySelector('[data-slot="dropdown-chevron"]')
    expect(disabledChevron?.getAttribute("class")).toContain("opacity-60")

    fireEvent.click(disabledTrigger)
    fireEvent.keyDown(disabledTrigger, { key: "Enter" })
    fireEvent.keyDown(disabledTrigger, { key: " " })
    expect(screen.queryByRole("listbox")).toBeNull()
  })

  it("supports multi-select from string defaultValue and toggles selected option off", () => {
    const onValueChange = vi.fn()

    render(
      <Dropdown
        options={ICON_OPTIONS}
        multiSelect
        defaultValue="clarity"
        onValueChange={onValueChange}
      />
    )

    expect(document.querySelector('[data-slot="dropdown-selected"]')?.textContent).toContain(
      "Clarity"
    )

    fireEvent.click(getTrigger())
    fireEvent.click(screen.getByRole("option", { name: /Clarity/ }))

    expect(onValueChange).toHaveBeenLastCalledWith([])
  })

  it("closes after selecting in multi-select when closeOnSelect is enabled", () => {
    render(
      <Dropdown
        options={ICON_OPTIONS}
        multiSelect
        defaultValue={["clarity"]}
        closeOnSelect
      />
    )

    fireEvent.click(getTrigger())
    fireEvent.click(screen.getByRole("option", { name: /Empathy/ }))

    expect(screen.queryByRole("listbox")).toBeNull()
  })

  it("supports single-select preset and emits empty value when preset does not match options", () => {
    const onValueChange = vi.fn()

    render(
      <Dropdown
        options={ICON_OPTIONS}
        presets={[{ id: "invalid", label: "Invalid", values: ["missing"] }]}
        onValueChange={onValueChange}
      />
    )

    fireEvent.click(getTrigger())
    fireEvent.click(screen.getByRole("button", { name: "Invalid" }))

    expect(onValueChange).toHaveBeenLastCalledWith("")
    expect(screen.queryByRole("listbox")).toBeNull()
  })

  it("marks single-select preset as active when current value is included", () => {
    render(
      <Dropdown
        options={ICON_OPTIONS}
        value="structure"
        presets={[{ id: "struct", label: "Struct", values: ["structure"] }]}
      />
    )

    fireEvent.click(getTrigger())

    const presetButton = screen.getByRole("button", { name: "Struct" })
    expect(presetButton.className).toContain("dropdown-preset-active-bg")
  })

  it("does not trigger selection for disabled options and applies disabled classes", () => {
    const onValueChange = vi.fn()
    const optionsWithDisabled: DropdownOption[] = [
      ...ICON_OPTIONS,
      { value: "blocked", label: "Blocked", disabled: true },
    ]

    render(<Dropdown options={optionsWithDisabled} onValueChange={onValueChange} />)

    fireEvent.click(getTrigger())
    const blockedOption = screen.getByRole("option", { name: "Blocked" })

    expect(blockedOption.className).toContain("cursor-not-allowed")
    fireEvent.click(blockedOption)
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it("renders pill overflow and can disable removable pills", () => {
    render(
      <Dropdown
        options={ICON_OPTIONS}
        multiSelect
        defaultValue={["clarity", "structure", "empathy"]}
        maxVisiblePills={1}
        removablePills={false}
      />
    )

    expect(document.querySelectorAll('[data-slot="dropdown-pill-remove"]').length).toBe(0)
    expect(document.querySelector('[data-slot="dropdown-pill-overflow"]')?.textContent).toBe(
      "+2"
    )
  })

  it("does not render icon slots for options without any icon source", () => {
    render(
      <Dropdown options={[{ value: "facts", label: "Facts" }]} itemIconPlacement="both" />
    )

    fireEvent.click(getTrigger())
    const factsOption = screen.getByRole("option", { name: "Facts" })

    expect(factsOption.querySelector('[data-slot="dropdown-option-icon-left"]')).toBeNull()
    expect(factsOption.querySelector('[data-slot="dropdown-option-icon-right"]')).toBeNull()
  })
})
