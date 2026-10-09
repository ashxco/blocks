import type { ReactNode } from "react"
import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"

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
  /* Ready for the registry slug to follow the page title. */
  shape: ShapeFoundation,
  motion: MotionFoundation,
  iconography: IconographyFoundation,
  tokens: TokensFoundation,
}

/*
 * Slugs a page used to have. Once the registry renames a page (radius to
 * shape, to match its title), the old address redirects instead of 404ing.
 */
const movedTo: Record<string, string> = { radius: "shape" }

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
  if (!entry) {
    const target = movedTo[slug]
    if (target && foundations.some((e) => e.slug === target)) permanentRedirect(`/foundations/${target}`)
    notFound()
  }
  if (!Foundation) notFound()
  const { prev, next } = pagerFor(foundations, slug, "/foundations")
  /* The first page steps back to the Foundations overview rather than leaving half the pager empty. */
  const back = prev ?? { title: "Overview", href: "/foundations", group: entry.group }
  return (
    <ViewerPage>
      <Foundation title={entry.title} description={entry.description} />
      <DocPager prev={back} next={next} />
    </ViewerPage>
  )
}
