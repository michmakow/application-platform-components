import * as React from "react"
import { Check, ChevronDown, X } from "lucide-react"

import { Button } from "../blocks/button"
import { cn } from "../../lib/utils"

export type DropdownOption = {
  value: string
  label: string
  icon?: React.ReactNode
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  disabled?: boolean
}

export type DropdownValue = string | string[]

export type DropdownIconPlacement = "none" | "left" | "right" | "both"
export type DropdownTriggerDisplay = "default" | "icon-only"
export type DropdownIconOnlySource = "auto" | "icon" | "leftIcon" | "rightIcon"

export type DropdownPreset = {
  id: string
  label: string
  values: string[]
}

export type DropdownColors = {
  triggerBackground: string
  triggerText: string
  triggerBorder: string
  menuBackground: string
  menuText: string
  menuBorder: string
  itemText: string
  itemHoverBackground: string
  itemSelectedBackground: string
  itemSelectedText: string
  chevron: string
  pillBackground: string
  pillText: string
  pillBorder: string
  presetBackground: string
  presetText: string
  presetBorder: string
  presetActiveBackground: string
  presetActiveText: string
  searchBackground: string
  searchText: string
  searchBorder: string
}

export interface DropdownProps
  extends Omit<
    React.ComponentPropsWithoutRef<"div">,
    "children" | "defaultValue" | "id"
  > {
  options: DropdownOption[]
  value?: DropdownValue
  defaultValue?: DropdownValue
  onValueChange?: (value: DropdownValue) => void
  onSelectionChange?: (selectedOptions: DropdownOption[]) => void
  placeholder?: string
  disabled?: boolean
  multiSelect?: boolean
  searchable?: boolean
  searchPlaceholder?: string
  searchNoResultsText?: string
  presets?: DropdownPreset[]
  itemIconPlacement?: DropdownIconPlacement
  selectedIconPlacement?: DropdownIconPlacement
  closeOnSelect?: boolean
  maxVisiblePills?: number
  colors?: Partial<DropdownColors>
  containerClassName?: string
  triggerClassName?: string
  menuClassName?: string
  itemClassName?: string
  pillClassName?: string
  presetPillClassName?: string
  searchInputClassName?: string
  chevronClassName?: string
  iconClassName?: string // backward compatibility alias for chevron class
  triggerDisplay?: DropdownTriggerDisplay
  iconOnlySource?: DropdownIconOnlySource
  iconOnlyContentClassName?: string
  removablePills?: boolean
  onOpenChange?: (open: boolean) => void
}

const DEFAULT_DROPDOWN_COLORS: DropdownColors = {
  triggerBackground: "rgba(11, 21, 38, 0.9)",
  triggerText: "#E6EBF0",
  triggerBorder: "rgba(230, 195, 106, 0.32)",
  menuBackground: "rgba(11, 21, 38, 0.96)",
  menuText: "#E6EBF0",
  menuBorder: "rgba(230, 195, 106, 0.35)",
  itemText: "#E6EBF0",
  itemHoverBackground: "rgba(230, 195, 106, 0.12)",
  itemSelectedBackground: "rgba(230, 195, 106, 0.22)",
  itemSelectedText: "#E6EBF0",
  chevron: "#E6C36A",
  pillBackground: "rgba(230, 195, 106, 0.2)",
  pillText: "#E6EBF0",
  pillBorder: "rgba(230, 195, 106, 0.4)",
  presetBackground: "rgba(255, 255, 255, 0.04)",
  presetText: "#E6EBF0",
  presetBorder: "rgba(255, 255, 255, 0.16)",
  presetActiveBackground: "rgba(230, 195, 106, 0.22)",
  presetActiveText: "#E6EBF0",
  searchBackground: "rgba(11, 21, 38, 0.94)",
  searchText: "#E6EBF0",
  searchBorder: "rgba(230, 195, 106, 0.32)",
}

