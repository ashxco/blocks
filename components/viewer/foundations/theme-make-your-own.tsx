import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { CodeBlock } from "@/components/viewer/code-block"
import { withLook } from "@/lib/themes"
import { cn } from "@/lib/utils"

import { formatRatio, textContrast, wcagLevel } from "./color"
import { modes, themes, themeValues, tokenByVar } from "./data"
import { Code, Meta, ScopedChip, SubHeading } from "./layout"

/* The Themes page's "Make your own theme": the theme file, scoping, previewing and the two gates. */

const themeFile = `{
  "$description": "A fuchsia accent on ink, 8px buttons, 12px cards, Space Grotesk headings over Inter.",
  "$extensions": {
    "blocks": {
      "theme": { "name": "Orchid", "order": 5, "modes": ["light", "dark"] }
    }
  },
  "theme": {
    "accent": {
      "50": { "$value": "{color.fuchsia.50}" },
      "100": { "$value": "{color.fuchsia.100}" },
      "200": { "$value": "{color.fuchsia.200}" },
      "300": { "$value": "{color.fuchsia.300}" },
      "400": { "$value": "{color.fuchsia.400}" },
      "500": { "$value": "{color.fuchsia.500}" },
      "600": { "$value": "{color.fuchsia.600}" },
      "700": { "$value": "{color.fuchsia.700}" },
      "800": { "$value": "{color.fuchsia.800}" },
      "900": { "$value": "{color.fuchsia.900}" },
      "950": { "$value": "{color.fuchsia.950}" },
      "dim": { "$value": "{color.fuchsia.dim}" }
    }
  },
  "component": {
    "button": { "radius": { "$value": "{radius.sm}" } },
    "card": { "radius": { "$value": "{radius.md}" } },
    "badge": { "radius": { "$value": "{radius.xs}" } }
  },
  "font": {
    "family": {
      "heading": {
        "$value": [
          "var(--font-space-grotesk)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif"
        ],
        "$extensions": { "blocks": { "name": "Space Grotesk" } }
      },
      "sans": {
        "$value": [
          "var(--font-inter)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif"
        ],
        "$extensions": { "blocks": { "name": "Inter" } }
      }
    }
  },
  "type": {
    "h1": { "$value": { "letterSpacing": "-0.03em" } },
    "h2": { "$value": { "letterSpacing": "-0.028em" } }
  },
  "light": {
    "color": { "ring": { "$value": "{theme.accent.700}" } }
  }
}
`

const scopeCode = `// Any element. The theme applies to its subtree;
// the mode comes from the nearest .dark or .light.
<section data-theme="ocean" className="dark bg-background text-copy">
  …
</section>

// In React, from server or client components

<ThemeScope theme="forest" mode="light" className="bg-background">
  {/* Menus and dialogs opened in here use Forest, light */}
  <PortalScope theme="forest" className="light">…</PortalScope>
</ThemeScope>
`

/* The terminal surface sits close to the dark canvas, so a hairline keeps its edge in dark mode. */
const codeFrame = "rounded-(--card-radius) border"

const commands = `npm run tokens
npm run contrast
npm run contrast -- --all
npm run themes
`

const settable: { keys: string[]; sets: string }[] = [
  {
    keys: ["theme.accent.50 … 950", "dim"],
    sets: "The accent scale that links, focus, the brand button and highlights read. Point each step at a fixed scale, such as {color.cobalt.600}, or give it an OKLCH value.",
  },
  {
    keys: ["theme.neutral.0 … 1000"],
    sets: "The neutral scale, and with it the tint of every surface, line and text colour.",
  },
  {
    keys: ["radius.xs … 4xl"],
    sets: "The radius scale. Component radii that point at it follow: controls at md, cards at lg, dialogs at xl, panels at 2xl.",
  },
  {
    keys: [
      "component.button.radius",
      "component.button.radius-sm",
      "component.card.radius",
      "component.badge.radius",
      "component.kern.pull",
      "component.link.decoration-line",
    ],
    sets: "Component tokens: a shape of its own for buttons, cards or badges, how far display headings pull in punctuation for the font, and whether links underline at rest.",
  },
  {
    keys: ["font.family.sans", "font.family.heading", "font.family.mono"],
    sets: "Font stacks, with the family's name in $extensions.blocks.name and its genre (geometric, neo-grotesque, grotesque, humanist, serif or mono) in $extensions.blocks.genre. The heading face follows the sans face unless the theme gives it one, such as Forest's grotesque, Ember's serif or Mono's monospace.",
  },
  {
    keys: ["type.<role>"],
    sets: 'Tracking only: { "letterSpacing": … }, where a font needs it.',
  },
  {
    keys: ["light.color.*", "dark.color.*"],
    sets: "One semantic colour in one mode, such as Mono's ink accent.",
  },
]

