import type { Meta, StoryObj } from "@storybook/react"
import { ButtonSpinner } from "../components/blocks/button-spinner"

const sizeOptions = [
  { label: "SM", value: "sm" },
  { label: "MD", value: "md" },
  { label: "LG", value: "lg" },
] as const

const meta: Meta<typeof ButtonSpinner> = {
  title: "Platform Components/Interaction Patterns/ButtonSpinner",
  component: ButtonSpinner,
  args: {
    size: "md",
    className: "text-foreground",
    "aria-hidden": true,
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

export const Default: Story = {
  render: (args) => <ButtonSpinner {...args} />,
}

export const Sizes: Story = {
  render: (args) => {
    const { size: _size, className, ...rest } = args

    return (
      <div className="flex items-center gap-4 text-foreground">
        {sizeOptions.map((option) => (
          <div key={option.value} className="flex items-center gap-2 text-sm">
            <ButtonSpinner size={option.value} className={className} {...rest} />
            <span>{option.label}</span>
          </div>
        ))}
      </div>
    )
  },
}

export const Inline: Story = {
  render: (args) => {
    const { size: _size, className, ...rest } = args

    return (
      <div className="flex items-center gap-3 text-foreground">
        <ButtonSpinner size="sm" className={className} {...rest} />
        <span className="text-sm">Syncing report data</span>
      </div>
    )
  },
}
