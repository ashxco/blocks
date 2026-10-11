import { describeSize, tokenByName } from "./data"
import {
  Code,
  FoundationPage,
  Section,
  type FoundationPageProps,
} from "./layout"
import {
  Breakpoints,
  Containers,
  GridTable,
  LiveGrid,
  OverlayWidths,
} from "./spacing-layout"
import { NamedSpacing, SpacingLadder } from "./spacing-scale"

export function SpacingFoundation({ title, description }: FoundationPageProps) {
  const unit = tokenByName("spacing")
  return (
    <FoundationPage title={title} description={description}>
      <Section
        id="unit"
        title="Spacing unit"
        description={
          <>
            Padding, margin and gap come from this ladder of{" "}
            <Code>--spacing</Code> ({describeSize(unit?.value)}) multiples:{" "}
            <Code>p-4</Code> is four units, 16px. Use steps from the ladder;
            half steps exist only below 16px. Fluid page spacing has its own
            names, below. Spacing, sizes and widths are the same in every theme.
          </>
        }
      >
        <SpacingLadder />
      </Section>

      <Section
        id="named"
        title="Named spacing"
        description="Page-level rhythm has names, so every page breathes the same way. Gutters and sections are fluid: resize the window and the highlighted space follows."
      >
        <NamedSpacing />
      </Section>

      <Section
        id="containers"
        title="Containers"
        description="Four widths, drawn to scale against the breakpoint ruler; page, in ink, is the default. The container utilities centre the column and add gutters; the max-width utilities only cap it."
      >
        <Containers />
      </Section>

      <Section
        id="grid"
        title="Grid"
        description={
          <>
            Four columns on phones, eight from md and twelve from lg, with the
            gutter between columns and rows. Use <Code>grid-system</Code> or{" "}
            <Code>{"<Grid>"}</Code> inside a container, which keeps the page
            margins.
          </>
        }
      >
        <div className="grid gap-8">
          <LiveGrid />
          <GridTable />
        </div>
      </Section>

      <Section
        id="breakpoints"
        title="Breakpoints"
        description="Mobile first: unprefixed utilities apply everywhere, prefixed ones from that width up. Inside variable-width slots, prefer container queries."
      >
        <Breakpoints />
      </Section>

      <Section
        id="overlays"
        title="Overlay widths"
        description="Menus, popovers, toasts and dialogs take their width from tokens, drawn here to scale. A dashed bar is a bound, not a size: menus start at theirs and grow with their content, tooltips wrap once they reach theirs, and dialogs and sheets stop at theirs and shrink to fit a phone."
      >
        <OverlayWidths />
      </Section>
    </FoundationPage>
  )
}
