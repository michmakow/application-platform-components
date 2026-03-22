import * as React from "react"
import { cn } from "../../../lib/utils"
import type { SeparatorDecoration } from "../separator.types"
import {
  DIAGONAL_LINE_LENGTH,
  getEdgeFadeMask,
  getFadeMask,
  getPatternStyle,
  getWavePatternStyle,
  type DecoratedTrackSlot,
  type SeparatorLineVariant,
} from "../separator.utils"
import { isSeparatorIconButtonConfig } from "./separator-components"
import type { SeparatorModel } from "./use-separator-model"

interface WaveColorState {
  color: string
  unresolvedVariable: boolean
}

const THEME_ATTRIBUTE_FILTER = ["class", "style", "data-theme", "data-color-mode"]

export const resolveWaveColorFromDocument = (rawColor: string): WaveColorState => {
  if (!rawColor.includes("var(")) {
    return { color: rawColor, unresolvedVariable: false }
  }

  if (typeof window === "undefined") {
    return { color: rawColor, unresolvedVariable: true }
  }

  const rootStyles = window.getComputedStyle(document.documentElement)
  let unresolvedVariable = false

  const resolvedColor = rawColor.replace(
    /var\((--[^,\)\s]+)(?:,\s*([^)]+))?\)/g,
    (match, variableName, fallbackValue) => {
      const computedVariable = rootStyles.getPropertyValue(variableName).trim()
      const inlineRootVariable = document.documentElement.style.getPropertyValue(variableName).trim()
      const inlineBodyVariable = document.body?.style.getPropertyValue(variableName).trim() ?? ""
      const variable = computedVariable || inlineRootVariable || inlineBodyVariable
      if (variable.length > 0) {
        return variable
      }

      const fallback = (fallbackValue ?? "").trim()
      if (fallback.length > 0) {
        return fallback
      }

      unresolvedVariable = true
      return match
    },
  )

  return {
    color: resolvedColor,
    unresolvedVariable: unresolvedVariable || resolvedColor.includes("var("),
  }
}

const useResolvedWaveColor = (
  color: string,
  curved: boolean,
): WaveColorState => {
  const [state, setState] = React.useState<WaveColorState>(() => ({
    color,
    unresolvedVariable: curved && color.includes("var("),
  }))

  React.useEffect(() => {
    if (!curved) {
      setState((previous) =>
        previous.color === color && !previous.unresolvedVariable
          ? previous
          : { color, unresolvedVariable: false },
      )
      return
    }

    const syncColor = () => {
      const next = resolveWaveColorFromDocument(color)
      setState((previous) =>
        previous.color === next.color && previous.unresolvedVariable === next.unresolvedVariable
          ? previous
          : next,
      )
    }

    syncColor()

    if (typeof MutationObserver === "undefined") {
      return
    }

    const observer = new MutationObserver(syncColor)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: THEME_ATTRIBUTE_FILTER,
    })

    if (document.body) {
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: THEME_ATTRIBUTE_FILTER,
      })
    }

    return () => {
      observer.disconnect()
    }
  }, [color, curved])

  return state
}

export interface SeparatorStylesModel {
  centerRootStyle: React.CSSProperties
  rootStyle: React.CSSProperties
  segmentLineClasses: string
  fadeClasses: string
  getSegmentStyle: (lineIndex: number) => React.CSSProperties
  getNodeStyleForSlot: (slot: DecoratedTrackSlot<SeparatorDecoration | null>) => React.CSSProperties
  diagonalRootStyle: React.CSSProperties
  diagonalContainerStyle: React.CSSProperties
  diagonalLineStyle: React.CSSProperties
  centerPlaceholderStyle: React.CSSProperties
  centerStyle: React.CSSProperties
  interactiveDiagonalCenter: boolean
}

