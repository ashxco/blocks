import * as React from "react"

const subscribeNever = () => () => {}

/** True after hydration, so UI that depends on the browser never mismatches the server. */
export function useHydrated() {
  return React.useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false
  )
}
