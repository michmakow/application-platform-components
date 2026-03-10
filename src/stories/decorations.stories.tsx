import type { Meta, StoryObj } from "@storybook/react"
import {
  AtmosphericGlows,
  atmosphericGlowsPositions,
  type AtmosphericGlowsPosition,
} from "../components/decorations/atmospheriGows"
import { CrystalFacets } from "../components/decorations/crystalFacets"

const positionLabels: Record<AtmosphericGlowsPosition, string> = {
  "top-left": "Top left corner",
  "top-center": "Top center",
  "top-right": "Top right corner",
  "right-center": "Right center",
  "bottom-right": "Bottom right corner",
  "bottom-center": "Bottom center",
  "bottom-left": "Bottom left corner",
  "left-center": "Left center",
  center: "Center",
}

type DecorationsStoryArgs = {
  position: AtmosphericGlowsPosition
  crystalColor: string
  crystalFacetSize: number
}

const meta = {
  title: "Platform Components/Layout System/Decorations",
  component: AtmosphericGlows,
  args: {
    position: "top-right",
    crystalColor: "#FFD26F",
    crystalFacetSize: 22,
  },
  argTypes: {
    position: {
      control: "select",
      options: atmosphericGlowsPositions,
    },
    crystalColor: {
      name: "Crystal color",
      control: "color",
    },
    crystalFacetSize: {
      name: "Crystal facet size",
      control: { type: "range", min: 8, max: 56, step: 1 },
    },
  },
} satisfies Meta<DecorationsStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Atmosphere: Story = {
  render: ({ crystalColor, crystalFacetSize, ...glowArgs }) => (
    <div className="relative h-64 overflow-hidden rounded-2xl border border-white/10 bg-[#0B1526]">
      <AtmosphericGlows {...glowArgs} />
      <CrystalFacets crystalColor={crystalColor} facetSize={crystalFacetSize} />
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
  render: ({ crystalColor, crystalFacetSize }) => (
    <div className="grid gap-4 md:grid-cols-3">
      {atmosphericGlowsPositions.map((position) => (
        <div
          key={position}
          className="relative h-64 overflow-hidden rounded-2xl border border-white/10 bg-[#0B1526]"
        >
          <AtmosphericGlows position={position} />
          <CrystalFacets crystalColor={crystalColor} facetSize={crystalFacetSize} />
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
