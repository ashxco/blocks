import { MobileMenu } from "@/components/viewer/mobile-menu"
import { ViewerSearch } from "@/components/viewer/viewer-search"
import { ViewerSidebar } from "@/components/viewer/viewer-sidebar"
import { viewerCss } from "@/components/viewer/viewer-styles"

/**
 * The viewer's frame: the sidebar beside the page, with no top bar. Below lg
 * the sidebar folds into a floating menu button. Search (⌘K or /) is mounted
 * here once. The viewer layout and the global 404 both use it.
 */
export function ViewerShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh bg-background">
      <style dangerouslySetInnerHTML={{ __html: viewerCss }} />
      <a
        href="#content"
        className="sr-only z-(--z-toast) rounded-(--button-radius) bg-primary px-4 py-2 text-label text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <ViewerSidebar />
      <MobileMenu />
      <main id="content" className="min-w-0 flex-1">
        {children}
      </main>
      <ViewerSearch />
    </div>
  )
}
