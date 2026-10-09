import * as React from "react"
import { cn } from "cn"

/**
 * Blocks message. Lays out one turn in a conversation: an avatar, then a
 * column with an optional header (name, time), the content (usually
 * bubbles) and an optional footer (status, actions).
 *
 * align="end" mirrors the layout for the person using the app. Pair it with
 * the ink bubble; leave the assistant on the canvas with the ghost bubble.
 */
function MessageGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-group"
      className={cn("flex min-w-0 flex-col gap-6", className)}
      {...props}
    />
  )
}

function Message({
  className,
  align = "start",
  ...props
}: React.ComponentProps<"div"> & { align?: "start" | "end" }) {
  return (
    <div
      data-slot="message"
      data-align={align}
      className={cn(
        "group/message relative flex w-full min-w-0 gap-3 text-sm/6 text-foreground data-[align=end]:flex-row-reverse",
        className
      )}
      {...props}
    />
  )
}

function MessageAvatar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-avatar"
      className={cn(
        "flex min-h-(--avatar-size-sm) w-fit min-w-(--avatar-size-sm) shrink-0 items-center justify-center self-start overflow-hidden rounded-full bg-secondary text-foreground",
        "[&>svg]:size-3.5 has-data-[slot=avatar]:bg-transparent",
        className
      )}
      {...props}
    />
  )
}

function MessageContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-content"
      className={cn(
        "flex w-full min-w-0 flex-col gap-1.5 wrap-break-word group-data-[align=end]/message:*:data-slot:self-end",
        className
      )}
      {...props}
    />
  )
}

function MessageHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-header"
      // text-caption stays outside cn(), which would read it as a colour.
      className={`text-caption ${cn(
        "flex min-h-(--avatar-size-sm) max-w-full min-w-0 items-center gap-2 px-4 text-muted-foreground",
        "*:[strong]:font-semibold *:[strong]:text-foreground",
        "group-has-data-[variant=ghost]/message:px-0",
        className
      )}`}
      {...props}
    />
  )
}

function MessageFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-footer"
      className={`text-caption ${cn(
        "flex max-w-full min-w-0 items-center gap-1 px-4 text-muted-foreground",
        "group-has-data-[variant=ghost]/message:px-0 group-data-[align=end]/message:justify-end",
        className
      )}`}
      {...props}
    />
  )
}

export {
  MessageGroup,
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageHeader,
}
