import type { Metadata } from "next"

import { NotFoundContent } from "@/components/viewer/not-found-content"
import { ThemeToggle } from "@/components/viewer/theme-toggle"
import { Wordmark } from "@/components/viewer/wordmark"

export const metadata: Metadata = {
  title: "Page not found",
  description: "There is no page at this address. Go back to the Blocks overview or open the live templates.",
}

/** Global 404, for any address outside the viewer and the live templates. */
export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="flex h-(--header-height-sm) shrink-0 items-center justify-between gap-4 px-gutter">
        <Wordmark />
        <ThemeToggle />
      </header>
      <main id="content" className="container-wide flex flex-1 flex-col justify-center pt-section-sm pb-section">
        <NotFoundContent />
      </main>
    </div>
  )
}
