import { FoundationPage, type FoundationPageProps } from "./layout"
import { TokenExplorer } from "./token-explorer"

export function TokensFoundation({ title, description }: FoundationPageProps) {
  return (
    <FoundationPage title={title} description={description}>
      <TokenExplorer />
    </FoundationPage>
  )
}
