import * as React from "react"

export type SeparatorLineVariant = "solid" | "dotted" | "long-dotted" | "double"

export interface DecoratedTrackSlot<TContent = unknown> {
  key: string
  kind: "center" | "edge-start" | "edge-end"
  content: TContent
}

export type TrackItem<TContent = unknown> =
  | { kind: "line"; key: string; lineIndex: number }
  | { kind: "slot"; slot: DecoratedTrackSlot<TContent> }

export interface TrackBuildResult<TContent = unknown> {
  items: TrackItem<TContent>[]
  lineCount: number
}

export const DIAGONAL_LINE_LENGTH = "141.5%"
const WAVE_SEGMENT_LENGTH = 64

const NUMERIC_LENGTH_PATTERN = /^-?\d+(\.\d+)?$/
const PIXEL_LENGTH_PATTERN = /^(-?\d+(?:\.\d+)?)px$/i
const UNIT_LENGTH_PATTERN = /^(-?\d+(?:\.\d+)?)([a-z%]+)$/i

export const resolveLength = (
  value: number | string | undefined,
  fallback: string,
  minPixels = 1,
): string => {
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      return fallback
    }

    return `${Math.max(minPixels, value)}px`
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const trimmed = value.trim()

    if (NUMERIC_LENGTH_PATTERN.test(trimmed)) {
      const parsed = Number.parseFloat(trimmed)
      return Number.isFinite(parsed) ? `${Math.max(minPixels, parsed)}px` : fallback
    }

    const pixelMatch = trimmed.match(PIXEL_LENGTH_PATTERN)
    if (pixelMatch) {
      const parsed = Number.parseFloat(pixelMatch[1] ?? "0")
      return Number.isFinite(parsed) ? `${Math.max(minPixels, parsed)}px` : fallback
    }

    const unitMatch = trimmed.match(UNIT_LENGTH_PATTERN)
    if (unitMatch) {
      const parsed = Number.parseFloat(unitMatch[1] ?? "0")
      if (!Number.isFinite(parsed)) {
        return fallback
      }

      return parsed <= 0 ? `${minPixels}px` : trimmed
    }

    return trimmed
  }

  return fallback
}

export const ensureMinPixelLength = (value: string, minPixels: number): string => {
  const match = value.match(/^(\d+(?:\.\d+)?)px$/)
  if (!match) {
    return value
  }

  const numericValue = Number.parseFloat(match[1] ?? "0")
  return numericValue < minPixels ? `${minPixels}px` : value
}

export const resolveOrnamentSymbol = (
  ornament: string | null | undefined,
  ornaments: Record<string, string>,
  fallback: string,
): string | null => {
  if (ornament === undefined || ornament === null) {
    return fallback.length > 0 ? fallback : null
  }

  const resolved = ornaments[ornament] ?? ornament
  return resolved.length > 0 ? resolved : null
}

export const getFadeMask = (axis: "horizontal" | "vertical"): string =>
  axis === "vertical"
    ? "linear-gradient(to bottom, transparent, black 16%, black 84%, transparent)"
    : "linear-gradient(to right, transparent, black 16%, black 84%, transparent)"

export const getEdgeFadeMask = (
  axis: "horizontal" | "vertical",
  edge: "start" | "end",
): string => {
  if (axis === "vertical") {
    return edge === "start"
      ? "linear-gradient(to bottom, transparent, black)"
      : "linear-gradient(to bottom, black, transparent)"
  }

  return edge === "start"
    ? "linear-gradient(to right, transparent, black)"
    : "linear-gradient(to right, black, transparent)"
}

