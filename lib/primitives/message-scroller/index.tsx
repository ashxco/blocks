"use client"

/**
 * Message scroller primitive: an unstyled conversation viewport that keeps
 * its place while messages arrive, load above or resize. The parts render
 * the elements; one controller per Provider (controller.ts) does the
 * scrolling.
 *
 * - Follows new content to the end while the person is there (autoScroll),
 *   and stops following as soon as they scroll, wheel, touch or use a scroll
 *   key, so nobody is pulled back down while reading.
 * - Opens at the start, the end or the last scroll anchor
 *   (defaultScrollPosition), hidden until that position is applied
 *   (data-pending-scroll), so it never flashes at the wrong place.
 * - Keeps the reading position when history loads above
 *   (preserveScrollOnPrepend).
 * - Scrolls a newly added scroll anchor (a question in a question-and-answer
 *   thread) to the top, with a spacer below so it can get there, and keeps it
 *   there while the answer streams in.
 * - Reports which ends are out of view (data-scrollable, the button's
 *   data-active) and which messages are visible.
 *
 * The behaviour follows @shadcn/react's MessageScroller 0.3.1 (MIT License,
 * Copyright (c) 2023 shadcn, https://github.com/shadcn-ui/ui), rewritten for
 * Blocks so it carries no dependency on that package.
 */

import * as React from "react"

import {
  mergeProps,
  useRenderElement,
  type RenderComponentProps,
} from "../render"
import {
  MessageScrollerController,
  type MessageScrollerDefaultScrollPosition,
  type MessageScrollerScrollable,
  type MessageScrollerVisibilityState,
} from "./controller"

export type {
  MessageScrollerDefaultScrollPosition,
  MessageScrollerScrollable,
  MessageScrollerScrollOptions,
  MessageScrollerVisibilityState,
} from "./controller"
export type { ScrollAlign as MessageScrollerScrollAlign } from "./geometry"
export type MessageScrollerButtonDirection = "start" | "end"

/** Keys that scroll the focused viewport, and so count as the person scrolling. */
const SCROLL_KEYS = new Set([
  "ArrowDown",
  "ArrowUp",
  "End",
  "Home",
  "PageDown",
  "PageUp",
  " ",
])

const ControllerContext = React.createContext<MessageScrollerController | null>(
  null
)

function useController(name: string) {
  const controller = React.useContext(ControllerContext)
  if (!controller)
    throw new Error(`${name} must be used within a MessageScroller.`)
  return controller
}

function usePendingDefaultScroll(controller: MessageScrollerController) {
  const { subscribe, get } = controller.pendingDefaultScroll
  return React.useSyncExternalStore(subscribe, get, get)
}

/** Lets the controller react to an element's size changes, once per frame. */
function useResize(
  ref: React.RefObject<HTMLElement | null>,
  onResize: () => void
) {
  React.useEffect(() => {
    const element = ref.current
    if (!element) return
    let frame = 0
    const observer = new ResizeObserver(() => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(onResize)
    })
    observer.observe(element)
    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [ref, onResize])
}

/** Imperative scrolling: scrollToEnd, scrollToStart and scrollToMessage(id). */
export function useMessageScroller() {
  const { scrollToEnd, scrollToMessage, scrollToStart } =
    useController("useMessageScroller")
  return React.useMemo(
    () => ({ scrollToEnd, scrollToMessage, scrollToStart }),
    [scrollToEnd, scrollToMessage, scrollToStart]
  )
}

/** Which ends of the conversation are out of view. */
export function useMessageScrollerScrollable(): MessageScrollerScrollable {
  const { subscribe, get } = useController(
    "useMessageScrollerScrollable"
  ).scrollable
  return React.useSyncExternalStore(subscribe, get, get)
}

/** The visible message ids and the scroll anchor at the top. Measures only while used. */
export function useMessageScrollerVisibility(): MessageScrollerVisibilityState {
  const controller = useController("useMessageScrollerVisibility")
  const { visibility, syncVisibility } = controller
  const subscribe = React.useCallback(
    (listener: () => void) => {
      const unsubscribe = visibility.subscribe(listener)
      syncVisibility()
      return () => {
        unsubscribe()
        syncVisibility()
      }
    },
    [visibility, syncVisibility]
  )
  return React.useSyncExternalStore(subscribe, visibility.get, visibility.get)
}

