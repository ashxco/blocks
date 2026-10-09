import { AppMockup } from "@/components/blocks/app-mockup"

const facts = [
  { value: "31s", label: "Median push to live" },
  { value: "38", label: "Edge regions worldwide" },
  { value: "99.99%", label: "API uptime, last 12 months" },
]

/**
 * The product screen on a wide dark panel, with three headline numbers
 * under it. Sits directly under the features hero.
 */
export function ProductStage() {
  return (
    <div className="container-wide">
      <div className="rounded-(--panel-radius) bg-panel p-2 text-panel-foreground sm:p-6 lg:p-12">
        <AppMockup contained={false} stage={false} />
        <dl className="mt-2 grid divide-y divide-panel-border px-4 sm:mt-10 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-0 lg:mt-12">
          {facts.map((fact) => (
            <div
              key={fact.label}
              className="flex items-baseline justify-between gap-4 py-4 sm:flex-col sm:items-start sm:justify-start sm:gap-1.5 sm:px-8 sm:py-0 sm:first:pl-0"
            >
              <dt className="text-label text-panel-muted sm:order-2">{fact.label}</dt>
              <dd className="text-h3 text-panel-foreground tabular sm:order-1">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
