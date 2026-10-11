import {
  breakpointValues,
  describeSize,
  leafName,
  perTheme,
  tokensIn,
  typeValue,
  valueIn,
} from "./data"
import {
  FoundationPage,
  Meta,
  Section,
  type FoundationPageProps,
} from "./layout"
import { Families } from "./type-families"
import { TypeSpecimens, type RoleSpec } from "./type-specimens"

/* Literal class names so Tailwind generates every step. */
const scaleClass: Record<string, string> = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
  "5xl": "text-5xl",
  "6xl": "text-6xl",
  "7xl": "text-7xl",
}

function roleSpecs(): RoleSpec[] {
  return tokensIn("typography", "roles").flatMap((t) => {
    const v = typeValue(t)
    if (!v) return []
    return [
      {
        key: leafName(t.name),
        utility: t.utility ?? `text-${leafName(t.name)}`,
        description: t.description,
        // Size · line height · tracking · weight, in each theme: a theme may retune tracking for its font.
        meta: perTheme((theme) => {
          const tv = typeValue({ ...t, value: valueIn(theme, t).value }) ?? v
          return [
            describeSize(tv.fontSize).replace(/ fluid$/, ""),
            tv.lineHeight,
            tv.letterSpacing,
            String(tv.fontWeight),
          ].join(" · ")
        }),
        // Roles with breakpoint values: the size and line height from each breakpoint up.
        responsive: breakpointValues(t).flatMap((b) => {
          const bv = typeValue({ ...t, value: b.value })
          return bv
            ? [
                `From ${b.name}: ${describeSize(bv.fontSize)} / ${bv.lineHeight}`,
              ]
            : []
        }),
      },
    ]
  })
}

/* ------------------------------------------------------------------------ */
/* Scale ladder                                                              */
/* ------------------------------------------------------------------------ */

function ScaleLadder() {
  const steps = tokensIn("typography", "scale")
  return (
    <ol className="grid">
      {steps.map((t) => {
        const v = typeValue(t)
        const step = leafName(t.name)
        if (!v) return null
        return (
          <li
            key={t.name}
            className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-baseline gap-4 border-t py-4 @prose:grid-cols-[8rem_6rem_minmax(0,1fr)]"
          >
            <code className="font-mono text-label text-foreground">
              {t.utility ?? `text-${step}`}
            </code>
            <Meta className="hidden @prose:block">
              {describeSize(v.fontSize)} / {v.lineHeight}
            </Meta>
            {/* Medium, as the scale is used in tables and settings; bold belongs to the roles above. */}
            <span
              className={`${scaleClass[step] ?? "text-base"} min-w-0 truncate font-medium text-foreground`}
            >
              Acme
            </span>
          </li>
        )
      })}
    </ol>
  )
}

/* ------------------------------------------------------------------------ */
/* Page                                                                      */
/* ------------------------------------------------------------------------ */

export function TypographyFoundation({
  title,
  description,
}: FoundationPageProps) {
  return (
    <FoundationPage title={title} description={description}>
      <Section
        id="roles"
        title="Type roles"
        description="One utility sets size, line height, tracking and weight together; a size range means the role scales with the viewport. Pick the role for the job; never assemble type by hand. Hero to h2 are extra-bold (800), h3 to title are bold (700), and every heading is full ink. A theme may retune tracking for its font, never size or weight; the values shown are the theme you are on."
      >
        <TypeSpecimens roles={roleSpecs()} />
      </Section>

      <Section
        id="scale"
        title="Size scale"
        description="A plain size ladder for dense interfaces: tables, dashboards and settings. Marketing and docs pages use the roles above."
      >
        <ScaleLadder />
      </Section>

      <Section
        id="families"
        title="Families"
        description="A text face and a mono face, set by the theme, plus a heading face in themes that give headings their own voice, and five weights. Components only name font-sans, font-heading and font-mono, so a theme changes the type everywhere at once. There are no light weights and no slanted styles."
      >
        <Families />
      </Section>
    </FoundationPage>
  )
}
