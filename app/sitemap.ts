import type { MetadataRoute } from "next"

import { components, foundations } from "@/lib/registry"
import { siteUrl } from "@/lib/site"

/** Every page the viewer serves, from the registry. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/foundations",
    ...foundations.map((entry) => `/foundations/${entry.slug}`),
    "/components",
    ...components.map((entry) => `/components/${entry.slug}`),
  ]
  return paths.map((path) => ({ url: `${siteUrl}${path === "/" ? "" : path}` }))
}
