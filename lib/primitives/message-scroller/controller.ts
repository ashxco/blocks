import {
  contentHeight,
  isAnchor,
  itemsOf,
  maxScrollTop,
  offsetInViewport,
  rowGap,
  scrollTopFor,
  topInViewport,
  type ScrollAlign,
} from "./geometry"

export type MessageScrollerDefaultScrollPosition =
  "start" | "end" | "last-anchor"
export type MessageScrollerScrollOptions = {
  align?: ScrollAlign
  behavior?: ScrollBehavior
  scrollMargin?: number
}
export type MessageScrollerScrollable = { start: boolean; end: boolean }
export type MessageScrollerVisibilityState = {
  currentAnchorId: string | null
  visibleMessageIds: string[]
}

export type ControllerOptions = {
  autoScroll: boolean
  defaultScrollPosition: MessageScrollerDefaultScrollPosition
  scrollEdgeThreshold: number
  scrollMargin: number
  scrollPreviousItemPeek: number
}

/**
 * following-bottom: pinned to the end, following new content.
 * free-scrolling: the person is in charge.
 * anchored-to-message: a scroll anchor is held at the top while its answer streams in.
 * settling-jump: a scrollToMessage jump that has not been scrolled away from yet.
 */
type Mode =
  | "following-bottom"
  | "free-scrolling"
  | "anchored-to-message"
  | "settling-jump"

/** Sub-pixel differences below this are treated as no movement. */
const EPSILON = 0.5
/** How long a programmatic scroll counts as autoscrolling. */
const AUTOSCROLL_SETTLE_MS = 180

const NOT_SCROLLABLE: MessageScrollerScrollable = { start: false, end: false }
const NO_VISIBILITY: MessageScrollerVisibilityState = {
  currentAnchorId: null,
  visibleMessageIds: [],
}

/** A value read with useSyncExternalStore. */
export class Store<T> {
  private listeners = new Set<() => void>()
  constructor(
    private value: T,
    private isEqual: (a: T, b: T) => boolean = Object.is
  ) {}
  get = () => this.value
  observed = () => this.listeners.size > 0
  set = (next: T) => {
    if (this.isEqual(this.value, next)) return
    this.value = next
    this.listeners.forEach((listener) => listener())
  }
  subscribe = (listener: () => void) => {
    this.listeners.add(listener)
    return () => void this.listeners.delete(listener)
  }
}

const sameScrollable = (
  a: MessageScrollerScrollable,
  b: MessageScrollerScrollable
) => a.start === b.start && a.end === b.end

const sameVisibility = (
  a: MessageScrollerVisibilityState,
  b: MessageScrollerVisibilityState
) =>
  a.currentAnchorId === b.currentAnchorId &&
  a.visibleMessageIds.join("\n") === b.visibleMessageIds.join("\n")

/** One per provider: owns the elements, the scroll mode and the frames that keep the scroll position. */
export class MessageScrollerController {
  readonly scrollable = new Store(NOT_SCROLLABLE, sameScrollable)
  readonly visibility = new Store(NO_VISIBILITY, sameVisibility)
  /** True until the default scroll position is applied; the viewport stays hidden meanwhile. */
  readonly pendingDefaultScroll: Store<boolean>
  private preserveScrollOnPrepend = true

  private root: HTMLElement | null = null
  private viewport: HTMLElement | null = null
  private content: HTMLElement | null = null
  private spacer: HTMLElement | null = null
  private spacerGap = 0
  private spacerHeight = 0

  private mode: Mode
  private autoscrolling = false
  private autoscrollTimeout: number | undefined
  private defaultScrollApplied = false
  private itemCount = 0
  private firstItem: HTMLElement | null = null
  private lastScrollTop = 0
  /** The anchor kept at the top while its answer streams in. */
  private anchored: HTMLElement | null = null
  /** The first visible message and its offset, restored when history loads above. */
  private restore: { element: HTMLElement; top: number } | null = null
  private pendingJump: {
    messageId: string
    options?: MessageScrollerScrollOptions
  } | null = null
  private readonly handledAnchors = new WeakSet<HTMLElement>()
  private readonly messages = new Map<string, HTMLElement>()
  private readonly frames = new Map<string, number>()

  constructor(public options: ControllerOptions) {
    this.mode = options.autoScroll ? "following-bottom" : "free-scrolling"
    this.pendingDefaultScroll = new Store(
      options.defaultScrollPosition !== "start"
    )
  }

  setPreserveScrollOnPrepend(preserve: boolean) {
    this.preserveScrollOnPrepend = preserve
  }

