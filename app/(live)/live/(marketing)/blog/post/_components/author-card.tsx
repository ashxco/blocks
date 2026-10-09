import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface AuthorCardProps {
  name: string
  role: string
  initials: string
  bio: string
  /** Where "More from" links to. */
  href: string
  className?: string
}

/** The author's portrait, name, role and a short bio, closing the article. */
export function AuthorCard({ name, role, initials, bio, href, className }: AuthorCardProps) {
  const firstName = name.split(" ")[0]

  return (
    <section
      aria-label={`About ${name}`}
      className={cn(
        "grid gap-6 rounded-(--card-radius) bg-subtle p-(--card-padding) sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-8 sm:p-8",
        className
      )}
    >
      <Avatar size="xl">
        <AvatarFallback tone="violet">{initials}</AvatarFallback>
      </Avatar>
      <div className="grid gap-4">
        <div className="grid gap-1">
          <p className="text-h4 text-foreground">{name}</p>
          <p className="text-caption text-muted-foreground">{role}</p>
        </div>
        <p className="text-body text-copy">{bio}</p>
        <div>
          <Button variant="outline" size="sm" nativeButton={false} render={<Link href={href} />}>
            More from {firstName}
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </div>
      </div>
    </section>
  )
}
