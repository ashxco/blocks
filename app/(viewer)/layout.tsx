import { ViewTransition } from "react"

import { ViewerColumn } from "@/components/viewer/viewer-column"
import { ViewerShell } from "@/components/viewer/viewer-shell"

export default function ViewerLayout({ children }: { children: React.ReactNode }) {
  return (
    <ViewerShell>
      <ViewTransition name="viewer-content">
        <div>
          <ViewerColumn>{children}</ViewerColumn>
        </div>
      </ViewTransition>
    </ViewerShell>
  )
}
