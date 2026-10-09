import type { Metadata } from "next"

import { NotFoundPanel } from "./_components/not-found-panel"

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you asked for doesn’t exist on Lumen. Head back home or contact support.",
  robots: { index: false },
}

export default function NotFoundTemplatePage() {
  return <NotFoundPanel className="pt-section-sm pb-section" />
}
