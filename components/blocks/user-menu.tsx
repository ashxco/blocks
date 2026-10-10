"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import {
  ChevronsUpDownIcon,
  CreditCardIcon,
  LifeBuoyIcon,
  LogOutIcon,
  MonitorIcon,
  MoonIcon,
  SunIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { personTone, type PersonTone } from "@/components/blocks/members-list/people"

export interface UserMenuUser {
  name: string
  email: string
  /** Defaults to the first letters of the name. */
  initials?: string
  image?: string
  /** Avatar fill. Defaults to the person's tint from the shared people list, so they look the same on every page. */
  tone?: PersonTone
}

export interface UserMenuProps {
  user?: UserMenuUser
  /** "avatar" for top bars; "full" adds the name and email, for sidebars. */
  variant?: "avatar" | "full"
  side?: "top" | "bottom" | "left" | "right"
  align?: "start" | "center" | "end"
  /** Where "Sign out" leads. */
  signOutHref?: string
  /**
   * Start with the menu open, for previews of the open state. The menu is
   * then non-modal, so the rest of the page stays usable.
   */
  defaultOpen?: boolean
  /**
   * Element to portal the menu into instead of <body>, e.g. a preview stage.
   * The menu then keeps to its side of the trigger inside it.
   */
  container?: HTMLElement | null
  className?: string
}

export const defaultUser: UserMenuUser = {
  name: "Maya Patel",
  email: "maya@acme.com",
}

const themes = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: MonitorIcon },
] as const

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

function UserAvatar({
  user,
  size = "md",
}: {
  user: UserMenuUser
  size?: "sm" | "md"
}) {
  return (
    <Avatar size={size === "sm" ? "sm" : "default"}>
      {user.image ? <AvatarImage src={user.image} alt="" /> : null}
      <AvatarFallback tone={user.tone ?? personTone(user.name)} className="text-xs">
        {user.initials ?? initialsOf(user.name)}
      </AvatarFallback>
    </Avatar>
  )
}

/**
 * The signed-in person's menu: account links, an Appearance switch (light,
 * dark or system) and sign out. The switch uses next-themes, so it needs the
 * app's ThemeProvider.
 */
export function UserMenu({
  user = defaultUser,
  variant = "avatar",
  side = "bottom",
  align = "end",
  signOutHref = "/live/sign-in",
  defaultOpen = false,
  container,
  className,
}: UserMenuProps) {
  // A page can force the mode (?mode=dark in previews); the radio shows the one on screen.
  const { theme, forcedTheme, setTheme } = useTheme()

  const trigger =
    variant === "full" ? (
      <button
        type="button"
        className={cn(
          "flex w-full min-w-0 items-center gap-3 rounded-(--control-radius) p-2 text-left outline-none",
          "transition-colors duration-(--duration-fast) ease-standard hover:bg-accent focus-visible:focus-ring aria-expanded:bg-accent",
          className
        )}
      />
    ) : (
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Account menu for ${user.name}`}
        className={cn("rounded-full", className)}
      />
    )

  return (
    <DropdownMenu defaultOpen={defaultOpen} modal={defaultOpen ? false : undefined}>
      <DropdownMenuTrigger render={trigger}>
        {variant === "full" ? (
          <>
            <UserAvatar user={user} />
            <span className="grid min-w-0 flex-1">
              <span className="truncate text-label text-foreground">
                {user.name}
              </span>
              <span className="truncate text-caption text-muted-foreground">
                {user.email}
              </span>
            </span>
            <ChevronsUpDownIcon
              aria-hidden="true"
              className="size-4 shrink-0 text-muted-foreground"
            />
          </>
        ) : (
          <UserAvatar user={user} />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side={side}
        align={align}
        sideOffset={8}
        container={container}
        // In a preview stage the popup keeps below its trigger and within the stage.
        collisionAvoidance={container ? { side: "none" } : undefined}
        collisionBoundary={container ?? undefined}
        className="w-(--popover-width-sm)"
      >
        <div className="flex items-center gap-3 px-2 py-2.5">
          <UserAvatar user={user} />
          <div className="grid min-w-0">
            <p className="truncate text-label text-foreground">{user.name}</p>
            <p className="truncate text-caption text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem render={<Link href="/live/app/settings" />}>
            <UserIcon />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/live/app/team" />}>
            <UsersIcon />
            Team
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/live/app/billing" />}>
            <CreditCardIcon />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/live/contact" />}>
            <LifeBuoyIcon />
            Help and support
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={forcedTheme ?? theme ?? "system"}
            onValueChange={(value) => setTheme(String(value))}
          >
            {themes.map((option) => (
              <DropdownMenuRadioItem
                key={option.value}
                value={option.value}
                closeOnClick={false}
              >
                <option.icon />
                {option.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href={signOutHref} />}>
          <LogOutIcon />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
