import { ArrowRightIcon, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { ByTheme, ThemeText } from "./by-theme"
import {
  modes,
  perTheme,
  refIn,
  tokenByName,
  tokenByVar,
  valueIn,
  type DesignToken,
  type Mode,
  type ThemeId,
} from "./data"

/* The Foundations overview's panel: one token followed from primitive to role to component. */

/**
 * The primitive a colour role reads in one mode of a theme: --bk-accent-600
 * for the default brand, --bk-neutral-950 for Mono's ink one. A role with a
 * raw value falls back to its default reference.
 */
function primitiveIn(t: DesignToken, mode: Mode, theme: ThemeId) {
  const v = valueIn(theme, t)
  const resolved = mode === "dark" && v.dark ? v.dark : v
  const ref =
    resolved.ref ?? (mode === "dark" ? t.dark?.ref : undefined) ?? t.ref
  return ref ? tokenByName(ref) : undefined
}

/**
 * The primitive card: the swatch, CSS variable and OKLCH value of the step
 * the role reads, in the theme and mode the page is on. Both modes go into
 * the HTML when they differ, and the dark variant picks one, so it is right
 * on the first frame.
 */
function PrimitiveStep({ role }: { role: DesignToken }) {
  const variants = (theme: ThemeId) => {
    const found = modes.map(({ value: mode }) => ({
      mode,
      token: primitiveIn(role, mode, theme),
    }))
    const [light, dark] = found
    const both = light.token?.cssVar === dark.token?.cssVar ? [light] : found
    return both.flatMap(({ mode, token }) =>
      token
        ? [
            {
              mode: both.length === 1 ? undefined : mode,
              cssVar: token.cssVar,
              value: String(valueIn(theme, token).value),
            },
          ]
        : []
    )
  }
  return (
    <ByTheme as="div" by={(theme) => JSON.stringify(variants(theme))}>
      {(theme) =>
        variants(theme).map((v) => (
          <div
            key={v.cssVar}
            className={cn(
              "grid content-start gap-4",
              v.mode === "light" && "dark:hidden",
              v.mode === "dark" && "hidden dark:grid"
            )}
          >
            <span
              aria-hidden
              className="block h-14 rounded-md border border-panel-border"
              style={{ backgroundColor: `var(${v.cssVar})` }}
            />
            <div className="grid gap-1">
              <p className="text-title text-panel-foreground">Primitive</p>
              <code className="font-mono text-code text-panel-muted">
                {v.cssVar}
              </code>
              <span className="font-mono text-xs text-panel-muted">
                {v.value}
              </span>
            </div>
          </div>
        ))
      }
    </ByTheme>
  )
}

export function TierChain() {
  const brand = tokenByVar("--brand")
  const radius = tokenByVar("--button-radius")
  const height = tokenByVar("--button-height-md")
  if (!brand) return null

  const step =
    "grid content-start gap-4 rounded-(--card-radius) border border-panel-border bg-panel-raised p-5"
  const arrow =
    "size-5 shrink-0 rotate-90 justify-self-center text-panel-muted @narrow:rotate-0 @narrow:self-center"
  return (
    <section
      aria-labelledby="tiers-title"
      className="grid gap-10 rounded-(--panel-radius) bg-panel p-(--panel-padding) text-panel-foreground"
    >
      <div className="grid gap-4 @narrow:grid-cols-2 @narrow:items-start @narrow:gap-10">
        <h2 id="tiers-title" className="text-h2 text-panel-foreground">
          One source of truth
        </h2>
        <p className="max-w-prose text-body text-panel-muted">
          Tokens are written once and compiled to CSS variables and Tailwind
          utilities. Change a primitive and every role and component that uses
          it follows, in light and dark. A theme re-points the primitives, so
          the same chain gives each theme its own look.
        </p>
      </div>

      <div className="grid gap-3 @narrow:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)]">
        <div className={step}>
          <PrimitiveStep role={brand} />
        </div>
        <ArrowRightIcon aria-hidden className={arrow} />
        <div className={step}>
          {/* The role on the page canvas, in the current theme. */}
          <span
            aria-hidden
            className="flex h-14 items-center gap-3 rounded-md border bg-background px-4"
          >
            <span className="size-3 shrink-0 rounded-full bg-brand" />
            <span className="truncate text-label text-brand">
              Links, focus, highlights
            </span>
          </span>
          <div className="grid gap-1">
            <p className="text-title text-panel-foreground">Semantic</p>
            <code className="font-mono text-code text-panel-muted">
              {[brand.cssVar, brand.utility].filter(Boolean).join(" · ")}
            </code>
            <span className="font-mono text-xs text-panel-muted">
              <ThemeText
                value={perTheme(
                  (theme) =>
                    `${refIn(brand, "light", theme)} light · ${refIn(brand, "dark", theme)} dark`
                )}
              />
            </span>
          </div>
        </div>
        <ArrowRightIcon aria-hidden className={arrow} />
        <div className={step}>
          <span className="flex h-14 items-center">
            <Button type="button" variant="brand" tabIndex={-1} aria-hidden>
              <PlusIcon data-icon="inline-start" />
              Create Project
            </Button>
          </span>
          <div className="grid gap-1">
            <p className="text-title text-panel-foreground">Component</p>
            <code className="font-mono text-code text-panel-muted">
              Button variant=&quot;brand&quot;
            </code>
            {[radius, height].map((t) =>
              t ? (
                <span
                  key={t.cssVar}
                  className="font-mono text-xs text-panel-muted"
                >
                  {t.cssVar}
                </span>
              ) : null
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