  setOptions(options: ControllerOptions) {
    if (options.defaultScrollPosition !== this.options.defaultScrollPosition)
      this.defaultScrollApplied = false
    this.options = options
  }

  /** Runs `callback` on the next frame, once however often it is asked for. */
  private nextFrame(key: string, callback: () => void) {
    if (this.frames.has(key)) return
    this.frames.set(
      key,
      window.requestAnimationFrame(() => {
        this.frames.delete(key)
        callback()
      })
    )
  }

  /* Elements ---------------------------------------------------------------- */

  setRoot = (element: HTMLElement | null) => {
    this.root = element
    this.applyAttributes(this.scrollable.get())
  }

  setViewport = (element: HTMLElement | null) => {
    this.viewport = element
    this.applyAttributes(this.scrollable.get())
  }

  setContent = (element: HTMLElement | null) => {
    this.content = element
  }

  setSpacer = (element: HTMLElement | null) => {
    this.spacer = element
    this.spacerGap = rowGap(element?.parentElement)
  }

  registerMessage = (
    id: string,
    element: HTMLElement | null,
    previous: HTMLElement | null
  ) => {
    if (element) this.messages.set(id, element)
    else if (this.messages.get(id) === previous) this.messages.delete(id)
    this.syncVisibility()
    if (element && this.pendingJump?.messageId === id)
      this.nextFrame("jump", () => {
        if (this.flushPendingJump()) this.captureRestorePoint()
      })
  }

  /* Scroll state ------------------------------------------------------------ */

  private applyAttributes({ start, end }: MessageScrollerScrollable) {
    const value = [start && "start", end && "end"].filter(Boolean).join(" ")
    for (const element of [this.root, this.viewport]) {
      if (!element) continue
      if (value) element.setAttribute("data-scrollable", value)
      else element.removeAttribute("data-scrollable")
      element.toggleAttribute("data-autoscrolling", this.autoscrolling)
    }
  }

  private commit = () => {
    const { content, viewport } = this
    const threshold = this.options.scrollEdgeThreshold
    const state =
      viewport && content
        ? {
            start: viewport.scrollTop > threshold,
            end:
              contentHeight(content, this.spacer, viewport) -
                viewport.scrollTop -
                viewport.clientHeight >
              threshold,
          }
        : NOT_SCROLLABLE

    const scrollTop = viewport?.scrollTop ?? 0
    const scrolledUp = scrollTop < this.lastScrollTop - EPSILON
    this.lastScrollTop = scrollTop
    if (
      this.options.autoScroll &&
      !state.end &&
      this.mode !== "settling-jump" &&
      this.mode !== "anchored-to-message"
    )
      this.mode = "following-bottom"
    else if (
      this.mode === "following-bottom" &&
      state.end &&
      scrolledUp &&
      !this.autoscrolling
    )
      this.mode = "free-scrolling"

    // While following, the end is about to be reached, so the jump button stays hidden.
    const shown =
      this.mode === "following-bottom" ? { ...state, end: false } : state
    this.applyAttributes(shown)
    this.scrollable.set(shown)
  }

  private scheduleCommit() {
    this.nextFrame("commit", this.commit)
  }

  /** Recomputes the visible messages on the next frame, while anyone is watching. */
  syncVisibility = () => {
    if (!this.visibility.observed()) return this.visibility.set(NO_VISIBILITY)
    this.nextFrame("visibility", () => {
      if (this.visibility.observed())
        this.visibility.set(this.computeVisibility())
    })
  }

  private computeVisibility(): MessageScrollerVisibilityState {
    const { content, viewport } = this
    if (!content || !viewport) return NO_VISIBILITY
    const bounds = viewport.getBoundingClientRect()
    const line =
      bounds.top +
      this.options.scrollMargin +
      this.options.scrollPreviousItemPeek
    const visibleMessageIds: string[] = []
    let currentAnchorId: string | null = null
    for (const item of itemsOf(content, this.spacer)) {
      const id = item.dataset.messageId
      if (!id) continue
      const rect = item.getBoundingClientRect()
      if (rect.bottom > line && rect.top < bounds.bottom)
        visibleMessageIds.push(id)
      if (isAnchor(item) && rect.top <= line + EPSILON) currentAnchorId = id
    }
    return visibleMessageIds.length || currentAnchorId
      ? { currentAnchorId, visibleMessageIds }
      : NO_VISIBILITY
  }

  /* Scrolling --------------------------------------------------------------- */

