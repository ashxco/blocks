/**
 * The shadcn-compatible registry Blocks serves from <origin>/r/: the base
 * item (blocks.json), one item per component (<slug>.json) and the index
 * (registry.json). Server-safe; only the copy control is a client component.
 */
import { CopyButton } from "@/components/viewer/copy-button"
import { siteUrl } from "@/lib/site"
import { cn } from "@/lib/utils"

export const registryUrl = `${siteUrl}/r`

/** The registry item for a component slug, or "blocks" for the base. */
export function registryItemUrl(slug: string) {
  return `${registryUrl}/${slug}.json`
}

/**
 * Items whose files shadcn init writes itself (lib/utils.ts and
 * components/ui/button.tsx): the Blocks versions replace them, so these two
 * install with --overwrite. Every other item needs no flag.
 */
const overwrites = new Set(["blocks", "button"])

/** The shadcn CLI command that installs one item. */
export function installCommand(slug: string) {
  const flag = overwrites.has(slug) ? " --overwrite" : ""
  return `npx shadcn@latest add ${registryItemUrl(slug)}${flag}`
}

/**
 * One command or URL on a muted, hairline-bordered row, in the mono face,
 * with a copy control. Long values scroll inside the row instead of wrapping.
 */
export function CommandRow({
  text,
  label = "Copy command",
  className,
}: {
  text: string
  /** Accessible name of the copy control. */
  label?: string
  className?: string
}) {
  return (
    <div
      data-slot="command-row"
      className={cn(
        "flex w-fit max-w-full min-w-0 items-center gap-2 rounded-(--control-radius) border bg-muted py-1 pr-1 pl-4",
        className
      )}
    >
      <code className="min-w-0 [scrollbar-width:thin] overflow-x-auto font-mono text-code whitespace-nowrap text-foreground">
        {text}
      </code>
      <CopyButton text={text} label={label} className="shrink-0" />
    </div>
  )
}

/** The install command for a component, shown under its page header. */
export function InstallCommand({
  slug,
  className,
}: {
  slug: string
  className?: string
}) {
  return (
    <CommandRow
      text={installCommand(slug)}
      label="Copy install command"
      className={className}
    />
  )
}