const previewLinks: { label: string; href: string }[] = [
  {
    label: "Components in Ember, dark",
    href: withLook("/components", { theme: "ember", mode: "dark" }),
  },
  {
    label: "Dialog in Forest, light",
    href: withLook("/components/dialog", { theme: "forest", mode: "light" }),
  },
  {
    label: "Colour in Mono",
    href: withLook("/foundations/colors", { theme: "mono" }),
  },
]

/*
 * The pairs of the gate that come closest to failing, per theme and mode,
 * computed from the token values. A column with several pairs shows the
 * lowest.
 */
const gatePairs: {
  pairs: [text: string, surface: string][]
  label: string
  min: number
}[] = [
  {
    pairs: [["--muted-foreground", "--muted"]],
    label: "Meta on muted",
    min: 4.5,
  },
  { pairs: [["--brand", "--background"]], label: "Accent text", min: 4.5 },
  {
    pairs: [["--panel-brand", "--panel-raised"]],
    label: "Accent on panels",
    min: 4.5,
  },
  {
    pairs: (["destructive", "success", "warning", "info"] as const).map((s) => [
      `--${s}`,
      `--${s}-subtle`,
    ]),
    label: "Status on its fill",
    min: 4.5,
  },
  {
    pairs: [
      ["--ring", "--background"],
      ["--ring", "--panel"],
      ["--ring", "--panel-raised"],
    ],
    label: "Focus ring",
    min: 3,
  },
]

function GateRatio({ ratio, min }: { ratio: number | null; min: number }) {
  if (ratio === null) return <Meta>Not computed</Meta>
  const pass = ratio >= min
  return (
    <span className="flex items-baseline gap-2">
      <span className="font-mono text-xs text-foreground tabular">
        {formatRatio(ratio)}
      </span>
      {pass ? (
        <span className="text-caption text-muted-foreground">
          {min === 3 ? "3:1" : wcagLevel(ratio)}
        </span>
      ) : (
        <Badge variant="destructive">Fail</Badge>
      )}
    </span>
  )
}

