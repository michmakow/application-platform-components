import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  splitting: false,
  target: "es2019",
  external: [
    "react",
    "react-dom",
    "react-hook-form",
    "react-i18next",
    "i18next",
    "zustand",
    "@radix-ui/react-label",
    "@radix-ui/react-separator",
    "@radix-ui/react-slot",
    "@radix-ui/react-tooltip",
    "class-variance-authority",
    "clsx",
    "date-fns",
    "lucide-react",
    "react-day-picker",
    "tailwind-merge",
  ],
  loader: {
    ".png": "dataurl",
  },
})
