import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { Grid, GridItem } from "@/components/ui/grid"
import { Inline } from "@/components/ui/inline"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Stack } from "@/components/ui/stack"

/** The examples' tiles: flat cards, so the columns behind them show between. */
const tile = "rounded-(--card-radius) border bg-card p-4"

/** Twelve column cells behind a grid. Rows past the first are clipped, so only the current columns show. */
const overlayCode = `<Grid aria-hidden className="absolute inset-0 auto-rows-[100%] overflow-hidden">
    {Array.from({ length: 12 }, (_, column) => (
      <GridItem key={column} className="bg-brand-subtle" />
    ))}
  </Grid>`

function ColumnOverlay({ className }: { className?: string }) {
  return (
    <Grid
      aria-hidden
      className={
        className ?? "absolute inset-0 auto-rows-[100%] overflow-hidden"
      }
    >
      {Array.from({ length: 12 }, (_, column) => (
        <GridItem key={column} className="bg-brand-subtle" />
      ))}
    </Grid>
  )
}

const spanRows = [
  { span: 12, title: "Tasks completed per day" },
  { span: 6, title: "Workload" },
  { span: 6, title: "On-time delivery" },
  { span: 4, title: "Active projects" },
  { span: 4, title: "Tasks completed" },
  { span: 4, title: "Average cycle time" },
  { span: 8, title: "Website relaunch timeline" },
  { span: 4, title: "Recent activity" },
] as const

const spansCode = `<div className="relative">
  ${overlayCode}
  <Grid className="relative">
${spanRows
  .map(
    ({ span, title }) => `    <GridItem span={${span}} className="${tile}">
      <p className="text-label">${title}</p>
      <p className="text-caption text-muted-foreground">span={${span}}</p>
    </GridItem>`
  )
  .join("\n")}
  </Grid>
</div>`

const metrics = [
  { label: "Active projects", value: "24", change: "+3 this month" },
  { label: "Tasks completed", value: "1,284", change: "+12% this month" },
  { label: "On-time delivery", value: "92%", change: "+4 pts" },
  { label: "Average cycle time", value: "3.4 days", change: "−0.6 days" },
]

const projects = [
  {
    name: "Website relaunch",
    status: "On track",
    variant: "success",
    meta: "52 tasks · Priya Raman",
  },
  {
    name: "Mobile app 2.0",
    status: "At risk",
    variant: "warning",
    meta: "87 tasks · Jordan Lee",
  },
  {
    name: "Q4 planning",
    status: "On track",
    variant: "success",
    meta: "18 tasks · Hana Kim",
  },
  {
    name: "Customer portal",
    status: "Off track",
    variant: "destructive",
    meta: "64 tasks · Daniel Brooks",
  },
  {
    name: "Brand refresh",
    status: "On track",
    variant: "success",
    meta: "23 tasks · Sofia Alvarez",
  },
  {
    name: "Help center",
    status: "Paused",
    variant: "secondary",
    meta: "31 tasks · Sam Okafor",
  },
] as const

