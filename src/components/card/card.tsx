import * as React from "react"

import { cn } from "../../lib/utils"

export type CardRounded = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl"
export type CardShadow = "none" | "sm" | "md" | "lg" | "xl"

const CARD_ROUNDED_CLASS: Record<CardRounded, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
}

const CARD_SHADOW_LEVEL: Record<CardShadow, string> = {
  none: "none",
  sm: "0 2px 8px -4px",
  md: "0 10px 24px -12px",
  lg: "0 18px 38px -18px",
  xl: "0 26px 52px -22px",
}

export interface CardProps extends React.ComponentProps<"div"> {
  glow?: boolean
  border?: boolean
  rounded?: CardRounded
  borderColor?: string
  shadow?: CardShadow
  shadowColor?: string
}

type CardDivProps = React.ComponentProps<"div">
type CardTitleProps = React.ComponentProps<"h3">
type CardDescriptionProps = React.ComponentProps<"p">

const Card: React.FC<CardProps> = ({
  className,
  style,
  glow = false,
  border = true,
  rounded = "xl",
  borderColor,
  shadow = "sm",
  shadowColor,
  ...props
}) => {
  const resolvedShadowColor = shadowColor || "rgba(15, 23, 42, 0.26)"
  const baseShadow = CARD_SHADOW_LEVEL[shadow]
  const baseShadowValue = baseShadow === "none" ? null : `${baseShadow} ${resolvedShadowColor}`
  const glowValue = glow ? `0 0 28px ${resolvedShadowColor}` : null
  const boxShadow = [baseShadowValue, glowValue].filter(Boolean).join(", ")

  const resolvedStyle: React.CSSProperties = {
    ...(borderColor ? { borderColor } : null),
    boxShadow: boxShadow || "none",
    ...style,
  }

  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 py-6",
        border ? "border" : "border-0",
        CARD_ROUNDED_CLASS[rounded],
        className
      )}
      style={resolvedStyle}
      {...props}
    />
  )
}

const CardHeader: React.FC<CardDivProps> = ({ className, ...props }) => {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

const CardTitle: React.FC<CardTitleProps> = ({ className, ...props }) => {
  return (
    <h3
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

const CardDescription: React.FC<CardDescriptionProps> = ({ className, ...props }) => {
  return (
    <p
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

const CardAction: React.FC<CardDivProps> = ({ className, ...props }) => {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

const CardContent: React.FC<CardDivProps> = ({ className, ...props }) => {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

const CardFooter: React.FC<CardDivProps> = ({ className, ...props }) => {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
