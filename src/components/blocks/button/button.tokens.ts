export const buttonTokens = {
  baseSurface: "bg-secondary/90",
  baseText: "text-foreground",
  baseBorder: "border border-border/70",
  ring:
    "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  variant: {
    primary:
      "bg-gradient-to-b from-primary/95 to-primary/80 text-primary-foreground border border-primary/70 hover:from-primary hover:to-primary/85 active:from-primary/90 active:to-primary/75",
    secondary:
      "bg-gradient-to-b from-secondary/95 to-secondary/80 text-secondary-foreground border border-border/70 hover:from-secondary/90 hover:to-secondary/70 active:from-secondary/85 active:to-secondary/65",
    ghost:
      "bg-transparent text-foreground border border-transparent hover:bg-white/5 active:bg-white/10",
    danger:
      "bg-gradient-to-b from-destructive/95 to-destructive/80 text-destructive-foreground border border-destructive/70 hover:from-destructive hover:to-destructive/85 active:from-destructive/90 active:to-destructive/75",
    link:
      "bg-transparent text-primary border border-transparent underline-offset-4 hover:underline hover:text-primary/85 active:text-primary/75",
  },
  intent: {
    default: "",
    positive:
      "data-[variant=primary]:border-emerald-300/60 data-[variant=secondary]:border-emerald-400/40 data-[variant=secondary]:text-emerald-50 data-[variant=ghost]:text-emerald-200 data-[variant=ghost]:hover:text-emerald-100 data-[variant=link]:text-emerald-300",
    negative:
      "data-[variant=primary]:border-rose-300/60 data-[variant=secondary]:border-rose-400/40 data-[variant=secondary]:text-rose-50 data-[variant=ghost]:text-rose-200 data-[variant=ghost]:hover:text-rose-100 data-[variant=link]:text-rose-300",
    warning:
      "data-[variant=primary]:border-amber-300/60 data-[variant=secondary]:border-amber-400/40 data-[variant=secondary]:text-amber-50 data-[variant=ghost]:text-amber-200 data-[variant=ghost]:hover:text-amber-100 data-[variant=link]:text-amber-300",
    info:
      "data-[variant=primary]:border-sky-300/60 data-[variant=secondary]:border-sky-400/40 data-[variant=secondary]:text-sky-50 data-[variant=ghost]:text-sky-200 data-[variant=ghost]:hover:text-sky-100 data-[variant=link]:text-sky-300",
  },
  glow: {
    soft: "shadow-[0_0_12px_rgba(230,195,106,0.22)]",
    medium: "shadow-[0_0_20px_rgba(230,195,106,0.3)]",
    strong: "shadow-[0_0_32px_rgba(230,195,106,0.38)]",
  },
  elevated: "shadow-[0_12px_30px_rgba(0,0,0,0.35)]",
  elevatedGlow: {
    soft: "shadow-[0_12px_30px_rgba(0,0,0,0.35),0_0_12px_rgba(230,195,106,0.22)]",
    medium: "shadow-[0_12px_30px_rgba(0,0,0,0.35),0_0_20px_rgba(230,195,106,0.3)]",
    strong: "shadow-[0_12px_30px_rgba(0,0,0,0.35),0_0_32px_rgba(230,195,106,0.38)]",
  },
} as const