function ContrastGate() {
  const canvas = tokenByVar("--background")
  const rows = themes.flatMap((theme) =>
    modes.map(({ value: mode, label }) => {
      const base = canvas ? themeValues(canvas, theme.id)[mode] : ""
      return {
        key: `${theme.id}-${mode}`,
        theme,
        mode,
        label,
        ratios: gatePairs.map((column) => {
          const ratios = column.pairs.flatMap(([textVar, surfaceVar]) => {
            const text = tokenByVar(textVar)
            const surface = tokenByVar(surfaceVar)
            const ratio =
              text && surface
                ? textContrast(
                    themeValues(text, theme.id)[mode],
                    themeValues(surface, theme.id)[mode],
                    base
                  )
                : null
            return ratio === null ? [] : [ratio]
          })
          return ratios.length ? Math.min(...ratios) : null
        }),
      }
    })
  )
  const th =
    "h-(--table-row-height-sm) px-4 text-left align-middle text-caption font-semibold text-muted-foreground"
  return (
    <div className="overflow-x-auto rounded-(--card-radius) border">
      <table className="w-full min-w-xl border-collapse">
        <caption className="sr-only">
          Contrast of the tightest pairs in every theme and mode
        </caption>
        <thead className="bg-subtle">
          <tr>
            <th scope="col" className={th}>
              Theme
            </th>
            {gatePairs.map((pair) => (
              <th key={pair.label} scope="col" className={th}>
                {pair.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-t">
              <th
                scope="row"
                className="h-(--table-row-height-sm) px-4 text-left align-middle font-normal"
              >
                <span className="flex items-center gap-2.5">
                  <ScopedChip
                    cssVar="--brand"
                    theme={row.theme.id}
                    mode={row.mode}
                    className="size-4"
                  />
                  <span className="text-label text-foreground">
                    {row.theme.name}
                  </span>
                  <span className="text-caption text-muted-foreground">
                    {row.label}
                  </span>
                </span>
              </th>
              {row.ratios.map((ratio, i) => (
                <td key={gatePairs[i].label} className="px-4 align-middle">
                  <GateRatio ratio={ratio} min={gatePairs[i].min} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function MakeYourOwn() {
  return (
    <div className="grid gap-16">
      <div className="grid gap-8 @narrow:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] @narrow:items-start @narrow:gap-10">
        <div className="grid content-start gap-6">
          <div className="grid gap-2">
            <SubHeading>The theme file</SubHeading>
            <p className="text-body text-copy">
              Add <Code>design-system/themes/&lt;id&gt;.tokens.json</Code>. It
              holds only what it changes, plus a description and its name, order
              and modes. Everything else stays as the default theme has it.
            </p>
          </div>
          <ul className="grid border-b">
            {settable.map((row) => (
              <li key={row.keys.join()} className="grid gap-1 border-t py-3.5">
                <span className="flex flex-wrap gap-x-3 gap-y-0.5">
                  {row.keys.map((key) => (
                    <code
                      key={key}
                      className="font-mono text-code whitespace-nowrap text-foreground"
                    >
                      {key}
                    </code>
                  ))}
                </span>
                <span className="text-caption text-copy">{row.sets}</span>
              </li>
            ))}
          </ul>
          <p className="text-caption text-copy">
            A theme never changes spacing, sizes, type sizes or weights, motion,
            or what the status colours mean. Tokens with breakpoint values
            cannot be themed. The build stops with an error on anything else. A
            new scale goes in <Code>primitives.tokens.json</Code>:{" "}
            <Code>node scripts/color-scale.mjs accent 330 0.2</Code> prints one
            built like the others, such as the fuchsia scale the example points
            at. A new font is self-hosted: its woff2 goes in{" "}
            <Code>app/fonts</Code> and loads with <Code>next/font/local</Code>{" "}
            in <Code>app/layout.tsx</Code>, with a <Code>variable</Code> and{" "}
            <Code>preload: false</Code>, and the theme names that variable.
          </p>
        </div>
        <div className="grid min-w-0 gap-3">
          <Meta>design-system/themes/orchid.tokens.json</Meta>
          <CodeBlock code={themeFile} className={codeFrame} />
        </div>
      </div>

      <div className="grid gap-8 @narrow:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] @narrow:items-start @narrow:gap-10">
        <div className="grid content-start gap-6">
          <div className="grid gap-2">
            <SubHeading>Scope it</SubHeading>
            <p className="text-body text-copy">
              <Code>data-theme=&quot;&lt;id&gt;&quot;</Code> on any element
              gives its subtree that theme, the way <Code>.dark</Code> and{" "}
              <Code>.light</Code> give it a mode. No attribute means Blocks.
              Scopes nest in any order: each element takes the nearest theme and
              the nearest mode.
            </p>
          </div>
          <div className="grid gap-2">
            <SubHeading>Preview it</SubHeading>
            <p className="text-body text-copy">
              <Code>?theme=&lt;id&gt;</Code> forces a theme for one page and{" "}
              <Code>&amp;mode=dark</Code> or <Code>light</Code> forces the mode.
              Neither is saved, so links and screenshots never change
              anyone&apos;s choice.
            </p>
            <ul className="grid gap-1.5 pt-1">
              {previewLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-label text-brand link-underline outline-none focus-visible:focus-ring"
                  >
                    {link.label}
                  </Link>{" "}
                  <Meta>{link.href}</Meta>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <CodeBlock code={scopeCode} className={cn("min-w-0", codeFrame)} />
      </div>

      <div className="grid gap-8">
        <div className="grid gap-8 @narrow:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] @narrow:items-start @narrow:gap-10">
          <div className="grid gap-2">
            <SubHeading>Pass the gates</SubHeading>
            <p className="text-body text-copy">
              <Code>npm run tokens</Code> compiles every theme into the CSS and
              the typed token list. <Code>npm run contrast</Code> then checks
              every theme in light and dark against WCAG AA: 4.5:1 for text,
              links and status colours on the surfaces they sit on, 3:1 for the
              focus ring on the canvas and on panels and for every chart series,
              and 4.5:1 for the syntax colours of code blocks on the terminal.
              Lines are not gated: they are hairlines by design. Add{" "}
              <Code>-- --all</Code> to print every ratio.
            </p>
            <p className="text-body text-copy">
              <Code>npm run themes</Code> checks that the theme is an identity
              of its own, not a recolour: against every other theme it has to
              differ on at least four of six traits, the accent hue, the
              neutrals&apos; tint, the button shape, the card radius, and the
              kind of heading face and of text face. Faces compare by genre, so
              two geometric sans count as alike. It prints each theme&apos;s
              traits and what every pair shares. <Code>npm run check</Code> runs
              all three, and a failure stops it. The table shows the contrast
              pairs that come closest.
            </p>
          </div>
          <CodeBlock code={commands} className={cn("min-w-0", codeFrame)} />
        </div>
        <ContrastGate />
      </div>
    </div>
  )
}
