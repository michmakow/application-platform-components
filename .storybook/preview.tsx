import type { Preview } from "@storybook/react"
import { I18nextProvider, initReactI18next } from "react-i18next"
import i18n from "i18next"
import React from "react"
import "../src/storybook.css"

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      "en-US": {
        translation: {
          standardReportModal: {
            unlockDimension: "Unlock dimension",
            lockDimension: "Lock dimension",
            question: "Question",
            answer: "Answer",
            answerPlaceholder: "Type your answer here...",
          },
        },
      },
    },
    fallbackLng: "en-US",
    interpolation: {
      escapeValue: false,
    },
  })
}

const preview: Preview = {
  decorators: [
    (Story) => (
      <I18nextProvider i18n={i18n}>
        <div className="min-h-screen bg-[#0B1526] text-[#E6EBF0] p-6">
          <Story />
        </div>
      </I18nextProvider>
    ),
  ],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