export const getPatternStyle = ({
  variant,
  axis,
  resolvedColor,
  lineThickness,
}: {
  variant: SeparatorLineVariant
  axis: "horizontal" | "vertical"
  resolvedColor: string
  lineThickness: string
}): React.CSSProperties => {
  if (variant === "solid") {
    return { backgroundColor: resolvedColor }
  }

  if (variant === "double") {
    if (axis === "vertical") {
      return {
        backgroundImage: `linear-gradient(${resolvedColor}, ${resolvedColor}), linear-gradient(${resolvedColor}, ${resolvedColor})`,
        backgroundRepeat: "no-repeat, no-repeat",
        backgroundSize: `${lineThickness} 100%, ${lineThickness} 100%`,
        backgroundPosition: `0 0, calc(100% - ${lineThickness}) 0`,
      }
    }

    return {
      backgroundImage: `linear-gradient(to right, ${resolvedColor}, ${resolvedColor}), linear-gradient(to right, ${resolvedColor}, ${resolvedColor})`,
      backgroundRepeat: "no-repeat, no-repeat",
      backgroundSize: `100% ${lineThickness}, 100% ${lineThickness}`,
      backgroundPosition: `0 0, 0 calc(100% - ${lineThickness})`,
    }
  }

  if (variant === "long-dotted") {
    return {
      backgroundImage:
        axis === "vertical"
          ? `repeating-linear-gradient(to bottom, ${resolvedColor} 0 12px, transparent 12px 20px)`
          : `repeating-linear-gradient(to right, ${resolvedColor} 0 12px, transparent 12px 20px)`,
    }
  }

  return {
    backgroundImage:
      axis === "vertical"
        ? `repeating-linear-gradient(to bottom, ${resolvedColor} 0 2px, transparent 2px 7px)`
        : `repeating-linear-gradient(to right, ${resolvedColor} 0 2px, transparent 2px 7px)`,
  }
}

export const getWavePatternStyle = ({
  axis,
  resolvedColor,
  lineThickness,
  waveCrossSize,
}: {
  axis: "horizontal" | "vertical"
  resolvedColor: string
  lineThickness: string
  waveCrossSize: string
}): React.CSSProperties => {
  const parsedThickness = Number.parseFloat(lineThickness)
  const strokeWidth = Number.isFinite(parsedThickness) && parsedThickness > 0 ? parsedThickness : 1
  const amplitude = Math.max(2, strokeWidth * 1.5)
  const span = amplitude * 2 + strokeWidth
  const baseline = amplitude + strokeWidth / 2
  const lowEdge = strokeWidth / 2
  const highEdge = span - strokeWidth / 2
  const path =
    axis === "vertical"
      ? `M ${baseline} 0 C ${lowEdge} 8 ${lowEdge} 24 ${baseline} 32 C ${highEdge} 40 ${highEdge} 56 ${baseline} 64`
      : `M 0 ${baseline} C 8 ${lowEdge} 24 ${lowEdge} 32 ${baseline} C 40 ${highEdge} 56 ${highEdge} 64 ${baseline}`
  const viewBox = axis === "vertical" ? `0 0 ${span} ${WAVE_SEGMENT_LENGTH}` : `0 0 ${WAVE_SEGMENT_LENGTH} ${span}`
  const backgroundSize =
    axis === "vertical"
      ? `${waveCrossSize} ${WAVE_SEGMENT_LENGTH}px`
      : `${WAVE_SEGMENT_LENGTH}px ${waveCrossSize}`
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='${viewBox}' preserveAspectRatio='none'><path d='${path}' fill='none' stroke='${resolvedColor}' stroke-width='${strokeWidth}' stroke-linecap='round' /></svg>`

  return {
    backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
    backgroundRepeat: axis === "vertical" ? "repeat-y" : "repeat-x",
    backgroundSize,
    backgroundPosition: "center",
  }
}

export const buildTrackItems = <TContent>({
  slots,
  hasStartEdge,
  hasEndEdge,
}: {
  slots: DecoratedTrackSlot<TContent>[]
  hasStartEdge: boolean
  hasEndEdge: boolean
}): TrackBuildResult<TContent> => {
  if (slots.length === 0) {
    return {
      items: [{ kind: "line", key: "line-0", lineIndex: 0 }],
      lineCount: 1,
    }
  }

  const items: TrackItem<TContent>[] = []
  let lineIndex = 0

  if (!hasStartEdge) {
    items.push({ kind: "line", key: `line-${lineIndex}`, lineIndex })
    lineIndex += 1
  }

  slots.forEach((slot, slotIndex) => {
    items.push({ kind: "slot", slot })
    if (slotIndex < slots.length - 1) {
      items.push({ kind: "line", key: `line-${lineIndex}`, lineIndex })
      lineIndex += 1
    }
  })

  if (!hasEndEdge) {
    items.push({ kind: "line", key: `line-${lineIndex}`, lineIndex })
    lineIndex += 1
  }

  return { items, lineCount: lineIndex }
}
