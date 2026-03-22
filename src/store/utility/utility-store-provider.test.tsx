import React from "react"
import { afterEach, describe, expect, it } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import { GlobalToast } from "../../components/utility/global-toast"
import { UtilityStoreProvider } from "./utility-store-provider"
import { createUtilityStore, useUtilityStore } from "./utility-store"

afterEach(() => {
  cleanup()
  useUtilityStore.getState().toast.clear()
  useUtilityStore.getState().toast.setLayout("replace")
  useUtilityStore.getState().toast.setEnterFrom("top")
  useUtilityStore.getState().toast.setExitTo("top")
  useUtilityStore.getState().overlaySpinner.resetLoading()
})

describe("UtilityStoreProvider", () => {
  it("uses provided scoped store and does not leak to singleton store", () => {
    const scopedStore = createUtilityStore()
    scopedStore.getState().toast.enqueue({
      tone: "information",
      subject: "",
      message: "Scoped toast message",
    })

    render(
      <UtilityStoreProvider store={scopedStore}>
        <GlobalToast />
      </UtilityStoreProvider>
    )

    expect(screen.getByText("Scoped toast message")).not.toBeNull()
    expect(useUtilityStore.getState().toast.queue.length).toBe(0)
  })
})
