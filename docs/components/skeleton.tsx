import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonDocs() {
  return (
    <Examples>
      <Example
        title="Shapes"
        description="Match the shape of what is loading: circles for avatars, pill lines for text, card radius for media."
        code={`<Skeleton className="size-(--avatar-size-lg) rounded-full" />
<Skeleton className="h-4 w-48 rounded-full" />
<Skeleton className="aspect-video w-64 rounded-(--card-radius)" />`}
      >
        <Skeleton className="size-(--avatar-size-lg) rounded-full" />
        <div className="grid gap-2.5">
          <Skeleton className="h-4 w-48 rounded-full" />
          <Skeleton className="h-3 w-32 rounded-full" />
        </div>
        <Skeleton className="aspect-video w-64 rounded-(--card-radius)" />
      </Example>

      <Example
        title="Project card"
        description="Lay skeletons out exactly like the content they stand in for, so nothing jumps when it loads."
        layout="stack"
        code={`<div className="grid gap-5 rounded-(--card-radius) border bg-card p-(--card-padding)">
  <div className="flex items-center gap-3">
    <Skeleton className="size-(--avatar-size-md) rounded-full" />
    <div className="grid gap-2">
      <Skeleton className="h-4 w-36 rounded-full" />
      <Skeleton className="h-3 w-24 rounded-full" />
    </div>
  </div>
  <Skeleton className="h-28 rounded-md" />
</div>`}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {[0, 1].map((i) => (
            <div key={i} className="grid gap-5 rounded-(--card-radius) border bg-card p-(--card-padding)">
              <div className="flex items-center gap-3">
                <Skeleton className="size-(--avatar-size-md) rounded-full" />
                <div className="grid gap-2">
                  <Skeleton className="h-4 w-36 rounded-full" />
                  <Skeleton className="h-3 w-24 rounded-full" />
                </div>
              </div>
              <Skeleton className="h-28 rounded-md" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-28 rounded-full" />
                <Skeleton className="h-(--badge-height) w-16 rounded-(--badge-radius)" />
              </div>
            </div>
          ))}
        </div>
      </Example>

      <Example
        title="Table rows"
        description="For lists, show the number of rows you expect, up to one screen."
        layout="stack"
      >
        <div className="divide-y overflow-hidden rounded-(--card-radius) border bg-card" aria-busy="true" aria-label="Loading deployments">
          {[48, 36, 56, 40].map((w) => (
            <div key={w} className="flex h-(--table-row-height) items-center gap-4 px-5">
              <Skeleton className="size-(--avatar-size-sm) rounded-full" />
              <Skeleton className="h-3.5 rounded-full" style={{ width: `${w}%` }} />
              <Skeleton className="ml-auto h-3 w-14 rounded-full" />
            </div>
          ))}
        </div>
      </Example>

      <Guidelines
        do={[
          "Use skeletons for the first load of a page or a region.",
          "Mirror the real layout: same sizes, radii and spacing.",
          "Mark the loading region with aria-busy and a label.",
        ]}
        dont={[
          "Don’t use skeletons for actions such as saving. Use a spinner in the button.",
          "Don’t add a shimmer gradient. The flat pulse is enough, and it stops when motion is reduced.",
          "Don’t keep skeletons up longer than the content takes. Show an empty state if there is nothing.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "className", type: "string", default: '"rounded-sm"', description: "Size and radius. The fill is a flat foreground tint that works on any surface and pulses between full strength and about 60% when motion is allowed." },
          { prop: "...props", type: "<div> props", description: "Any div attribute. Hidden from assistive technology by default." },
        ]}
      />
    </Examples>
  )
}
