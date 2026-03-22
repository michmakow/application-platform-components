import type { Meta, StoryObj } from "@storybook/react"
import { ArrowRight, Bell, Check, Sparkles } from "lucide-react"
import { Button } from "../components/blocks/button"
const variantOptions = [
  { label: "Primary", value: "primary" },
  { label: "Secondary", value: "secondary" },
  { label: "Ghost", value: "ghost" },
  { label: "Danger", value: "danger" },
  { label: "Link", value: "link" },
] as const

const intentOptions = [
  { label: "Default", value: "default" },
  { label: "Positive", value: "positive" },
  { label: "Negative", value: "negative" },
  { label: "Warning", value: "warning" },
  { label: "Info", value: "info" },
] as const

const sizeOptions = [
  { label: "XS", value: "xs" },
  { label: "SM", value: "sm" },
  { label: "MD", value: "md" },
  { label: "LG", value: "lg" },
] as const

const meta: Meta<typeof Button> = {
  title: "Platform Components/Interaction Patterns/Button",
  component: Button,
  subcomponents: {
    Icon: Button.Icon,
    IconButton: Button.IconButton,
    Spinner: Button.Spinner,
    Text: Button.Text,
  },
  tags: ["autodocs"],
  args: {
    variant: "primary",
    intent: "default",
    size: "md",
    children: "Primary Button",
  },
  argTypes: {
    variant: {
      control: "select",
      options: variantOptions.map((option) => option.value),
    },
    intent: {
      control: "select",
      options: intentOptions.map((option) => option.value),
    },
    size: {
      control: "select",
      options: sizeOptions.map((option) => option.value),
    },
    rounded: {
      control: "select",
      options: ["md", "lg", "xl", "full"],
    },
    glowIntensity: {
      control: "select",
      options: ["soft", "medium", "strong"],
    },
    loadingPosition: {
      control: "select",
      options: ["left", "right", "overlay"],
    },
    iconOnly: { control: "boolean" },
    leftIcon: { control: false },
    rightIcon: { control: false },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
  render: (args) => <Button {...args} />,
}

export const Variants: Story = {
  render: (args) => (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {variantOptions.map((option) => (
        <Button key={option.value} {...args} variant={option.value}>
          {option.label}
        </Button>
      ))}
    </div>
  ),
}

export const Intents: Story = {
  render: (args) => (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {intentOptions.map((option) => (
        <Button key={option.value} {...args} intent={option.value} variant="secondary">
          {option.label}
        </Button>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {sizeOptions.map((option) => (
        <Button key={option.value} {...args} size={option.value}>
          {option.label}
        </Button>
      ))}
    </div>
  ),
}

export const FullWidth: Story = {
  render: (args) => (
    <div className="max-w-md space-y-3">
      <Button {...args} fullWidth>
        Continue
      </Button>
      <Button {...args} variant="secondary" fullWidth>
        Secondary Action
      </Button>
    </div>
  ),
}

export const Icons: Story = {
  render: (args) => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Button {...args} leftIcon={<Sparkles />}>
          New Report
        </Button>
        <Button {...args} rightIcon={<ArrowRight />} variant="secondary">
          Next Step
        </Button>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button {...args} variant="ghost">
          <Button.Icon position="left">
            <Sparkles />
          </Button.Icon>
          <Button.Text>Compound</Button.Text>
          <Button.Icon position="right">
            <ArrowRight />
          </Button.Icon>
        </Button>
      </div>
    </div>
  ),
}

export const IconButtons: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" iconOnly aria-label="Notifications">
          <Bell />
        </Button>
        <Button variant="secondary" iconOnly rounded="full" aria-label="Sparkle action">
          <Sparkles />
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button.IconButton
          id="favorites"
          icon={<Sparkles />}
          alt="Favorites"
          showTooltip
          title="Favorites"
          description="Quick access to starred items."
          variant="primary"
        />
        <Button.IconButton
          id="alerts"
          icon={<Bell />}
          alt="Alerts"
          showTooltip
          title="Alerts"
          description="System activity updates."
          showDot
          badgeContent={3}
          dotTitle="3 updates"
          active
        />
        <Button.IconButton
          id="labs"
          icon={<Sparkles />}
          alt="Labs"
          showTooltip
          title="Labs"
          description="Experimental actions and previews."
          comingSoon="Soon"
        />
      </div>
    </div>
  ),
}

export const Disabled: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-3">
      <Button {...args} disabled>
        Primary
      </Button>
      <Button {...args} variant="secondary" disabled>
        Secondary
      </Button>
      <Button {...args} variant="ghost" disabled>
        Ghost
      </Button>
      <Button {...args} variant="link" disabled>
        Link
      </Button>
    </div>
  ),
}

export const LoadingStates: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-3">
      <Button
        {...args}
        loading
        loadingText="Saving"
        loadingPosition="left"
        leftIcon={<Check />}
      >
        Save
      </Button>
      <Button
        {...args}
        loading
        loadingText="Creating"
        loadingPosition="right"
        rightIcon={<ArrowRight />}
        variant="secondary"
      >
        Create
      </Button>
      <Button {...args} loading loadingText="Syncing" loadingPosition="overlay" variant="ghost">
        Sync
      </Button>
    </div>
  ),
}

export const LinkInParagraph: Story = {
  render: (args) => (
    <p className="max-w-xl text-sm text-muted-foreground">
      Want deeper guidance?{" "}
      <Button {...args} variant="link" href="/interaction-patterns">
        Read the interaction guide
      </Button>
      .
    </p>
  ),
}

export const ElevatedRounded: Story = {
  render: (args) => (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <Button {...args} elevated>
        Elevated
      </Button>
      <Button {...args} elevated rounded="full" variant="secondary">
        Rounded Full
      </Button>
      <Button {...args} elevated rounded="xl" variant="ghost">
        Soft Corners
      </Button>
    </div>
  ),
}

export const GlowIntensities: Story = {
  render: (args) => (
    <div className="grid gap-3 sm:grid-cols-3">
      <Button {...args} glowIntensity="soft">
        Glow Soft
      </Button>
      <Button {...args} glowIntensity="medium">
        Glow Medium
      </Button>
      <Button {...args} glowIntensity="strong">
        Glow Strong
      </Button>
    </div>
  ),
}
