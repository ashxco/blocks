"use client"

import * as React from "react"
import { CheckIcon, CopyIcon, RefreshCwIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/toast"

export interface RecoveryCode {
  code: string
  used?: boolean
}

export const INITIAL_RECOVERY_CODES: RecoveryCode[] = [
  { code: "7KQ2-M9XD" },
  { code: "P4TW-83NF" },
  { code: "HX6R-2LCV", used: true },
  { code: "D9JM-Q5ZA" },
  { code: "3VBN-K7EP" },
  { code: "W2FS-6TYH" },
  { code: "L8CG-R4UM", used: true },
  { code: "N5QE-J3XK" },
  { code: "B6ZT-9PWD" },
  { code: "R3HY-V2MC" },
]

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"

function randomCode() {
  const values = new Uint32Array(8)
  crypto.getRandomValues(values)
  const chars = Array.from(values, (v) => ALPHABET[v % ALPHABET.length])
  return `${chars.slice(0, 4).join("")}-${chars.slice(4).join("")}`
}

/** Shows the recovery codes, copies the unused ones and generates a fresh set. */
export function RecoveryCodesDialog({
  codes,
  onRegenerate,
}: {
  codes: RecoveryCode[]
  onRegenerate: (codes: RecoveryCode[]) => void
}) {
  const [copied, setCopied] = React.useState(false)
  const unused = codes.filter((c) => !c.used)

  React.useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  async function copy() {
    try {
      await navigator.clipboard.writeText(unused.map((c) => c.code).join("\n"))
      setCopied(true)
    } catch {
      toast.add({
        type: "error",
        title: "Couldn’t copy the codes",
        description: "Your browser blocked the clipboard. Select the codes and copy them instead.",
      })
    }
  }

  function regenerate() {
    onRegenerate(Array.from({ length: 10 }, () => ({ code: randomCode() })))
    setCopied(false)
    toast.add({
      title: "New recovery codes ready",
      description: "Your old codes stopped working. Save the new ones before you close this window.",
    })
  }

  return (
    <Dialog>
      <DialogTrigger render={<Button type="button" variant="outline" size="sm" />}>View codes</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Recovery codes</DialogTitle>
          <DialogDescription>
            Keep these somewhere safe, away from your laptop. Each code works once. Used codes are crossed out.
          </DialogDescription>
        </DialogHeader>

        <ul
          aria-label={`${unused.length} unused recovery codes`}
          className="grid grid-cols-2 gap-x-6 gap-y-2.5 rounded-(--card-radius) border bg-subtle p-5 font-mono text-code text-foreground"
        >
          {codes.map((c) => (
            <li key={c.code} className={cn("tabular", c.used && "text-muted-foreground line-through")}>
              {c.code}
              {c.used ? <span className="sr-only"> (used)</span> : null}
            </li>
          ))}
        </ul>

        <DialogFooter className="sm:justify-between">
          <Button type="button" variant="ghost" onClick={regenerate}>
            <RefreshCwIcon data-icon="inline-start" />
            Regenerate
          </Button>
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <DialogClose render={<Button type="button" variant="outline" />}>Done</DialogClose>
            <Button type="button" onClick={copy}>
              {copied ? <CheckIcon data-icon="inline-start" /> : <CopyIcon data-icon="inline-start" />}
              {copied ? "Copied" : "Copy codes"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
