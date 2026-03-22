import * as React from "react"
import type {
  SeparatorDecoration,
  SeparatorIconButtonConfig,
  SeparatorOrientation,
  SeparatorProps,
  SeparatorVariant,
} from "../separator.types"
import { SEPARATOR_ORNAMENTS, separatorNode } from "../separator.types"
import {
  buildTrackItems,
  ensureMinPixelLength,
  resolveLength,
  resolveOrnamentSymbol,
  type DecoratedTrackSlot,
  type TrackItem,
} from "../separator.utils"

const DEFAULT_SEPARATOR_COLOR = "rgb(var(--border))"
const DEFAULT_ORNAMENT_SYMBOL = SEPARATOR_ORNAMENTS.none
const DEFAULT_ICON_SYMBOL = "✦"
const DEFAULT_TEXT_CONTENT = "Section"
const DEFAULT_TRACK_EXTENT = "6rem"

const isSeparatorIconButtonConfig = (
  value: SeparatorDecoration | null | undefined,
): value is SeparatorIconButtonConfig => value?.kind === "icon-button"

const resolveTextContent = (content: SeparatorProps["text"]): React.ReactNode | null => {
  if (content === undefined || content === null) {
    return DEFAULT_TEXT_CONTENT
  }

  if (typeof content === "string") {
    return content.trim().length > 0 ? content : null
  }

  return content
}

export interface SeparatorModel {
  orientation: SeparatorOrientation
  primitiveOrientation: "horizontal" | "vertical"
  axis: "horizontal" | "vertical"
  isVertical: boolean
  isDiagonal: boolean
  decorative: boolean
  effectiveDecorative: boolean
  curved: boolean
  fadeEnds: boolean
  variant: SeparatorVariant
  centerVariant: boolean
  textVariant: boolean
  resolvedColor: string
  resolvedCenterColor: string
  lineThickness: string
  effectiveCurvedThickness: string
  centerSize: string
  centerTextSize: string
  waveCrossSize: string
  resolvedTrackExtent: string
  lineCrossSize: string
  resolvedLineCrossSize: string
  lineCrossAxisStyle: React.CSSProperties
  shouldUseTailwindGradientFadeForDefaultSolidSeparator: boolean
  hasStartEdge: boolean
  hasEndEdge: boolean
  centerHidden: boolean
  centerSlots: DecoratedTrackSlot<SeparatorDecoration | null>[]
  decoratedSlots: DecoratedTrackSlot<SeparatorDecoration | null>[]
  trackItems: TrackItem<SeparatorDecoration | null>[]
  lineCount: number
  centerSlotCount: number
  showCenterSlot: boolean
  showCenterContent: boolean
  diagonalCenterContent: SeparatorDecoration | null
}

export type UseSeparatorModelInput = Pick<
  SeparatorProps,
  | "orientation"
  | "decorative"
  | "curved"
  | "fadeEnds"
  | "color"
  | "centerColor"
  | "trackExtent"
  | "variant"
  | "thickness"
  | "ornament"
  | "icon"
  | "icons"
  | "text"
  | "edgeStart"
  | "edgeEnd"
  | "ornamentCount"
  | "hideCenterContent"
>

