import type { Meta, StoryObj } from "@storybook/react"
import {
  AtmosphericGlows,
  atmosphericGlowsPositions,
  type AtmosphericGlowsPosition,
} from "../components/decorations/atmospheriGows"
import { CrystalFacets } from "../components/decorations/crystalFacets"

const positionLabels: Record<AtmosphericGlowsPosition, string> = {
  "top-left": "Gorny lewy rog",
  "top-center": "Gora srodek",
  "top-right": "Gorny prawy rog",
  "right-center": "Prawy srodek",
  "bottom-right": "Prawy dolny rog",
  "bottom-center": "Dol srodek",
  "bottom-left": "Lewy dolny rog",
  "left-center": "Lewy srodek",
  center: "Srodek",
}

const meta: Meta<typeof AtmosphericGlows> = {
  title: "Platform Components/Layout System/Decorations",
  component: AtmosphericGlows,
  args: {
    position: "top-right",
  },
  argTypes: {
    position: {
      control: "select",
      options: atmosphericGlowsPositions,
    },
  },
}

export default meta
type Story = StoryObj<typeof AtmosphericGlows>

export const Atmosphere: Story = {
  render: (args) => (
    <div className="relative h-64 overflow-hidden rounded-2xl border border-white/10 bg-[#0B1526]">
      <AtmosphericGlows {...args} />
      <CrystalFacets />
      <div className="relative z-10 p-6">
        <p className="text-sm uppercase tracking-[0.4em] text-[#E6C36A]/70">Ambient</p>
        <h3 className="mt-3 text-2xl font-semibold text-[#E6EBF0]">
          Decorative gradients for hero layouts
        </h3>
      </div>
    </div>
  ),
}

export const AtmospherePositions: Story = {
  render: () => (
    <div className="grid gap-4 md:grid-cols-3">
      {atmosphericGlowsPositions.map((position) => (
        <div
          key={position}
          className="relative h-64 overflow-hidden rounded-2xl border border-white/10 bg-[#0B1526]"
        >
          <AtmosphericGlows position={position} />
          <CrystalFacets />
          <div className="relative z-10 p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-[#E6C36A]/70">
              {positionLabels[position]}
            </p>
            <h3 className="mt-3 text-xl font-semibold text-[#E6EBF0]">Atmospheric position</h3>
          </div>
        </div>
      ))}
    </div>
  ),
}
