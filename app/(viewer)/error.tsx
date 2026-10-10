"use client"

import Link from "next/link"
import { ArrowLeftIcon, RotateCwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

/**
 * Shown in place of a viewer page that failed to render. The sidebar stays,
 * so the visitor can retry or go elsewhere.
 */
export default function ViewerError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <div className="grid min-h-[60dvh] content-center gap-8">
      <div className="grid gap-4">
        <h1 className="text-display text-foreground">This page did not load.</h1>
        <p className="max-w-prose text-lead text-copy">
          Something went wrong while showing it. Try again, or go back to the overview.
          {error.digest ? <span className="mt-2 block font-mono text-caption text-muted-foreground">Error {error.digest}</span> : null}
        </p>
      </div>
      <div className="grid gap-3 sm:flex sm:flex-wrap">
        <Button size="lg" onClick={() => retry()}>
          <RotateCwIcon data-icon="inline-start" />
          Try Again
        </Button>
        <Button size="lg" variant="outline" nativeButton={false} render={<Link href="/" />}>
          <ArrowLeftIcon data-icon="inline-start" />
          Back to the Overview
        </Button>
      </div>
    </div>
  )
}