export const useSeparatorModel = ({
  orientation = "horizontal",
  decorative = true,
  curved = false,
  fadeEnds = false,
  color,
  centerColor,
  trackExtent,
  variant = "solid",
  thickness = 1,
  ornament,
  icon,
  icons,
  text,
  edgeStart,
  edgeEnd,
  ornamentCount = 0,
  hideCenterContent,
}: UseSeparatorModelInput): SeparatorModel => {
  const isVertical = orientation === "vertical"
  const isDiagonal = orientation === "diagonal-down" || orientation === "diagonal-up"
  const axis: "horizontal" | "vertical" = isVertical ? "vertical" : "horizontal"
  const primitiveOrientation: "horizontal" | "vertical" = isVertical ? "vertical" : "horizontal"

  const lineThickness = React.useMemo(() => resolveLength(thickness, "1px"), [thickness])
  const effectiveCurvedThickness = React.useMemo(
    () => (curved ? ensureMinPixelLength(lineThickness, 2) : lineThickness),
    [curved, lineThickness],
  )
  const centerSize = React.useMemo(() => `max(12px, calc(${lineThickness} * 6))`, [lineThickness])
  const centerTextSize = React.useMemo(
    () => `max(0.75rem, calc(${lineThickness} * 3.5))`,
    [lineThickness],
  )
  const waveCrossSize = React.useMemo(
    () => `max(8px, calc(${effectiveCurvedThickness} * 6))`,
    [effectiveCurvedThickness],
  )
  const resolvedTrackExtent = React.useMemo(
    () => resolveLength(trackExtent, DEFAULT_TRACK_EXTENT),
    [trackExtent],
  )

  const resolvedColor = color ?? DEFAULT_SEPARATOR_COLOR
  const resolvedCenterColor = centerColor ?? resolvedColor
  const resolvedOrnamentSymbol = React.useMemo(
    () => resolveOrnamentSymbol(ornament, SEPARATOR_ORNAMENTS, DEFAULT_ORNAMENT_SYMBOL),
    [ornament],
  )
  const resolvedTextContent = React.useMemo(() => resolveTextContent(text), [text])
  const normalizedOrnamentCount = React.useMemo(
    () => (Number.isFinite(ornamentCount) ? Math.max(0, Math.floor(ornamentCount)) : 0),
    [ornamentCount],
  )
  const iconSequence = React.useMemo(
    () => (icons ?? []).filter((entry): entry is SeparatorDecoration => entry !== null && entry !== undefined),
    [icons],
  )

  const centerVariant = variant === "ornament" || variant === "icon" || variant === "text"
  const textVariant = variant === "text"

  const baseCenterContents = React.useMemo<SeparatorDecoration[]>(() => {
    if (variant === "ornament") {
      if (!resolvedOrnamentSymbol || normalizedOrnamentCount <= 0) {
        return []
      }

      return Array.from({ length: normalizedOrnamentCount }, () => separatorNode(resolvedOrnamentSymbol))
    }

    if (variant === "icon") {
      if (iconSequence.length > 0) {
        return iconSequence
      }

      return [icon ?? separatorNode(DEFAULT_ICON_SYMBOL)]
    }

    if (variant === "text") {
      return resolvedTextContent === null ? [] : [separatorNode(resolvedTextContent)]
    }

    return []
  }, [icon, iconSequence, normalizedOrnamentCount, resolvedOrnamentSymbol, resolvedTextContent, variant])

  const hasStartEdge = edgeStart !== null && edgeStart !== undefined
  const hasEndEdge = edgeEnd !== null && edgeEnd !== undefined
  const centerHidden = hideCenterContent ?? false

  const centerSlots = React.useMemo<DecoratedTrackSlot<SeparatorDecoration | null>[]>(
    () =>
      Array.from({ length: centerVariant ? baseCenterContents.length : 0 }).map((_, index) => ({
        key: `center-${index}`,
        kind: "center",
        content: centerHidden ? null : (baseCenterContents[index] ?? null),
      })),
    [baseCenterContents, centerHidden, centerVariant],
  )

  const decoratedSlots = React.useMemo<DecoratedTrackSlot<SeparatorDecoration | null>[]>(
    () => [
      ...(hasStartEdge
        ? [
            {
              key: "edge-start",
              kind: "edge-start" as const,
              content: edgeStart ?? null,
            },
          ]
        : []),
      ...centerSlots,
      ...(hasEndEdge
        ? [
            {
              key: "edge-end",
              kind: "edge-end" as const,
              content: edgeEnd ?? null,
            },
          ]
        : []),
    ],
    [centerSlots, edgeEnd, edgeStart, hasEndEdge, hasStartEdge],
  )

  const trackModel = React.useMemo(
    () =>
      buildTrackItems({
        slots: decoratedSlots,
        hasStartEdge,
        hasEndEdge,
      }),
    [decoratedSlots, hasEndEdge, hasStartEdge],
  )

  const centerSlotCount = centerSlots.length
  const showCenterSlot = centerSlotCount > 0
  const showCenterContent = showCenterSlot && !centerHidden
  const diagonalCenterContent = showCenterContent ? (baseCenterContents[0] ?? null) : null

  const hasInteractiveDecoration = React.useMemo(
    () => decoratedSlots.some((slot) => isSeparatorIconButtonConfig(slot.content)),
    [decoratedSlots],
  )
  const effectiveDecorative = decorative && !hasInteractiveDecoration
  const shouldUseTailwindGradientFadeForDefaultSolidSeparator =
    variant === "solid" && fadeEnds && !color && !isDiagonal && !centerVariant && !curved

  const doubleThickness = React.useMemo(() => `calc(${lineThickness} * 3)`, [lineThickness])
  const lineCrossSize = variant === "double" ? doubleThickness : lineThickness
  const resolvedLineCrossSize = curved ? waveCrossSize : lineCrossSize
  const lineCrossAxisStyle = isVertical
    ? { width: resolvedLineCrossSize }
    : { height: resolvedLineCrossSize }

  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      return
    }
    if (variant !== "ornament" && ornament !== undefined) {
      console.warn("[Separator] `ornament` prop is ignored unless variant='ornament'.")
    }

    if (variant !== "ornament" && normalizedOrnamentCount > 0) {
      console.warn("[Separator] `ornamentCount` prop is ignored unless variant='ornament'.")
    }

    if (variant === "icon" && icon !== undefined && iconSequence.length > 0) {
      console.warn("[Separator] `icons` has priority over `icon` when both are provided.")
    }

    if (variant !== "icon" && (icon !== undefined || iconSequence.length > 0)) {
      console.warn("[Separator] `icon` and `icons` props are ignored unless variant='icon'.")
    }

    if (variant !== "text" && text !== undefined && text !== null) {
      console.warn("[Separator] `text` prop is ignored unless variant='text'.")
    }

    if (isDiagonal && centerSlotCount > 1) {
      console.warn("[Separator] Diagonal orientation supports only one center decoration; extra items are ignored.")
    }

    if (decorative && hasInteractiveDecoration) {
      console.warn("[Separator] Interactive decorations force decorative=false for accessibility semantics.")
    }
  }, [
    centerSlotCount,
    decorative,
    hasInteractiveDecoration,
    icon,
    iconSequence.length,
    isDiagonal,
    normalizedOrnamentCount,
    ornament,
    text,
    variant,
  ])

  return React.useMemo(
    () => ({
      orientation,
      primitiveOrientation,
      axis,
      isVertical,
      isDiagonal,
      decorative,
      effectiveDecorative,
      curved,
      fadeEnds,
      variant,
      centerVariant,
      textVariant,
      resolvedColor,
      resolvedCenterColor,
      lineThickness,
      effectiveCurvedThickness,
      centerSize,
      centerTextSize,
      waveCrossSize,
      resolvedTrackExtent,
      lineCrossSize,
      resolvedLineCrossSize,
      lineCrossAxisStyle,
      shouldUseTailwindGradientFadeForDefaultSolidSeparator,
      hasStartEdge,
      hasEndEdge,
      centerHidden,
      centerSlots,
      decoratedSlots,
      trackItems: trackModel.items,
      lineCount: trackModel.lineCount,
      centerSlotCount,
      showCenterSlot,
      showCenterContent,
      diagonalCenterContent,
    }),
    [
      orientation,
      primitiveOrientation,
      axis,
      isVertical,
      isDiagonal,
      decorative,
      effectiveDecorative,
      curved,
      fadeEnds,
      variant,
      centerVariant,
      textVariant,
      resolvedColor,
      resolvedCenterColor,
      lineThickness,
      effectiveCurvedThickness,
      centerSize,
      centerTextSize,
      waveCrossSize,
      resolvedTrackExtent,
      lineCrossSize,
      resolvedLineCrossSize,
      lineCrossAxisStyle,
      shouldUseTailwindGradientFadeForDefaultSolidSeparator,
      hasStartEdge,
      hasEndEdge,
      centerHidden,
      centerSlots,
      decoratedSlots,
      trackModel.items,
      trackModel.lineCount,
      centerSlotCount,
      showCenterSlot,
      showCenterContent,
      diagonalCenterContent,
    ],
  )
}




