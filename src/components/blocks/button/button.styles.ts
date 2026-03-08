import { cva } from "class-variance-authority"

import { buttonTokens } from "./button.tokens"

export const buttonVariants = cva(
  [
    buttonTokens.baseSurface,
    buttonTokens.baseText,
    buttonTokens.baseBorder,
    buttonTokens.ring,
    "relative inline-flex items-center justify-center whitespace-nowrap font-semibold leading-none",
    "select-none transition-[transform,box-shadow,background-color,border-color,color,opacity] duration-200 ease-out",
    "focus-visible:outline-none",
    "disabled:pointer-events-none disabled:opacity-60 disabled:cursor-not-allowed",
    "aria-disabled:pointer-events-none aria-disabled:opacity-60 aria-disabled:cursor-not-allowed",
    "data-[loading=true]:cursor-wait",
    "data-[glow=true]:ring-1 data-[glow=true]:ring-[#E6C36A]/20",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: buttonTokens.variant.primary,
        secondary: buttonTokens.variant.secondary,
        ghost: buttonTokens.variant.ghost,
        danger: buttonTokens.variant.danger,
        link: buttonTokens.variant.link,
      },
      intent: {
        default: buttonTokens.intent.default,
        positive: buttonTokens.intent.positive,
        negative: buttonTokens.intent.negative,
        warning: buttonTokens.intent.warning,
        info: buttonTokens.intent.info,
      },
      size: {
        xs: "h-8 px-2.5 text-xs [&_[data-slot=content]]:gap-1.5 [&_[data-slot=icon]]:size-3.5 [&_[data-slot=spinner]]:size-3.5",
        sm: "h-9 px-3 text-sm [&_[data-slot=content]]:gap-2 [&_[data-slot=icon]]:size-4 [&_[data-slot=spinner]]:size-4",
        md: "h-10 px-4 text-sm [&_[data-slot=content]]:gap-2.5 [&_[data-slot=icon]]:size-4 [&_[data-slot=spinner]]:size-4",
        lg: "h-12 px-5 text-base [&_[data-slot=content]]:gap-3 [&_[data-slot=icon]]:size-5 [&_[data-slot=spinner]]:size-5",
      },
      rounded: {
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-full",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
      elevated: {
        true: buttonTokens.elevated,
        false: "",
      },
      glowIntensity: {
        none: "",
        soft: "",
        medium: "",
        strong: "",
      },
    },
    compoundVariants: [
      { variant: "link", className: "!h-auto !px-0" },
      { variant: "link", size: "xs", className: "text-xs" },
      { variant: "link", size: "sm", className: "text-sm" },
      { variant: "link", size: "md", className: "text-sm" },
      { variant: "link", size: "lg", className: "text-base" },
      { glowIntensity: "soft", className: buttonTokens.glow.soft },
      { glowIntensity: "medium", className: buttonTokens.glow.medium },
      { glowIntensity: "strong", className: buttonTokens.glow.strong },
      { elevated: true, glowIntensity: "soft", className: buttonTokens.elevatedGlow.soft },
      { elevated: true, glowIntensity: "medium", className: buttonTokens.elevatedGlow.medium },
      { elevated: true, glowIntensity: "strong", className: buttonTokens.elevatedGlow.strong },
    ],
    defaultVariants: {
      variant: "primary",
      intent: "default",
      size: "md",
      rounded: "lg",
      fullWidth: false,
      elevated: false,
      glowIntensity: "none",
    },
  }
)

export const buttonSlotClasses = {
  content: "relative inline-flex items-center justify-center transition-opacity",
  overlay: "pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity",
} as const
