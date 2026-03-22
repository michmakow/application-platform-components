import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

export type SeparatorVariant =
  | "solid"
  | "dotted"
  | "long-dotted"
  | "double"
  | "ornament"
  | "icon"
  | "text"

export type SeparatorOrientation =
  | "horizontal"
  | "vertical"
  | "diagonal-down"
  | "diagonal-up"

export const SEPARATOR_ORNAMENTS = {
  none: "",
  flower: "✿",
  spark: "✦",
  sun: "✶",
  diamond: "❖",
  snowflake: "❄",
  heart: "♥",
  circle: "●",
  cross: "✚",
  starburst: "✹",
  clover: "❋",
  knot: "✣",
  leaf: "❧",
} as const

export type SeparatorOrnamentKey = keyof typeof SEPARATOR_ORNAMENTS

export interface SeparatorNodeDecoration {
  kind: "node"
  content: React.ReactNode
}

export type SeparatorIconButtonVariant = "ghost" | "outline" | "solid"
export type SeparatorIconButtonSize = "xs" | "sm" | "md" | "lg"

export interface SeparatorIconButtonConfig {
  kind: "icon-button"
  id: string
  icon: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  active?: boolean
  showDot?: boolean
  dotTitle?: string
  badgeContent?: number | string
  comingSoon?: string
  disabled?: boolean
  // Presentation hints for default/custom renderers.
  variant?: SeparatorIconButtonVariant
  size?: SeparatorIconButtonSize
  meta?: Record<string, unknown>
  className?: string
  alt?: string
  title?: string
  description?: string
}

export type SeparatorDecoration = SeparatorNodeDecoration | SeparatorIconButtonConfig

export const separatorNode = (content: React.ReactNode): SeparatorNodeDecoration => ({
  kind: "node",
  content,
})

export interface SeparatorProps
  extends Omit<React.ComponentProps<typeof SeparatorPrimitive.Root>, "orientation" | "asChild"> {
  orientation?: SeparatorOrientation
  curved?: boolean
  fadeEnds?: boolean
  fadeColorClassName?: string
  color?: string
  centerColor?: string
  trackExtent?: number | string
  variant?: SeparatorVariant
  thickness?: number | string
  ornament?: SeparatorOrnamentKey | string
  icon?: SeparatorDecoration
  icons?: SeparatorDecoration[]
  text?: React.ReactNode
  edgeStart?: SeparatorDecoration
  edgeEnd?: SeparatorDecoration
  ornamentCount?: number
  hideCenterContent?: boolean
  renderIconButton?: (config: SeparatorIconButtonConfig) => React.ReactNode
}