const includesPlacement = (
  placement: DropdownIconPlacement,
  side: "left" | "right"
) => {
  if (placement === "none") return false
  if (placement === "both") return true
  return placement === side
}

const normalizeValue = (
  value: DropdownValue | undefined,
  multiSelect: boolean
): string[] => {
  if (multiSelect) {
    if (Array.isArray(value)) {
      return Array.from(new Set(value.filter(Boolean)))
    }
    if (typeof value === "string" && value.length > 0) {
      return [value]
    }
    return []
  }

  if (Array.isArray(value)) {
    return value[0] ? [value[0]] : []
  }
  if (typeof value === "string" && value.length > 0) {
    return [value]
  }
  return []
}

const toPublicValue = (
  selectedValues: string[],
  multiSelect: boolean
): DropdownValue => {
  if (multiSelect) return selectedValues
  return selectedValues[0] ?? ""
}

const isPresetActive = (
  presetValues: string[],
  selectedValues: string[],
  multiSelect: boolean
) => {
  if (multiSelect) {
    if (presetValues.length !== selectedValues.length) return false
    const selectedSet = new Set(selectedValues)
    return presetValues.every((value) => selectedSet.has(value))
  }

  if (selectedValues.length === 0) return false
  return presetValues.includes(selectedValues[0])
}

