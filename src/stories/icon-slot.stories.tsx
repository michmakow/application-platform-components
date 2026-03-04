import type { Meta, StoryObj } from "@storybook/react"
import { ArrowRight, Sparkles } from "lucide-react"
import { IconSlot } from "../components/blocks/icon-slot/icon-slot"

const meta: Meta<typeof IconSlot> = {
  title: "Interaction Patterns/IconSlot",
  component: IconSlot,
  args: {
    position: "left",
    className: "h-5 w-5",
  },
  argTypes: {
    position: { control: "select", options: ["left", "right"] },
    className: { control: "text" },
    children: { control: false },
  },
}

export default meta
type Story = StoryObj<typeof IconSlot>

export const Default: Story = {
  render: (args) => (
    <div className="flex items-center gap-2 text-foreground">
      <IconSlot {...args}>
        <Sparkles />
      </IconSlot>
      <span className="text-sm">New insight</span>
    </div>
  ),
}

export const Positions: Story = {
  render: () => (
    <div className="grid gap-3 text-foreground">
      <div className="flex items-center gap-2">
        <IconSlot position="left" className="h-4 w-4">
          <Sparkles />
        </IconSlot>
        <span className="text-sm">Left icon</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">Right icon</span>
        <IconSlot position="right" className="h-4 w-4">
          <ArrowRight />
        </IconSlot>
      </div>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4 text-foreground">
      <IconSlot className="h-3 w-3">
        <Sparkles />
      </IconSlot>
      <IconSlot className="h-5 w-5">
        <Sparkles />
      </IconSlot>
      <IconSlot className="h-7 w-7">
        <Sparkles />
      </IconSlot>
    </div>
  ),
}
