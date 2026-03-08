import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { Button } from "./button"

afterEach(() => {
  cleanup()
})

describe("Button", () => {
  it("defaults type=button and wraps text children", () => {
    render(<Button>Save</Button>)
    const button = screen.getByRole("button", { name: "Save" })

    expect(button.getAttribute("type")).toBe("button")
    expect(button.querySelector('[data-slot="text"]')?.textContent).toBe("Save")
  })

  it("respects explicit type", () => {
    render(<Button type="submit">Submit</Button>)
    const button = screen.getByRole("button", { name: "Submit" })

    expect(button.getAttribute("type")).toBe("submit")
  })

  it("renders an anchor when href is provided", () => {
    render(<Button href="/docs">Docs</Button>)
    const link = screen.getByRole("link", { name: "Docs" })

    expect(link.tagName).toBe("A")
    expect(link.getAttribute("href")).toBe("/docs")
    expect(link.getAttribute("type")).toBeNull()
  })

  it("sets aria-disabled and tabIndex for disabled links", () => {
    const onClick = vi.fn()
    render(
      <Button href="/docs" disabled onClick={onClick}>
        Docs
      </Button>
    )
    const link = screen.getByRole("link", { name: "Docs" })

    expect(link.getAttribute("aria-disabled")).toBe("true")
    expect(link.getAttribute("tabindex")).toBe("-1")
    fireEvent.click(link)
    expect(onClick).not.toHaveBeenCalled()
  })

  it("loading disables and sets aria-busy", () => {
    render(
      <Button loading loadingText="Saving">
        Save
      </Button>
    )
    const button = screen.getByRole("button") as HTMLButtonElement

    expect(button.disabled).toBe(true)
    expect(button.getAttribute("aria-busy")).toBe("true")
    expect(screen.getByText("Saving")).toBeTruthy()
  })

  it("click handler not invoked when loading", () => {
    const onClick = vi.fn()
    render(
      <Button loading onClick={onClick}>
        Save
      </Button>
    )
    fireEvent.click(screen.getByRole("button"))

    expect(onClick).not.toHaveBeenCalled()
  })

  it("click handler is invoked when enabled", () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Save</Button>)
    fireEvent.click(screen.getByRole("button", { name: "Save" }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("overlay loading preserves label in DOM", () => {
    const { container } = render(
      <Button loading loadingPosition="overlay">
        Save
      </Button>
    )

    expect(screen.getByText("Save")).toBeTruthy()
    expect(container.querySelector('[data-slot="overlay"]')).not.toBeNull()
    expect(container.querySelector('[data-slot="content"]')?.className).toContain("opacity-0")
  })

  it("uses side spinners for left and right loading positions", () => {
    const { container, rerender } = render(
      <Button loading loadingPosition="left">
        Save
      </Button>
    )
    expect(container.querySelector('[data-slot="overlay"]')).toBeNull()
    expect(container.querySelectorAll('[data-slot="spinner"]').length).toBe(1)

    rerender(
      <Button loading loadingPosition="right">
        Save
      </Button>
    )
    expect(container.querySelector('[data-slot="overlay"]')).toBeNull()
    expect(container.querySelectorAll('[data-slot="spinner"]').length).toBe(1)
  })

  it("data attributes applied correctly", () => {
    render(
      <Button
        variant="secondary"
        intent="info"
        size="lg"
        glowIntensity="strong"
        elevated
        rounded="full"
        analyticsId="analytics-save"
        testId="save-btn"
      >
        Save
      </Button>
    )
    const button = screen.getByTestId("save-btn")

    expect(button.getAttribute("data-variant")).toBe("secondary")
    expect(button.getAttribute("data-intent")).toBe("info")
    expect(button.getAttribute("data-size")).toBe("lg")
    expect(button.getAttribute("data-glow")).toBe("true")
    expect(button.getAttribute("data-elevated")).toBe("true")
    expect(button.getAttribute("data-rounded")).toBe("full")
    expect(button.getAttribute("data-analytics-id")).toBe("analytics-save")
  })

  it("does not glow when glowIntensity is not provided", () => {
    render(<Button>Save</Button>)
    const button = screen.getByRole("button", { name: "Save" })

    expect(button.getAttribute("data-glow")).toBe("false")
  })

  it("keeps non-text children unchanged", () => {
    const { container } = render(
      <Button>
        <strong>Save</strong>
      </Button>
    )

    expect(screen.getByText("Save").tagName).toBe("STRONG")
    expect(container.querySelector('[data-slot="text"]')).toBeNull()
  })

  it("compound subcomponents render", () => {
    const { container } = render(
      <Button>
        <Button.Icon position="left">
          <span>Icon</span>
        </Button.Icon>
        <Button.Text>Save</Button.Text>
        <Button.Spinner />
      </Button>
    )

    expect(container.querySelector('[data-slot="icon"]')).not.toBeNull()
    expect(container.querySelector('[data-slot="spinner"]')).not.toBeNull()
    expect(screen.getByText("Save")).toBeTruthy()
  })

  it("renders empty content wrapper when no children are provided", () => {
    const { container } = render(<Button />)

    expect(container.querySelector('[data-slot="content"]')).not.toBeNull()
  })

  it("asChild behavior works", () => {
    render(
      <Button asChild>
        <a href="/docs">Docs</a>
      </Button>
    )
    const link = screen.getByRole("link", { name: "Docs" })

    expect(link.getAttribute("data-variant")).toBe("primary")
    expect(link.querySelector('[data-slot="content"]')).toBeNull()
  })

  it("asChild disabled state blocks click and removes focusability", () => {
    const onClick = vi.fn()
    render(
      <Button asChild disabled onClick={onClick}>
        <a href="/docs">Docs</a>
      </Button>
    )
    const link = screen.getByRole("link", { name: "Docs" })

    expect(link.getAttribute("aria-disabled")).toBe("true")
    expect(link.getAttribute("tabindex")).toBe("-1")
    fireEvent.click(link)
    expect(onClick).not.toHaveBeenCalled()
  })

  it("falls back to button when href is not a string", () => {
    render(<Button {...({ href: 123 } as any)}>Fallback</Button>)
    const button = screen.getByRole("button", { name: "Fallback" })

    expect(button.tagName).toBe("BUTTON")
  })
})