export const Dropdown: React.FC<DropdownProps> = ({
  options = [],
  value,
  defaultValue,
  onValueChange,
  onSelectionChange,
  placeholder = "Select option",
  disabled = false,
  multiSelect = false,
  searchable = false,
  searchPlaceholder = "Search...",
  searchNoResultsText = "No results",
  presets = [],
  itemIconPlacement,
  selectedIconPlacement = "none",
  closeOnSelect,
  maxVisiblePills = 3,
  colors,
  style,
  className,
  containerClassName,
  triggerClassName,
  menuClassName,
  itemClassName,
  pillClassName,
  presetPillClassName,
  searchInputClassName,
  chevronClassName,
  iconClassName,
  triggerDisplay = "default",
  iconOnlySource = "auto",
  iconOnlyContentClassName,
  removablePills = true,
  onOpenChange,
  ...props
}) => {
  const rootRef = React.useRef<HTMLDivElement | null>(null)
  const triggerRef = React.useRef<HTMLButtonElement | null>(null)
  const searchInputRef = React.useRef<HTMLInputElement | null>(null)
  const optionRefs = React.useRef<(HTMLButtonElement | null)[]>([])
  const pendingOpenFocusModeRef = React.useRef<"selected" | "first" | "last">(
    "selected"
  )
  const listboxId = React.useId()
  const [isOpen, setIsOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [activeOptionIndex, setActiveOptionIndex] = React.useState(-1)

  const isControlled = value !== undefined
  const [internalSelectedValues, setInternalSelectedValues] = React.useState<string[]>(
    () => normalizeValue(defaultValue, multiSelect)
  )

  React.useEffect(() => {
    if (!isControlled) {
      setInternalSelectedValues((current) => normalizeValue(current, multiSelect))
    }
  }, [isControlled, multiSelect])

  const selectedValues = isControlled
    ? normalizeValue(value, multiSelect)
    : internalSelectedValues

  const optionValueSet = React.useMemo(
    () => new Set(options.map((option) => option.value)),
    [options]
  )

  const sanitizedSelectedValues = React.useMemo(
    () => selectedValues.filter((selectedValue) => optionValueSet.has(selectedValue)),
    [optionValueSet, selectedValues]
  )

  React.useEffect(() => {
    if (isControlled) return
    if (sanitizedSelectedValues.length === selectedValues.length) return
    setInternalSelectedValues(sanitizedSelectedValues)
  }, [isControlled, sanitizedSelectedValues, selectedValues])

  const selectedValueSet = React.useMemo(
    () => new Set(sanitizedSelectedValues),
    [sanitizedSelectedValues]
  )

  const selectedOptions = React.useMemo(
    () => options.filter((option) => selectedValueSet.has(option.value)),
    [options, selectedValueSet]
  )

  const selectedOption = selectedOptions[0]
  const resolvedItemIconPlacement = itemIconPlacement ?? selectedIconPlacement
  const isIconOnlyTrigger = triggerDisplay === "icon-only" && !multiSelect

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      setIsOpen(nextOpen)
      onOpenChange?.(nextOpen)
    },
    [onOpenChange]
  )

  const openDropdown = React.useCallback(
    (focusMode: "selected" | "first" | "last" = "selected") => {
      pendingOpenFocusModeRef.current = focusMode
      setOpen(true)
    },
    [setOpen]
  )

  const getFirstEnabledIndex = React.useCallback(
    (optionsList: DropdownOption[]) =>
      optionsList.findIndex((option) => !option.disabled),
    []
  )

  const getLastEnabledIndex = React.useCallback((optionsList: DropdownOption[]) => {
    for (let index = optionsList.length - 1; index >= 0; index -= 1) {
      if (!optionsList[index]?.disabled) return index
    }
    return -1
  }, [])

  const getNextEnabledIndex = React.useCallback(
    (
      optionsList: DropdownOption[],
      startIndex: number,
      direction: 1 | -1
    ): number => {
      if (optionsList.length === 0) return -1

      let candidateIndex = startIndex
      for (let checked = 0; checked < optionsList.length; checked += 1) {
        candidateIndex =
          (candidateIndex + direction + optionsList.length) % optionsList.length
        if (!optionsList[candidateIndex]?.disabled) return candidateIndex
      }

      return -1
    },
    []
  )

  const resolveInitialActiveIndex = React.useCallback(
    (
      optionsList: DropdownOption[],
      mode: "selected" | "first" | "last"
    ) => {
      if (optionsList.length === 0) return -1
      if (mode === "first") return getFirstEnabledIndex(optionsList)
      if (mode === "last") return getLastEnabledIndex(optionsList)

      const selectedIndex = optionsList.findIndex(
        (option) => !option.disabled && selectedValueSet.has(option.value)
      )
      if (selectedIndex >= 0) return selectedIndex
      return getFirstEnabledIndex(optionsList)
    },
    [getFirstEnabledIndex, getLastEnabledIndex, selectedValueSet]
  )

  React.useEffect(() => {
    if (!isOpen) return

    const handleOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (!rootRef.current?.contains(target)) {
        setOpen(false)
      }
    }

    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target as Node
      if (!rootRef.current?.contains(target)) {
        setOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleOutside)
    document.addEventListener("focusin", handleFocusIn)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleOutside)
      document.removeEventListener("focusin", handleFocusIn)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, setOpen])

  React.useEffect(() => {
    if (!isOpen && query.length > 0) {
      setQuery("")
    }
  }, [isOpen, query.length])

  const shouldCloseOnSelect = closeOnSelect ?? !multiSelect

  const publishSelection = React.useCallback(
    (nextSelection: string[]) => {
      const validSelection = Array.from(
        new Set(
          nextSelection.filter((selectedValue) => optionValueSet.has(selectedValue))
        )
      )

      const normalizedSelection = multiSelect
        ? validSelection
        : validSelection.length > 0
          ? [validSelection[0]]
          : []

      if (!isControlled) {
        setInternalSelectedValues(normalizedSelection)
      }

      onValueChange?.(toPublicValue(normalizedSelection, multiSelect))

      if (onSelectionChange) {
        const selectedSet = new Set(normalizedSelection)
        onSelectionChange(options.filter((option) => selectedSet.has(option.value)))
      }
    },
    [
      isControlled,
      multiSelect,
      onSelectionChange,
      onValueChange,
      optionValueSet,
      options,
    ]
  )

  const handleOptionToggle = (option: DropdownOption) => {
    if (multiSelect) {
      const isSelected = selectedValueSet.has(option.value)
      const nextSelection = isSelected
        ? sanitizedSelectedValues.filter((valueItem) => valueItem !== option.value)
        : [...sanitizedSelectedValues, option.value]

      publishSelection(nextSelection)
      if (shouldCloseOnSelect) {
        setOpen(false)
      }
      return
    }

    publishSelection([option.value])
    if (shouldCloseOnSelect) {
      setOpen(false)
    }
  }

  const handlePillRemove = React.useCallback(
    (optionValue: string) => {
      const nextSelection = sanitizedSelectedValues.filter(
        (valueItem) => valueItem !== optionValue
      )
      publishSelection(nextSelection)
    },
    [publishSelection, sanitizedSelectedValues]
  )

  const applyPreset = (preset: DropdownPreset) => {
    const filteredValues = Array.from(
      new Set(
        preset.values.filter((presetValue) => optionValueSet.has(presetValue))
      )
    )

    const nextSelection = multiSelect ? filteredValues : filteredValues.slice(0, 1)
    publishSelection(nextSelection)

    if (shouldCloseOnSelect) {
      setOpen(false)
    }
  }

  const filteredOptions = React.useMemo(() => {
    if (!searchable) return options

    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return options

    return options.filter((option) =>
      option.label.toLowerCase().includes(normalizedQuery)
    )
  }, [options, query, searchable])

  React.useEffect(() => {
    optionRefs.current = []
  }, [filteredOptions])

  React.useEffect(() => {
    if (!isOpen) {
      setActiveOptionIndex(-1)
      return
    }

    const initialIndex = resolveInitialActiveIndex(
      filteredOptions,
      pendingOpenFocusModeRef.current
    )
    pendingOpenFocusModeRef.current = "selected"
    setActiveOptionIndex(initialIndex)

    if (searchable) {
      searchInputRef.current?.focus()
      return
    }

    if (initialIndex >= 0) {
      optionRefs.current[initialIndex]?.focus()
    }
  }, [filteredOptions, isOpen, resolveInitialActiveIndex, searchable])

  React.useEffect(() => {
    if (!isOpen) return
    if (filteredOptions.length === 0) {
      setActiveOptionIndex(-1)
      return
    }

    if (
      activeOptionIndex >= 0 &&
      filteredOptions[activeOptionIndex] &&
      !filteredOptions[activeOptionIndex].disabled
    ) {
      return
    }

    setActiveOptionIndex(resolveInitialActiveIndex(filteredOptions, "first"))
  }, [activeOptionIndex, filteredOptions, isOpen, resolveInitialActiveIndex])

  const focusOptionAtIndex = React.useCallback((index: number) => {
    if (index < 0) return
    setActiveOptionIndex(index)
    optionRefs.current[index]?.focus()
  }, [])

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      if (isOpen) {
        setOpen(false)
        return
      }
      openDropdown("selected")
      return
    }

    if (event.key === "ArrowDown") {
      event.preventDefault()
      if (isOpen) {
        const firstEnabledIndex = getFirstEnabledIndex(filteredOptions)
        focusOptionAtIndex(firstEnabledIndex)
        return
      }

      openDropdown("first")
      return
    }

    if (event.key === "ArrowUp") {
      event.preventDefault()
      if (isOpen) {
        const lastEnabledIndex = getLastEnabledIndex(filteredOptions)
        focusOptionAtIndex(lastEnabledIndex)
        return
      }

      openDropdown("last")
    }
  }

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      const startIndex = activeOptionIndex >= 0 ? activeOptionIndex : -1
      const targetIndex = getNextEnabledIndex(filteredOptions, startIndex, 1)
      focusOptionAtIndex(targetIndex)
      return
    }

    if (event.key === "ArrowUp") {
      event.preventDefault()
      const startIndex = activeOptionIndex >= 0 ? activeOptionIndex : 0
      const targetIndex = getNextEnabledIndex(filteredOptions, startIndex, -1)
      focusOptionAtIndex(targetIndex)
      return
    }

    if (event.key === "Escape") {
      event.preventDefault()
      setOpen(false)
      triggerRef.current?.focus()
    }
  }

  const handleListboxKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      const startIndex = activeOptionIndex >= 0 ? activeOptionIndex : -1
      const targetIndex = getNextEnabledIndex(filteredOptions, startIndex, 1)
      focusOptionAtIndex(targetIndex)
      return
    }

    if (event.key === "ArrowUp") {
      event.preventDefault()
      const startIndex = activeOptionIndex >= 0 ? activeOptionIndex : 0
      const targetIndex = getNextEnabledIndex(filteredOptions, startIndex, -1)
      focusOptionAtIndex(targetIndex)
      return
    }

    if (event.key === "Home") {
      event.preventDefault()
      focusOptionAtIndex(getFirstEnabledIndex(filteredOptions))
      return
    }

    if (event.key === "End") {
      event.preventDefault()
      focusOptionAtIndex(getLastEnabledIndex(filteredOptions))
      return
    }

    if (event.key === "Escape") {
      event.preventDefault()
      setOpen(false)
      triggerRef.current?.focus()
    }
  }

  const resolvedColors = React.useMemo(
    () => ({ ...DEFAULT_DROPDOWN_COLORS, ...colors }),
    [colors]
  )

  const resolvedStyle: React.CSSProperties = {
    "--ud-dropdown-trigger-bg": resolvedColors.triggerBackground,
    "--ud-dropdown-trigger-text": resolvedColors.triggerText,
    "--ud-dropdown-trigger-border": resolvedColors.triggerBorder,
    "--ud-dropdown-menu-bg": resolvedColors.menuBackground,
    "--ud-dropdown-menu-text": resolvedColors.menuText,
    "--ud-dropdown-menu-border": resolvedColors.menuBorder,
    "--ud-dropdown-item-text": resolvedColors.itemText,
    "--ud-dropdown-item-hover-bg": resolvedColors.itemHoverBackground,
    "--ud-dropdown-item-selected-bg": resolvedColors.itemSelectedBackground,
    "--ud-dropdown-item-selected-text": resolvedColors.itemSelectedText,
    "--ud-dropdown-chevron": resolvedColors.chevron,
    "--ud-dropdown-pill-bg": resolvedColors.pillBackground,
    "--ud-dropdown-pill-text": resolvedColors.pillText,
    "--ud-dropdown-pill-border": resolvedColors.pillBorder,
    "--ud-dropdown-preset-bg": resolvedColors.presetBackground,
    "--ud-dropdown-preset-text": resolvedColors.presetText,
    "--ud-dropdown-preset-border": resolvedColors.presetBorder,
    "--ud-dropdown-preset-active-bg": resolvedColors.presetActiveBackground,
    "--ud-dropdown-preset-active-text": resolvedColors.presetActiveText,
    "--ud-dropdown-search-bg": resolvedColors.searchBackground,
    "--ud-dropdown-search-text": resolvedColors.searchText,
    "--ud-dropdown-search-border": resolvedColors.searchBorder,
    ...style,
  } as React.CSSProperties

  const renderIcon = (
    option: DropdownOption,
    side: "left" | "right",
    placement: DropdownIconPlacement,
    slotName: string
  ) => {
    const explicitSideIcon = side === "left" ? option.leftIcon : option.rightIcon

    if (explicitSideIcon) {
      return (
        <span
          data-slot={slotName}
          className={cn(
            "inline-flex h-4 w-4 shrink-0 items-center justify-center text-current",
            side === "right" && "ml-1",
            side === "left" && "mr-1"
          )}
        >
          {explicitSideIcon}
        </span>
      )
    }

    if (!includesPlacement(placement, side)) return null

    const candidate =
      side === "left"
        ? option.icon ?? option.rightIcon
        : option.icon ?? option.leftIcon

    if (!candidate) return null

    return (
      <span
        data-slot={slotName}
        className={cn(
          "inline-flex h-4 w-4 shrink-0 items-center justify-center text-current",
          side === "right" && "ml-1",
          side === "left" && "mr-1"
        )}
      >
        {candidate}
      </span>
    )
  }

  const resolveTriggerIcon = (option: DropdownOption): React.ReactNode => {
    if (iconOnlySource === "icon") {
      return option.icon ?? option.leftIcon ?? option.rightIcon ?? null
    }

    if (iconOnlySource === "leftIcon") {
      return option.leftIcon ?? option.icon ?? option.rightIcon ?? null
    }

    if (iconOnlySource === "rightIcon") {
      return option.rightIcon ?? option.icon ?? option.leftIcon ?? null
    }

    if (option.leftIcon) return option.leftIcon
    if (option.icon) return option.icon
    if (option.rightIcon) return option.rightIcon

    if (includesPlacement(selectedIconPlacement, "left")) {
      return option.icon ?? option.rightIcon ?? option.leftIcon ?? null
    }

    if (includesPlacement(selectedIconPlacement, "right")) {
      return option.icon ?? option.leftIcon ?? option.rightIcon ?? null
    }

    return null
  }

  const triggerIconOnlyContent = selectedOption
    ? resolveTriggerIcon(selectedOption)
    : null

  const triggerAriaLabel =
    selectedOptions.length > 0
      ? multiSelect
        ? `Selected: ${selectedOptions.map((option) => option.label).join(", ")}`
        : selectedOptions[0].label
      : placeholder

  return (
    <div
      {...props}
      ref={rootRef}
      data-slot="dropdown-root"
      className={cn("relative", containerClassName, className)}
      style={resolvedStyle}
    >
      <div
        className={cn(
          "relative flex min-h-10 w-full items-center rounded-xl border px-3 py-2 text-left text-sm transition",
          !isIconOnlyTrigger && "pr-10",
          isIconOnlyTrigger && "justify-center",
          "border-(--ud-dropdown-trigger-border) bg-(--ud-dropdown-trigger-bg) text-(--ud-dropdown-trigger-text)",
          "focus-within:ring-2 focus-within:ring-(--ud-dropdown-trigger-border)",
          disabled && "opacity-60",
          isOpen && "shadow-[0_0_0_1px_var(--ud-dropdown-trigger-border)]",
          triggerClassName
        )}
      >
        <button
          ref={triggerRef}
          type="button"
          data-slot="dropdown-trigger"
          tabIndex={disabled ? -1 : 0}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-label={triggerAriaLabel}
          onClick={() => {
            if (isOpen) {
              setOpen(false)
              return
            }
            openDropdown("selected")
          }}
          onKeyDown={handleTriggerKeyDown}
          className={cn(
            "absolute inset-0 z-0 rounded-xl outline-none",
            "cursor-pointer",
            "focus-visible:ring-2 focus-visible:ring-(--ud-dropdown-trigger-border)",
            disabled && "cursor-not-allowed"
          )}
        />

        <span
          data-slot="dropdown-selected"
          className={cn(
            "pointer-events-none relative z-10 flex min-w-0 items-center gap-2",
            isIconOnlyTrigger ? "justify-center" : "flex-1"
          )}
        >
          {multiSelect ? (
            selectedOptions.length > 0 ? (
              <span className="flex min-w-0 flex-wrap gap-1.5">
                {selectedOptions.slice(0, maxVisiblePills).map((option) => (
                  <span
                    key={`pill-${option.value}`}
                    data-slot="dropdown-pill"
                    className={cn(
                      "inline-flex max-w-full items-center gap-1 rounded-full border px-2 py-0.5 text-xs",
                      "border-(--ud-dropdown-pill-border) bg-(--ud-dropdown-pill-bg) text-(--ud-dropdown-pill-text)",
                      pillClassName
                    )}
                  >
                    {renderIcon(
                      option,
                      "left",
                      selectedIconPlacement,
                      "dropdown-pill-icon-left"
                    )}
                    <span className="truncate">{option.label}</span>
                    {renderIcon(
                      option,
                      "right",
                      selectedIconPlacement,
                      "dropdown-pill-icon-right"
                    )}
                    {removablePills && !disabled ? (
                      <Button.IconButton
                        id={`dropdown-pill-remove-${option.value}`}
                        data-slot="dropdown-pill-remove"
                        icon={<X className="h-3 w-3" aria-hidden />}
                        alt={`Remove ${option.label}`}
                        title={`Remove ${option.label}`}
                        description="Remove selected option"
                        variant="utility"
                        size="xs"
                        className="pointer-events-auto relative z-20 h-4! w-4! min-h-0! min-w-0! rounded-full! border-0! p-0! opacity-80! shadow-none! hover:opacity-100! hover:bg-(--ud-dropdown-item-hover-bg)! focus-visible:ring-1! focus-visible:ring-(--ud-dropdown-trigger-border)!"
                        onMouseDown={(event: React.MouseEvent<HTMLElement>) => {
                          event.preventDefault()
                          event.stopPropagation()
                        }}
                        onClick={(event: React.MouseEvent<HTMLElement>) => {
                          event.preventDefault()
                          event.stopPropagation()
                          handlePillRemove(option.value)
                        }}
                      />
                    ) : null}
                  </span>
                ))}

                {selectedOptions.length > maxVisiblePills ? (
                  <span
                    data-slot="dropdown-pill-overflow"
                    className={cn(
                      "inline-flex items-center rounded-full border px-2 py-0.5 text-xs",
                      "border-(--ud-dropdown-pill-border) bg-(--ud-dropdown-pill-bg) text-(--ud-dropdown-pill-text)",
                      pillClassName
                    )}
                  >
                    +{selectedOptions.length - maxVisiblePills}
                  </span>
                ) : null}
              </span>
            ) : (
              <span className="truncate opacity-75">{placeholder}</span>
            )
          ) : selectedOption ? (
            isIconOnlyTrigger ? (
              triggerIconOnlyContent ? (
                <span
                  data-slot="dropdown-selected-icon-only"
                  className={cn(
                    "inline-flex h-4 w-6 shrink-0 items-center justify-center text-current [&>svg]:h-4 [&>svg]:w-4",
                    iconOnlyContentClassName
                  )}
                >
                  {triggerIconOnlyContent}
                </span>
              ) : (
                <span className="truncate">{selectedOption.label}</span>
              )
            ) : (
              <>
                {renderIcon(
                  selectedOption,
                  "left",
                  selectedIconPlacement,
                  "dropdown-selected-icon-left"
                )}
                <span className="truncate">{selectedOption.label}</span>
                {renderIcon(
                  selectedOption,
                  "right",
                  selectedIconPlacement,
                  "dropdown-selected-icon-right"
                )}
              </>
            )
          ) : (
            <span className="truncate opacity-75">{placeholder}</span>
          )}
        </span>

        {!isIconOnlyTrigger ? (
          <ChevronDown
            data-slot="dropdown-chevron"
            className={cn(
              "pointer-events-none absolute right-3 top-1/2 z-10 size-4 -translate-y-1/2 text-(--ud-dropdown-chevron)",
              "transition-transform duration-200 ease-out",
              isOpen ? "rotate-180" : "rotate-0",
              disabled && "opacity-60",
              chevronClassName,
              iconClassName
            )}
          />
        ) : null}
      </div>

      {isOpen && !disabled ? (
        <div
          data-slot="dropdown-menu"
          className={cn(
            "absolute z-50 mt-2 w-full overflow-hidden rounded-xl border shadow-[0_18px_40px_rgba(0,0,0,0.45)] backdrop-blur-md",
            "border-(--ud-dropdown-menu-border) bg-(--ud-dropdown-menu-bg) text-(--ud-dropdown-menu-text)",
            menuClassName
          )}
        >
          {searchable ? (
            <div className="p-2 pb-0">
              <input
                data-slot="dropdown-search"
                ref={searchInputRef}
                type="text"
                value={query}
                placeholder={searchPlaceholder}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setQuery(event.target.value)
                }
                onKeyDown={handleSearchKeyDown}
                className={cn(
                  "mb-2 w-full rounded-lg border px-2.5 py-2 text-sm outline-none transition",
                  "border-(--ud-dropdown-search-border) bg-(--ud-dropdown-search-bg) text-(--ud-dropdown-search-text)",
                  "focus:ring-2 focus:ring-(--ud-dropdown-trigger-border)",
                  searchInputClassName
                )}
              />
            </div>
          ) : null}

          {presets.length > 0 ? (
            <div data-slot="dropdown-presets" className="flex flex-wrap gap-2 px-2 pb-2">
              {presets.map((preset) => {
                const presetValues = Array.from(
                  new Set(
                    preset.values.filter((presetValue) =>
                      optionValueSet.has(presetValue)
                    )
                  )
                )
                const active = isPresetActive(
                  presetValues,
                  sanitizedSelectedValues,
                  multiSelect
                )

                return (
                  <button
                    key={preset.id}
                    type="button"
                    data-slot="dropdown-preset-pill"
                    onClick={() => applyPreset(preset)}
                    className={cn(
                      "cursor-pointer rounded-full border px-2.5 py-1 text-xs transition",
                      active
                        ? "border-transparent bg-(--ud-dropdown-preset-active-bg) text-(--ud-dropdown-preset-active-text)"
                        : "border-(--ud-dropdown-preset-border) bg-(--ud-dropdown-preset-bg) text-(--ud-dropdown-preset-text) hover:bg-white/8",
                      presetPillClassName
                    )}
                  >
                    {preset.label}
                  </button>
                )
              })}
            </div>
          ) : null}

          <ul
            id={listboxId}
            role="listbox"
            aria-multiselectable={multiSelect || undefined}
            aria-activedescendant={
              activeOptionIndex >= 0
                ? `${listboxId}-option-${activeOptionIndex}`
                : undefined
            }
            onKeyDown={handleListboxKeyDown}
            className="max-h-56 overflow-y-auto p-1"
          >
            {filteredOptions.length === 0 ? (
              <li className="px-2.5 py-2 text-sm opacity-70">{searchNoResultsText}</li>
            ) : (
              filteredOptions.map((option, index) => {
                const selected = selectedValueSet.has(option.value)

                return (
                  <li key={option.value}>
                    <button
                      id={`${listboxId}-option-${index}`}
                      ref={(element) => {
                        optionRefs.current[index] = element
                      }}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      disabled={option.disabled}
                      tabIndex={option.disabled ? -1 : activeOptionIndex === index ? 0 : -1}
                      onClick={() => handleOptionToggle(option)}
                      onFocus={() => {
                        if (!option.disabled) {
                          setActiveOptionIndex(index)
                        }
                      }}
                      onMouseEnter={() => {
                        if (!option.disabled) {
                          setActiveOptionIndex(index)
                        }
                      }}
                      className={cn(
                        "flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-(--ud-dropdown-trigger-border)",
                        selected
                          ? "bg-(--ud-dropdown-item-selected-bg) text-(--ud-dropdown-item-selected-text)"
                          : "text-(--ud-dropdown-item-text) hover:bg-(--ud-dropdown-item-hover-bg)",
                        option.disabled && "cursor-not-allowed opacity-50 hover:bg-transparent",
                        itemClassName
                      )}
                    >
                      {renderIcon(
                        option,
                        "left",
                        resolvedItemIconPlacement,
                        "dropdown-option-icon-left"
                      )}
                      <span className="flex-1 truncate">{option.label}</span>
                      {renderIcon(
                        option,
                        "right",
                        resolvedItemIconPlacement,
                        "dropdown-option-icon-right"
                      )}
                      {multiSelect && selected ? (
                        <Check
                          data-slot="dropdown-option-check"
                          className="h-4 w-4 shrink-0"
                        />
                      ) : null}
                    </button>
                  </li>
                )
              })
            )}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
