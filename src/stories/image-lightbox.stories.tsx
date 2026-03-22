import type { Meta, StoryObj } from "@storybook/react"
import flagEn from "../assets/flags/en-US.png"
import { ImageLightbox } from "../components/image"

const meta: Meta<typeof ImageLightbox> = {
  id: "platform-components-communication-modules-imagelightbox",
  title: "Platform Components/Communication Modules/ImageLightbox",
  component: ImageLightbox,
  argTypes: {
    hintSize: {
      control: "select",
      options: ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl"],
    },
  },
  args: {
    src: flagEn,
    alt: "Flag",
    hint: "Click to zoom",
    hintSize: "xs",
  },
}

export default meta
type Story = StoryObj<typeof ImageLightbox>

export const Default: Story = {}