  private setAutoscrolling(on: boolean) {
    window.clearTimeout(this.autoscrollTimeout)
    if (this.autoscrolling !== on) {
      this.autoscrolling = on
      this.commit()
    }
    if (on)
      this.autoscrollTimeout = window.setTimeout(
        () => this.setAutoscrolling(false),
        AUTOSCROLL_SETTLE_MS
      )
  }

  /** The spacer lets an anchor scroll to the top when there is not enough content below it. */
  private setSpacerHeight(height: number) {
    const spacer = this.spacer
    const next = Math.max(0, Math.ceil(height))
    if (!spacer || this.spacerHeight === next) return
    this.spacerHeight = next
    spacer.hidden = next === 0
    spacer.style.height = `${next}px`
    spacer.style.marginTop = next > 0 ? `${-this.spacerGap}px` : ""
  }

  private scrollTo(top: number, behavior: ScrollBehavior, autoscroll = false) {
    const viewport = this.viewport
    if (!viewport) return
    const target = Math.max(0, top)
    if (Math.abs(viewport.scrollTop - target) <= EPSILON) {
      viewport.scrollTop = target
      this.commit()
      return
    }
    if (autoscroll) this.setAutoscrolling(true)
    viewport.scrollTo({ top: target, behavior })
    this.scheduleCommit()
  }

  scrollToStart = ({ behavior = "auto" }: MessageScrollerScrollOptions = {}) =>
    this.scrollToEdge("start", behavior)

  scrollToEnd = ({ behavior = "auto" }: MessageScrollerScrollOptions = {}) =>
    this.scrollToEdge("end", behavior)

  private scrollToEdge(edge: "start" | "end", behavior: ScrollBehavior) {
    const viewport = this.viewport
    if (!viewport) return false
    this.setSpacerHeight(0)
    this.anchored = null
    this.mode =
      edge === "end" && this.options.autoScroll
        ? "following-bottom"
        : "free-scrolling"
    if (edge === "end") this.scrollTo(maxScrollTop(viewport), behavior, true)
    else this.scrollTo(0, behavior)
    this.syncVisibility()
    return true
  }

  /**
   * Scrolls to an element. As an anchor (`anchor`), it keeps the previous
   * item's peek above it and holds it at the top while content grows below.
   */
  private scrollToElement(
    element: HTMLElement,
    {
      align = "start",
      behavior = "auto",
      scrollMargin = this.options.scrollMargin,
    }: MessageScrollerScrollOptions = {},
    anchor = false
  ) {
    const { content, viewport } = this
    if (!content || !viewport || !content.contains(element)) return false
    const margin = anchor
      ? scrollMargin + this.options.scrollPreviousItemPeek
      : scrollMargin
    const top = scrollTopFor(element, viewport, this.spacer, align, margin)
    this.setSpacerHeight(
      top +
        viewport.clientHeight -
        contentHeight(content, this.spacer, viewport)
    )
    this.restore = { element, top: topInViewport(element, viewport) }
    this.mode = anchor ? "anchored-to-message" : "settling-jump"
    this.anchored = anchor ? element : null
    this.scrollTo(top, behavior)
    this.syncVisibility()
    return true
  }

  private scrollToAnchor(element: HTMLElement) {
    return this.scrollToElement(element, { align: "start" }, true)
  }

  scrollToMessage = (
    messageId: string,
    options?: MessageScrollerScrollOptions
  ) => {
    const element = this.messages.get(messageId)
    if (!element && this.itemCount > 0) return false
    this.markDefaultScrollApplied()
    this.pendingJump =
      element && this.scrollToElement(element, options)
        ? null
        : { messageId, options }
    return true
  }

  private flushPendingJump() {
    const pending = this.pendingJump
    const element = pending && this.messages.get(pending.messageId)
    if (!element || !this.scrollToElement(element, pending.options))
      return false
    this.pendingJump = null
    this.markDefaultScrollApplied()
    return true
  }

  /** Remembers the first visible message, so content loading above can be compensated. */
  private captureRestorePoint() {
    const { content, viewport } = this
    const bounds = viewport?.getBoundingClientRect()
    const first =
      content && viewport && bounds
        ? itemsOf(content, this.spacer).find((item) => {
            if (!item.dataset.messageId) return false
            const rect = item.getBoundingClientRect()
            return rect.bottom > bounds.top && rect.top < bounds.bottom
          })
        : undefined
    this.restore =
      first && viewport
        ? { element: first, top: topInViewport(first, viewport) }
        : null
  }

