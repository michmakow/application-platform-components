import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { supportedLngs } from "../../../lib/i18n"
import { Dropdown, type DropdownOption, type DropdownValue } from "../../dropdown"

import enUS from "../../../assets/flags/en-US.png"
import esES from "../../../assets/flags/es-ES.png"
import frFR from "../../../assets/flags/fr-FR.png"
import arSA from "../../../assets/flags/ar-SA.png"
import ptPT from "../../../assets/flags/pt-PT.png"
import deDE from "../../../assets/flags/de-DE.png"
import itIT from "../../../assets/flags/it-IT.png"
import nlNL from "../../../assets/flags/nl-NL.png"
import plPL from "../../../assets/flags/pl-PL.png"
import ukUA from "../../../assets/flags/uk-UA.png"
import ruRU from "../../../assets/flags/ru-RU.png"
import trTR from "../../../assets/flags/tr-TR.png"
import zhCN from "../../../assets/flags/zh-CN.png"
import jaJP from "../../../assets/flags/ja-JP.png"
import koKR from "../../../assets/flags/ko-KR.png"
import hiIN from "../../../assets/flags/hi-IN.png"
import bnBD from "../../../assets/flags/bn-BD.png"
import urPK from "../../../assets/flags/ur-PK.png"
import idID from "../../../assets/flags/id-ID.png"
import viVN from "../../../assets/flags/vi-VN.png"
import thTH from "../../../assets/flags/th-TH.png"
import swKE from "../../../assets/flags/sw-KE.png"
import amET from "../../../assets/flags/am-ET.png"
import heIL from "../../../assets/flags/he-IL.png"
import faIR from "../../../assets/flags/fa-IR.png"
import msMY from "../../../assets/flags/ms-MY.png"
import roRO from "../../../assets/flags/ro-RO.png"
import csCZ from "../../../assets/flags/cs-CZ.png"
import ptBR from "../../../assets/flags/pt-BR.png"
import esMX from "../../../assets/flags/es-MX.png"

type LanguageOption = {
  code: string
  label: string
  flagSrc: string
}

type LanguageSwitcherProps = {
  variant?: "floating" | "compact"
  className?: string
  compactFillIcon?: boolean
}

const STORAGE_KEY = "i18nextLng"

const LANGUAGE_NAMES: Record<string, { label: string; flagSrc: string }> = {
  "en-US": { label: "English", flagSrc: enUS },
  "es-ES": { label: "Español", flagSrc: esES },
  "fr-FR": { label: "Français", flagSrc: frFR },
  "ar-SA": { label: "العربية", flagSrc: arSA },
  "pt-PT": { label: "Português (PT)", flagSrc: ptPT },
  "de-DE": { label: "Deutsch", flagSrc: deDE },
  "it-IT": { label: "Italiano", flagSrc: itIT },
  "nl-NL": { label: "Nederlands", flagSrc: nlNL },
  "pl-PL": { label: "Polski", flagSrc: plPL },
  "uk-UA": { label: "Українська", flagSrc: ukUA },
  "ru-RU": { label: "Русский", flagSrc: ruRU },
  "tr-TR": { label: "Türkçe", flagSrc: trTR },
  "zh-CN": { label: "中文", flagSrc: zhCN },
  "ja-JP": { label: "日本語", flagSrc: jaJP },
  "ko-KR": { label: "한국어", flagSrc: koKR },
  "hi-IN": { label: "हिन्दी", flagSrc: hiIN },
  "bn-BD": { label: "বাংলা", flagSrc: bnBD },
  "ur-PK": { label: "اردو", flagSrc: urPK },
  "id-ID": { label: "Bahasa Indonesia", flagSrc: idID },
  "vi-VN": { label: "Tiếng Việt", flagSrc: viVN },
  "th-TH": { label: "ไทย", flagSrc: thTH },
  "sw-KE": { label: "Kiswahili", flagSrc: swKE },
  "am-ET": { label: "አማርኛ", flagSrc: amET },
  "he-IL": { label: "עברית", flagSrc: heIL },
  "fa-IR": { label: "فارسی", flagSrc: faIR },
  "ms-MY": { label: "Bahasa Melayu", flagSrc: msMY },
  "ro-RO": { label: "Română", flagSrc: roRO },
  "cs-CZ": { label: "Čeština", flagSrc: csCZ },
  "pt-BR": { label: "Português (BR)", flagSrc: ptBR },
  "es-MX": { label: "Español (MX)", flagSrc: esMX },
}

const buildOptions = (): LanguageOption[] => {
  const unique = Array.from(new Set(supportedLngs))
  return unique
    .map((code) => {
      const meta = LANGUAGE_NAMES[code]
      if (!meta) return null
      return { code, label: meta.label, flagSrc: meta.flagSrc }
    })
    .filter((item): item is LanguageOption => Boolean(item))
}