export type MessageScrollerProviderProps = {
  children?: React.ReactNode
  autoScroll?: boolean
  defaultScrollPosition?: MessageScrollerDefaultScrollPosition
  scrollEdgeThreshold?: number
  scrollPreviousItemPeek?: number
  scrollMargin?: number
}

function Provider({
  autoScroll = false,
  children,
  defaultScrollPosition = "end",
  scrollEdgeThreshold = 8,
  scrollPreviousItemPeek = 64,
  scrollMargin = 0,
}: MessageScrollerProviderProps) {
  const options = {
    autoScroll,
    defaultScrollPosition,
    scrollEdgeThreshold,
    scrollMargin,
    scrollPreviousItemPeek,
  }
  const [controller] = React.useState(
    () => new MessageScrollerController(options)
  )

  // Insertion effects run before every layout effect, children's included,
  // so the parts always read the current options.
  React.useInsertionEffect(() => {
    controller.setOptions({
      autoScroll,
      defaultScrollPosition,
      scrollEdgeThreshold,
      scrollMargin,
      scrollPreviousItemPeek,
    })
  }, [
    controller,
    autoScroll,
    defaultScrollPosition,
    scrollEdgeThreshold,
    scrollMargin,
    scrollPreviousItemPeek,
  ])
  React.useLayoutEffect(
    () => controller.syncDefaultScrollPosition(),
    [controller, defaultScrollPosition]
  )
  React.useLayoutEffect(
    () => controller.syncAutoScroll(),
    [controller, autoScroll]
  )

  return (
    <ControllerContext.Provider value={controller}>
      {children}
    </ControllerContext.Provider>
  )
}

export type MessageScrollerRootProps = React.ComponentProps<"div">

function Root({ ref, ...props }: MessageScrollerRootProps) {
  const controller = useController("MessageScroller")
  const pending = usePendingDefaultScroll(controller)
  return useRenderElement({
    defaultTagName: "div",
    props: mergeProps(props, pending ? { "data-pending-scroll": "" } : null),
    ref: [controller.setRoot, ref],
  })
}

export type MessageScrollerViewportProps = React.ComponentProps<"div"> & {
  preserveScrollOnPrepend?: boolean
}

function Viewport({
  "aria-label": ariaLabel = "Messages",
  children,
  onKeyDown,
  onScroll,
  onTouchMove,
  onWheel,
  preserveScrollOnPrepend = true,
  ref,
  role = "region",
  tabIndex = 0,
  ...props
}: MessageScrollerViewportProps) {
  const controller = useController("MessageScrollerViewport")
  const pending = usePendingDefaultScroll(controller)
  const viewportRef = React.useRef<HTMLDivElement | null>(null)
  const setViewport = React.useCallback(
    (element: HTMLDivElement | null) => {
      viewportRef.current = element
      controller.setViewport(element)
    },
    [controller]
  )
  useResize(viewportRef, controller.handleResize)

  React.useInsertionEffect(() => {
    controller.setPreserveScrollOnPrepend(preserveScrollOnPrepend)
  }, [controller, preserveScrollOnPrepend])

  return useRenderElement({
    defaultTagName: "div",
    props: mergeProps(
      {
        role,
        "aria-label": ariaLabel,
        tabIndex,
        onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
          if (SCROLL_KEYS.has(event.key)) controller.handleUserScroll()
          onKeyDown?.(event)
        },
        onScroll: (event: React.UIEvent<HTMLDivElement>) => {
          controller.handleScroll()
          onScroll?.(event)
        },
        onTouchMove: (event: React.TouchEvent<HTMLDivElement>) => {
          controller.handleUserScroll()
          onTouchMove?.(event)
        },
        onWheel: (event: React.WheelEvent<HTMLDivElement>) => {
          controller.handleUserScroll()
          onWheel?.(event)
        },
        children,
      },
      props,
      pending ? { "data-pending-scroll": "" } : null
    ),
    ref: [setViewport, ref],
  })
}

