import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import { cn } from "../../../lib/utils"
import type {
  SeparatorDecoration,
  SeparatorIconButtonConfig,
  SeparatorVariant,
} from "../separator.types"
import type { DecoratedTrackSlot, TrackItem } from "../separator.utils"

const sizeClassMap: Record<string, string> = {
  xs: "h-6 w-6 text-[11px]",
  sm: "h-7 w-7 text-xs",
  md: "h-8 w-8 text-sm",
  lg: "h-9 w-9 text-base",
}

const variantClassMap: Record<string, string> = {
  ghost: "border-transparent bg-transparent",
  outline: "border-current/35 bg-transparent",
  solid: "border-transparent bg-current text-background",
}

const isSeparatorNodeDecoration = (
  value: SeparatorDecoration | null | undefined,
): value is Extract<SeparatorDecoration, { kind: "node" }> => value?.kind === "node"

export const isSeparatorIconButtonConfig = (
  value: SeparatorDecoration | null | undefined,
): value is SeparatorIconButtonConfig => value?.kind === "icon-button"

export const defaultRenderIconButton = (config: SeparatorIconButtonConfig): React.ReactNode => {
  const label = config.alt ?? config.title ?? config.id
  const baseTitle = config.title ?? label
  const comingSoon = config.comingSoon
  const canInteract = !config.disabled && !comingSoon
  const sizeClass = sizeClassMap[config.size ?? "xs"] ?? sizeClassMap.xs
  const variantClass = variantClassMap[config.variant ?? "outline"] ?? variantClassMap.outline
  const title = comingSoon ? `${baseTitle} (${comingSoon})` : baseTitle
  const description = config.description ?? (comingSoon ? `Coming soon: ${comingSoon}` : undefined)
  const accessibleLabel = description ? `${label}. ${description}` : label

  return (
    <button
      type="button"
      aria-label={accessibleLabel}
      aria-description={description}
      title={title}
      onClick={canInteract ? config.onClick : undefined}
      disabled={!canInteract}
      aria-current={config.active ? "page" : undefined}
      className={cn(
        "relative inline-flex items-center justify-center rounded-full border text-current",
        sizeClass,
        variantClass,
        config.className,
      )}
    >
      {config.icon}
      {config.showDot ? (
        <span
          title={config.dotTitle}
          className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-current"
        />
      ) : null}
      {config.badgeContent !== undefined && config.badgeContent !== null ? (
        <span className="absolute -right-1.5 -top-1.5 rounded-full bg-current px-1 text-[9px] font-medium leading-3 text-background">
          {config.badgeContent}
        </span>
      ) : null}
    </button>
  )
}

interface SeparatorLineProps {
  className: string
  style: React.CSSProperties
}

export const SeparatorLine = ({ className, style }: SeparatorLineProps) => (
  <span className={className} style={style} />
)

interface SeparatorCenterContentProps {
  decoration: SeparatorDecoration | null | undefined
  fallbackLabel: string
  renderIconButton: (config: SeparatorIconButtonConfig) => React.ReactNode
}

export const SeparatorCenterContent = ({
  decoration,
  fallbackLabel,
  renderIconButton,
}: SeparatorCenterContentProps): React.ReactNode => {
  if (!decoration) {
    return null
  }

  if (isSeparatorIconButtonConfig(decoration)) {
    return renderIconButton({
      ...decoration,
      title: decoration.title ?? decoration.alt ?? fallbackLabel,
      description: decoration.description ?? "Separator action",
    })
  }

  if (isSeparatorNodeDecoration(decoration)) {
    return decoration.content
  }

  return null
}

interface SeparatorDecoratedTrackProps {
  trackItems: TrackItem<SeparatorDecoration | null>[]
  segmentLineClasses: string
  getSegmentStyle: (lineIndex: number) => React.CSSProperties
  showCenterContent: boolean
  isVertical: boolean
  getNodeStyleForSlot: (slot: DecoratedTrackSlot<SeparatorDecoration | null>) => React.CSSProperties
  renderIconButton: (config: SeparatorIconButtonConfig) => React.ReactNode
}

export const SeparatorDecoratedTrack = ({
  trackItems,
  segmentLineClasses,
  getSegmentStyle,
  showCenterContent,
  isVertical,
  getNodeStyleForSlot,
  renderIconButton,
}: SeparatorDecoratedTrackProps) => (
  <>
    {trackItems.map((item) => {
      if (item.kind === "line") {
        return (
          <SeparatorLine
            key={item.key}
            className={segmentLineClasses}
            style={getSegmentStyle(item.lineIndex)}
          />
        )
      }

      const { slot } = item
      const interactive = isSeparatorIconButtonConfig(slot.content)

      return (
        <span
          key={slot.key}
          aria-hidden={slot.kind === "center" ? !showCenterContent : undefined}
          className={cn(
            "inline-flex items-center justify-center leading-none",
            isVertical ? "text-sm" : "text-xs",
          )}
          style={interactive ? undefined : getNodeStyleForSlot(slot)}
        >
          <SeparatorCenterContent
            decoration={slot.content}
            fallbackLabel={slot.key}
            renderIconButton={renderIconButton}
          />
        </span>
      )
    })}
  </>
)

interface SeparatorDiagonalTrackProps
  extends Omit<React.ComponentProps<typeof SeparatorPrimitive.Root>, "orientation"> {
  orientation: "diagonal-down" | "diagonal-up"
  variant: SeparatorVariant
  fadeEnds: boolean
  decorative: boolean
  className?: string
  rootStyle?: React.CSSProperties
  diagonalContainerStyle: React.CSSProperties
  diagonalLineStyle: React.CSSProperties
  showCenterSlot: boolean
  centerPlaceholderStyle: React.CSSProperties
  showCenterContent: boolean
  interactiveCenter: boolean
  centerStyle: React.CSSProperties
  centerContent: SeparatorDecoration | null
  renderIconButton: (config: SeparatorIconButtonConfig) => React.ReactNode
}

export const SeparatorDiagonalTrack = ({
  orientation,
  variant,
  fadeEnds,
  decorative,
  className,
  rootStyle,
  diagonalContainerStyle,
  diagonalLineStyle,
  showCenterSlot,
  centerPlaceholderStyle,
  showCenterContent,
  interactiveCenter,
  centerStyle,
  centerContent,
  renderIconButton,
  ...props
}: SeparatorDiagonalTrackProps) => (
  <SeparatorPrimitive.Root
    data-slot="separator"
    data-variant={variant}
    data-fade-ends={fadeEnds}
    data-separator-orientation={orientation}
    decorative={decorative}
    orientation="horizontal"
    className={cn("relative w-full shrink-0 overflow-hidden", className)}
    style={rootStyle}
    {...props}
  >
    <span aria-hidden="true" className="pointer-events-none absolute inset-0">
      <span style={diagonalContainerStyle}>
        <span style={diagonalLineStyle} />
        {showCenterSlot ? <span style={centerPlaceholderStyle} /> : null}
        <span style={diagonalLineStyle} />
      </span>
    </span>
    {showCenterContent ? (
      <span
        className={cn(
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          interactiveCenter ? null : "pointer-events-none text-sm leading-none",
        )}
        style={interactiveCenter ? undefined : centerStyle}
      >
        <SeparatorCenterContent
          decoration={centerContent}
          fallbackLabel="diagonal-center"
          renderIconButton={renderIconButton}
        />
      </span>
    ) : null}
  </SeparatorPrimitive.Root>
)
