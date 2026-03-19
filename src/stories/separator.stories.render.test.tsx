import { composeStories } from "@storybook/react"
import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import * as stories from "./separator.stories"

const {
  IconCentered,
  IconSequence,
  OrnamentEdges,
  ClickableIcons,
} = composeStories(stories)

describe("Separator stories render", () => {
  afterEach(() => {
    cleanup()
  })

  it("renders IconCentered story content", () => {
    render(<IconCentered />)
    expect(screen.getByText("Top content")).toBeTruthy()
    expect(screen.getByText("Bottom content")).toBeTruthy()
    expect(screen.getByText("✦")).toBeTruthy()
  })

  it("renders IconSequence story content", () => {
    render(<IconSequence />)
    expect(screen.getByText("Top content")).toBeTruthy()
    expect(screen.getByText("Bottom content")).toBeTruthy()
  })

  it("renders OrnamentEdges story content", () => {
    render(<OrnamentEdges />)
    expect(screen.getByText("Top content")).toBeTruthy()
    expect(screen.getByText("Bottom content")).toBeTruthy()
    expect(screen.getAllByText("✿").length).toBeGreaterThan(0)
  })

  it("renders ClickableIcons story content", () => {
    render(<ClickableIcons />)
    expect(screen.getByText(/Last action:/)).toBeTruthy()
    expect(screen.getByText("Bottom content")).toBeTruthy()
    expect(screen.getAllByText("✦").length).toBeGreaterThan(0)
  })
})
