const baseSupportedLngs = [
  "en-US",
  "es-ES",
  "fr-FR",
  "ar-SA",
  "pt-PT",
  "de-DE",
  "it-IT",
  "nl-NL",
  "pl-PL",
  "uk-UA",
  "ru-RU",
  "tr-TR",
  "zh-CN",
  "ja-JP",
  "ko-KR",
  "hi-IN",
  "bn-BD",
  "ur-PK",
  "id-ID",
  "vi-VN",
  "th-TH",
  "sw-KE",
  "am-ET",
  "he-IL",
  "fa-IR",
  "ms-MY",
  "ro-RO",
  "cs-CZ",
  "pt-BR",
  "es-MX",
] as const

// Add underscore aliases (pl_PL) and base language codes (pl) to match navigator/localStorage formats.
const supportedLngs = [
  ...baseSupportedLngs,
  ...baseSupportedLngs.map((lng) => lng.replace("-", "_")),
  ...Array.from(new Set(baseSupportedLngs.map((lng) => lng.split("-")[0]))),
] as const

export type SupportedLanguage = (typeof supportedLngs)[number]

export { supportedLngs }
