import type { Config } from "tailwindcss"

const withAlpha = (name: string) => `rgb(var(--${name}) / <alpha-value>)`

export default {
  content: ["./src/**/*.{ts,tsx}", "./.storybook/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: withAlpha("border"),
        input: withAlpha("input"),
        ring: withAlpha("ring"),
        background: withAlpha("background"),
        foreground: withAlpha("foreground"),
        primary: {
          DEFAULT: withAlpha("primary"),
          foreground: withAlpha("primary-foreground"),
        },
        secondary: {
          DEFAULT: withAlpha("secondary"),
          foreground: withAlpha("secondary-foreground"),
        },
        destructive: {
          DEFAULT: withAlpha("destructive"),
          foreground: withAlpha("destructive-foreground"),
        },
        muted: {
          DEFAULT: withAlpha("muted"),
          foreground: withAlpha("muted-foreground"),
        },
        accent: {
          DEFAULT: withAlpha("accent"),
          foreground: withAlpha("accent-foreground"),
        },
        card: {
          DEFAULT: withAlpha("card"),
          foreground: withAlpha("card-foreground"),
        },
        popover: {
          DEFAULT: withAlpha("popover"),
          foreground: withAlpha("popover-foreground"),
        },
      },
    },
  },
  plugins: [],
} satisfies Config
