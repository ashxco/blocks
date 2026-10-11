import * as React from "react"
import {
  BellIcon,
  CalendarIcon,
  ChartColumnIcon,
  FolderKanbanIcon,
  ListChecksIcon,
  ZapIcon,
} from "lucide-react"

import { themeScopeProps } from "@/lib/themes"
import { cn } from "@/lib/utils"

import { ThemeText } from "./by-theme"
import {
  fixedScales,
  formatValue,
  perTheme,
  refIn,
  scaleKind,
  sharedSteps,
  themes,
  themeScales,
  tokenByVar,
  valueIn,
  type DesignToken,
} from "./data"

/* The Foundations overview's tiles: a small live sample of each page, keyed by registry slug. */

/**
 * The theme's own scales (accent and neutral, so the tile changes with the
 * theme) and the status scales, on the steps they share (50 … 950).
 */
function ColorSample() {
  const scales = [
    ...themeScales(),
    ...fixedScales().filter((scale) => scaleKind(scale) === "status"),
  ]
  const steps = sharedSteps(scales)
  return (
    <div
      aria-hidden
      className="grid size-full gap-1 p-5"
      style={{
        gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${scales.length}, minmax(0, 1fr))`,
      }}
    >
      {scales.flatMap((scale) =>
        steps.map((step) => {
          const token = scale.steps.find((s) => s.step === step)?.token
          return token ? (
            <span
              key={`${scale.name}-${step}`}
              className="block rounded-xs border"
              style={{ backgroundColor: `var(${token.cssVar})` }}
            />
          ) : null
        })
      )}
    </div>
  )
}

/** How many presets the Themes tile shows on narrow screens, so each keeps its name. */
const NARROW_PRESETS = 3

/**
 * The presets side by side, each drawn in its own theme: its font, its
 * accent and its button shape. Narrow tiles show the first three, named;
 * from @prose up every preset fits.
 */
function ThemesSample() {
  return (
    <div
      aria-hidden
      className="grid size-full grid-cols-[repeat(var(--narrow),minmax(0,1fr))] gap-2 p-4 @prose:grid-cols-[repeat(var(--all),minmax(0,1fr))] @prose:gap-3 @prose:p-5"
      style={
        {
          "--narrow": Math.min(NARROW_PRESETS, themes.length),
          "--all": themes.length,
        } as React.CSSProperties
      }
    >
      {themes.map((theme, i) => (
        <span
          key={theme.id}
          {...themeScopeProps(
            theme.id,
            undefined,
            cn(
              "grid min-w-0 content-between gap-3 overflow-hidden rounded-(--card-radius) border bg-background p-3 @prose:p-4",
              i >= NARROW_PRESETS && "hidden @prose:grid"
            )
          )}
        >
          <span className="grid gap-1">
            <span className="text-h3 leading-none text-foreground">Aa</span>
            <span className="truncate text-caption text-muted-foreground">
              {theme.name}
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="block h-5 w-3/5 min-w-0 rounded-(--button-radius) bg-brand" />
            <span className="size-5 shrink-0 rounded-(--control-radius) border border-input bg-muted" />
          </span>
        </span>
      ))}
    </div>
  )
}

function TypeSample() {
  return (
    <div aria-hidden className="flex size-full items-end gap-4 p-6">
      <span className="text-7xl leading-none font-extrabold text-foreground">
        Aa
      </span>
      <span className="pb-1 font-mono text-4xl leading-none text-muted-foreground">
        Aa
      </span>
    </div>
  )
}

function SpacingSample() {
  const steps = [2, 4, 6, 10, 16, 24]
  return (
    <div aria-hidden className="grid size-full content-center gap-2 p-6">
      {steps.map((n) => (
        <span
          key={n}
          className="block h-2.5 rounded-xs bg-foreground"
          style={{ width: `min(100%, calc(var(--spacing) * ${n * 2}))` }}
        />
      ))}
    </div>
  )
}

/*
 * Four steps of the radius scale on equal squares (sm, lg, 2xl, full), far
 * enough apart to read as different shapes. Outlines use the strong line so
 * they hold up on the muted tile in both modes.
 */
function ShapeSample() {
  const square = "aspect-square w-full max-w-16 justify-self-center"
  return (
    <div
      aria-hidden
      className="grid size-full grid-cols-4 content-center items-center gap-3 p-6"
    >
      <span
        className={cn(
          square,
          "rounded-sm border border-border-strong bg-background"
        )}
      />
      <span
        className={cn(
          square,
          "rounded-lg border border-border-strong bg-background"
        )}
      />
      <span className={cn(square, "rounded-2xl bg-foreground")} />
      <span
        className={cn(
          square,
          "rounded-full border border-border-strong bg-background"
        )}
      />
    </div>
  )
}

/*
 * Two dots on rails, frozen at the same moment: ease-out has nearly arrived
 * while ease-in-out is halfway. Hover or focus the tile and both finish.
 */
const motionRails: { name: string; at: string; dot: string }[] = [
  { name: "out", at: "85%", dot: "bg-foreground ease-out" },
  { name: "in-out", at: "50%", dot: "bg-muted-foreground ease-in-out" },
]

function MotionSample() {
  return (
    <div aria-hidden className="grid size-full content-center gap-6 p-6">
      {motionRails.map((rail) => (
        <div
          key={rail.name}
          className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-3"
        >
          <span className="font-mono text-xs text-muted-foreground">
            {rail.name}
          </span>
          <span className="relative block h-4">
            <span className="absolute inset-x-0 top-1/2 h-(--border-width-strong) -translate-y-1/2 rounded-full bg-border-strong" />
            <span className="absolute top-1/2 left-0 h-4 w-(--border-width-strong) -translate-x-1/2 -translate-y-1/2 rounded-full bg-muted-foreground" />
            <span className="absolute top-1/2 left-full h-4 w-(--border-width-strong) -translate-x-1/2 -translate-y-1/2 rounded-full bg-muted-foreground" />
            <span
              className={cn(
                "absolute top-1/2 left-(--at) size-3 -translate-x-1/2 -translate-y-1/2 rounded-full transition-[left] duration-(--duration-slower) group-hover:[--at:100%] group-focus-visible:[--at:100%]",
                rail.dot
              )}
              style={{ "--at": rail.at } as React.CSSProperties}
            />
          </span>
        </div>
      ))}
    </div>
  )
}

function IconSample() {
  const icons = [
    FolderKanbanIcon,
    ListChecksIcon,
    CalendarIcon,
    ChartColumnIcon,
    ZapIcon,
    BellIcon,
  ]
  return (
    <div
      aria-hidden
      className="grid size-full grid-cols-3 place-items-center p-6 text-foreground"
    >
      {icons.map((Icon, i) => (
        <Icon key={i} className="size-6" />
      ))}
    </div>
  )
}

/** A small mark per token type: a chip for colour, a corner for radius, a bar for time, Aa for type. */
function TokenGlyph({ type, cssVar }: { type: string; cssVar: string }) {
  if (type === "color") {
    return (
      <span
        className="size-3.5 shrink-0 rounded-full border"
        style={{ backgroundColor: `var(${cssVar})` }}
      />
    )
  }
  if (type === "typography") {
    return (
      <span className="w-3.5 shrink-0 text-center text-xs leading-none font-extrabold text-foreground">
        Aa
      </span>
    )
  }
  if (type === "duration") {
    return (
      <span className="flex w-3.5 shrink-0 items-center">
        <span className="h-1 w-full rounded-full bg-foreground" />
      </span>
    )
  }
  /* Dimensions such as radius: one rounded corner, drawn as an outline. */
  return (
    <span className="size-3.5 shrink-0 rounded-tl-sm border-t-(length:--border-width-strong) border-l-(length:--border-width-strong) border-foreground" />
  )
}

function TokensSample() {
  const sample = ["--brand", "--radius-lg", "--duration-base", "--text-h2"]
    .map(tokenByVar)
    .filter((t): t is DesignToken => Boolean(t))
  return (
    <div aria-hidden className="grid size-full content-center p-5">
      <div className="grid overflow-hidden rounded-md border bg-background">
        {sample.map((t) => (
          <div
            key={t.cssVar}
            className="flex items-center gap-3 border-t px-3 py-2 first:border-t-0"
          >
            <TokenGlyph type={t.type} cssVar={t.cssVar} />
            <span className="font-mono text-xs text-foreground">
              {t.cssVar}
            </span>
            <span className="ml-auto truncate font-mono text-xs text-muted-foreground">
              {t.type === "typography" ? (
                "type role"
              ) : (
                <ThemeText
                  value={perTheme((theme) =>
                    t.dark
                      ? // Colour roles: the primitive behind each mode, in the page's theme.
                        `${refIn(t, "light", theme)} · ${refIn(t, "dark", theme)}`
                      : formatValue(t, valueIn(theme, t).value)
                  )}
                />
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export const samples: Record<
  string,
  { sample: React.ReactNode; span?: string }
> = {
  themes: {
    sample: <ThemesSample />,
    span: "@prose:col-span-2 @narrow:col-span-3",
  },
  colors: { sample: <ColorSample />, span: "@prose:col-span-2" },
  typography: { sample: <TypeSample /> },
  spacing: { sample: <SpacingSample /> },
  shape: { sample: <ShapeSample /> },
  motion: { sample: <MotionSample /> },
  iconography: { sample: <IconSample /> },
  tokens: { sample: <TokensSample />, span: "@narrow:col-span-2" },
}
