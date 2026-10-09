import { AppShell } from "@/components/blocks/app-shell"

/**
 * Shared frame for every Lumen app template: the collapsible sidebar, the top
 * bar with search, notifications and the user menu, and the page. The skip
 * link jumps past the sidebar navigation to the page content.
 */
export default function LumenAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#content"
        className="sr-only rounded-full bg-primary px-5 py-2.5 text-label text-primary-foreground focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-(--z-toast)"
      >
        Skip to content
      </a>
      <AppShell>
        <div id="content" tabIndex={-1} className="scroll-mt-(--header-height) outline-none">
          {children}
        </div>
      </AppShell>
    </>
  )
}