export type MessageScrollerContentProps = React.ComponentProps<"div"> & {
  spacerClassName?: string
}

function Content({
  "aria-relevant": ariaRelevant = "additions",
  children,
  ref,
  role = "log",
  spacerClassName,
  ...props
}: MessageScrollerContentProps) {
  const controller = useController("MessageScrollerContent")
  const contentRef = React.useRef<HTMLDivElement | null>(null)
  const setContent = React.useCallback(
    (element: HTMLDivElement | null) => {
      contentRef.current = element
      controller.setContent(element)
    },
    [controller]
  )
  const setSpacer = React.useCallback(
    (element: HTMLDivElement | null) => controller.setSpacer(element),
    [controller]
  )
  useResize(contentRef, controller.handleResize)

  React.useLayoutEffect(() => {
    const content = contentRef.current
    if (!content) return
    controller.handleContentChange()
    const observer = new MutationObserver(controller.handleContentChange)
    observer.observe(content, { childList: true })
    return () => observer.disconnect()
  }, [controller])

  return useRenderElement({
    defaultTagName: "div",
    props: mergeProps(
      {
        role,
        "aria-relevant": ariaRelevant,
        children: (
          <>
            {children}
            <div
              ref={setSpacer}
              aria-hidden="true"
              data-message-scroller-spacer=""
              hidden
              className={spacerClassName}
            />
          </>
        ),
      },
      props
    ),
    ref: [setContent, ref],
  })
}

export type MessageScrollerItemProps = React.ComponentProps<"div"> & {
  messageId?: string
  scrollAnchor?: boolean
}

function Item({
  messageId,
  ref,
  scrollAnchor = false,
  ...props
}: MessageScrollerItemProps) {
  const controller = useController("MessageScrollerItem")
  const elementRef = React.useRef<HTMLDivElement | null>(null)
  const register = React.useCallback(
    (element: HTMLDivElement | null) => {
      const previous = elementRef.current
      elementRef.current = element
      if (messageId) controller.registerMessage(messageId, element, previous)
    },
    [controller, messageId]
  )
  return useRenderElement({
    defaultTagName: "div",
    props: mergeProps(
      {
        "data-message-id": messageId,
        "data-scroll-anchor": scrollAnchor ? "true" : "false",
      },
      props
    ),
    ref: [register, ref],
  })
}

type ButtonState = {
  active: boolean
  direction: MessageScrollerButtonDirection
}

export type MessageScrollerButtonProps = RenderComponentProps<
  "button",
  ButtonState
> & {
  behavior?: ScrollBehavior
  direction?: MessageScrollerButtonDirection
}

/** Jumps to one end. Inert and hidden from the tab order while that end is in view. */
function ScrollButton({
  behavior = "smooth",
  children,
  direction = "end",
  onClick,
  render,
  tabIndex,
  type = "button",
  ...props
}: MessageScrollerButtonProps) {
  const controller = useController("MessageScrollerButton")
  const { subscribe, get } = controller.scrollable
  const getActive = React.useCallback(() => get()[direction], [get, direction])
  const active = React.useSyncExternalStore(subscribe, getActive, getActive)

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    if (!active) return
    onClick?.(event)
    if (event.defaultPrevented) return
    event.currentTarget.blur()
    if (direction === "start") controller.scrollToStart({ behavior })
    else controller.scrollToEnd({ behavior })
  }

  return useRenderElement<ButtonState>({
    defaultTagName: "button",
    props: mergeProps(
      {
        type,
        inert: !active,
        tabIndex: active ? tabIndex : -1,
        children: children ?? <span>Scroll to {direction}</span>,
        onClick: handleClick,
      },
      props
    ),
    render,
    state: { active, direction },
    stateAttributesMapping: {
      active: (value) => ({ "data-active": value ? "true" : "false" }),
    },
  })
}

export const MessageScroller = {
  Provider,
  Root,
  Viewport,
  Content,
  Item,
  Button: ScrollButton,
}