const LANGUAGE_OPTIONS = buildOptions()
const RTL_LANG_CODES = new Set([
  "ar",
  "ar-sa",
  "ar_sa",
  "he",
  "he-il",
  "he_il",
  "fa",
  "fa-ir",
  "fa_ir",
  "ur",
  "ur-pk",
  "ur_pk",
])

const applyDirection = (code: string) => {
  if (typeof document === "undefined") return
  const normalized = code.toLowerCase()
  const base = normalized.split(/[-_]/)[0]
  const isRtl = RTL_LANG_CODES.has(normalized) || RTL_LANG_CODES.has(base)
  document.documentElement.dir = isRtl ? "rtl" : "ltr"
  document.documentElement.lang = code
}

const normalizeLanguageValue = (value: DropdownValue): string => {
  if (Array.isArray(value)) return value[0] ?? ""
  return value
}

const toDropdownOptions = (
  options: LanguageOption[],
  compactFillIcon: boolean
): DropdownOption[] =>
  options.map((option) => ({
    value: option.code,
    label: option.label,
    icon: compactFillIcon ? (
      <span className="inline-flex h-full w-full overflow-hidden">
        <img src={option.flagSrc} alt="" aria-hidden className="h-full w-full object-cover" />
      </span>
    ) : undefined,
    leftIcon: (
      <span className="inline-flex h-4 w-6 overflow-hidden rounded-[2px] border border-white/20">
        <img src={option.flagSrc} alt="" aria-hidden className="h-4 w-6 object-cover" />
      </span>
    ),
  }))

export const LanguageSwitcher = ({
  variant = "floating",
  className,
  compactFillIcon = false,
}: LanguageSwitcherProps) => {
  const { i18n } = useTranslation()
  const isCompact = variant === "compact"
  const shouldFillCompactIcon = isCompact && compactFillIcon
  const [selectedCode, setSelectedCode] = useState<string>(() => LANGUAGE_OPTIONS[0]?.code ?? "")

  useEffect(() => {
    if (LANGUAGE_OPTIONS.length === 0) return
    const fromStorage = localStorage.getItem(STORAGE_KEY)
    const resolvedCode = fromStorage ?? i18n.resolvedLanguage ?? LANGUAGE_OPTIONS[0].code
    const match =
      LANGUAGE_OPTIONS.find((option) => option.code.toLowerCase() === resolvedCode?.toLowerCase()) ??
      LANGUAGE_OPTIONS[0]
    setSelectedCode(match.code)
    applyDirection(match.code)
  }, [i18n.resolvedLanguage])

  const dropdownOptions = useMemo(
    () => toDropdownOptions(LANGUAGE_OPTIONS, shouldFillCompactIcon),
    [shouldFillCompactIcon]
  )

  const handleLanguageChange = (nextValue: DropdownValue) => {
    const nextCode = normalizeLanguageValue(nextValue)
    if (!nextCode) return
    const match = LANGUAGE_OPTIONS.find((option) => option.code === nextCode)
    if (!match) return

    setSelectedCode(match.code)
    i18n.changeLanguage(match.code)
    localStorage.setItem(STORAGE_KEY, match.code)
    applyDirection(match.code)
  }

  const wrapperClassName =
    `${isCompact ? "relative text-sm text-[#E6EBF0] w-fit" : "fixed right-15 top-15 z-70 text-sm text-[#E6EBF0]"} ${className ?? ""}`.trim()

  const containerClassName = isCompact ? "w-10" : "w-60"
  const triggerClassName = isCompact
    ? shouldFillCompactIcon
      ? "h-10 min-h-10 w-10 overflow-hidden rounded-3xl p-0"
      : "h-10 min-h-10 w-10 rounded-3xl px-2 py-2"
    : "min-h-10 px-3 py-2 pr-9 text-sm"
  const menuClassName = isCompact ? "w-60" : undefined
  const iconOnlyContentClassName = shouldFillCompactIcon
    ? "!h-full !w-full overflow-hidden rounded-[inherit] [&>span]:!h-full [&>span]:!w-full [&>span]:overflow-hidden [&>span>img]:!h-full [&>span>img]:!w-full [&>span>img]:object-cover"
    : undefined

  return (
    <div data-slot="language-switcher-root" className={wrapperClassName}>
      <Dropdown
        options={dropdownOptions}
        value={selectedCode}
        onValueChange={handleLanguageChange}
        closeOnSelect
        searchable={false}
        itemIconPlacement="left"
        selectedIconPlacement="left"
        triggerDisplay={isCompact ? "icon-only" : "default"}
        iconOnlySource={shouldFillCompactIcon ? "icon" : "auto"}
        iconOnlyContentClassName={iconOnlyContentClassName}
        containerClassName={containerClassName}
        triggerClassName={triggerClassName}
        menuClassName={menuClassName}
      />
    </div>
  )
}
