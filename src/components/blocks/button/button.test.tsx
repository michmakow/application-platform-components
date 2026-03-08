import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { Button } from "./button"

describe("Button", () => {
  it("defaults type=button", () => {
    render(<Button>Save</Button>)
    const button = screen.getByRole("button")

    expect(button.getAttribute("type")).toBe("button")
  })

  it("respects explicit type", () => {
    render(<Button type="submit">Submit</Button>)
    const button = screen.getByRole("button")

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
    render(
      <Button href="/docs" disabled>
        Docs
      </Button>
    )
    const link = screen.getByRole("link", { name: "Docs" })

    expect(link.getAttribute("aria-disabled")).toBe("true")
    expect(link.getAttribute("tabindex")).toBe("-1")
  })

  it("loading disables and sets aria-busy", () => {
    render(<Button loading>Save</Button>)
    const button = screen.getByRole("button") as HTMLButtonElement

    expect(button.disabled).toBe(true)
    expect(button.getAttribute("aria-busy")).toBe("true")
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

  it("overlay loading preserves label in DOM", () => {
    render(
      <Button loading loadingPosition="overlay">
        Save
      </Button>
    )

    expect(screen.getByText("Save")).toBeTruthy()
  })

  it("data attributes applied correctly", () => {
    render(
      <Button
        variant="secondary"
        intent="info"
        size="lg"
        glow
        glowIntensity="strong"
        elevated
        rounded="full"
      >
        Save
      </Button>
    )
    const button = screen.getByRole("button")

    expect(button.getAttribute("data-variant")).toBe("secondary")
    expect(button.getAttribute("data-intent")).toBe("info")
    expect(button.getAttribute("data-size")).toBe("lg")
    expect(button.getAttribute("data-glow")).toBe("true")
    expect(button.getAttribute("data-elevated")).toBe("true")
    expect(button.getAttribute("data-rounded")).toBe("full")
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

  it("asChild behavior works", () => {
    render(
      <Button asChild>
        <a href="/docs">Docs</a>
      </Button>
    )
    const link = screen.getByRole("link", { name: "Docs" })

    expect(link.getAttribute("data-variant")).toBe("primary")
  })
})
