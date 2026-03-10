import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react"
import { createPortal } from "react-dom"
import { useTranslation } from "react-i18next"
import { supportedLngs } from "../../../lib/i18n"

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
  const normalized = code.toLowerCase()
  const base = normalized.split(/[-_]/)[0]
  const isRtl = RTL_LANG_CODES.has(normalized) || RTL_LANG_CODES.has(base)
  document.documentElement.dir = isRtl ? "rtl" : "ltr"
  document.documentElement.lang = code
}

export const LanguageSwitcher = ({ variant = "floating", className }: LanguageSwitcherProps) => {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<LanguageOption>(LANGUAGE_OPTIONS[0])
  const isCompact = variant === "compact"
  const containerRef = useRef<HTMLDivElement | null>(null)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const [dropdownStyle, setDropdownStyle] = useState<CSSProperties | null>(null)

  const wrapperClassName =
    `${isCompact ? "relative text-sm text-[#E6EBF0] flex-shrink-0" : "fixed right-15 top-15 z-70 text-sm scale-120 text-[#E6EBF0]"} ${className ?? ""}`.trim()
  const buttonClassName = isCompact
    ? [
        "group cursor-pointer relative flex items-center justify-center rounded-3xl overflow-hidden p-1.5 sm:p-3 transition-colors duration-200 active:scale-[0.98]",
        "hover:bg-[#E6C36A]/10 hover:border-[#E6C36A]/60 ",
        open ? "border border-[#E6C36A]/60 bg-[#E6C36A]/8" : "border border-transparent",
        "focus:outline-none focus:ring-0 focus-visible:ring-0",
      ].join(" ")
    : "cursor-pointer flex w-60 items-center gap-3 rounded-xl border border-[#E6C36A]/40 bg-[#0E1F33]/70 px-4 py-2 shadow-[0_0_20px_rgba(230,195,106,0.22)] transition hover:border-[#E6C36A] hover:bg-[#0E1F33]/85 hover:shadow-[0_0_24px_rgba(230,195,106,0.28)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E6C36A]/60"
  const dropdownClassName = isCompact
    ? "rounded-xl border border-[#E6C36A]/30 bg-[#0B1526]/95 backdrop-blur-md shadow-[0_18px_40px_rgba(0,0,0,0.55),0_0_30px_rgba(230,195,106,0.18)] z-50"
    : "rounded-xl border border-[#E6C36A]/30 bg-[#0E1F33]/90 backdrop-blur-sm shadow-[0_0_20px_rgba(230,195,106,0.2)] z-50"

  useEffect(() => {
    const fromStorage = localStorage.getItem(STORAGE_KEY)
    const currentCode = (fromStorage ?? i18n.resolvedLanguage ?? LANGUAGE_OPTIONS[0].code) as
      | string
      | undefined
    const match =
      LANGUAGE_OPTIONS.find((option) => option.code.toLowerCase() === currentCode?.toLowerCase()) ??
      LANGUAGE_OPTIONS[0]
    setSelected(match)
    applyDirection(match.code)
  }, [i18n.resolvedLanguage])

  const handleSelect = (option: LanguageOption) => {
    setSelected(option)
    i18n.changeLanguage(option.code)
    localStorage.setItem(STORAGE_KEY, option.code)
    applyDirection(option.code)
    setOpen(false)
  }

  const dropdownOptions = useMemo(() => LANGUAGE_OPTIONS, [])

  const updateDropdownPosition = useCallback(() => {
    if (typeof window === "undefined") return
    const trigger = containerRef.current?.querySelector("button")
    if (!trigger) return
    const rect = trigger.getBoundingClientRect()
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth
    const viewportPadding = 8
    const dropdownWidth = isCompact ? 256 : 240
    const gap = isCompact ? 12 : 8
    const isRtl = document.documentElement?.dir === "rtl"

    let left = isCompact ? rect.left + rect.width / 2 - dropdownWidth / 2 : rect.right - dropdownWidth
    if (isRtl && !isCompact) {
      left = rect.left
    }
    left = Math.min(Math.max(left, viewportPadding), viewportWidth - dropdownWidth - viewportPadding)

    setDropdownStyle({
      position: "fixed",
      top: Math.round(rect.bottom + gap),
      left: Math.round(left),
      width: dropdownWidth,
    })
  }, [isCompact])

  useEffect(() => {
    if (!open) return
    updateDropdownPosition()
    const handleReposition = () => updateDropdownPosition()
    window.addEventListener("resize", handleReposition)
    window.addEventListener("scroll", handleReposition, true)
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node | null
      if (!target) return
      const clickedTrigger = containerRef.current?.contains(target)
      const clickedDropdown = dropdownRef.current?.contains(target)
      if (!clickedTrigger && !clickedDropdown) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      window.removeEventListener("resize", handleReposition)
      window.removeEventListener("scroll", handleReposition, true)
    }
  }, [open, updateDropdownPosition])

  useEffect(() => {
    if (!open) {
      setDropdownStyle(null)
    }
  }, [open])

  return (
    <div className={wrapperClassName}>
      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => {
            if (!open) {
              updateDropdownPosition()
            }
            setOpen((prev) => !prev)
          }}
          className={buttonClassName}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={isCompact ? "Change language" : selected.label}
        >
          {isCompact ? (
            <>
              <span
                className={`pointer-events-none absolute -inset-1.5 rounded-full  transition-opacity duration-300 ${
                  open ? "opacity-80" : "opacity-60 group-hover:opacity-80"
                }`}
              />
              <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-white/25 bg-[#0A1627]/90 shadow-[0_0_12px_rgba(0,0,0,0.35)] transition-colors duration-200 group-hover:border-[#E6C36A]/60">
                <img
                  src={selected.flagSrc}
                  alt={`${selected.label} flag`}
                  className="h-7 w-7 object-cover"
                />
              </span>
            </>
          ) : (
            <>
              <span className="flex h-6 w-11 items-center justify-center rounded-md border border-white/30 bg-[#0A1627] overflow-hidden">
                <img
                  src={selected.flagSrc}
                  alt={`${selected.label} flag`}
                  className="h-6 w-11 object-cover"
                />
              </span>
              <span className="text-sm font-semibold text-[#E6EBF0]">{selected.label}</span>
              <span
                className={`font-bold rounded-full border w-5 h-5 justify-center border-[#E6C36A]/40 ml-auto text-xs text-[#E6C36A]/80 rtl:ml-0 rtl:mr-auto transition-transform ${
                  open ? "rotate-180" : ""
                }`}
              >
                v
              </span>
            </>
          )}
        </button>

        {open && dropdownStyle
          ? createPortal(
              <div ref={dropdownRef} className={dropdownClassName} style={dropdownStyle}>
                <ul role="listbox" className="max-h-72 overflow-y-auto py-2 transition">
                  {dropdownOptions.map((option) => {
                    const isActive = option.code === selected.code
                    return (
                      <li key={option.code}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={isActive}
                          onClick={() => handleSelect(option)}
                          className={`flex w-full items-center gap-3 px-3 py-2 text-left transition ${
                            isActive
                              ? "bg-[#E6C36A]/20 text-[#E6EBF0]"
                              : "hover:bg-[#E6C36A]/10 text-[#E6EBF0]/85"
                          }`}
                        >
                          <span className="flex h-6 w-11 items-center justify-center rounded-md border border-white/25 bg-[#0A1627] overflow-hidden">
                            <img
                              src={option.flagSrc}
                              alt=""
                              aria-hidden
                              className="h-6 w-11 object-cover"
                            />
                          </span>
                          <span className="flex-1 text-sm font-medium">{option.label}</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>,
              document.body
            )
          : null}
      </div>
    </div>
  )
}
