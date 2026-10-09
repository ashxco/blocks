import * as React from "react"

import { FoundationPage } from "./layout"
import { TokenExplorer } from "./token-explorer"

export function TokensFoundation({ title, description }: { title: string; description: string }) {
  return (
    <FoundationPage title={title} description={description}>
      <TokenExplorer />
    </FoundationPage>
  )
}
