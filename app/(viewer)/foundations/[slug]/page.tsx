import type { ReactNode } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { DocPager } from "@/components/viewer/doc-pager"
import { ColorsFoundation } from "@/components/viewer/foundations/colors"
import { IconographyFoundation } from "@/components/viewer/foundations/iconography"
import { MotionFoundation } from "@/components/viewer/foundations/motion"
import { ShapeFoundation } from "@/components/viewer/foundations/shape"
import { SpacingFoundation } from "@/components/viewer/foundations/spacing"
import { TokensFoundation } from "@/components/viewer/foundations/tokens-page"
import { TypographyFoundation } from "@/components/viewer/foundations/typography"
import { pagerFor } from "@/components/viewer/nav"
import { ViewerPage } from "@/components/viewer/viewer-page"
import { foundations } from "@/lib/registry"

type FoundationPageComponent = (props: { title: string; description: string }) => ReactNode

const pages: Record<string, FoundationPageComponent> = {
  colors: ColorsFoundation,
  typography: TypographyFoundation,
  spacing: SpacingFoundation,
  radius: ShapeFoundation,
  motion: MotionFoundation,
  iconography: IconographyFoundation,
  tokens: TokensFoundation,
}

export function generateStaticParams() {
  return foundations.filter((e) => e.slug in pages).map((e) => ({ slug: e.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const entry = foundations.find((e) => e.slug === slug)
  return entry ? { title: entry.title, description: entry.description } : {}
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const entry = foundations.find((e) => e.slug === slug)
  const Foundation = pages[slug]
  if (!entry || !Foundation) notFound()
  const { prev, next } = pagerFor(foundations, slug, "/foundations")
  return (
    <ViewerPage>
      <Foundation title={entry.title} description={entry.description} />
      <DocPager prev={prev} next={next} />
    </ViewerPage>
  )
}
