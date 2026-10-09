"use client"

import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react"
import { cn } from "@/lib/utils"
import { CheckIcon, ChevronDownIcon, SearchIcon, XIcon } from "lucide-react"

/**
 * Blocks combobox. A searchable select on Base UI's Combobox.
 *
 * The input is a Blocks control (muted fill, input border, control height
 * and radius) with a chevron and an optional clear button. The popup is a
 * flat overlay that matches Select: popover surface, hairline border,
 * overlay radius, a fade with a 4px slide and no shadow. Placed inside the
 * popup, ComboboxInput turns into a borderless search row.
 *
 *   <Combobox items={frameworks}>
 *     <ComboboxInput placeholder="Search frameworks" />
 *     <ComboboxContent>
 *       <ComboboxEmpty>No frameworks found.</ComboboxEmpty>
 *       <ComboboxList>
 *         {(item) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}
 *       </ComboboxList>
 *     </ComboboxContent>
 *   </Combobox>
 */
const Combobox = ComboboxPrimitive.Root

function ComboboxValue({ ...props }: ComboboxPrimitive.Value.Props) {
  return <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />
}

/**
 * Opens the popup. Unstyled apart from its chevron, so compose it with the
 * render prop: <ComboboxTrigger render={<Button variant="outline" />}>.
 */
