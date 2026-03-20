import React from "react"
import { cn } from "../../../lib/utils"
import { useScopedUtilityStore } from "../../../store/utility/utility-store-provider"

const DEFAULT_OVERLAY_COLOR = "rgba(0, 6, 15, 0.75)"
const DEFAULT_SPINNER_COLOR = "rgba(230, 195, 106, 0.8)"
const DEFAULT_SPINNER_GLOW_COLOR = "rgba(230, 195, 106, 0.45)"
const DEFAULT_SPINNER_SIZE = 56
const DEFAULT_SPINNER_THICKNESS = 2

export type GlobalLoadingOverlaySpinnerShape = "circle" | "rounded" | "square"
export type GlobalLoadingOverlaySpinnerAnimation = "spin" | "orbit-wave" | "orbit-pulse"

const SPINNER_SHAPE_CLASS: Record<GlobalLoadingOverlaySpinnerShape, string> = {
  circle: "rounded-full",
  rounded: "rounded-xl",
  square: "rounded-none",
}

const SPINNER_ORBIT_DURATION_MS = 1450
const SPINNER_PULSE_DOT_DURATION_MS = 1350
const SPINNER_WAVE_BREATH_DURATION_MS = 1800
const SPINNER_WAVE_SEGMENTS = 14
const SPINNER_WAVE_STEPS = 180
const OVERLAY_BLUR_MAX_PX = 6
const SPINNER_ORBIT_REVERSE_MULTIPLIER = 1.35
const VISUALLY_HIDDEN_STYLE: React.CSSProperties = {
  border: 0,
  clip: "rect(0 0 0 0)",
  height: "1px",
  margin: "-1px",
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  whiteSpace: "nowrap",
  width: "1px",
}

const buildWavePath = (
  radius: number,
  amplitude: number,
  segments: number,
  steps: number,
  phase = 0
) => {
  const commands: string[] = []
  for (let index = 0; index <= steps; index += 1) {
    const theta = (index / steps) * Math.PI * 2
    const localRadius = radius + amplitude * Math.sin(theta * segments + phase)
    const x = 50 + localRadius * Math.cos(theta)
    const y = 50 + localRadius * Math.sin(theta)
    commands.push(`${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`)
  }
  return `${commands.join(" ")} Z`
}

export interface GlobalLoadingOverlayProps {
  overlayColor?: string
  overlayOpacity?: number
  statusMessage?: string
  spinnerColor?: string
  spinnerGlowColor?: string
  spinnerShape?: GlobalLoadingOverlaySpinnerShape
  spinnerAnimation?: GlobalLoadingOverlaySpinnerAnimation
  spinnerCenterContent?: React.ReactNode
  spinnerSize?: number
  spinnerThickness?: number
  overlayClassName?: string
  spinnerClassName?: string
}

