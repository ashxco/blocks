import {
  FoundationPage,
  Section,
  SubHeading,
  type FoundationPageProps,
} from "./layout"
import { Depth } from "./shape-depth"
import { BorderColors, BorderWidths, Focus } from "./shape-lines"
import { ComponentRadii, RadiusScale } from "./shape-radius"

export function ShapeFoundation({ title, description }: FoundationPageProps) {
  return (
    <FoundationPage title={title} description={description}>
      <Section
        id="radius"
        title="Corner radius"
        description="Small things get small corners, large surfaces get generous ones. Each theme sets its own scale, from Mono's sharp corners to Ember's soft ones; the sizes shown are the theme you are on. Only full is the same everywhere."
      >
        <RadiusScale />
      </Section>

      <Section
        id="component-radii"
        title="Component radii"
        description="Components read their corners through their own tokens, never a scale step by name, so a theme can make buttons pills in one theme and rounded squares in another without touching component code. Most point at a step of the scale; a theme can re-point them."
      >
        <ComponentRadii />
      </Section>

      <Section
        id="borders"
        title="Borders"
        description="Lines do the work that shadows do elsewhere. Default to the hairline; use the strong width only to mark a selected or emphasised outline."
      >
        <div className="grid gap-12">
          <div className="grid gap-6">
            <SubHeading>Widths</SubHeading>
            <BorderWidths />
          </div>
          <div className="grid gap-6">
            <SubHeading>Colours</SubHeading>
            <BorderColors />
          </div>
        </div>
      </Section>

      <Section
        id="focus"
        title="Focus"
        description="One outline for every focusable element: solid, in the theme's accent (ink in Mono), offset from the edge so it never hides the control."
      >
        <Focus />
      </Section>

      <Section
        id="depth"
        title="Depth without shadows"
        description="Blocks has no shadows. Hierarchy comes from four tools, used in this order: hairlines, tinted surfaces, dark panels and bordered overlays."
      >
        <Depth />
      </Section>
    </FoundationPage>
  )
}
