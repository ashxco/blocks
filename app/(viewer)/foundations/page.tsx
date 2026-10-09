import type { Metadata } from "next"

import { FoundationsOverview } from "@/components/viewer/foundations/overview"

export const metadata: Metadata = {
  title: "Foundations",
  description: "Colour, type, space, shape, motion, icons and every token behind the Blocks design system.",
}

export default function Page() {
  return <FoundationsOverview />
}
