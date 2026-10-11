import type { Metadata } from "next"

import { DocHeader } from "@/components/viewer/doc-header"
import { ShowcaseStage } from "@/components/viewer/showcase/showcase-stage"
import { ViewerPage } from "@/components/viewer/viewer-page"

const title = "Showcase"
const description =
  "One Acme screen in every theme. Same components, same tokens, five products."

export const metadata: Metadata = { title, description }

export default function Page() {
  return (
    <ViewerPage>
      <DocHeader section="Showcase" title={title} description={description} />
      <ShowcaseStage />
    </ViewerPage>
  )
}