function ComboboxTrigger({
  className,
  children,
  ...props
}: ComboboxPrimitive.Trigger.Props) {
  return (
    <ComboboxPrimitive.Trigger
      data-slot="combobox-trigger"
      className={cn(
        "group/combobox-trigger [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon
        data-slot="combobox-trigger-icon"
        className="pointer-events-none size-4 text-muted-foreground transition-transform duration-(--duration-base) ease-out group-data-popup-open/combobox-trigger:rotate-180"
      />
    </ComboboxPrimitive.Trigger>
  )
}

/** Small round icon button used for the chevron and clear actions inside the input. */
const inputActionClass = cn(
  "grid size-7 shrink-0 place-items-center rounded-full text-muted-foreground outline-none",
  "transition-[background-color,color] duration-(--duration-fast) ease-standard",
  "hover:bg-accent hover:text-foreground focus-visible:focus-ring",
  "disabled:pointer-events-none disabled:opacity-50",
  "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4"
)

function ComboboxClear({ className, ...props }: ComboboxPrimitive.Clear.Props) {
  return (
    <ComboboxPrimitive.Clear
      data-slot="combobox-clear"
      aria-label="Clear selection"
      className={cn(inputActionClass, className)}
      {...props}
    >
      <XIcon className="pointer-events-none" />
    </ComboboxPrimitive.Clear>
  )
}

/** True inside ComboboxContent, so ComboboxInput can render as a search row. */
const ComboboxContentContext = React.createContext(false)

function ComboboxInput({
  className,
  children,
  disabled = false,
  showTrigger = true,
  showClear = false,
  ...props
}: ComboboxPrimitive.Input.Props & {
  showTrigger?: boolean
  showClear?: boolean
}) {
  const inPopup = React.useContext(ComboboxContentContext)

  return (
    <ComboboxPrimitive.InputGroup
      data-slot="combobox-input-group"
      data-variant={inPopup ? "search" : "control"}
      className={cn(
        "group/combobox-input relative flex w-full min-w-0 items-center text-sm text-foreground",
        "[&>svg]:pointer-events-none [&>svg]:shrink-0 [&>svg:not([class*='size-'])]:size-4 [&>svg:not([class*='text-'])]:text-muted-foreground",
        "has-disabled:pointer-events-none has-disabled:opacity-50",
        inPopup
          ? // Inside the popup: a borderless search row above the list.
            "h-(--control-height-md) shrink-0 gap-2.5 border-b border-border ps-3.5 pe-2"
          : [
              "h-(--control-height-md) gap-1 rounded-(--control-radius) border border-input bg-muted ps-(--control-padding-x) pe-2",
              "transition-[background-color,border-color] duration-(--duration-fast) ease-standard",
              "hover:border-foreground/25 data-popup-open:border-foreground/30 data-popup-open:bg-background",
              "has-[input:focus-visible]:border-ring has-[input:focus-visible]:focus-ring",
              "has-aria-invalid:border-destructive has-aria-invalid:has-[input:focus-visible]:outline-destructive",
            ],
        className
      )}
    >
      {inPopup ? <SearchIcon aria-hidden="true" /> : null}
      <ComboboxPrimitive.Input
        data-slot="combobox-input"
        disabled={disabled}
        className="h-full min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
        {...props}
      />
      {children}
      {showTrigger ? (
        <ComboboxPrimitive.Trigger
          data-slot="combobox-trigger"
          disabled={disabled}
          aria-label="Show options"
          className={cn(
            inputActionClass,
            "group/combobox-trigger -me-0.5 group-has-data-[slot=combobox-clear]/combobox-input:hidden data-popup-open:text-foreground"
          )}
        >
          <ChevronDownIcon className="transition-transform duration-(--duration-base) ease-out group-data-popup-open/combobox-trigger:rotate-180" />
        </ComboboxPrimitive.Trigger>
      ) : null}
      {showClear ? <ComboboxClear disabled={disabled} className="-me-0.5" /> : null}
    </ComboboxPrimitive.InputGroup>
  )
}

function ComboboxContent({
  className,
  side = "bottom",
  sideOffset = 6,
  align = "start",
  alignOffset = 0,
  anchor,
  ...props
}: ComboboxPrimitive.Popup.Props &
  Pick<
    ComboboxPrimitive.Positioner.Props,
    "side" | "align" | "sideOffset" | "alignOffset" | "anchor"
  >) {
  return (
    <ComboboxContentContext.Provider value={true}>
      <ComboboxPrimitive.Portal>
        <ComboboxPrimitive.Positioner
          side={side}
          sideOffset={sideOffset}
          align={align}
          alignOffset={alignOffset}
          anchor={anchor}
          className="isolate z-(--z-overlay) outline-none"
        >
          <ComboboxPrimitive.Popup
            data-slot="combobox-content"
            data-chips={!!anchor}
            className={cn(
              "group/combobox-content relative flex max-h-[min(var(--available-height),--spacing(96))] w-(--anchor-width) max-w-(--available-width) min-w-56 origin-(--transform-origin) flex-col overflow-hidden",
              "rounded-(--overlay-radius) border border-border bg-popover text-popover-foreground outline-none",
              "data-[chips=true]:min-w-(--anchor-width)",
              "duration-(--duration-base) ease-out data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
              "data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=inline-start]:slide-in-from-right-1 data-[side=inline-end]:slide-in-from-left-1",
              "data-closed:data-[side=bottom]:slide-out-to-top-1 data-closed:data-[side=top]:slide-out-to-bottom-1",
              className
            )}
            {...props}
          />
        </ComboboxPrimitive.Positioner>
      </ComboboxPrimitive.Portal>
    </ComboboxContentContext.Provider>
  )
}

function ComboboxList({ className, ...props }: ComboboxPrimitive.List.Props) {
  return (
    <ComboboxPrimitive.List
      data-slot="combobox-list"
      className={cn(
        "no-scrollbar max-h-80 min-h-0 scroll-py-(--overlay-padding) overflow-y-auto overscroll-contain p-(--overlay-padding) outline-none data-empty:p-0",
        className
      )}
      {...props}
    />
  )
}

function ComboboxItem({
  className,
  children,
  ...props
}: ComboboxPrimitive.Item.Props) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      className={cn(
        "group/combobox-item relative flex min-h-(--overlay-item-height) w-full cursor-default items-center gap-2 rounded-(--overlay-item-radius) py-1.5 ps-2.5 pe-9 text-sm text-foreground outline-none select-none",
        "transition-colors duration-(--duration-instant) ease-standard",
        "data-highlighted:bg-accent data-highlighted:text-accent-foreground data-[selected]:font-semibold",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
      <ComboboxPrimitive.ItemIndicator
        data-slot="combobox-item-indicator"
        render={
          <span className="pointer-events-none absolute end-2.5 flex size-4 items-center justify-center" />
        }
      >
        <CheckIcon className="size-4 text-foreground" strokeWidth={2.5} />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  )
}

function ComboboxGroup({ className, ...props }: ComboboxPrimitive.Group.Props) {
  return (
    <ComboboxPrimitive.Group
      data-slot="combobox-group"
      className={cn("scroll-my-(--overlay-padding)", className)}
      {...props}
    />
  )
}

function ComboboxLabel({
  className,
  ...props
}: ComboboxPrimitive.GroupLabel.Props) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="combobox-label"
      className={cn(
        "flex h-8 items-end px-2.5 pb-1.5 text-caption font-semibold text-muted-foreground select-none",
        className
      )}
      {...props}
    />
  )
}