export const GlobalLoadingOverlay: React.FC<GlobalLoadingOverlayProps> = ({
  overlayColor = DEFAULT_OVERLAY_COLOR,
  overlayOpacity = 1,
  statusMessage = "Loading",
  spinnerColor = DEFAULT_SPINNER_COLOR,
  spinnerGlowColor = DEFAULT_SPINNER_GLOW_COLOR,
  spinnerShape = "circle",
  spinnerAnimation = "spin",
  spinnerCenterContent,
  spinnerSize = DEFAULT_SPINNER_SIZE,
  spinnerThickness = DEFAULT_SPINNER_THICKNESS,
  overlayClassName,
  spinnerClassName,
}) => {
  const isLoading = useScopedUtilityStore((state) => state.overlaySpinner.isLoading)
  const waveStrokeWidth = Math.max(1.2, spinnerThickness * 0.92)
  const waveAmplitude = Math.max(1.2, spinnerThickness * 0.95)
  const waveRadius = Math.max(26, 50 - waveAmplitude - waveStrokeWidth * 0.9)
  const wavePrimaryPath = buildWavePath(
    waveRadius,
    waveAmplitude,
    SPINNER_WAVE_SEGMENTS,
    SPINNER_WAVE_STEPS
  )
  const waveSecondaryPath = buildWavePath(
    waveRadius,
    waveAmplitude * 0.82,
    SPINNER_WAVE_SEGMENTS,
    SPINNER_WAVE_STEPS,
    Math.PI / SPINNER_WAVE_SEGMENTS
  )
  const pulseDotSize = Math.max(6, Math.round(spinnerThickness * 2 + spinnerSize * 0.08))
  const clampedOverlayOpacity = Math.min(1, Math.max(0, overlayOpacity))
  const overlayBlurPx = Number((OVERLAY_BLUR_MAX_PX * clampedOverlayOpacity).toFixed(2))
  const orbitReverseDurationMs = Math.round(SPINNER_ORBIT_DURATION_MS * SPINNER_ORBIT_REVERSE_MULTIPLIER)

  return isLoading ? (
    <div
      className={cn(
        "fixed inset-0 z-[200] relative flex items-center justify-center",
        overlayClassName
      )}
      data-slot="global-loading-overlay"
      role="status"
      aria-live="polite"
      style={{
        backdropFilter: `blur(${overlayBlurPx}px)`,
        WebkitBackdropFilter: `blur(${overlayBlurPx}px)`,
      }}
    >
      <span
        className="absolute inset-0"
        data-slot="global-loading-overlay-backdrop"
        style={{ backgroundColor: overlayColor, opacity: clampedOverlayOpacity }}
      />
      <span data-slot="global-loading-overlay-status-text" style={VISUALLY_HIDDEN_STYLE}>
        {statusMessage}
      </span>
      <div className="relative z-[1] flex flex-col items-center gap-3">
        <span
          className="relative inline-flex items-center justify-center"
          data-slot="global-loading-spinner-wrapper"
          style={{ width: spinnerSize, height: spinnerSize }}
        >
          <span
            className={cn(
              "absolute inset-0 border-t-transparent",
              spinnerAnimation === "spin" && "animate-spin",
              SPINNER_SHAPE_CLASS[spinnerShape],
              spinnerClassName
            )}
            data-slot="global-loading-spinner"
            data-animation={spinnerAnimation}
            data-shape={spinnerShape}
            style={{
              borderColor: spinnerAnimation === "orbit-wave" ? "transparent" : spinnerColor,
              borderTopColor: spinnerAnimation === "spin" ? "transparent" : spinnerColor,
              borderWidth: spinnerAnimation === "orbit-wave" ? 0 : spinnerThickness,
              boxShadow:
                spinnerAnimation === "orbit-wave"
                  ? "none"
                  : `0 0 18px ${spinnerGlowColor}`,
            }}
          />
          {spinnerAnimation === "orbit-wave" ? (
            <span
              className="absolute inset-0 animate-pulse"
              data-slot="global-loading-spinner-wave"
              style={{
                animationDuration: `${SPINNER_WAVE_BREATH_DURATION_MS}ms`,
                animationTimingFunction: "ease-in-out",
              }}
            >
              <svg
                className="h-full w-full"
                viewBox="0 0 100 100"
                data-slot="global-loading-spinner-wave-svg"
                aria-hidden="true"
              >
                <g
                  className="animate-spin"
                  style={{
                    transformOrigin: "50% 50%",
                    animationDuration: `${SPINNER_ORBIT_DURATION_MS}ms`,
                  }}
                >
                  <path
                    d={wavePrimaryPath}
                    fill="none"
                    stroke={spinnerColor}
                    strokeWidth={waveStrokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={0.95}
                    style={{ filter: `drop-shadow(0 0 7px ${spinnerGlowColor})` }}
                    data-slot="global-loading-spinner-wave-path"
                  />
                </g>
                <g
                  className="animate-spin"
                  style={{
                    transformOrigin: "50% 50%",
                    animationDuration: `${orbitReverseDurationMs}ms`,
                    animationDirection: "reverse",
                  }}
                >
                  <path
                    d={waveSecondaryPath}
                    fill="none"
                    stroke={spinnerColor}
                    strokeWidth={Math.max(1, waveStrokeWidth * 0.8)}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={0.45}
                    style={{ filter: `drop-shadow(0 0 5px ${spinnerGlowColor})` }}
                    data-slot="global-loading-spinner-wave-path"
                  />
                </g>
              </svg>
            </span>
          ) : spinnerAnimation === "orbit-pulse" ? (
            <span
              className="absolute inset-0 animate-spin"
              data-slot="global-loading-spinner-orbit"
              style={{
                animationDuration: `${SPINNER_ORBIT_DURATION_MS}ms`,
              }}
            >
              <span
                className="absolute left-1/2 top-0 rounded-full -translate-x-1/2 animate-pulse"
                data-slot="global-loading-spinner-orbit-dot"
                style={{
                  width: pulseDotSize,
                  height: pulseDotSize,
                  backgroundColor: spinnerColor,
                  boxShadow: `0 0 14px ${spinnerGlowColor}`,
                  animationDuration: `${SPINNER_PULSE_DOT_DURATION_MS}ms`,
                }}
              />
            </span>
          ) : null}
          {spinnerCenterContent ? (
            <span
              className="relative z-[1] inline-flex items-center justify-center text-xs font-semibold"
              data-slot="global-loading-spinner-center"
              aria-hidden="true"
              style={{ color: spinnerColor }}
            >
              {spinnerCenterContent}
            </span>
          ) : null}
        </span>
      </div>
    </div>
  ) : null
}
