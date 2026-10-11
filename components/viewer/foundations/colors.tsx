import { ContrastTable } from "./color-contrast"
import { SemanticRoles } from "./color-roles"
import { AliasMap, FixedScales, ThemeScaleRamps } from "./color-scales"
import {
  Code,
  FoundationPage,
  Section,
  SubHeading,
  type FoundationPageProps,
} from "./layout"

export function ColorsFoundation({ title, description }: FoundationPageProps) {
  return (
    <FoundationPage title={title} description={description}>
      <Section
        id="roles"
        title="Semantic roles"
        description={
          <>
            Components only use roles, so changing the theme or the mode never
            touches component code. Most roles point at a step of the theme
            scales below (<Code>neutral.950</Code>, <Code>accent.600</Code>);
            status roles read the fixed status scales. Dark-mode lines, both
            overlays and the panel&apos;s muted text and hairline are a step at
            reduced opacity, and tuned one-offs show as raw OKLCH. Swatches show
            light on the left and dark on the right, in the theme you are on,
            and the values listed are that theme&apos;s; Aa is the text role
            made for that fill.
          </>
        }
      >
        <SemanticRoles />
      </Section>

      <Section
        id="theme-scales"
        title="Theme scales"
        description={
          <>
            Two alias scales sit between the roles and the raw colours: accent (
            <Code>--bk-accent-*</Code>) and neutral (<Code>--bk-neutral-*</Code>
            ). Roles read them, never a hue by name, and each theme points them
            at its own colours: a fixed scale below, or values of its own. The
            ramps and numbers show the theme you are on.
          </>
        }
      >
        <div className="grid gap-12">
          <ThemeScaleRamps />
          <div className="grid gap-6">
            <SubHeading>In every theme</SubHeading>
            <AliasMap />
          </div>
        </div>
      </Section>

      <Section
        id="scales"
        title="Fixed scales"
        description="Raw OKLCH ramps with even lightness steps across hues, drawn on shared columns so each step lines up. They are the same in every theme and are never used in components directly."
      >
        <FixedScales />
      </Section>

      <Section
        id="contrast"
        title="Contrast"
        description="WCAG 2 ratios for the pairs people read most, computed from the token values of the theme you are on. Body text needs AA (4.5:1); large text and icons need 3:1. The build checks every theme the same way."
      >
        <ContrastTable />
      </Section>
    </FoundationPage>
  )
}
