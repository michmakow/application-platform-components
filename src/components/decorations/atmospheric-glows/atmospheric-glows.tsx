import React from "react"

export const atmosphericGlowsPositions = [
  "top-left",
  "top-center",
  "top-right",
  "right-center",
  "bottom-right",
  "bottom-center",
  "bottom-left",
  "left-center",
  "center",
] as const

export type AtmosphericGlowsPosition = (typeof atmosphericGlowsPositions)[number]

export interface AtmosphericGlowsProps {
  position?: AtmosphericGlowsPosition
}

const positionClasses: Record<
  AtmosphericGlowsPosition,
  { top: string; bottom: string; overlay: string }
> = {
  "top-left": {
    top: "left-[-12%] top-[-18%]",
    bottom: "right-[-18%] bottom-[-28%]",
    overlay:
      "bg-[radial-gradient(circle_at_20%_10%,rgba(255,210,111,0.12),transparent_55%)]",
  },
  "top-center": {
    top: "left-1/2 top-[-18%] -translate-x-1/2",
    bottom: "left-1/2 bottom-[-28%] -translate-x-1/2",
    overlay:
      "bg-[radial-gradient(circle_at_50%_10%,rgba(255,210,111,0.12),transparent_55%)]",
  },
  "top-right": {
    top: "right-[-12%] top-[-18%]",
    bottom: "left-[-18%] bottom-[-28%]",
    overlay:
      "bg-[radial-gradient(circle_at_80%_10%,rgba(255,210,111,0.12),transparent_55%)]",
  },
  "right-center": {
    top: "right-[-12%] top-1/2 -translate-y-1/2",
    bottom: "left-[-18%] top-1/2 -translate-y-1/2",
    overlay:
      "bg-[radial-gradient(circle_at_90%_50%,rgba(255,210,111,0.12),transparent_55%)]",
  },
  "bottom-right": {
    top: "right-[-12%] bottom-[-28%]",
    bottom: "left-[-18%] top-[-18%]",
    overlay:
      "bg-[radial-gradient(circle_at_80%_90%,rgba(255,210,111,0.12),transparent_55%)]",
  },
  "bottom-center": {
    top: "left-1/2 bottom-[-28%] -translate-x-1/2",
    bottom: "left-1/2 top-[-18%] -translate-x-1/2",
    overlay:
      "bg-[radial-gradient(circle_at_50%_90%,rgba(255,210,111,0.12),transparent_55%)]",
  },
  "bottom-left": {
    top: "left-[-12%] bottom-[-28%]",
    bottom: "right-[-18%] top-[-18%]",
    overlay:
      "bg-[radial-gradient(circle_at_20%_90%,rgba(255,210,111,0.12),transparent_55%)]",
  },
  "left-center": {
    top: "left-[-12%] top-1/2 -translate-y-1/2",
    bottom: "right-[-18%] top-1/2 -translate-y-1/2",
    overlay:
      "bg-[radial-gradient(circle_at_10%_50%,rgba(255,210,111,0.12),transparent_55%)]",
  },
  center: {
    top: "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
    bottom: "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
    overlay:
      "bg-[radial-gradient(circle_at_50%_50%,rgba(255,210,111,0.12),transparent_55%)]",
  },
}

export const AtmosphericGlows: React.FC<AtmosphericGlowsProps> = ({ position = "top-right" }) => {
  const classes = positionClasses[position]

  return (
    <div
      data-slot="atmospheric-glows"
      data-position={position}
      className="pointer-events-none absolute inset-0 opacity-80"
    >
      <div
        data-layer="top"
        className={`absolute ${classes.top} h-72 w-72 rounded-full bg-[#E6C36A]/14 blur-[140px]`}
      />
      <div
        data-layer="bottom"
        className={`absolute ${classes.bottom} h-96 w-96 rounded-full bg-[#0E1F33]/45 blur-[160px]`}
      />
      <div data-layer="overlay" className={`absolute inset-0 ${classes.overlay} mix-blend-screen`} />
    </div>
  )
}
