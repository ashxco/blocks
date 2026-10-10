import type { Metadata } from "next"
import {
  Bricolage_Grotesque,
  DM_Sans,
  Fraunces,
  Geist,
  Geist_Mono,
  Inter_Tight,
  Manrope,
  Plus_Jakarta_Sans,
} from "next/font/google"

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
 */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
})

/** Code in every theme, and Mono's headings at 800: the variable font, weights 100 to 900. */
const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-geist-mono",
})

/** Ocean. */
const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter-tight",
  preload: false,
})

/** Forest. */
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  preload: false,
})

/**
 * Forest's headings: Bricolage Grotesque as the variable font (weights 200 to
 * 800) with its optical-size axis, so display sizes get the display cut.
 */
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: "variable",
  axes: ["opsz"],
  variable: "--font-bricolage",
  preload: false,
})

/** Ember. */
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-dm-sans",
  preload: false,
})

/**
 * Ember's headings: Fraunces, upright only, as the variable font (weights 100
 * to 900) with its optical-size axis, so display sizes get the display cut.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: "variable",
  style: "normal",
  axes: ["opsz"],
  variable: "--font-fraunces",
  preload: false,
})

/** Mono. */
const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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
  openGraph: { type: "website", siteName, title: siteName, description: siteDescription },
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
