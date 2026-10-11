/**
 * The site's public origin, for absolute URLs in metadata, the sitemap,
 * robots.txt and the registry install commands. NEXT_PUBLIC_SITE_URL wins
 * when set (for example https://blocks.example.com); on Vercel the project's
 * production domain (VERCEL_PROJECT_PRODUCTION_URL) is used; local builds
 * fall back to localhost. Trailing slashes are stripped.
 */
function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
  const origin = explicit
    ? explicit
    : vercel
      ? `https://${vercel}`
      : "http://localhost:3000"
  return origin.replace(/\/+$/, "")
}

export const siteUrl = resolveSiteUrl()

export const siteName = "Blocks"
export const siteDescription =
  "One component library, five real products. Blocks is a token-first design system for Next.js where a theme changes everything and build gates enforce the rules."

/**
 * Installs the base registry item (CSS, utils, portal container, hooks,
 * primitives). --overwrite replaces the lib/utils.ts that shadcn init writes.
 */
export const installCommand = `npx shadcn@latest add ${siteUrl}/r/blocks.json --overwrite`
