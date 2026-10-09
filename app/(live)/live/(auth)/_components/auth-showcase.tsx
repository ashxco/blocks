import { Avatar, AvatarFallback } from "@/components/ui/avatar"

import { DeployLog } from "./deploy-log"

/**
 * The dark side of the account screens: what Lumen does, a deploy streaming
 * in, and a customer who ships with it.
 */
export function AuthShowcase() {
  return (
    <div className="flex h-full min-h-0 flex-col justify-between gap-10 overflow-hidden rounded-(--panel-radius) bg-panel p-10 text-panel-muted xl:p-14">
      <div className="grid max-w-prose gap-5">
        <h2 className="text-h2 text-panel-foreground">Push to main. Live in under a minute.</h2>
        <p className="max-w-104 text-body">
          Every pull request gets its own preview URL. Every merge rolls out to 35 regions, with logs, metrics and
          instant rollbacks in one place.
        </p>
      </div>

      <DeployLog />

      <figure className="m-0 grid gap-6 border-t border-panel-border pt-8">
        <blockquote>
          <p className="text-title text-panel-foreground">
            “Release day is gone from our calendar. Main reaches production four minutes after we merge.”
          </p>
        </blockquote>
        <figcaption className="flex items-center gap-3">
          <Avatar className="after:hidden">
            <AvatarFallback tone="mint">PS</AvatarFallback>
          </Avatar>
          <span className="grid">
            <span className="text-label text-panel-foreground">Priya Shah</span>
            <span className="text-caption">CTO, Fernhill</span>
          </span>
        </figcaption>
      </figure>
    </div>
  )
}
