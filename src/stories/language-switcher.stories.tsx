import type { Meta, StoryObj } from "@storybook/react"
import { LanguageSwitcher } from "../components/i18n/language-switcher/language-switcher"

const meta: Meta<typeof LanguageSwitcher> = {
  title: "Platform Components/Communication Modules/LanguageSwitcher",
  component: LanguageSwitcher,
}

export default meta
type Story = StoryObj<typeof LanguageSwitcher>

export const Floating: Story = {
  args: {
    variant: "floating",
    className: "!left-5 !top-0",
  },
}

export const Compact: Story = {
  args: {
    variant: "compact",
  },
}

export const CompactFullIcon: Story = {
  args: {
    variant: "compact",
    compactFillIcon: true,
  },
}
