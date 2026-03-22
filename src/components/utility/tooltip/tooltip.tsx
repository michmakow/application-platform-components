import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "../../../lib/utils"

export type TooltipContentAnimation =
  | "default"
  | "none"
  | "fade"
  | "zoom"
  | "slide"

type TooltipProviderProps = React.ComponentProps<typeof TooltipPrimitive.Provider>
type TooltipProps = React.ComponentProps<typeof TooltipPrimitive.Root>
type TooltipTriggerProps = React.ComponentProps<typeof TooltipPrimitive.Trigger>
type TooltipSide = NonNullable<React.ComponentProps<typeof TooltipPrimitive.Content>["side"]>

export interface TooltipContentProps extends React.ComponentProps<typeof TooltipPrimitive.Content> {
  animation?: TooltipContentAnimation
  animationDurationMs?: number
}

const TooltipProviderContext = React.createContext(false)

const TOOLTIP_KEYFRAMES_STYLE_ID = "ud-tooltip-animation-keyframes"

const TOOLTIP_ANIMATION_CLASS: Record<TooltipContentAnimation, string> = {
  default:
    "data-[state=instant-open]:![animation:ud-tooltip-default-in_var(--ud-tooltip-animation-duration,180ms)_cubic-bezier(0.16,1,0.3,1)_both] data-[state=delayed-open]:![animation:ud-tooltip-default-in_var(--ud-tooltip-animation-duration,180ms)_cubic-bezier(0.16,1,0.3,1)_both] data-[state=closed]:![animation:ud-tooltip-default-out_var(--ud-tooltip-animation-duration,180ms)_cubic-bezier(0.16,1,0.3,1)_both]",
  none: "![animation:none]",
  fade:
    "data-[state=instant-open]:![animation:ud-tooltip-fade-in_var(--ud-tooltip-animation-duration,180ms)_cubic-bezier(0.16,1,0.3,1)_both] data-[state=delayed-open]:![animation:ud-tooltip-fade-in_var(--ud-tooltip-animation-duration,180ms)_cubic-bezier(0.16,1,0.3,1)_both] data-[state=closed]:![animation:ud-tooltip-fade-out_var(--ud-tooltip-animation-duration,180ms)_cubic-bezier(0.16,1,0.3,1)_both]",
  zoom:
    "data-[state=instant-open]:![animation:ud-tooltip-zoom-in_var(--ud-tooltip-animation-duration,180ms)_cubic-bezier(0.16,1,0.3,1)_both] data-[state=delayed-open]:![animation:ud-tooltip-zoom-in_var(--ud-tooltip-animation-duration,180ms)_cubic-bezier(0.16,1,0.3,1)_both] data-[state=closed]:![animation:ud-tooltip-zoom-out_var(--ud-tooltip-animation-duration,180ms)_cubic-bezier(0.16,1,0.3,1)_both]",
  slide:
    "data-[state=instant-open]:![animation:ud-tooltip-slide-in_var(--ud-tooltip-animation-duration,180ms)_cubic-bezier(0.16,1,0.3,1)_both] data-[state=delayed-open]:![animation:ud-tooltip-slide-in_var(--ud-tooltip-animation-duration,180ms)_cubic-bezier(0.16,1,0.3,1)_both] data-[state=closed]:![animation:ud-tooltip-slide-out_var(--ud-tooltip-animation-duration,180ms)_cubic-bezier(0.16,1,0.3,1)_both]",
}

const TOOLTIP_KEYFRAMES_CSS = `
@keyframes ud-tooltip-default-in {
  from {
    opacity: 0;
    transform: translate3d(var(--ud-tooltip-enter-x, 0px), var(--ud-tooltip-enter-y, 0px), 0) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }
}
@keyframes ud-tooltip-default-out {
  from {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }
  to {
    opacity: 0;
    transform: translate3d(var(--ud-tooltip-enter-x, 0px), var(--ud-tooltip-enter-y, 0px), 0) scale(0.95);
  }
}
@keyframes ud-tooltip-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes ud-tooltip-fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}
@keyframes ud-tooltip-zoom-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes ud-tooltip-zoom-out {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}
@keyframes ud-tooltip-slide-in {
  from {
    opacity: 0;
    transform: translate3d(var(--ud-tooltip-enter-x, 0px), var(--ud-tooltip-enter-y, 0px), 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
@keyframes ud-tooltip-slide-out {
  from {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
  to {
    opacity: 0;
    transform: translate3d(var(--ud-tooltip-enter-x, 0px), var(--ud-tooltip-enter-y, 0px), 0);
  }
}
`

const ensureTooltipKeyframes = () => {
  if (typeof document === "undefined") {
    return
  }

  if (document.getElementById(TOOLTIP_KEYFRAMES_STYLE_ID)) {
    return
  }

  const style = document.createElement("style")
  style.id = TOOLTIP_KEYFRAMES_STYLE_ID
  style.textContent = TOOLTIP_KEYFRAMES_CSS
  document.head.appendChild(style)
}

// Ensure keyframes are available before first tooltip render on the client.
ensureTooltipKeyframes()

const getSideOffset = (side: TooltipSide) => {
  switch (side) {
    case "bottom":
      return { x: "0px", y: "-8px" }
    case "left":
      return { x: "8px", y: "0px" }
    case "right":
      return { x: "-8px", y: "0px" }
    case "top":
    default:
      return { x: "0px", y: "8px" }
  }
}

const TooltipProvider: React.FC<TooltipProviderProps> = ({
  delayDuration = 0,
  ...props
}) => {
  return (
    <TooltipProviderContext.Provider value={true}>
      <TooltipPrimitive.Provider
        data-slot="tooltip-provider"
        delayDuration={delayDuration}
        {...props}
      />
    </TooltipProviderContext.Provider>
  )
}

const Tooltip: React.FC<TooltipProps> = ({ ...props }) => {
  const hasProvider = React.useContext(TooltipProviderContext)

  if (hasProvider) {
    return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
  }

  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  )
}

const TooltipTrigger: React.FC<TooltipTriggerProps> = ({ ...props }) => {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

const TooltipContent: React.FC<TooltipContentProps> = ({
  className,
  style,
  sideOffset = 0,
  animation = "default",
  animationDurationMs = 180,
  children,
  forceMount,
  ...props
}) => {
  const resolvedSide: TooltipSide = props.side ?? "top"
  const offset = getSideOffset(resolvedSide)
  const resolvedAnimationDurationMs = Math.max(0, Math.round(animationDurationMs))
  const resolvedAnimationDuration = `${resolvedAnimationDurationMs}ms`

  const resolvedStyle: React.CSSProperties = {
    "--ud-tooltip-enter-x": offset.x,
    "--ud-tooltip-enter-y": offset.y,
    "--ud-tooltip-animation-duration": resolvedAnimationDuration,
    ...style,
  } as React.CSSProperties

  return (
    <TooltipPrimitive.Portal forceMount={forceMount}>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        data-animation={animation}
        forceMount={forceMount}
        sideOffset={sideOffset}
        className={cn(
          "bg-foreground text-background z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
          TOOLTIP_ANIMATION_CLASS[animation],
          className
        )}
        {...props}
        style={resolvedStyle}
      >
        {children}
        <TooltipPrimitive.Arrow className="bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
