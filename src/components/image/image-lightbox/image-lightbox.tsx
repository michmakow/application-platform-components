import { useEffect, useState } from "react"

export type HintSize = "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl"

export type ImageLightboxProps = {
  src: string
  alt: string
  className?: string
  hint?: string
  hintSize?: HintSize
}

const ANIMATION_MS = 150
const hintSizeClasses: Record<HintSize, string> = {
  xs: "text-[11px]",
  sm: "text-xs",
  base: "text-sm",
  lg: "text-base",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
}

export const ImageLightbox = ({
  src,
  alt,
  className,
  hint = "Click to enlarge",
  hintSize = "xs",
}: ImageLightboxProps) => {
  const [isRendered, setIsRendered] = useState(false)
  const [motion, setMotion] = useState<"enter" | "exit">("exit")

  const open = () => {
    setIsRendered(true)
    requestAnimationFrame(() => setMotion("enter"))
  }

  const close = () => {
    setMotion("exit")
    window.setTimeout(() => setIsRendered(false), ANIMATION_MS)
  }

  useEffect(() => {
    if (!isRendered) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isRendered])

  const overlayOpacity = motion === "enter" ? "opacity-100" : "opacity-0"
  const imageMotion = motion === "enter" ? "opacity-100 scale-100" : "opacity-0 scale-[0.98]"

  return (
    <div className="flex flex-col items-center gap-2">
      <button type="button" onClick={open} className="cursor-zoom-in">
        <img
          src={src}
          alt={alt}
          className={`rounded-xl border border-[#E6C36A]/25 shadow-[0_0_20px_rgba(230,195,106,0.22)] transition-shadow duration-200 hover:shadow-[0_0_28px_rgba(230,195,106,0.35)] ${className ?? ""}`}
        />
      </button>
      <p className={`${hintSizeClasses[hintSize]} text-muted-foreground`}>{hint}</p>

      {isRendered ? (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-150 ${overlayOpacity}`}
          onClick={close}
        >
          <div className="px-4 py-6" onClick={(event) => event.stopPropagation()}>
            <img
              src={src}
              alt={alt}
              className={`max-h-[90vh] max-w-[90vw] rounded-2xl object-contain shadow-[0_30px_80px_rgba(0,0,0,0.55)] transition-all duration-150 ${imageMotion}`}
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}

export type ImageViewerProps = ImageLightboxProps
export const ImageViewer = ImageLightbox