export default function GridDocs() {
  return (
    <Examples>
      <Example
        title="Columns"
        thumbnail
        layout="full"
        description="The system grid has 12 columns from lg, 8 from md and 4 on phones, with a gutter of 32, 24 or 16px between them (--grid-columns, --grid-gutter). Switch to Tablet and Mobile to see it change. The container around it adds the page gutters at the sides."
        code={`<Container className="py-10">
  <Grid aria-hidden className="h-48 auto-rows-[100%] overflow-hidden">
    {Array.from({ length: 12 }, (_, column) => (
      <GridItem key={column} className="bg-brand-subtle" />
    ))}
  </Grid>
</Container>`}
      >
        <Container className="py-10">
          <ColumnOverlay className="h-48 auto-rows-[100%] overflow-hidden" />
        </Container>
      </Example>

      <Example
        title="Spans"
        layout="stack"
        description="A dashboard on the 12 columns: one item across the row, then halves, thirds and two thirds. A span never exceeds the columns there are, so on a phone each item fills the row instead of adding columns."
        code={spansCode}
      >
        <div className="relative">
          <ColumnOverlay />
          <Grid className="relative">
            {spanRows.map(({ span, title }) => (
              <GridItem key={title} span={span} className={tile}>
                <p className="text-label">{title}</p>
                <p className="text-caption text-muted-foreground">
                  span={`{${span}}`}
                </p>
              </GridItem>
            ))}
          </Grid>
        </div>
      </Example>

      <Example
        title="Responsive spans"
        layout="stack"
        description="Give a span per breakpoint, mobile first; a breakpoint left out keeps the value below it, and phones fill the row unless you say otherwise. Here the metrics sit one per row on phones, two on tablets and four on desktops, and the chart takes two thirds beside the activity from lg. Resize the window to see them move."
        code={`<Grid>
  {metrics.map((metric) => (
    <GridItem key={metric.label} span={{ md: 4, lg: 3 }} className="${tile}">
      <p className="text-caption text-muted-foreground">{metric.label}</p>
      <p className="text-h3">{metric.value}</p>
      <p className="text-caption text-success">{metric.change}</p>
    </GridItem>
  ))}
  <GridItem span={{ lg: 8 }} className="${tile} h-40">
    <p className="text-label">Tasks completed per day</p>
  </GridItem>
  <GridItem span={{ lg: 4 }} className="${tile} h-40">
    <p className="text-label">Recent activity</p>
  </GridItem>
</Grid>`}
      >
        <Grid>
          {metrics.map((metric) => (
            <GridItem
              key={metric.label}
              span={{ md: 4, lg: 3 }}
              className={tile}
            >
              <p className="text-caption text-muted-foreground">
                {metric.label}
              </p>
              <p className="text-h3">{metric.value}</p>
              <p className="text-caption text-success">{metric.change}</p>
            </GridItem>
          ))}
          <GridItem span={{ lg: 8 }} className={`${tile} h-40`}>
            <p className="text-label">Tasks completed per day</p>
          </GridItem>
          <GridItem span={{ lg: 4 }} className={`${tile} h-40`}>
            <p className="text-label">Recent activity</p>
          </GridItem>
        </Grid>
      </Example>

      <Example
        title="Start"
        layout="stack"
        description="start sets the column an item begins at, so a form can sit in the middle columns: 6 of 8 from column 2 on tablets, 6 of 12 from column 4 on desktops. A start that would push the item past the last column moves back."
        code={`<div className="relative">
  ${overlayCode}
  <Grid className="relative">
    <GridItem span={{ md: 6 }} start={{ md: 2, lg: 4 }} className="${tile}">
      <Stack gap={4}>
        <h3 className="text-h4">Invite your team</h3>
        <Stack gap={2}>
          <Label htmlFor="invite-email">Email</Label>
          <Input id="invite-email" placeholder="jordan@acme.com" />
        </Stack>
        <Button>Send Invite</Button>
      </Stack>
    </GridItem>
  </Grid>
</div>`}
      >
        <div className="relative">
          <ColumnOverlay />
          <Grid className="relative">
            <GridItem
              span={{ md: 6 }}
              start={{ md: 2, lg: 4 }}
              className={tile}
            >
              <Stack gap={4}>
                <h3 className="text-h4">Invite your team</h3>
                <Stack gap={2}>
                  <Label htmlFor="invite-email">Email</Label>
                  <Input id="invite-email" placeholder="jordan@acme.com" />
                </Stack>
                <Button>Send Invite</Button>
              </Stack>
            </GridItem>
          </Grid>
        </div>
      </Example>

      <Example
        title="Fixed columns"
        layout="stack"
        description="For even tiles, such as a gallery of project cards, give columns a count, or one per breakpoint. The gutter stays the grid gutter."
        code={`<Grid columns={{ base: 1, md: 2, lg: 3 }}>
  {projects.map((project) => (
    <Stack key={project.name} gap={3} className="${tile}">
      <Inline justify="between">
        <h3 className="text-title">{project.name}</h3>
        <Badge variant={project.variant}>{project.status}</Badge>
      </Inline>
      <p className="text-caption text-muted-foreground">{project.meta}</p>
    </Stack>
  ))}
</Grid>`}
      >
        <Grid columns={{ base: 1, md: 2, lg: 3 }}>
          {projects.map((project) => (
            <Stack key={project.name} gap={3} className={tile}>
              <Inline justify="between">
                <h3 className="text-title">{project.name}</h3>
                <Badge variant={project.variant}>{project.status}</Badge>
              </Inline>
              <p className="text-caption text-muted-foreground">
                {project.meta}
              </p>
            </Stack>
          ))}
        </Grid>
      </Example>

      <Guidelines
        do={[
          "Lay out page sections and dashboards on the system grid, inside a container.",
          "Write spans mobile first, and let phones fill the row unless items are small.",
          "Use columns for even tiles, and the system grid when items have different widths.",
        ]}
        dont={[
          "Don’t add your own gap to the grid. The gutter comes from --grid-gutter.",
          "Don’t put side padding on the grid: the container’s px-gutter is the page margin.",
          "Don’t use the grid for a row of buttons or badges. Use Inline.",
        ]}
      />

      <ApiTable
        title="Grid"
        rows={[
          {
            prop: "columns",
            type: '"system" | 1 … 12 | { base?, md?, lg? }',
            default: '"system"',
            description:
              "The system grid (--grid-columns: 4, 8 and 12), a fixed count, or a count per breakpoint. The gap is always --grid-gutter.",
          },
          {
            prop: "render",
            type: "ReactElement",
            description: "Render as another element, such as a section or ul.",
          },
        ]}
      />

      <ApiTable
        title="GridItem"
        rows={[
          {
            prop: "span",
            type: '1 … 12 | "full" | { base?, md?, lg? }',
            description:
              'Columns to cover. With one per breakpoint, base defaults to "full" and each breakpoint keeps the value below it. Never wider than the grid at that breakpoint.',
          },
          {
            prop: "start",
            type: "1 … 12 | { base?, md?, lg? }",
            description:
              "The column to start at. Moves back when the span would run past the last column; ignored where the item fills the row.",
          },
          {
            prop: "render",
            type: "ReactElement",
            description: "Render as another element, such as an li or article.",
          },
        ]}
      />
    </Examples>
  )
}
