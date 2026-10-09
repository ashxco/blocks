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
  /* A moved slug redirects before anything renders; any other unknown slug is a 404 and is titled as one. */
  return entry ? { title: entry.title, description: entry.description } : { title: "Page not found" }
}

type SearchParams = Record<string, string | string[] | undefined>

/** The query string to carry across a redirect, so ?theme=dark survives the move. */
function queryString(params: SearchParams) {
  const qs = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    for (const v of Array.isArray(value) ? value : value === undefined ? [] : [value]) qs.append(key, v)
  }
  const s = qs.toString()
  return s ? `?${s}` : ""
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<SearchParams>
}) {
  const { slug } = await params
  const entry = foundations.find((e) => e.slug === slug)
  const Foundation = pages[slug]
  if (!entry) {
    const target = movedTo[slug]
    /* Search params are read only here, so the registry pages stay static. */
    if (target && foundations.some((e) => e.slug === target)) {
      permanentRedirect(`/foundations/${target}${queryString(await searchParams)}`)
    }
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