export const useSeparatorStyles = ({
  model,
  style,
  fadeColorClassName,
}: {
  model: SeparatorModel
  style: React.CSSProperties | undefined
  fadeColorClassName: string
}): SeparatorStylesModel => {
  const resolvedWaveColor = useResolvedWaveColor(model.resolvedColor, model.curved)

  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      return
    }

    if (model.curved && resolvedWaveColor.unresolvedVariable) {
      console.warn(
        "[Separator] Curved wave could not fully resolve CSS variable color. Provide explicit `color` for predictable output.",
      )
    }
  }, [model.curved, resolvedWaveColor.unresolvedVariable])

  const waveSegmentStyle = React.useMemo(
    () =>
      model.curved
        ? getWavePatternStyle({
            axis: model.axis,
            resolvedColor: resolvedWaveColor.color,
            lineThickness: model.effectiveCurvedThickness,
            waveCrossSize: model.resolvedLineCrossSize,
          })
        : null,
    [
      model.axis,
      model.curved,
      model.effectiveCurvedThickness,
      model.resolvedLineCrossSize,
      resolvedWaveColor.color,
    ],
  )

  const segmentMiddleStyle = React.useMemo<React.CSSProperties>(
    () =>
      model.curved
        ? {
            ...(waveSegmentStyle ?? {}),
            ...model.lineCrossAxisStyle,
          }
        : {
            backgroundColor: model.resolvedColor,
            ...(model.isVertical ? { width: model.lineThickness } : { height: model.lineThickness }),
          },
    [model.curved, model.lineCrossAxisStyle, model.resolvedColor, model.isVertical, model.lineThickness, waveSegmentStyle],
  )

  const segmentStartStyle = React.useMemo<React.CSSProperties>(
    () =>
      model.fadeEnds
        ? model.curved
          ? {
              ...segmentMiddleStyle,
              maskImage: getEdgeFadeMask(model.axis, "start"),
              WebkitMaskImage: getEdgeFadeMask(model.axis, "start"),
            }
          : {
              backgroundImage: model.axis === "vertical"
                ? `linear-gradient(to bottom, transparent, ${model.resolvedColor})`
                : `linear-gradient(to right, transparent, ${model.resolvedColor})`,
              ...(model.isVertical ? { width: model.lineThickness } : { height: model.lineThickness }),
            }
        : segmentMiddleStyle,
    [
      model.fadeEnds,
      model.curved,
      model.axis,
      model.resolvedColor,
      model.isVertical,
      model.lineThickness,
      segmentMiddleStyle,
    ],
  )

  const segmentEndStyle = React.useMemo<React.CSSProperties>(
    () =>
      model.fadeEnds
        ? model.curved
          ? {
              ...segmentMiddleStyle,
              maskImage: getEdgeFadeMask(model.axis, "end"),
              WebkitMaskImage: getEdgeFadeMask(model.axis, "end"),
            }
          : {
              backgroundImage: model.axis === "vertical"
                ? `linear-gradient(to bottom, ${model.resolvedColor}, transparent)`
                : `linear-gradient(to right, ${model.resolvedColor}, transparent)`,
              ...(model.isVertical ? { width: model.lineThickness } : { height: model.lineThickness }),
            }
        : segmentMiddleStyle,
    [
      model.fadeEnds,
      model.curved,
      model.axis,
      model.resolvedColor,
      model.isVertical,
      model.lineThickness,
      segmentMiddleStyle,
    ],
  )

  const getSegmentStyle = React.useCallback((lineIndex: number): React.CSSProperties => {
    if (!model.fadeEnds) {
      return segmentMiddleStyle
    }

    if (lineIndex === 0) {
      return segmentStartStyle
    }

    if (lineIndex === model.lineCount - 1) {
      return segmentEndStyle
    }

    return segmentMiddleStyle
  }, [model.fadeEnds, model.lineCount, segmentEndStyle, segmentMiddleStyle, segmentStartStyle])

  const defaultNodeSlotStyle = React.useMemo<React.CSSProperties>(
    () => ({
      color: model.resolvedCenterColor,
      fontSize: model.centerSize,
      width: model.centerSize,
      height: model.centerSize,
      lineHeight: 1,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
    }),
    [model.centerSize, model.resolvedCenterColor],
  )

  const textNodeSlotStyle = React.useMemo<React.CSSProperties>(
    () => ({
      color: model.resolvedCenterColor,
      fontSize: model.centerTextSize,
      lineHeight: 1.2,
      paddingInline: "0.5rem",
      whiteSpace: "nowrap",
      fontWeight: 500,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
    }),
    [model.centerTextSize, model.resolvedCenterColor],
  )

  const getNodeStyleForSlot = React.useCallback(
    (slot: DecoratedTrackSlot<SeparatorDecoration | null>): React.CSSProperties =>
      model.textVariant && slot.kind === "center"
        ? textNodeSlotStyle
        : defaultNodeSlotStyle,
    [defaultNodeSlotStyle, model.textVariant, textNodeSlotStyle],
  )

  const segmentLineClasses = model.isVertical ? "w-px flex-1" : "h-px flex-1"
  const fadeClasses = model.axis === "horizontal"
    ? cn("bg-gradient-to-r from-transparent to-transparent", fadeColorClassName)
    : cn("bg-gradient-to-b from-transparent to-transparent", fadeColorClassName)

  const centerRootStyle = React.useMemo<React.CSSProperties>(
    () => ({
      ...(model.isVertical
        ? {
            minWidth: `calc(${model.centerSize} + 0.75rem)`,
            minHeight: model.resolvedTrackExtent,
          }
        : { minHeight: `calc(${model.centerSize} + 0.5rem)` }),
      ...style,
    }),
    [model.centerSize, model.isVertical, model.resolvedTrackExtent, style],
  )

  const rootStyle = React.useMemo<React.CSSProperties>(
    () =>
      model.shouldUseTailwindGradientFadeForDefaultSolidSeparator
        ? {
            ...style,
            ...(model.isVertical ? { width: model.lineCrossSize } : { height: model.lineCrossSize }),
          }
        : {
            ...(model.curved
              ? getWavePatternStyle({
                  axis: model.axis,
                  resolvedColor: resolvedWaveColor.color,
                  lineThickness: model.effectiveCurvedThickness,
                  waveCrossSize: model.resolvedLineCrossSize,
                })
              : getPatternStyle({
                  variant: model.variant as SeparatorLineVariant,
                  axis: model.axis,
                  resolvedColor: model.resolvedColor,
                  lineThickness: model.lineThickness,
                })),
            ...(model.fadeEnds
              ? {
                  maskImage: getFadeMask(model.axis),
                  WebkitMaskImage: getFadeMask(model.axis),
                }
              : {}),
            ...model.lineCrossAxisStyle,
            ...style,
          },
    [
      model.shouldUseTailwindGradientFadeForDefaultSolidSeparator,
      model.isVertical,
      model.lineCrossSize,
      style,
      model.curved,
      model.axis,
      model.effectiveCurvedThickness,
      model.resolvedLineCrossSize,
      model.variant,
      model.resolvedColor,
      model.lineThickness,
      model.fadeEnds,
      model.lineCrossAxisStyle,
      resolvedWaveColor.color,
    ],
  )

  const diagonalRootStyle = React.useMemo<React.CSSProperties>(
    () => ({
      height: model.resolvedTrackExtent,
      ...style,
    }),
    [model.resolvedTrackExtent, style],
  )

  const diagonalContainerStyle = React.useMemo<React.CSSProperties>(
    () => ({
      position: "absolute",
      left: "50%",
      top: "50%",
      width: DIAGONAL_LINE_LENGTH,
      height: model.resolvedLineCrossSize,
      transform:
        model.orientation === "diagonal-down"
          ? "translate(-50%, -50%) rotate(45deg)"
          : "translate(-50%, -50%) rotate(-45deg)",
      display: "flex",
      alignItems: "center",
      gap: model.showCenterSlot ? (model.textVariant ? "1rem" : model.centerSize) : "0px",
      ...(model.fadeEnds
        ? {
            maskImage: getFadeMask("horizontal"),
            WebkitMaskImage: getFadeMask("horizontal"),
          }
        : {}),
    }),
    [
      model.fadeEnds,
      model.orientation,
      model.resolvedLineCrossSize,
      model.showCenterSlot,
      model.textVariant,
      model.centerSize,
    ],
  )

  const diagonalLineStyle = React.useMemo<React.CSSProperties>(
    () => ({
      ...(model.curved
        ? getWavePatternStyle({
            axis: "horizontal",
            resolvedColor: resolvedWaveColor.color,
            lineThickness: model.effectiveCurvedThickness,
            waveCrossSize: model.resolvedLineCrossSize,
          })
        : getPatternStyle({
            variant: (model.centerVariant ? "solid" : model.variant) as SeparatorLineVariant,
            axis: "horizontal",
            resolvedColor: model.resolvedColor,
            lineThickness: model.lineThickness,
          })),
      height: "100%",
      flex: 1,
    }),
    [
      model.curved,
      model.effectiveCurvedThickness,
      model.resolvedLineCrossSize,
      model.centerVariant,
      model.variant,
      model.resolvedColor,
      model.lineThickness,
      resolvedWaveColor.color,
    ],
  )

  const centerPlaceholderStyle = React.useMemo<React.CSSProperties>(
    () =>
      model.textVariant
        ? {
            width: `max(3rem, calc(${model.lineThickness} * 14))`,
            height: model.resolvedLineCrossSize,
            flexShrink: 0,
          }
        : {
            width: model.centerSize,
            height: model.centerSize,
            flexShrink: 0,
          },
    [model.centerSize, model.lineThickness, model.resolvedLineCrossSize, model.textVariant],
  )

  const centerStyle = model.textVariant ? textNodeSlotStyle : defaultNodeSlotStyle
  const interactiveDiagonalCenter = isSeparatorIconButtonConfig(model.diagonalCenterContent)

  return {
    centerRootStyle,
    rootStyle,
    segmentLineClasses,
    fadeClasses,
    getSegmentStyle,
    getNodeStyleForSlot,
    diagonalRootStyle,
    diagonalContainerStyle,
    diagonalLineStyle,
    centerPlaceholderStyle,
    centerStyle,
    interactiveDiagonalCenter,
  }
}


