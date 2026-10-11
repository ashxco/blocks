import { FoundationPage, Section, type FoundationPageProps } from "./layout"
import { themes } from "./data"
import { ThemeCompare } from "./theme-compare"
import { Composition } from "./theme-composition"
import { ThemeDetails, ThemeSummary } from "./theme-details"
import { MakeYourOwn } from "./theme-make-your-own"
import { ThemeStage, type StageItem } from "./theme-stage"

/*
 * Every preview on this page is scoped with data-theme (and .light / .dark
 * for the mode), so it shows that theme whatever the site is on. Only the
 * "Current" and "Current theme" marks follow the site's own theme.
 *
 * - The stage (theme-stage.tsx): one theme at a time, large, as a live
 *   project page of real components (theme-composition.tsx), with its
 *   description, actions, scales, shapes and faces under it
 *   (theme-details.tsx).
 * - Side by side: the comparison strip (theme-compare.tsx), the same small
 *   composition in all five themes.
 * - Make your own (theme-make-your-own.tsx): the theme file, scoping,
 *   previewing and the two gates.
 */

const stageItems: StageItem[] = themes.map((theme) => ({
  id: theme.id,
  name: theme.name,
  composition: <Composition label={theme.name} />,
  summary: <ThemeSummary theme={theme} />,
  details: <ThemeDetails theme={theme} />,
}))

export function ThemesFoundation({ title, description }: FoundationPageProps) {
  return (
    <FoundationPage title={title} description={description}>
      <ThemeStage items={stageItems} />

      <Section
        id="side-by-side"
        title="Side by side"
        description="The same composition in all five themes."
      >
        <ThemeCompare />
      </Section>

      <Section
        id="make-your-own"
        title="Make your own theme"
        description="A theme is one token file. The build turns it into a data-theme scope and adds it to the Theme picker and the ?theme= parameter. Two gates check it: its contrast, and that it stands apart from every other theme."
      >
        <MakeYourOwn />
      </Section>
    </FoundationPage>
  )
}
