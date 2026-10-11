import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

import { formatRatio, textContrast, wcagLevel } from "./color"
import { ByTheme } from "./by-theme"
import {
  perTheme,
  themeValues,
  tokenByVar,
  type Mode,
  type ThemeId,
} from "./data"
import { Meta } from "./layout"

const contrastPairs: { text: string; surface: string; use: string }[] = [
  {
    text: "--foreground",
    surface: "--background",
    use: "Headings and primary text",
  },
  { text: "--copy", surface: "--background", use: "Paragraphs" },
  {
    text: "--muted-foreground",
    surface: "--background",
    use: "Meta text and captions",
  },
  {
    text: "--muted-foreground",
    surface: "--subtle",
    use: "Captions on tinted bands",
  },
  {
    text: "--primary-foreground",
    surface: "--primary",
    use: "Primary buttons",
  },
  {
    text: "--secondary-foreground",
    surface: "--secondary",
    use: "Secondary buttons",
  },
  { text: "--brand", surface: "--background", use: "Links and highlights" },
  { text: "--brand-foreground", surface: "--brand", use: "Brand buttons" },
  {
    text: "--brand-subtle-foreground",
    surface: "--brand-subtle",
    use: "Quiet brand fills",
  },
  { text: "--destructive", surface: "--background", use: "Error messages" },
  {
    text: "--destructive-foreground",
    surface: "--destructive",
    use: "Destructive buttons",
  },
  { text: "--success", surface: "--background", use: "Success text" },
  { text: "--warning", surface: "--background", use: "Warning text" },
  { text: "--info", surface: "--background", use: "Informational text" },
  { text: "--panel-foreground", surface: "--panel", use: "Headings on panels" },
  { text: "--panel-muted", surface: "--panel", use: "Body text on panels" },
  {
    text: "--panel-brand",
    surface: "--panel",
    use: "Links and highlights on panels",
  },
  { text: "--panel-success", surface: "--panel", use: "Success on panels" },
  { text: "--panel-warning", surface: "--panel", use: "Warnings on panels" },
  { text: "--panel-destructive", surface: "--panel", use: "Errors on panels" },
  {
    text: "--terminal-foreground",
    surface: "--terminal",
    use: "Code and terminal output",
  },
]

/** The ratio, with the level it reaches as quiet text. Only a failure gets a badge. */
function Ratio({ ratio, label }: { ratio: number | null; label: string }) {
  if (ratio === null) return <Meta>Not computed</Meta>
  const level = wcagLevel(ratio)
  return (
    <div className="flex items-baseline gap-3">
      <span className="text-caption text-muted-foreground @narrow:hidden">
        {label}
      </span>
      <span className="font-mono text-label text-foreground tabular">
        {formatRatio(ratio)}
      </span>
      {level === "Fail" ? (
        <Badge variant="destructive">Fail</Badge>
      ) : (
        <span className="text-caption text-muted-foreground">{level}</span>
      )}
    </div>
  )
}

/** The ratio a pair reaches in one mode, printed for the theme the page is on. */
function ThemedRatio({
  ratios,
  mode,
  label,
}: {
  ratios: Record<ThemeId, Record<Mode, number | null>>
  mode: Mode
  label: string
}) {
  const key = (theme: ThemeId) => {
    const r = ratios[theme][mode]
    return r === null ? "none" : `${formatRatio(r)} ${wcagLevel(r)}`
  }
  return (
    <ByTheme as="div" by={key}>
      {(theme) => <Ratio ratio={ratios[theme][mode]} label={label} />}
    </ByTheme>
  )
}

/** The pair as each mode paints it: two equal chips, each with its own hairline. */
function Sample({ text, surface }: { text: string; surface: string }) {
  return (
    <div aria-hidden className="flex gap-2">
      {(["light", "dark"] as const).map((mode) => (
        <span
          key={mode}
          className="block size-10 overflow-hidden rounded-md border border-border-strong"
        >
          <span className={cn(mode, "block size-full bg-background")}>
            <span
              className="grid size-full place-items-center text-title"
              style={{
                color: `var(${text})`,
                backgroundColor: `var(${surface})`,
              }}
            >
              Aa
            </span>
          </span>
        </span>
      ))}
    </div>
  )
}

export function ContrastTable() {
  const canvas = tokenByVar("--background")
  if (!canvas) return null

  const rows = contrastPairs.flatMap((pair) => {
    const text = tokenByVar(pair.text)
    const surface = tokenByVar(pair.surface)
    if (!text || !surface) return []
    const ratios = perTheme((theme) => {
      const c = themeValues(canvas, theme)
      const t = themeValues(text, theme)
      const s = themeValues(surface, theme)
      return {
        light: textContrast(t.light, s.light, c.light),
        dark: textContrast(t.dark, s.dark, c.dark),
      }
    })
    return [{ ...pair, ratios }]
  })

  const th =
    "h-(--table-row-height-sm) px-5 text-left text-caption font-semibold text-muted-foreground"
  return (
    <div className="overflow-hidden rounded-(--card-radius) border">
      <table className="block w-full border-collapse @narrow:table">
        <caption className="sr-only">
          WCAG contrast of key text and surface pairs in light and dark, for the
          current theme
        </caption>
        <thead className="hidden bg-subtle @narrow:table-header-group">
          <tr>
            <th scope="col" className={th}>
              Sample
            </th>
            <th scope="col" className={th}>
              Text on surface
            </th>
            <th scope="col" className={th}>
              Light
            </th>
            <th scope="col" className={th}>
              Dark
            </th>
          </tr>
        </thead>
        <tbody className="block @narrow:table-row-group">
          {rows.map((r) => (
            <tr
              key={`${r.text}-${r.surface}`}
              className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-3 border-t p-5 first:border-t-0 @narrow:table-row @narrow:p-0 @narrow:first:border-t"
            >
              <td className="row-span-2 align-middle @narrow:h-(--table-row-height) @narrow:w-32 @narrow:px-5 @narrow:py-3">
                <Sample text={r.text} surface={r.surface} />
              </td>
              <td className="align-middle @narrow:px-5 @narrow:py-3">
                <div className="grid gap-0.5">
                  <span className="text-label text-foreground">
                    {r.text.slice(2)}{" "}
                    <span className="font-normal text-muted-foreground">
                      on
                    </span>{" "}
                    {r.surface.slice(2)}
                  </span>
                  <span className="text-caption text-copy">{r.use}</span>
                </div>
              </td>
              <td className="col-start-2 align-middle @narrow:px-5 @narrow:py-3">
                <div className="flex flex-wrap gap-x-6 gap-y-2 @narrow:block">
                  <ThemedRatio ratios={r.ratios} mode="light" label="Light" />
                  <div className="@narrow:hidden">
                    <ThemedRatio ratios={r.ratios} mode="dark" label="Dark" />
                  </div>
                </div>
              </td>
              <td className="hidden align-middle @narrow:table-cell @narrow:px-5 @narrow:py-3">
                <ThemedRatio ratios={r.ratios} mode="dark" label="Dark" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
