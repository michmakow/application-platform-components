import React from "react"
import { cn } from "../../../lib/utils"

export interface CrystalFacetsProps {
  crystalColor?: string
  color?: string
  facetSize?: number
  className?: string
}

interface RGBColor {
  r: number
  g: number
  b: number
}

const parseHexColor = (value: string): RGBColor | null => {
  const sanitized = value.trim().replace("#", "")

  if (/^[\da-fA-F]{3}$/.test(sanitized)) {
    return {
      r: Number.parseInt(`${sanitized[0]}${sanitized[0]}`, 16),
      g: Number.parseInt(`${sanitized[1]}${sanitized[1]}`, 16),
      b: Number.parseInt(`${sanitized[2]}${sanitized[2]}`, 16),
    }
  }

  if (/^[\da-fA-F]{6}$/.test(sanitized)) {
    return {
      r: Number.parseInt(sanitized.slice(0, 2), 16),
      g: Number.parseInt(sanitized.slice(2, 4), 16),
      b: Number.parseInt(sanitized.slice(4, 6), 16),
    }
  }

  return null
}

const clampRgbChannel = (value: number) => Math.min(255, Math.max(0, value))

const parseRgbColor = (value: string): RGBColor | null => {
  const normalized = value.trim()

  const commaSeparatedMatch = normalized.match(
    /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(?:0|1|0?\.\d+)\s*)?\)$/i,
  )

  if (commaSeparatedMatch) {
    return {
      r: clampRgbChannel(Number.parseInt(commaSeparatedMatch[1], 10)),
      g: clampRgbChannel(Number.parseInt(commaSeparatedMatch[2], 10)),
      b: clampRgbChannel(Number.parseInt(commaSeparatedMatch[3], 10)),
    }
  }

  const spaceSeparatedMatch = normalized.match(
    /^rgba?\(\s*(\d{1,3})\s+(\d{1,3})\s+(\d{1,3})(?:\s*\/\s*(?:0|1|0?\.\d+|(?:\d{1,3})%)\s*)?\)$/i,
  )

  if (spaceSeparatedMatch) {
    return {
      r: clampRgbChannel(Number.parseInt(spaceSeparatedMatch[1], 10)),
      g: clampRgbChannel(Number.parseInt(spaceSeparatedMatch[2], 10)),
      b: clampRgbChannel(Number.parseInt(spaceSeparatedMatch[3], 10)),
    }
  }

  return null
}

const parseColor = (value: string): RGBColor | null => parseHexColor(value) ?? parseRgbColor(value)

const toRgba = (color: RGBColor, alpha: number) => `rgba(${color.r},${color.g},${color.b},${alpha})`

const normalizeFacetSize = (facetSize: number) =>
  Math.min(72, Math.max(8, Math.round(facetSize)))

export const CrystalFacets: React.FC<CrystalFacetsProps> = ({
  crystalColor,
  color = "#FFD26F",
  facetSize = 22,
  className,
}) => {
  const resolvedColor = (crystalColor ?? color).trim()
  const normalizedColor = resolvedColor.length > 0 ? resolvedColor : "#FFD26F"
  const parsedColor = parseColor(normalizedColor)
  const resolveTone = (alpha: number) => {
    if (parsedColor) {
      return toRgba(parsedColor, alpha)
    }

    return normalizedColor
  }

  const normalizedFacetSize = normalizeFacetSize(facetSize)
  const primaryStride = normalizedFacetSize
  const secondaryStride = Math.max(10, Math.round(normalizedFacetSize * 1.28))
  const facetStroke = Math.max(1, Math.round(normalizedFacetSize * 0.06))

  return (
    <div className={cn("pointer-events-none absolute inset-0", className)}>
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: `linear-gradient(135deg,${resolveTone(0.1)} 0%,${resolveTone(
            0.035,
          )} 32%,rgba(14,31,51,0) 62%)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-65"
        style={{
          backgroundImage: `repeating-linear-gradient(60deg,${resolveTone(
            0.065,
          )} 0px,${resolveTone(0.065)} ${facetStroke}px,transparent ${facetStroke}px,transparent ${primaryStride}px)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-55"
        style={{
          backgroundImage: `repeating-linear-gradient(-60deg,${resolveTone(
            0.045,
          )} 0px,${resolveTone(0.045)} ${facetStroke}px,transparent ${facetStroke}px,transparent ${secondaryStride}px)`,
        }}
      />
      <div
        className="absolute inset-0 mix-blend-screen"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 0%,${resolveTone(0.18)},transparent 55%)`,
        }}
      />
    </div>
  )
}
