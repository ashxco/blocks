/** An Item's answers: which are picked, which were picked by default, and whether it was skipped or checked. */
export type ItemAnswers = {
  selected: string[]
  /** Answers checked by default, restored on reset. */
  defaults: string[]
  skipped: boolean
  /** Continue or submit was tried, so a missing answer shows as invalid. */
  attempted: boolean
  /** Counts resets, so controlled answers and native inputs resync after one. */
  resetVersion: number
}

export type ItemAnswersAction =
  /** An answer mounted, picked by default or not. */
  | { type: "mount"; id: string; selected: boolean }
  | { type: "unmount"; id: string }
  /** An answer's default (defaultChecked or defaultValue) changed. */
  | { type: "default"; id: string; selected: boolean }
  /** A person picked or cleared an answer (`unskip`), or a controlled answer changed. */
  | { type: "select"; id: string; selected: boolean; unskip: boolean }
  /** `multiple` was turned off: keep the first picked answer in `order`. */
  | { type: "single"; order: string[] }
  | { type: "skip" }
  | { type: "attempt" }
  | { type: "reset" }

export const initialItemAnswers: ItemAnswers = {
  selected: [],
  defaults: [],
  skipped: false,
  attempted: false,
  resetVersion: 0,
}

const without = (list: string[], id: string) =>
  list.filter((entry) => entry !== id)
const including = (list: string[], id: string) =>
  list.includes(id) ? list : [...list, id]

/** `multiple` is the Item's current value, so an answer replaces the others unless several are allowed. */
export function itemAnswersReducer(
  state: ItemAnswers,
  action: ItemAnswersAction,
  multiple: boolean
): ItemAnswers {
  switch (action.type) {
    case "mount": {
      if (!action.selected) return state
      const { id } = action
      return {
        ...state,
        defaults: [...without(state.defaults, id), id],
        selected: multiple
          ? including(state.selected, id)
          : state.selected.length
            ? state.selected
            : [id],
      }
    }
    case "unmount":
      return {
        ...state,
        defaults: without(state.defaults, action.id),
        selected: without(state.selected, action.id),
      }
    case "default": {
      const defaults = action.selected
        ? including(state.defaults, action.id)
        : without(state.defaults, action.id)
      return defaults.length === state.defaults.length
        ? state
        : { ...state, defaults }
    }
    case "select": {
      const { id } = action
      return {
        ...state,
        selected: !action.selected
          ? without(state.selected, id)
          : multiple
            ? including(state.selected, id)
            : [id],
        skipped: action.unskip ? false : state.skipped,
      }
    }
    case "single": {
      const kept = action.order.find((id) => state.selected.includes(id))
      return { ...state, selected: kept ? [kept] : [] }
    }
    case "skip":
      return { ...state, selected: [], skipped: true }
    case "attempt":
      return state.attempted ? state : { ...state, attempted: true }
    case "reset":
      return {
        ...state,
        attempted: false,
        resetVersion: state.resetVersion + 1,
        selected: multiple ? state.defaults : state.defaults.slice(0, 1),
        skipped: false,
      }
  }
}
