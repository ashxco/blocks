"use client"

import * as React from "react"
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar"
import { cn } from "@/lib/utils"

type AvatarSize = "sm" | "default" | "lg" | "xl"
type AvatarTone = "violet" | "mint" | "sand" | "sky" | "rose" | "muted"

/**
 * Blocks avatar. Sizes come from --avatar-size-*. Images get a faint
 * hairline so light photos keep their edge; fallbacks sit on flat tint fills.
 * In an AvatarGroup, avatars overlap with a cut-out in the page colour.
 */
function Avatar({
  className,
  size = "default",
  ...props
}: AvatarPrimitive.Root.Props & {
  size?: AvatarSize
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(
        "group/avatar relative flex size-(--avatar-size-md) shrink-0 rounded-full select-none",
        "data-[size=lg]:size-(--avatar-size-lg) data-[size=sm]:size-(--avatar-size-sm) data-[size=xl]:size-(--avatar-size-xl)",
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-full after:border after:border-foreground/8",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(
        "aspect-square size-full rounded-full object-cover",
        className
      )}
      {...props}
    />
  )
}

const toneClasses: Record<AvatarTone, string> = {
  violet: "bg-tint-violet",
  mint: "bg-tint-mint",
  sand: "bg-tint-sand",
  sky: "bg-tint-sky",
  rose: "bg-tint-rose",
  muted: "bg-muted",
}

const autoTones: AvatarTone[] = ["violet", "mint", "sand", "sky", "rose"]

/** Picks the same tint for the same initials on every render and server. */
function toneFor(children: React.ReactNode): AvatarTone {
  if (typeof children !== "string" || children.length === 0) return "violet"
  let hash = 0
  for (let i = 0; i < children.length; i++) {
    hash = (hash * 31 + children.charCodeAt(i)) >>> 0
  }
  return autoTones[hash % autoTones.length]
}

function AvatarFallback({
  className,
  tone,
  children,
  ...props
}: AvatarPrimitive.Fallback.Props & {
  /** Tint behind the initials. Defaults to a stable tint picked from the initials. */
  tone?: AvatarTone
}) {
  const resolvedTone = tone ?? toneFor(children)
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      data-tone={resolvedTone}
      className={cn(
        // Tight, relative to the theme's own text-sm tracking (-0.025em where it has none).
        "flex size-full items-center justify-center rounded-full text-sm font-bold tracking-[calc(var(--text-sm--letter-spacing)-0.025em)] text-foreground uppercase",
        "group-data-[size=lg]/avatar:text-base group-data-[size=sm]/avatar:text-xs group-data-[size=xl]/avatar:text-2xl",
        "[&>svg]:size-[45%] [&>svg]:text-muted-foreground",
        toneClasses[resolvedTone],
        className
      )}
      {...props}
    >
      {children}
    </AvatarPrimitive.Fallback>
  )
}

/** A status dot or small icon on the avatar's lower edge. Colour it with bg-success, bg-warning… */
function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground outline-2 outline-background select-none",
        "size-2.5 [&>svg]:size-2",
        "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=lg]/avatar:size-3.5 group-data-[size=lg]/avatar:[&>svg]:size-2.5",
        "group-data-[size=xl]/avatar:right-0.5 group-data-[size=xl]/avatar:bottom-0.5 group-data-[size=xl]/avatar:size-4.5 group-data-[size=xl]/avatar:outline-3 group-data-[size=xl]/avatar:[&>svg]:size-3",
        className
      )}
      {...props}
    />
  )
}

/**
 * Overlapping avatars. Each one is cut out from the next with a ring in the
 * page colour. The overlap plus the 2px ring stays clear of the second letter
 * of two-letter initials at every size.
 */
function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "group/avatar-group flex items-center -space-x-1",
        "has-data-[size=lg]:-space-x-1.5 has-data-[size=sm]:-space-x-0.5 has-data-[size=xl]:-space-x-3",
        "*:data-[slot=avatar]:outline-2 *:data-[slot=avatar]:outline-background",
        className
      )}
      {...props}
    />
  )
}

/** The "+4" at the end of a group. */
function AvatarGroupCount({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "relative flex size-(--avatar-size-md) shrink-0 items-center justify-center rounded-full border border-border bg-muted text-xs font-semibold text-muted-foreground tabular-nums outline-2 outline-background",
        "group-has-data-[size=sm]/avatar-group:size-(--avatar-size-sm)",
        "group-has-data-[size=lg]/avatar-group:size-(--avatar-size-lg) group-has-data-[size=lg]/avatar-group:text-sm",
        "group-has-data-[size=xl]/avatar-group:size-(--avatar-size-xl) group-has-data-[size=xl]/avatar-group:text-lg",
        "[&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
        className
      )}
      {...props}
    />
  )
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
}
