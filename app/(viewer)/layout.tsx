import { ViewTransition } from "react"

import { ViewerColumn } from "@/components/viewer/viewer-column"
import { ViewerHeader } from "@/components/viewer/viewer-header"
import { ViewerSidebar } from "@/components/viewer/viewer-sidebar"
import { viewerCss } from "@/components/viewer/viewer-styles"

export default function ViewerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <style dangerouslySetInnerHTML={{ __html: viewerCss }} />
      <a
        href="#content"
        className="sr-only z-(--z-toast) rounded-(--button-radius) bg-primary px-4 py-2 text-label text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <ViewerHeader />
      <div className="flex flex-1">
        <ViewerSidebar />
        <main id="content" className="min-w-0 flex-1">
          <ViewTransition name="viewer-content">
            <div>
              <ViewerColumn>{children}</ViewerColumn>
            </div>
          </ViewTransition>
        </main>
      </div>
    </div>
  )
}
