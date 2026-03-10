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
    className: "!left-5 !w-[50px] !top-0 [&_button]:!w-fit",
  },
}

export const Compact: Story = {
  args: {
    variant: "compact",
  },
}
