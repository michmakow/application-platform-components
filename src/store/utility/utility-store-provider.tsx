import React, { createContext, useContext, useRef } from "react"
import { useStore } from "zustand"
import type { UtilityState } from "./utility.types"
import { createUtilityStore, utilityStore, type UtilityStoreApi } from "./utility-store"

const UtilityStoreContext = createContext<UtilityStoreApi | null>(null)

export type UtilityStoreProviderProps = {
  children: React.ReactNode
  store?: UtilityStoreApi
}

export const UtilityStoreProvider: React.FC<UtilityStoreProviderProps> = ({ children, store }) => {
  const storeRef = useRef<UtilityStoreApi>(store ?? createUtilityStore())
  return <UtilityStoreContext.Provider value={storeRef.current}>{children}</UtilityStoreContext.Provider>
}

export const useScopedUtilityStore = <T,>(selector: (state: UtilityState) => T): T => {
  const scopedStore = useContext(UtilityStoreContext)
  return useStore(scopedStore ?? utilityStore, selector)
}

export const useScopedUtilityStoreApi = (): UtilityStoreApi => {
  const scopedStore = useContext(UtilityStoreContext)
  return scopedStore ?? utilityStore
}
