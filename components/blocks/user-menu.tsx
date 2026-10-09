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

export interface UserMenuUser {
  name: string
  email: string
  /** Defaults to the first letters of the name. */
  initials?: string
  image?: string
}

export interface UserMenuProps {
  user?: UserMenuUser
  /** "avatar" for top bars; "full" adds the name and email, for sidebars. */
  variant?: "avatar" | "full"
  side?: "top" | "bottom" | "left" | "right"
  align?: "start" | "center" | "end"
  /** Where "Sign out" leads. */
  signOutHref?: string
  className?: string
}

export const defaultUser: UserMenuUser = {
  name: "Maya Chen",
  email: "maya@acme.dev",
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
      <AvatarFallback tone="violet" className="text-xs">
        {user.initials ?? initialsOf(user.name)}
      </AvatarFallback>
    </Avatar>
  )
}

/**
 * The signed-in person's menu: account links, a theme switch and sign out.
 * The theme switch uses next-themes, so it needs the app's ThemeProvider.
 */
export function UserMenu({
  user = defaultUser,
  variant = "avatar",
  side = "bottom",
  align = "end",
  signOutHref = "/live/sign-in",
  className,
}: UserMenuProps) {
  const { theme, setTheme } = useTheme()

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
    <DropdownMenu>
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
        className="w-64"
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
          <DropdownMenuLabel>Theme</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={theme ?? "system"}
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
