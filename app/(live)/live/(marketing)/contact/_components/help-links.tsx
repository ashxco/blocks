import Link from "next/link"
import { ArrowRightIcon, BookOpenIcon, CreditCardIcon, SparklesIcon, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface HelpLink {
  icon: LucideIcon
  title: string
  description: string
  href: string
}

const links: HelpLink[] = [
  {
    icon: CreditCardIcon,
    title: "Compare plans",
    description: "Limits, prices and what each plan includes, side by side.",
    href: "/live/pricing",
  },
  {
    icon: BookOpenIcon,
    title: "Read the guides",
    description: "Step-by-step posts on planning, automations, reports and guests.",
    href: "/live/blog",
  },
  {
    icon: SparklesIcon,
    title: "See what shipped",
    description: "Every new feature and improvement, newest first.",
    href: "/live/changelog",
  },
]

/** Self-serve answers under the contact form, in a hairline grid of links. */
export function HelpLinks({ className }: { className?: string }) {
  return (
    <section aria-labelledby="help-links-title" className={cn("container-page", className)}>
      <div className="grid gap-10 border-t pt-14 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,2fr)] lg:gap-16 lg:pt-20">
        <div className="grid content-start gap-3">
          <h2 id="help-links-title" className="text-h3 text-foreground">
            Need an answer right now?
          </h2>
          <p className="max-w-prose text-body text-copy">Most questions are already answered in one of these.</p>
        </div>

        <ul className="grid gap-px overflow-hidden rounded-(--card-radius) border bg-border md:grid-cols-3">
          {links.map((link) => {
            const Icon = link.icon
            return (
              <li key={link.href} className="bg-background">
                <Link
                  href={link.href}
                  className="group/help flex h-full flex-col gap-10 p-6 outline-none transition-colors duration-(--duration-fast) ease-standard hover:bg-subtle focus-visible:focus-ring focus-visible:-outline-offset-2 sm:p-8"
                >
                  <span className="flex items-center justify-between">
                    <span className="grid size-10 place-items-center rounded-md border bg-background text-foreground">
                      <Icon aria-hidden="true" className="size-4.5" />
                    </span>
                    <ArrowRightIcon
                      aria-hidden="true"
                      className="size-5 text-muted-foreground transition-[color,translate] duration-(--duration-fast) ease-standard group-hover/help:translate-x-0.5 group-hover/help:text-foreground"
                    />
                  </span>
                  <span className="grid gap-1.5">
                    <span className="text-title text-foreground">{link.title}</span>
                    <span className="text-sm text-copy">{link.description}</span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
