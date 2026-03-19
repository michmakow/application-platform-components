import * as React from "react"
import { cn } from "../../lib/utils"
import { Button, type ButtonIconButtonProps } from "../blocks/button"
import type {
  SeparatorIconButtonConfig,
  SeparatorIconButtonSize,
  SeparatorIconButtonVariant,
} from "./separator.types"

const actionButtonVariantMap: Record<SeparatorIconButtonVariant, ButtonIconButtonProps["variant"]> = {
  ghost: "utility",
  outline: "secondary",
  solid: "primary",
}

const actionButtonSizeMap: Record<SeparatorIconButtonSize, ButtonIconButtonProps["size"]> = {
  xs: "xs",
  sm: "sm",
  md: "md",
  lg: "lg",
}

export const resolveSeparatorActionButtonVariant = (
  variant: SeparatorIconButtonVariant | undefined,
): ButtonIconButtonProps["variant"] => (variant ? actionButtonVariantMap[variant] : "secondary")

export const resolveSeparatorActionButtonSize = (
  size: SeparatorIconButtonSize | undefined,
): ButtonIconButtonProps["size"] => (size ? actionButtonSizeMap[size] : "xs")

export interface SeparatorActionButtonProps {
  config: SeparatorIconButtonConfig
}

export const SeparatorActionButton = ({ config }: SeparatorActionButtonProps) => {
  const label = config.alt ?? config.title ?? config.id
  const title = config.title ?? label

  return (
    <Button.IconButton
      id={config.id}
      icon={config.icon}
      alt={label}
      title={title}
      description={config.description ?? "Separator action"}
      onClick={config.onClick}
      active={config.active}
      showDot={config.showDot}
      dotTitle={config.dotTitle}
      badgeContent={config.badgeContent}
      comingSoon={config.comingSoon}
      disabled={config.disabled}
      variant={resolveSeparatorActionButtonVariant(config.variant)}
      size={resolveSeparatorActionButtonSize(config.size)}
      className={cn("!rounded-full !p-1.5 sm:!p-1.5", config.className)}
    />
  )
}

export const renderSeparatorActionButton = (config: SeparatorIconButtonConfig): React.ReactNode => (
  <SeparatorActionButton config={config} />
)
