"use client"

import "./globals.css"

/**
 * Last-resort error page, for a failure in the root layout itself. It
 * replaces the whole document, so it brings its own <html>, styles and
 * title, and keeps to the default theme in the visitor's system mode.
 */
export default function GlobalError({
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  return (
    <html lang="en">
      <body className="grid min-h-dvh place-items-center bg-background px-gutter text-copy">
        <title>Something went wrong · Blocks</title>
        <main className="grid max-w-prose gap-6">
          <h1 className="text-h1 text-foreground">Something went wrong.</h1>
          <p className="text-lead">
            Blocks could not load. Try again in a moment.
          </p>
          <button
            type="button"
            onClick={() => retry()}
            className="h-(--button-height-md) justify-self-start rounded-(--button-radius) bg-primary px-5 text-label text-primary-foreground outline-none focus-visible:focus-ring"
          >
            Try Again
          </button>
        </main>
      </body>
    </html>
  )
}
