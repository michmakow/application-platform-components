import { describe, expect, it } from "vitest"
import { render, screen, within } from "@testing-library/react"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  type CardRounded,
  type CardShadow,
  CardTitle,
} from "./card"

const ROUNDED_CASES: ReadonlyArray<readonly [CardRounded, string]> = [
  ["none", "rounded-none"],
  ["sm", "rounded-sm"],
  ["md", "rounded-md"],
  ["lg", "rounded-lg"],
  ["xl", "rounded-xl"],
  ["2xl", "rounded-2xl"],
  ["3xl", "rounded-3xl"],
]

const SHADOW_CASES: ReadonlyArray<readonly [CardShadow, string]> = [
  ["none", "none"],
  ["sm", "0 2px 8px -4px"],
  ["md", "0 10px 24px -12px"],
  ["lg", "0 18px 38px -18px"],
  ["xl", "0 26px 52px -22px"],
]

describe("Card", () => {
  it("renders all base card slots with merged custom classes", () => {
    const { container } = render(
      <Card className="custom-card" data-testid="card-root">
        <CardHeader className="custom-header" data-testid="card-header">
          <CardTitle className="custom-title">Card title</CardTitle>
          <CardDescription className="custom-description">Card description</CardDescription>
          <CardAction className="custom-action">Action</CardAction>
        </CardHeader>
        <CardContent className="custom-content">Content</CardContent>
        <CardFooter className="custom-footer">Footer</CardFooter>
      </Card>
    )

    const card = screen.getByTestId("card-root")
    const header = screen.getByTestId("card-header")
    const title = screen.getByText("Card title")
    const description = screen.getByText("Card description")
    const action = screen.getByText("Action")
    const content = screen.getByText("Content")
    const footer = screen.getByText("Footer")

    expect(card.getAttribute("data-slot")).toBe("card")
    expect(card.className).toContain("custom-card")

    expect(header.getAttribute("data-slot")).toBe("card-header")
    expect(header.className).toContain("custom-header")

    expect(title.getAttribute("data-slot")).toBe("card-title")
    expect(title.className).toContain("custom-title")
    expect(title.tagName).toBe("H3")

    expect(description.getAttribute("data-slot")).toBe("card-description")
    expect(description.className).toContain("custom-description")
    expect(description.tagName).toBe("P")

    expect(action.getAttribute("data-slot")).toBe("card-action")
    expect(action.className).toContain("custom-action")

    expect(content.getAttribute("data-slot")).toBe("card-content")
    expect(content.className).toContain("custom-content")

    expect(footer.getAttribute("data-slot")).toBe("card-footer")
    expect(footer.className).toContain("custom-footer")

    expect(container.querySelectorAll('[data-slot^="card"]').length).toBeGreaterThanOrEqual(7)
  })

  it("applies container visual configuration via card props", () => {
    render(
      <Card
        data-testid="card-configured"
        border={false}
        rounded="3xl"
        borderColor="#123456"
        shadow="lg"
        shadowColor="rgba(255, 0, 0, 0.4)"
        glow
      >
        Configured
      </Card>
    )

    const card = screen.getByTestId("card-configured")

    expect(card.className).toContain("border-0")
    expect(card.className).toContain("rounded-3xl")
    expect(card.style.borderColor).toBe("rgb(18, 52, 86)")
    expect(card.style.boxShadow).toContain("0 18px 38px -18px")
    expect(card.style.boxShadow).toContain("rgba(255, 0, 0, 0.4)")
  })

  it.each(ROUNDED_CASES)("maps rounded='%s' to class '%s'", (rounded, className) => {
    const { container } = render(
      <Card data-testid="card-rounded" rounded={rounded}>
        Rounded
      </Card>
    )

    const card = within(container).getByTestId("card-rounded")
    expect(card.className).toContain(className)
  })

  it.each(SHADOW_CASES)("maps shadow='%s' to box shadow '%s'", (shadow, value) => {
    const { container } = render(
      <Card data-testid="card-shadow" shadow={shadow}>
        Shadow
      </Card>
    )

    const card = within(container).getByTestId("card-shadow")

    if (shadow === "none") {
      expect(card.style.boxShadow).toBe("none")
      return
    }

    expect(card.style.boxShadow).toContain(value)
    expect(card.style.boxShadow).toContain("rgba(15, 23, 42, 0.26)")
  })

  it("supports turning off shadow and overriding computed style with inline style", () => {
    render(
      <Card
        data-testid="card-no-shadow"
        shadow="none"
        borderColor="#abcdef"
        style={{ borderColor: "#654321", boxShadow: "none" }}
      >
        No shadow
      </Card>
    )

    const card = screen.getByTestId("card-no-shadow")

    expect(card.style.borderColor).toBe("rgb(101, 67, 33)")
    expect(card.style.boxShadow).toBe("none")
    expect(card.className).toContain("border")
    expect(card.className).toContain("rounded-xl")
  })
})
