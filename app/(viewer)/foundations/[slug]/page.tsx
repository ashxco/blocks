import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"

import { DocPager } from "@/components/viewer/doc-pager"
import { foundationPages } from "@/components/viewer/foundations/pages"
import { pagerFor } from "@/components/viewer/nav"
import { ViewerPage } from "@/components/viewer/viewer-page"
import { foundations } from "@/lib/registry"

/* Slugs a page used to have: the old address redirects instead of 404ing. */
const movedTo: Record<string, string> = { radius: "shape" }

export function generateStaticParams() {
  return foundations
    .filter((e) => e.slug in foundationPages)
    .map((e) => ({ slug: e.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const entry = foundations.find((e) => e.slug === slug)
  /* A moved slug redirects before anything renders; any other unknown slug is a 404 and is titled as one. */
  return entry
    ? { title: entry.title, description: entry.description }
    : { title: "Page not found" }
}

type SearchParams = Record<string, string | string[] | undefined>

/** The query string to carry across a redirect, so ?theme= and &mode= survive the move. */
function queryString(params: SearchParams) {
  const qs = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    for (const v of Array.isArray(value)
      ? value
      : value === undefined
        ? []
        : [value])
      qs.append(key, v)
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
  const Foundation = foundationPages[slug]
  if (!entry) {
    const target = movedTo[slug]
    /* Search params are read only here, so the registry pages stay static. */
    if (target && foundations.some((e) => e.slug === target)) {
      permanentRedirect(
        `/foundations/${target}${queryString(await searchParams)}`
      )
    }
    notFound()
  }
  if (!Foundation) notFound()
  /* The first page steps back to the Foundations overview. */
  const { prev, next } = pagerFor("foundations", slug)
  return (
    <ViewerPage>
      <Foundation title={entry.title} description={entry.description} />
      <DocPager prev={prev} next={next} />
    </ViewerPage>
  )
}
