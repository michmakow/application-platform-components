import type { Config } from "tailwindcss"
import tailwindcssRtl from "tailwindcss-rtl"

export default {
  content: ["./src/**/*.{ts,tsx}", "./.storybook/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [tailwindcssRtl],
} satisfies Config