function ComboboxCollection({ ...props }: ComboboxPrimitive.Collection.Props) {
  return (
    <ComboboxPrimitive.Collection data-slot="combobox-collection" {...props} />
  )
}

/**
 * Shown when nothing matches. It stays mounted (Base UI announces it to
 * screen readers) and collapses when there is nothing to say.
 */
function ComboboxEmpty({ className, ...props }: ComboboxPrimitive.Empty.Props) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn(
        "px-4 py-8 text-center text-sm text-muted-foreground empty:p-0",
        className
      )}
      {...props}
    />
  )
}

function ComboboxSeparator({
  className,
  ...props
}: ComboboxPrimitive.Separator.Props) {
  return (
    <ComboboxPrimitive.Separator
      data-slot="combobox-separator"
      className={cn(
        "-mx-(--overlay-padding) my-(--overlay-padding) h-px bg-border",
        className
      )}
      {...props}
    />
  )
}

function ComboboxChips({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof ComboboxPrimitive.Chips> &
  ComboboxPrimitive.Chips.Props) {
  return (
    <ComboboxPrimitive.Chips
      data-slot="combobox-chips"
      className={cn(
        "flex min-h-(--control-height-md) w-full min-w-0 flex-wrap items-center gap-1.5 rounded-(--control-radius) border border-input bg-muted py-2 ps-(--control-padding-x) pe-2 text-sm text-foreground",
        "transition-[background-color,border-color] duration-(--duration-fast) ease-standard",
        "hover:border-foreground/25",
        "has-[input:focus-visible]:border-ring has-[input:focus-visible]:focus-ring",
        "has-aria-invalid:border-destructive",
        "has-data-[slot=combobox-chip]:ps-2",
        "has-disabled:pointer-events-none has-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

function ComboboxChip({
  className,
  children,
  showRemove = true,
  ...props
}: ComboboxPrimitive.Chip.Props & {
  showRemove?: boolean
}) {
  return (
    <ComboboxPrimitive.Chip
      data-slot="combobox-chip"
      className={cn(
        "group/combobox-chip flex h-(--badge-height) w-fit items-center justify-center gap-1 rounded-(--badge-radius) border border-border bg-background px-2.5 text-caption font-semibold whitespace-nowrap text-foreground outline-none",
        "transition-[background-color,border-color,color] duration-(--duration-fast) ease-standard",
        "focus:border-primary focus:bg-primary focus:text-primary-foreground",
        "has-data-[slot=combobox-chip-remove]:pe-0.5",
        "aria-disabled:pointer-events-none aria-disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      {showRemove && (
        <ComboboxPrimitive.ChipRemove
          data-slot="combobox-chip-remove"
          aria-label="Remove"
          className={cn(
            "grid size-5 place-items-center rounded-full text-muted-foreground outline-none",
            "transition-[background-color,color] duration-(--duration-fast) ease-standard",
            "hover:bg-accent hover:text-foreground",
            "group-focus/combobox-chip:text-primary-foreground group-focus/combobox-chip:hover:bg-primary-foreground/15",
            "[&_svg]:pointer-events-none [&_svg]:size-3"
          )}
        >
          <XIcon strokeWidth={2.5} />
        </ComboboxPrimitive.ChipRemove>
      )}
    </ComboboxPrimitive.Chip>
  )
}

function ComboboxChipsInput({
  className,
  ...props
}: ComboboxPrimitive.Input.Props) {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-chip-input"
      className={cn(
        "h-(--badge-height) min-w-24 flex-1 bg-transparent px-1 text-sm text-foreground outline-none placeholder:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function useComboboxAnchor() {
  return React.useRef<HTMLDivElement | null>(null)
}

export {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxGroup,
  ComboboxLabel,
  ComboboxCollection,
  ComboboxEmpty,
  ComboboxSeparator,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxTrigger,
  ComboboxValue,
  ComboboxClear,
  useComboboxAnchor,
}
