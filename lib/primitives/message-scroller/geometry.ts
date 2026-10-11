/** Measurements of the viewport, the content element and its items. */

export type ScrollAlign = "start" | "center" | "end" | "nearest"

const px = (value: string) => Number.parseFloat(value) || 0

export function blockPadding(element: Element | null | undefined) {
  if (!element) return { start: 0, end: 0 }
  const style = window.getComputedStyle(element)
  return {
    start: px(style.paddingBlockStart || style.paddingTop),
    end: px(style.paddingBlockEnd || style.paddingBottom),
  }
}

export function rowGap(element: Element | null | undefined) {
  if (!element) return 0
  const style = window.getComputedStyle(element)
  return px(style.rowGap === "normal" ? style.gap : style.rowGap)
}

/** The content's items: every child but the spacer. */
export function itemsOf(content: HTMLElement, spacer: HTMLElement | null) {
  return Array.from(content.children).filter(
    (child): child is HTMLElement =>
      child instanceof HTMLElement && child !== spacer
  )
}

/** The element's top relative to the viewport's visible top edge. */
export function topInViewport(element: HTMLElement, viewport: HTMLElement) {
  return (
    element.getBoundingClientRect().top - viewport.getBoundingClientRect().top
  )
}

/** The element's top within the viewport's scrollable area. */
export function offsetInViewport(element: HTMLElement, viewport: HTMLElement) {
  return topInViewport(element, viewport) + viewport.scrollTop
}

/** Height of the real content, ignoring the spacer. */
export function contentHeight(
  content: HTMLElement,
  spacer: HTMLElement | null,
  viewport: HTMLElement
) {
  const padding = blockPadding(content)
  const top = viewport.getBoundingClientRect().top - viewport.scrollTop
  return itemsOf(content, spacer).reduce(
    (height, item) =>
      Math.max(height, item.getBoundingClientRect().bottom - top + padding.end),
    padding.start + padding.end
  )
}

export function maxScrollTop(viewport: HTMLElement) {
  return Math.max(0, viewport.scrollHeight - viewport.clientHeight)
}

/** The scrollTop that shows `element` at `align`, inside the content's padding. */
export function scrollTopFor(
  element: HTMLElement,
  viewport: HTMLElement,
  spacer: HTMLElement | null,
  align: ScrollAlign,
  margin: number
) {
  const top = offsetInViewport(element, viewport)
  const height = element.getBoundingClientRect().height
  const bottom = top + height
  const padding = blockPadding(spacer?.parentElement)
  const visible = viewport.clientHeight
  if (align === "center") {
    const available = Math.max(0, visible - padding.start - padding.end)
    return top - padding.start - (available - height) / 2 - margin
  }
  if (align === "end") return bottom - visible + padding.end + margin
  if (align === "nearest") {
    const visibleTop = viewport.scrollTop + padding.start
    const visibleBottom = viewport.scrollTop + visible - padding.end
    if (top >= visibleTop && bottom <= visibleBottom) return viewport.scrollTop
    if (top >= visibleTop) return bottom - visible + padding.end + margin
  }
  return top - padding.start - margin
}

export const isAnchor = (element: HTMLElement | undefined) =>
  element?.dataset.scrollAnchor === "true"
