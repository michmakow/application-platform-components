import type { Meta, StoryObj } from "@storybook/react"
import { ButtonSpinner } from "../components/blocks/button-spinner/button-spinner"

const sizeOptions = [
  { label: "SM", value: "sm" },
  { label: "MD", value: "md" },
  { label: "LG", value: "lg" },
] as const

const meta: Meta<typeof ButtonSpinner> = {
  title: "Interaction Patterns/ButtonSpinner",
  component: ButtonSpinner,
  args: {
    size: "md",
    className: "text-foreground",
  },
  argTypes: {
    size: {
      control: "select",
      options: sizeOptions.map((option) => option.value),
    },
    "aria-hidden": { control: "boolean" },
    className: { control: "text" },
  },
}

export default meta
type Story = StoryObj<typeof ButtonSpinner>

export const Default: Story = {}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4 text-foreground">
      {sizeOptions.map((option) => (
        <div key={option.value} className="flex items-center gap-2 text-sm">
          <ButtonSpinner size={option.value} />
          <span>{option.label}</span>
        </div>
      ))}
    </div>
  ),
}

export const Inline: Story = {
  render: () => (
    <div className="flex items-center gap-3 text-foreground">
      <ButtonSpinner size="sm" />
      <span className="text-sm">Syncing report data</span>
    </div>
  ),
}
