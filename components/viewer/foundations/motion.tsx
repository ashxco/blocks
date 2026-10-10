import * as React from "react"

import { leafName, tokensIn } from "./data"
import { DoDont, FoundationPage, Section } from "./layout"
import { DurationDemos, EasingDemos, MotionInUse, type DurationItem, type EasingItem } from "./motion-demos"

function durations(): DurationItem[] {
  return tokensIn("layout", "duration").map((t) => ({
    name: leafName(t.name),
    cssVar: t.cssVar,
    value: String(t.value),
    utility: t.utility ?? `duration-(${t.cssVar})`,
    description: t.description,
  }))
}

function easings(): EasingItem[] {
  return tokensIn("layout", "easing").flatMap((t) => {
    const v = t.value
    if (!Array.isArray(v) || v.length !== 4) return []
    return [
      {
        name: leafName(t.name),
        cssVar: t.cssVar,
        utility: t.utility ?? `ease-${leafName(t.name)}`,
        points: v.map(Number) as [number, number, number, number],
        description: t.description,
      },
    ]
  })
}

export function MotionFoundation({ title, description }: { title: string; description: string }) {
  const durationItems = durations()
  const easingItems = easings()
  const standard = easingItems.find((e) => e.name === "standard")?.cssVar ?? "--ease-standard"
  const slowest = durationItems[durationItems.length - 1]?.cssVar ?? "--duration-slower"

  return (
    <FoundationPage title={title} description={description}>
      <Section
        id="in-use"
        title="In use"
        description="Overlays fade and travel 4px or scale from 98%. They enter with ease-out and leave faster with ease-in."
      >
        <MotionInUse />
      </Section>

      <Section
        id="durations"
        title="Durations"
        description="Five steps, from press feedback to large reveals. Small changes are fast; big surfaces take longer. Motion is the same in every theme."
      >
        <DurationDemos items={durationItems} easingVar={standard} />
      </Section>

      <Section
        id="easing"
        title="Easing"
        description="Entering slows into place, leaving speeds away, moving eases both ways. Everything else uses standard."
      >
        <EasingDemos items={easingItems} durationVar={slowest} />
      </Section>

      <Section
        id="principles"
        title="Principles"
        description="Motion explains a change; it never decorates. When people turn motion down, transitions finish instantly: state still changes, nothing travels."
      >
        <DoDont
          do={[
            "Fade, slide 4px, or scale from 98% when overlays open.",
            "Use fast for hover and colour, base for menus and tabs, slow for dialogs and sheets.",
            "Enter with ease-out and leave with ease-in.",
            "Read durations and easings from tokens, never hard-code milliseconds.",
          ]}
          dont={[
            "Bounce, loop or pulse to attract attention.",
            "Animate width, height or position on large surfaces when opacity or a small translate will do.",
            "Rely on motion alone to show that something changed.",
          ]}
        />
      </Section>
    </FoundationPage>
  )
}
