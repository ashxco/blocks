import type { Metadata } from "next"

import { Kern } from "@/components/ui/kern"
import { themes } from "@/lib/themes"
import { cn } from "@/lib/utils"

/*
 * The social card, as a page: a fixed 1200 × 630 box drawn with the real
 * tokens and fonts, outside the viewer layout. scripts/og.mjs screenshots it
 * into app/opengraph-image.png; it is not a page for visitors.
 */
export const metadata: Metadata = {
  title: "Social card",
  robots: { index: false, follow: false },
}

/** The Blocks mark (components/viewer/wordmark.tsx), at card size. */
function BlocksMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <rect x="0" y="0" width="9" height="9" rx="2" className="fill-current" />
      <rect x="11" y="0" width="9" height="9" rx="2" className="fill-current" />
      <rect x="0" y="11" width="9" height="9" rx="2" className="fill-current" />
      <rect
        x="11"
        y="11"
        width="9"
        height="9"
        rx="2"
        className="fill-brand stroke-background [stroke-width:calc(var(--brand-mark-ring)*2)]"
      />
    </svg>
  )
}

export default function SocialCardPage() {
  return (
    <main className="light bg-background text-foreground" data-theme="blocks">
      {/* The dev server's indicator would otherwise land in the capture. */}
      <style>{"nextjs-portal{display:none}"}</style>
      <div className="flex h-[630px] w-[1200px] flex-col justify-between border bg-background p-20">
        <BlocksMark className="size-24 text-foreground" />
        <div className="flex items-end justify-between gap-16">
          <div className="flex flex-col gap-4">
            <h1 className="text-hero text-foreground">
              <Kern>Blocks</Kern>
            </h1>
            <p className="text-3xl font-medium text-copy">
              <Kern>One library, five products.</Kern>
            </p>
          </div>
          <ul aria-label="Themes" className="flex shrink-0 items-center gap-3">
            {themes.map((theme) => (
              <li
                key={theme.id}
                data-theme={theme.id}
                title={theme.name}
                className="size-9 rounded-full bg-brand"
              />
            ))}
          </ul>
        </div>
      </div>
    </main>
  )
}
