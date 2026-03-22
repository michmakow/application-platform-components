import type { StorybookConfig } from "@storybook/react-vite"
import { fileURLToPath } from "node:url"
import { mergeConfig } from "vite"
import tailwindcss from "@tailwindcss/vite"

const mdxShimUrl = new URL(
  "../node_modules/@storybook/addon-docs/dist/mdx-react-shim.js",
  import.meta.url
).href
const mdxShimPath = fileURLToPath(
  new URL("../node_modules/@storybook/addon-docs/dist/mdx-react-shim.js", import.meta.url)
)

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-docs"],

  framework: {
    name: "@storybook/react-vite",
    options: {},
  },

  viteFinal: async (config) =>
    mergeConfig(config, {
      plugins: [tailwindcss()],
      resolve: {
        alias: [
          { find: mdxShimUrl, replacement: mdxShimPath },
          {
            find: /^file:\/\/\/.*\/node_modules\/@storybook\/addon-docs\/dist\/mdx-react-shim\.js$/i,
            replacement: mdxShimPath,
          },
        ],
      },
    })
}

export default config