  private restorePosition() {
    const { restore, viewport } = this
    if (!restore || !viewport || !restore.element.isConnected) return
    const delta = topInViewport(restore.element, viewport) - restore.top
    if (Math.abs(delta) <= EPSILON) return
    viewport.scrollTop += delta
    restore.top = topInViewport(restore.element, viewport)
    this.scheduleCommit()
    this.syncVisibility()
  }

  private markDefaultScrollApplied() {
    this.defaultScrollApplied = true
    this.pendingDefaultScroll.set(false)
  }

  private applyDefaultScrollPosition() {
    const position = this.options.defaultScrollPosition
    if (this.defaultScrollApplied || this.itemCount === 0) return false
    const { content, viewport } = this
    let applied: boolean
    if (position === "start") applied = this.scrollToStart()
    else if (position === "end" || !content || !viewport)
      applied = this.scrollToEnd()
    else {
      const items = itemsOf(content, this.spacer)
      const anchor = [...items].reverse().find(isAnchor)
      // The last anchor goes to the top, unless everything from it fits anyway.
      applied =
        anchor &&
        contentHeight(content, this.spacer, viewport) -
          offsetInViewport(anchor, viewport) >
          viewport.clientHeight
          ? this.scrollToAnchor(anchor)
          : this.scrollToEnd()
    }
    if (applied) this.markDefaultScrollApplied()
    return applied
  }

  /** Runs on mount and whenever defaultScrollPosition changes. */
  syncDefaultScrollPosition = () => {
    if (!this.applyDefaultScrollPosition() && this.itemCount === 0)
      this.pendingDefaultScroll.set(false)
  }

  /** Runs on mount and whenever autoScroll changes. */
  syncAutoScroll = () => {
    if (
      this.options.autoScroll &&
      this.mode === "following-bottom" &&
      this.itemCount > 0
    )
      this.scrollToEnd()
    else this.commit()
  }

  /* Events ------------------------------------------------------------------ */

  /** The content's children changed: messages arrived, loaded above or were removed. */
  handleContentChange = () => {
    const content = this.content
    if (!content) return
    const items = itemsOf(content, this.spacer)
    const previousCount = this.itemCount
    const previousFirst = this.firstItem
    this.itemCount = items.length
    this.firstItem = items[0] ?? null
    this.reactToContentChange(items, previousCount, previousFirst)
    this.captureRestorePoint()
  }

  private reactToContentChange(
    items: HTMLElement[],
    previousCount: number,
    previousFirst: HTMLElement | null
  ) {
    const following =
      this.options.autoScroll && this.mode === "following-bottom"
    if (this.flushPendingJump()) return
    if (previousCount === 0) {
      if (
        !this.applyDefaultScrollPosition() &&
        !(items.length > 0 && this.options.autoScroll && this.scrollToEnd())
      )
        this.settle()
      return
    }
    // The old first item moved down: history loaded above.
    if (
      this.preserveScrollOnPrepend &&
      previousFirst &&
      items.indexOf(previousFirst) > 0
    )
      return this.restorePosition()

    // A new scroll anchor (a question) goes to the top. Several at once: follow to the end instead.
    const added = items.slice(previousCount).filter(isAnchor)
    const anchor =
      items.length > previousCount
        ? added[0]
        : items.length === previousCount
          ? items.find(
              (item) => isAnchor(item) && !this.handledAnchors.has(item)
            )
          : undefined
    if (anchor) {
      if (following && added.length > 1) return void this.scrollToEnd()
      this.scrollToAnchor(anchor)
      this.handledAnchors.add(anchor)
      return
    }
    if (following) this.scrollToEnd()
    else this.settle()
  }

  private settle() {
    this.commit()
    this.syncVisibility()
  }

  /** The viewport or the content changed size. */
  handleResize = () => {
    if (this.options.autoScroll && this.mode === "following-bottom")
      return void this.scrollToEnd()
    const spacerBefore = this.spacerHeight
    const anchored = this.anchored
    if (
      anchored?.isConnected &&
      this.mode === "anchored-to-message" &&
      this.scrollToAnchor(anchored)
    ) {
      // The answer grew past the spacer: from here on, follow it to the end.
      if (
        this.options.autoScroll &&
        spacerBefore > 0 &&
        this.spacerHeight === 0
      )
        this.scrollToEnd()
      return
    }
    this.scheduleCommit()
    this.syncVisibility()
  }

  handleScroll = () => {
    this.settle()
    this.captureRestorePoint()
  }

  /** The person scrolled, wheeled, touched or pressed a scroll key: stop following. */
  handleUserScroll = () => {
    this.anchored = null
    this.mode = "free-scrolling"
  }
}
