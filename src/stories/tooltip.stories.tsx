import type { Meta, StoryObj } from "@storybook/react"
import {
  Tooltip,
  TooltipContent,
  type TooltipContentAnimation,
  type TooltipContentProps,
  TooltipTrigger,
} from "../components/utility/tooltip"
import { Button } from "../components/blocks/button"

type TooltipSide = NonNullable<TooltipContentProps["side"]>

const TOOLTIP_SIDE_OPTIONS: TooltipSide[] = ["top", "right", "bottom", "left"]
const TOOLTIP_ANIMATION_OPTIONS: TooltipContentAnimation[] = [
  "default",
  "none",
  "fade",
  "zoom",
  "slide",
]

type TooltipStoryArgs = {
  side: TooltipSide
  sideOffset: number
  animation: TooltipContentAnimation
  animationDurationMs: number
  content: string
  triggerLabel: string
}

const meta: Meta<TooltipStoryArgs> = {
  title: "Platform Components/Interaction Patterns/Tooltip",
  component: Tooltip,
  args: {
    side: "bottom",
    sideOffset: 0,
    animation: "default",
    animationDurationMs: 180,
    content: "Helpful hint",
    triggerLabel: "Hover me",
  },
  argTypes: {
    side: { control: "select", options: TOOLTIP_SIDE_OPTIONS },
    sideOffset: { control: { type: "number", min: 0, max: 32, step: 1 } },
    animation: { control: "select", options: TOOLTIP_ANIMATION_OPTIONS },
    animationDurationMs: { control: { type: "number", min: 0, max: 2000, step: 10 } },
    content: { control: "text" },
    triggerLabel: { control: "text" },
  },
}

export default meta
type Story = StoryObj<TooltipStoryArgs>

export const Default: Story = {
  render: (args) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="secondary">{args.triggerLabel}</Button>
      </TooltipTrigger>
      <TooltipContent
        side={args.side}
        sideOffset={args.sideOffset}
        animation={args.animation}
        animationDurationMs={args.animationDurationMs}
      >
        {args.content}
      </TooltipContent>
    </Tooltip>
  ),
}
