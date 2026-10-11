import { CalendarIcon, FolderKanbanIcon, ListChecksIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

/** The overview's project card, shown twice for the light and dark comparison. */
export function ProjectCard() {
  return (
    <div className="grid w-full max-w-112 gap-5 rounded-(--card-radius) border bg-card p-(--card-padding) text-card-foreground">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-md bg-brand-subtle text-brand-subtle-foreground">
            <FolderKanbanIcon aria-hidden="true" className="size-4" />
          </span>
          <div className="grid min-w-0">
            {/* Wraps rather than truncates: a wide heading face (Mono's Geist Mono) needs the room on phones. */}
            <span className="text-title text-pretty text-foreground">
              Website relaunch
            </span>
            <span className="truncate text-caption text-muted-foreground">
              Marketing
            </span>
          </div>
        </div>
        <Badge variant="success" className="shrink-0">
          On track
        </Badge>
      </div>
      <div className="grid gap-2 text-caption text-copy">
        <span className="flex items-center gap-2">
          <CalendarIcon
            aria-hidden="true"
            className="size-3.5 text-muted-foreground"
          />
          Launches Nov 14
        </span>
        <span className="flex items-center gap-2">
          <ListChecksIcon
            aria-hidden="true"
            className="size-3.5 text-muted-foreground"
          />
          Next up: Review homepage copy
        </span>
      </div>
      <div className="grid gap-2">
        <div className="flex items-center justify-between text-caption">
          <span className="font-semibold text-foreground">Tasks done</span>
          <span className="text-muted-foreground tabular">38 of 52</span>
        </div>
        <Progress value={73} aria-label="Tasks done" />
      </div>
      {/* This row wraps on the narrowest phones rather than push the card past the screen. */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-5">
        <AvatarGroup>
          <Avatar size="sm">
            <AvatarFallback>PR</AvatarFallback>
          </Avatar>
          <Avatar size="sm">
            <AvatarFallback>MP</AvatarFallback>
          </Avatar>
          <Avatar size="sm">
            <AvatarFallback>SA</AvatarFallback>
          </Avatar>
        </AvatarGroup>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            Share
          </Button>
          <Button size="sm">Open</Button>
        </div>
      </div>
    </div>
  )
}
