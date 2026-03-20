import { useEffect } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import {
  GlobalLoadingOverlay,
  type GlobalLoadingOverlayProps,
} from "../components/utility/global-loading-overlay"
import { useUtilityStore } from "../store/utilityStore"

const meta: Meta<typeof GlobalLoadingOverlay> = {
  title: "Platform Components/Async State Components/GlobalLoadingOverlay",
  component: GlobalLoadingOverlay,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    overlayColor: "rgba(0, 6, 15, 0.75)",
    overlayOpacity: 1,
    statusMessage: "Loading",
    spinnerColor: "rgba(230, 195, 106, 0.8)",
    spinnerGlowColor: "rgba(230, 195, 106, 0.45)",
    spinnerShape: "circle",
    spinnerAnimation: "spin",
    spinnerSize: 56,
    spinnerThickness: 2,
    spinnerCenterContent: "",
  },
  argTypes: {
    overlayColor: { control: "color" },
    overlayOpacity: {
      control: { type: "number", min: 0, max: 1, step: 0.05 },
    },
    statusMessage: { control: "text" },
    spinnerColor: { control: "color" },
    spinnerGlowColor: { control: "color" },
    spinnerShape: {
      control: "select",
      options: ["circle", "rounded", "square"],
    },
    spinnerAnimation: {
      control: "select",
      options: ["spin", "orbit-wave", "orbit-pulse"],
    },
    spinnerSize: {
      control: { type: "number", min: 24, max: 120, step: 2 },
    },
    spinnerThickness: {
      control: { type: "number", min: 1, max: 12, step: 1 },
    },
    spinnerCenterContent: { control: "text" },
    overlayClassName: { control: "text" },
    spinnerClassName: { control: "text" },
  },
}

export default meta
type Story = StoryObj<typeof GlobalLoadingOverlay>

const AlwaysLoadingPreview = (args: GlobalLoadingOverlayProps) => {
  const startLoading = useUtilityStore((state) => state.startLoading)
  const resetLoading = useUtilityStore((state) => state.resetLoading)

  useEffect(() => {
    resetLoading()
    startLoading()
    return () => resetLoading()
  }, [startLoading, resetLoading])

  return (
    <div className="min-h-30 bg-[radial-gradient(circle_at_top,#0f1d3d_0%,#091124_42%,#050811_100%)] p-8">
      <GlobalLoadingOverlay {...args} />
    </div>
  )
}

export const Default: Story = {
  render: (args) => AlwaysLoadingPreview(args),
}

export const WithCenterIcon: Story = {
  args: {
    spinnerShape: "rounded",
    spinnerColor: "#FB7185",
    spinnerGlowColor: "rgba(251, 113, 133, 0.45)",
    spinnerCenterContent: <span className="text-base leading-none">✦</span>,
  },
  render: (args) => AlwaysLoadingPreview(args),
}

export const WithCenterUD: Story = {
  args: {
    spinnerShape: "circle",
    spinnerColor: "#38BDF8",
    spinnerGlowColor: "rgba(56, 189, 248, 0.45)",
    spinnerCenterContent: "UD",
  },
  render: (args) => AlwaysLoadingPreview(args),
}

export const OrbitWave: Story = {
  args: {
    spinnerAnimation: "orbit-wave",
    spinnerShape: "circle",
    spinnerColor: "#E6C36A",
    spinnerGlowColor: "rgba(230, 195, 106, 0.5)",
  },
  render: (args) => AlwaysLoadingPreview(args),
}

export const OrbitPulse: Story = {
  args: {
    spinnerAnimation: "orbit-pulse",
    spinnerShape: "circle",
    spinnerColor: "#FB7185",
    spinnerGlowColor: "rgba(251, 113, 133, 0.55)",
  },
  render: (args) => AlwaysLoadingPreview(args),
}
