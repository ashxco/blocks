import { notFound } from "next/navigation"

import { foundations } from "@/lib/registry"

export function generateStaticParams() {
  return foundations.map((e) => ({ slug: e.slug }))
}

// Placeholder. Replaced by the foundations build.
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const entry = foundations.find((e) => e.slug === slug)
  if (!entry) notFound()
  return <h1 className="text-h1">{entry.title}</h1>
}
