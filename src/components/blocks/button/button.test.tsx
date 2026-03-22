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

  it("keeps icon slot rendered while left spinner is visible", () => {
    const { container } = render(
      <Button loading loadingPosition="left" leftIcon={<svg data-testid="left-icon" aria-hidden />}>
        Save
      </Button>
    )

    expect(container.querySelector('[data-slot="icon"]')).toBeTruthy()
    expect(container.querySelector('[data-slot="icon"]')?.className).toContain("opacity-0")
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

  it("sets icon-only data attribute", () => {
    render(
      <Button iconOnly aria-label="Settings">
        <svg aria-hidden />
      </Button>
    )
    const button = screen.getByRole("button", { name: "Settings" })

    expect(button.getAttribute("data-icon-only")).toBe("true")
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

  it("Button.IconButton triggers click when enabled", () => {
    const onClick = vi.fn()
    render(
      <Button.IconButton
        id="favorites"
        icon={<svg data-testid="favorites-icon" aria-hidden />}
        alt="Favorites"
        title="Favorites"
        description="Quick access to starred items."
        onClick={onClick}
        showDot
        badgeContent={3}
      />
    )
    const button = screen.getByRole("button", { name: "Favorites" })

    expect(button.getAttribute("data-nav-id")).toBe("favorites")
    expect(button.getAttribute("data-state")).toBeNull()
    expect(screen.getByText("3")).toBeTruthy()
    expect(screen.getByTestId("favorites-icon")).toBeTruthy()

    fireEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("Button.IconButton renders dot without badge content fallback", () => {
    render(
      <Button.IconButton
        id="dot-only"
        icon={<svg aria-hidden />}
        alt="Dot only"
        showDot
        dotTitle="Badge dot"
      />
    )

    const dot = document.querySelector('[title="Badge dot"]') as HTMLSpanElement
    expect(dot).toBeTruthy()
    expect(dot.textContent).toBe("")
  })

  it("Button.IconButton enables tooltip only when showTooltip is set", () => {
    render(
      <>
        <Button.IconButton id="plain" icon={<svg aria-hidden />} alt="Plain action" />
        <Button.IconButton
          id="hinted"
          icon={<svg aria-hidden />}
          alt="Hinted action"
          showTooltip
          title="Hinted action"
          description="Tooltip details"
        />
      </>
    )

    const plainButton = screen.getByRole("button", { name: "Plain action" })
    const hintedButton = screen.getByRole("button", { name: "Hinted action" })

    expect(plainButton.getAttribute("data-state")).toBeNull()
    expect(hintedButton.getAttribute("data-state")).toBe("closed")
  })

  it("Button.IconButton supports string icon and tooltip metadata", () => {
    render(
      <Button.IconButton
        id="string-icon"
        icon="/fake/icon.svg"
        alt="String icon action"
        showTooltip
        title="String icon action"
        description="Detailed tooltip copy"
        comingSoon="Soon"
      />
    )

    const button = screen.getByRole("button", { name: "String icon action" })
    expect(button.getAttribute("data-state")).toBe("closed")
    expect((button as HTMLButtonElement).disabled).toBe(false)
    expect(document.querySelector('img[src=\"/fake/icon.svg\"]')).toBeTruthy()
  })

  it("Button.IconButton supports primary variant tooltip without description", () => {
    render(
      <Button.IconButton
        id="primary-icon"
        icon="/fake/primary.svg"
        alt="Primary icon action"
        variant="primary"
        showTooltip
        comingSoon="Soon"
      />
    )

    const button = screen.getByRole("button", { name: "Primary icon action" })
    const icon = document.querySelector('img[src="/fake/primary.svg"]') as HTMLImageElement
    const glow = button.querySelector(".blur-\\[10px\\]") as HTMLSpanElement

    expect(icon.className).toContain("brightness(1.06)")
    expect(glow.className).toContain("rgba(255,210,111,0.24)")
    expect(button.querySelector('[data-slot="tooltip-trigger"]')).toBeNull()
  })

  it("Button.IconButton disables interaction when comingSoon is set", () => {
    const onClick = vi.fn()
    render(
      <Button.IconButton
        id="labs"
        icon={<svg aria-hidden />}
        alt="Labs"
        title="Labs"
        description="Experimental actions and previews."
        comingSoon="Soon"
        onClick={onClick}
      />
    )
    const button = screen.getByRole("button", { name: "Labs" }) as HTMLButtonElement

    expect(button.disabled).toBe(true)
    fireEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })
})
