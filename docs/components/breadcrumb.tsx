"use client"

import { ChevronRightIcon, FolderIcon, HouseIcon } from "lucide-react"

import { ApiTable, Example, Examples, Guidelines } from "@/docs/kit"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function BreadcrumbDocs() {
  return (
    <Examples>
      <Example
        title="Default"
        description="Muted links lead to the current page, which is in full ink and not a link. The trail stays on one line; on a phone, drop the top level and keep the levels nearest the page."
        code={`<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink render={<Link href="/projects" />}>Projects</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink render={<Link href="/projects/lumen-web" />}>lumen-web</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Deployments</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`}
      >
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="@max-sm:hidden">
              <BreadcrumbLink href="#lumen-labs">Lumen Labs</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="@max-sm:hidden" />
            <BreadcrumbItem>
              <BreadcrumbLink href="#projects">Projects</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#lumen-web">lumen-web</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Deployments</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Example>

      <Example
        title="Collapsed"
        description="When the path is deep, keep the first and last two levels and put the rest in a menu."
        code={`<BreadcrumbItem>
  <DropdownMenu>
    <DropdownMenuTrigger
      render={<button type="button" aria-label="Show hidden levels" />}
    >
      <BreadcrumbEllipsis />
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem>Projects</DropdownMenuItem>
      <DropdownMenuItem>lumen-web</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</BreadcrumbItem>`}
      >
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#lumen-labs">Lumen Labs</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button
                      type="button"
                      aria-label="Show hidden levels"
                      className="rounded-full outline-none transition-colors duration-(--duration-fast) hover:bg-accent hover:text-foreground focus-visible:focus-ring data-popup-open:bg-accent"
                    />
                  }
                >
                  <BreadcrumbEllipsis />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Projects</DropdownMenuItem>
                  <DropdownMenuItem>lumen-web</DropdownMenuItem>
                  <DropdownMenuItem>Deployments</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#a41c9e2" className="font-mono">
                a41c9e2
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Build logs</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Example>

      <Example
        title="Separators and icons"
        description="The slash is the default. Pass a child to BreadcrumbSeparator to use another mark."
        layout="stack"
        code={`<BreadcrumbSeparator>
  <ChevronRightIcon />
</BreadcrumbSeparator>`}
      >
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#home" aria-label="Home">
                <HouseIcon />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRightIcon />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href="#docs">Docs</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRightIcon />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Custom domains</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#backups">
                <FolderIcon />
                backups
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-mono">2026-10-08.sql.gz</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Example>

      <Example
        title="In a page header"
        description="The breadcrumb sits above the page title and tells people where they are. The title repeats the last level in full."
        layout="stack"
      >
        <header className="grid gap-4 border-b pb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#projects">Projects</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#lumen-web">lumen-web</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Domains</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="grid gap-1.5">
              <h3 className="text-h2">Domains</h3>
              <p className="text-body text-copy">Serve lumen-web from your own domains. Certificates renew on their own.</p>
            </div>
            <Button>Add domain</Button>
          </div>
        </header>
      </Example>

      <Guidelines
        do={[
          "Start from the top of the hierarchy people care about, usually the team or project.",
          "End with the current page as BreadcrumbPage, so screen readers announce it as the current page.",
          "Render links with your router through the render prop.",
        ]}
        dont={[
          "Don’t use a breadcrumb on a flat site with one or two levels.",
          "Don’t make the current page a link to itself.",
          "Don’t use breadcrumbs as the only navigation. They support the sidebar or top nav.",
        ]}
      />

      <ApiTable
        rows={[
          { prop: "render", type: "ReactElement", description: "BreadcrumbLink: render as another element, such as a Next.js Link." },
          { prop: "href", type: "string", description: "BreadcrumbLink: the destination when it renders the default <a>." },
          { prop: "children", type: "ReactNode", default: "<SlashIcon />", description: "BreadcrumbSeparator: the mark between levels." },
          { prop: "aria-label", type: "string", default: '"breadcrumb"', description: "Breadcrumb: the name of the navigation landmark." },
        ]}
      />
    </Examples>
  )
}
