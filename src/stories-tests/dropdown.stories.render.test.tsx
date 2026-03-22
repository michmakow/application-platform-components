import { composeStories } from "@storybook/react"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import * as stories from "../stories/dropdown.stories"

const { Playground, CompactIconOnly } = composeStories(stories)

const getTrigger = () =>
  document.querySelector('[data-slot="dropdown-trigger"]') as HTMLButtonElement

describe("Dropdown stories render", () => {
  afterEach(() => {
    cleanup()
  })

  it("Playground single-select replaces selected value and closes menu", () => {
    render(<Playground />)

    const selectedContainer = document.querySelector(
      '[data-slot="dropdown-selected"]'
    ) as HTMLElement
    expect(selectedContainer.textContent).toContain("Clarity")

    fireEvent.click(getTrigger())
    const empathyOption = screen.getByRole("option", { name: "Empathy" })
    fireEvent.mouseDown(empathyOption)
    fireEvent.mouseUp(empathyOption)
    fireEvent.click(empathyOption)

    expect(screen.queryByRole("listbox")).toBeNull()
    expect(selectedContainer.textContent).toContain("Empathy")
    expect(selectedContainer.textContent).not.toContain("Clarity")
  })

  it("CompactIconOnly story renders icon-only trigger and keeps menu interactive", () => {
    render(<CompactIconOnly />)

    const selectedContainer = document.querySelector(
      '[data-slot="dropdown-selected"]'
    ) as HTMLElement
    expect(
      document.querySelector('[data-slot="dropdown-selected-icon-only"]')
    ).toBeTruthy()
    expect(document.querySelector('[data-slot="dropdown-chevron"]')).toBeNull()
    expect(selectedContainer.textContent).not.toContain("Clarity")

    fireEvent.click(getTrigger())
    expect(screen.getByRole("listbox")).toBeTruthy()

    fireEvent.click(screen.getByRole("option", { name: "Empathy" }))

    expect(screen.queryByRole("listbox")).toBeNull()
    expect(getTrigger().getAttribute("aria-label")).toBe("Empathy")
    expect(
      document.querySelector('[data-slot="dropdown-selected-icon-only"]')
    ).toBeTruthy()
    expect(selectedContainer.textContent).not.toContain("Empathy")
  })
})
