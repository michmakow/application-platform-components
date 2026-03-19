import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import { cn } from "../../lib/utils"
import {
  SeparatorDecoratedTrack,
  SeparatorDiagonalTrack,
  defaultRenderIconButton,
} from "./internal/separator-components"
import { useSeparatorModel } from "./internal/use-separator-model"
import { useSeparatorStyles } from "./internal/use-separator-styles"
import type { SeparatorProps } from "./separator.types"

type SeparatorInternalProps = SeparatorProps & {
  asChild?: boolean
}

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  curved = false,
  fadeEnds = false,
  fadeColorClassName = "via-border",
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
  renderIconButton,
  style,
  asChild,
  ...props
}: SeparatorInternalProps) {
  const iconButtonRenderer = renderIconButton ?? defaultRenderIconButton

  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      return
    }

    if (asChild) {
      console.warn("[Separator] `asChild` is not supported in this wrapper and will be ignored.")
    }
  }, [asChild])

  const model = useSeparatorModel({
    orientation,
    decorative,
    curved,
    fadeEnds,
    color,
    centerColor,
    trackExtent,
    variant,
    thickness,
    ornament,
    icon,
    icons,
    text,
    edgeStart,
    edgeEnd,
    ornamentCount,
    hideCenterContent,
  })

  const styles = useSeparatorStyles({
    model,
    style,
    fadeColorClassName,
  })

  if (model.centerVariant && !model.isDiagonal) {
    return (
      <SeparatorPrimitive.Root
        data-slot="separator"
        data-variant={variant}
        data-fade-ends={fadeEnds}
        data-separator-orientation={orientation}
        decorative={model.effectiveDecorative}
        orientation={model.primitiveOrientation}
        className={cn(
          "shrink-0",
          model.isVertical
            ? "flex h-full flex-col items-center gap-2"
            : "flex w-full items-center gap-2",
          className,
        )}
        style={styles.centerRootStyle}
        {...props}
      >
        <SeparatorDecoratedTrack
          trackItems={model.trackItems}
          segmentLineClasses={styles.segmentLineClasses}
          getSegmentStyle={styles.getSegmentStyle}
          showCenterContent={model.showCenterContent}
          isVertical={model.isVertical}
          getNodeStyleForSlot={styles.getNodeStyleForSlot}
          renderIconButton={iconButtonRenderer}
        />
      </SeparatorPrimitive.Root>
    )
  }

  if (model.isDiagonal) {
    return (
      <SeparatorDiagonalTrack
        orientation={orientation}
        variant={variant}
        fadeEnds={fadeEnds}
        decorative={model.effectiveDecorative}
        className={className}
        rootStyle={styles.diagonalRootStyle}
        diagonalContainerStyle={styles.diagonalContainerStyle}
        diagonalLineStyle={styles.diagonalLineStyle}
        showCenterSlot={model.showCenterSlot}
        centerPlaceholderStyle={styles.centerPlaceholderStyle}
        showCenterContent={model.showCenterContent}
        interactiveCenter={styles.interactiveDiagonalCenter}
        centerStyle={styles.centerStyle}
        centerContent={model.diagonalCenterContent}
        renderIconButton={iconButtonRenderer}
        {...props}
      />
    )
  }

  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      data-variant={variant}
      data-fade-ends={fadeEnds}
      data-separator-orientation={orientation}
      decorative={model.effectiveDecorative}
      orientation={model.primitiveOrientation}
      className={cn(
        "shrink-0",
        model.isVertical ? "h-full" : "w-full",
        model.shouldUseTailwindGradientFadeForDefaultSolidSeparator ? styles.fadeClasses : null,
        className,
      )}
      style={styles.rootStyle}
      {...props}
    />
  )
}

export { Separator }
export {
  SEPARATOR_ORNAMENTS,
  separatorNode,
  type SeparatorDecoration,
  type SeparatorIconButtonConfig,
  type SeparatorNodeDecoration,
  type SeparatorOrientation,
  type SeparatorOrnamentKey,
  type SeparatorProps,
  type SeparatorVariant,
} from "./separator.types"
