import type { Metadata } from "next"
import localFont from "next/font/local"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toast"
import { TooltipProvider } from "@/components/ui/tooltip"
import { siteDescription, siteName, siteUrl } from "@/lib/site"
import { cn } from "@/lib/utils"

/*
 * Fonts. Each one sets a CSS variable on <html> that the font tokens read
 * (font.family.sans, .heading and .mono in design-system/tokens and
 * design-system/themes). The default theme's fonts are preloaded; a theme's
 * own fonts download when a page first uses that theme.
 *
 * Every font is self-hosted from app/fonts/<family>/ (latin subset, upright,
 * variable, each with its OFL license), so neither the build nor the browser
 * fetches a font from anywhere else. A variable font's weight range covers
 * the weights the system uses (400 to 800).
 */
const jakarta = localFont({
  src: "./fonts/plus-jakarta-sans/plus-jakarta-sans-latin-wght-normal.woff2",
  weight: "400 800",
  style: "normal",
  variable: "--font-jakarta",
})

/** Code in every theme, and Mono's headings at 800: the variable font, weights 100 to 900. */
const geistMono = localFont({
  src: "./fonts/geist-mono/geist-mono-latin-wght-normal.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-geist-mono",
  // Code keeps its columns while the font loads: fall back to a system monospace, not adjusted Arial.
  adjustFontFallback: false,
  fallback: [
    "ui-monospace",
    "SFMono-Regular",
    "Menlo",
    "Consolas",
    "monospace",
  ],
})

/** Ocean. */
const interTight = localFont({
  src: "./fonts/inter-tight/inter-tight-latin-wght-normal.woff2",
  weight: "400 800",
  style: "normal",
  variable: "--font-inter-tight",
  preload: false,
})

/** Forest. */
const manrope = localFont({
  src: "./fonts/manrope/manrope-latin-wght-normal.woff2",
  weight: "400 800",
  style: "normal",
  variable: "--font-manrope",
  preload: false,
})

/**
 * Forest's headings: Bricolage Grotesque as the variable font (weights 200 to
 * 800) with its optical-size axis, so display sizes get the display cut.
 */
const bricolage = localFont({
  src: "./fonts/bricolage-grotesque/bricolage-grotesque-latin-opsz-normal.woff2",
  weight: "200 800",
  style: "normal",
  variable: "--font-bricolage",
  preload: false,
})

/** Ember. */
const dmSans = localFont({
  src: "./fonts/dm-sans/dm-sans-latin-wght-normal.woff2",
  weight: "400 800",
  style: "normal",
  variable: "--font-dm-sans",
  preload: false,
})

/**
 * Ember's headings: Fraunces, upright only, as the variable font (weights 100
 * to 900) with its optical-size axis, so display sizes get the display cut.
 */
const fraunces = localFont({
  src: "./fonts/fraunces/fraunces-latin-opsz-normal.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-fraunces",
  adjustFontFallback: "Times New Roman",
  preload: false,
})

/** Mono. */
const geist = localFont({
  src: "./fonts/geist/geist-latin-wght-normal.woff2",
  weight: "400 800",
  style: "normal",
  variable: "--font-geist",
  preload: false,
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s · ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  openGraph: {
    type: "website",
    siteName,
    title: siteName,
    description: siteDescription,
  },
  twitter: { card: "summary", title: siteName, description: siteDescription },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        jakarta.variable,
        geistMono.variable,
        interTight.variable,
        manrope.variable,
        bricolage.variable,
        dmSans.variable,
        fraunces.variable,
        geist.variable
      )}
    >
      <body>
        <ThemeProvider defaultTheme="light">
          <Toaster>
            <TooltipProvider>{children}</TooltipProvider>
          </Toaster>
        </ThemeProvider>
      </body>
    </html>
  )
}
