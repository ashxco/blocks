/**
 * The site's public origin, for absolute URLs in metadata, the sitemap and
 * robots.txt. Set NEXT_PUBLIC_SITE_URL when deploying (for example
 * https://blocks.example.com); local builds fall back to localhost.
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "")

export const siteName = "Blocks"
export const siteDescription = "Blocks is a design system: tokens, five themes and a library of components."
