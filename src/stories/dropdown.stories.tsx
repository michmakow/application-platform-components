import type { Meta, StoryObj } from "@storybook/react"
import { Sparkles, Star } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import {
  Dropdown,
  type DropdownColors,
  type DropdownIconPlacement,
  type DropdownPreset,
  type DropdownTriggerDisplay,
  type DropdownValue,
} from "../components/dropdown"

const DEFAULT_OPTIONS = [
  {
    value: "clarity",
    label: "Clarity",
    leftIcon: <Sparkles className="h-3.5 w-3.5" />,
    rightIcon: <Star className="h-3.5 w-3.5" />,
  },
  {
    value: "structure",
    label: "Structure",
    icon: <Sparkles className="h-3.5 w-3.5" />,
  },
  {
    value: "empathy",
    label: "Empathy",
    icon: <Star className="h-3.5 w-3.5" />,
  },
  {
    value: "facts",
    label: "Facts",
  },
]

const DEFAULT_PRESETS: DropdownPreset[] = [
  { id: "core", label: "Core", values: ["clarity", "structure"] },
  { id: "assistant", label: "Assistant", values: ["empathy", "facts"] },
  { id: "all", label: "All", values: ["clarity", "structure", "empathy", "facts"] },
]

const COLOR_PRESET_GOLD: Partial<DropdownColors> = {
  triggerBackground: "rgba(11, 21, 38, 0.9)",
  triggerText: "#E6EBF0",
  triggerBorder: "rgba(230, 195, 106, 0.42)",
  menuBackground: "rgba(11, 21, 38, 0.97)",
  menuBorder: "rgba(230, 195, 106, 0.38)",
  itemHoverBackground: "rgba(230, 195, 106, 0.15)",
  itemSelectedBackground: "rgba(230, 195, 106, 0.26)",
  itemSelectedText: "#FFFFFF",
  chevron: "#E6C36A",
}

type DropdownStoryArgs = {
  disabled: boolean
  placeholder: string
  searchable: boolean
  multiSelect: boolean
  triggerDisplay: DropdownTriggerDisplay
  itemIconPlacement: DropdownIconPlacement
  selectedIconPlacement: DropdownIconPlacement
  maxVisiblePills: number
  usePresets: boolean
  useCustomColors: boolean
}

const normalizeStoryValue = (
  nextValue: DropdownValue,
  multiSelect: boolean
): DropdownValue => {
  if (multiSelect) {
    if (Array.isArray(nextValue)) return nextValue
    if (typeof nextValue === "string" && nextValue.length > 0) return [nextValue]
    return []
  }

  if (Array.isArray(nextValue)) return nextValue[0] ?? ""
  return nextValue
}

const renderDropdown = (args: DropdownStoryArgs) => {
  const isCompactTrigger = args.triggerDisplay === "icon-only" && !args.multiSelect
  const initialValue = useMemo<DropdownValue>(
    () => (args.multiSelect ? ["clarity"] : "clarity"),
    [args.multiSelect]
  )
  const [value, setValue] = useState<DropdownValue>(initialValue)

  useEffect(() => {
    setValue(args.multiSelect ? ["clarity"] : "clarity")
  }, [args.multiSelect])

  return (
    <div className="max-w-md">
      <Dropdown
        options={DEFAULT_OPTIONS}
        value={value}
        onValueChange={(next) => setValue(normalizeStoryValue(next, args.multiSelect))}
        disabled={args.disabled}
        placeholder={args.placeholder}
        searchable={args.searchable}
        multiSelect={args.multiSelect}
        closeOnSelect={!args.multiSelect}
        triggerDisplay={args.triggerDisplay}
        itemIconPlacement={args.itemIconPlacement}
        selectedIconPlacement={args.selectedIconPlacement}
        maxVisiblePills={args.maxVisiblePills}
        presets={args.usePresets ? DEFAULT_PRESETS : undefined}
        colors={args.useCustomColors ? COLOR_PRESET_GOLD : undefined}
        containerClassName={isCompactTrigger ? "w-10" : undefined}
        triggerClassName={isCompactTrigger ? "h-10 min-h-10 w-10 rounded-3xl px-2 py-2" : undefined}
        menuClassName={isCompactTrigger ? "w-60" : undefined}
      />
    </div>
  )
}

const meta: Meta<DropdownStoryArgs> = {
  title: "Platform Components/Form Controls/Dropdown",
  component: Dropdown,
  render: renderDropdown,
  args: {
    disabled: false,
    placeholder: "Select option",
    searchable: true,
    multiSelect: false,
    triggerDisplay: "default",
    itemIconPlacement: "left",
    selectedIconPlacement: "left",
    maxVisiblePills: 3,
    usePresets: false,
    useCustomColors: false,
  },
  argTypes: {
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
    searchable: { control: "boolean" },
    multiSelect: { control: "boolean" },
    triggerDisplay: {
      control: "select",
      options: ["default", "icon-only"],
    },
    itemIconPlacement: {
      control: "select",
      options: ["none", "left", "right", "both"],
    },
    selectedIconPlacement: {
      control: "select",
      options: ["none", "left", "right", "both"],
    },
    maxVisiblePills: { control: { type: "number", min: 1, max: 8, step: 1 } },
    usePresets: { control: "boolean" },
    useCustomColors: { control: "boolean" },
  },
}

export default meta
type Story = StoryObj<DropdownStoryArgs>

export const Playground: Story = {}

export const MultiSelectWithPresets: Story = {
  args: {
    multiSelect: true,
    searchable: true,
    usePresets: true,
    itemIconPlacement: "left",
    selectedIconPlacement: "left",
  },
}

export const IconsBothSides: Story = {
  args: {
    multiSelect: false,
    searchable: true,
    itemIconPlacement: "both",
    selectedIconPlacement: "both",
  },
}

export const CompactIconOnly: Story = {
  args: {
    triggerDisplay: "icon-only",
    searchable: false,
    multiSelect: false,
    itemIconPlacement: "left",
    selectedIconPlacement: "left",
  },
}
