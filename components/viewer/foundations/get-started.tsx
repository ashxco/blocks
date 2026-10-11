import Link from "next/link"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CodeBlock } from "@/components/viewer/code-block"
import { CopyButton } from "@/components/viewer/copy-button"
import {
  CommandRow,
  installCommand,
  registryUrl,
} from "@/components/viewer/install-command"
import { siteUrl } from "@/lib/site"
import { themes } from "@/lib/themes"
import { cn } from "@/lib/utils"

import {
  Code,
  FoundationPage,
  Meta,
  Section,
  SubHeading,
  type FoundationPageProps,
} from "./layout"

/*
 * Getting started: install Blocks in a Next.js app with the shadcn CLI. Every
 * command is built from the site's own origin (lib/site.ts), so a copied
 * command points at this deployment.
 */

/**
 * The CSS variable each face is loaded under. tokens.css reads these names
 * (font.family.sans, .heading and .mono per theme) and app/layout.tsx defines
 * them, so a consumer's next/font call has to use the same ones.
 */
const fontVariables: Record<string, string> = {
  "Plus Jakarta Sans": "--font-jakarta",
  "Geist Mono": "--font-geist-mono",
  "Inter Tight": "--font-inter-tight",
  Manrope: "--font-manrope",
  "Bricolage Grotesque": "--font-bricolage",
  "DM Sans": "--font-dm-sans",
  Fraunces: "--font-fraunces",
  Geist: "--font-geist",
}

const requirements = [
  {
    name: "Next.js 15 or later",
    note: "With the App Router and the @/* import alias at the project root, as create-next-app sets it up: the base installs under lib/, hooks/, design-system/ and app/styles/. The snippets on this page go in app/layout.tsx and app/globals.css.",
  },
  {
    name: "React 19",
    note: "What the components, hooks and primitives are written against.",
  },
  {
    name: "Tailwind CSS v4",
    note: "The tokens compile to a Tailwind v4 @theme, so only Blocks tokens produce utilities.",
  },
  {
    name: "The shadcn CLI",
    note: "Only to copy files in. There is no shadcn runtime dependency: Blocks components are built on Base UI.",
  },
]

const baseFiles = [
  "app/styles/blocks.css",
  "app/styles/tokens.css",
  "app/styles/variants.css",
  "app/styles/animate.css",
  "lib/utils.ts",
  "lib/portal-container.tsx",
  "lib/themes.ts",
  "lib/theme-scope.tsx",
  "lib/primitives",
  "hooks",
  "design-system/generated/tokens.ts",
]

const initCommand = "npx shadcn@latest init -d"

const globalsCss = `@import "tailwindcss";
@import "./styles/blocks.css";
`

const fontsLayout = `import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google"

import "./globals.css"

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={\`\${jakarta.variable} \${geistMono.variable}\`}>
      <body>{children}</body>
    </html>
  )
}
`

const usage = `import { Button } from "@/components/ui/button"

export function Toolbar() {
  return <Button>Create Project</Button>
}
`

const themeScope = `// The whole app: a theme and the mode, on <html>
<html lang="en" data-theme="ocean" className="dark">

// One region: any element takes a theme and a mode of its own
<section data-theme="forest" className="light">
`

/** Two columns from the narrow container width: copy on the left, code on the right. */
const split =
  "grid gap-8 @narrow:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] @narrow:items-start @narrow:gap-10"

/**
 * A command or file listing with a copy control. The control sits inside the
 * block's dark scope, so it reads on the terminal surface in both modes.
 */
function Snippet({
  code,
  file,
  label,
  className,
}: {
  code: string
  /** Where the snippet lives, e.g. app/globals.css. Omitted for commands. */
  file?: string
  label?: string
  className?: string
}) {
  return (
    <figure className={cn("grid min-w-0 gap-3", className)}>
      {file ? (
        <figcaption>
          <Meta>{file}</Meta>
        </figcaption>
      ) : null}
      <div className="dark relative min-w-0">
        <CodeBlock code={code} className="rounded-(--card-radius) border" />
        <CopyButton
          text={code}
          label={label ?? (file ? `Copy ${file}` : "Copy command")}
          className="absolute top-2 right-2"
        />
      </div>
    </figure>
  )
}

function Prose({ children }: { children: React.ReactNode }) {
  return <div className="grid content-start gap-5">{children}</div>
}

export function GetStartedFoundation({
  title,
  description,
}: FoundationPageProps) {
  // The base and the button carry --overwrite (installCommand adds it): init
  // writes shadcn's own lib/utils.ts and components/ui/button.tsx.
  const baseCommand = installCommand("blocks")
  const buttonCommand = installCommand("button")
  const menuCommand = installCommand("dropdown-menu")
  const registryIndex = `${registryUrl}/registry.json`
  const llmsUrl = `${siteUrl}/llms.txt`

  return (
    <FoundationPage title={title} description={description}>
      <Section
        id="requirements"
        title="Requirements"
        description="Blocks is copied into your app as source, so it needs the stack it is written for. Nothing is fetched at run time."
      >
        <ul className="grid divide-y border-y">
          {requirements.map((item) => (
            <li
              key={item.name}
              className="grid gap-1 py-4 @prose:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] @prose:gap-8"
            >
              <span className="text-title text-foreground">{item.name}</span>
              <span className="text-body text-copy">{item.note}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="install"
        title="Install the base"
        description="One registry item carries everything the components share: the stylesheets, the class merger, the portal container, the primitives and the hooks."
      >
        <div className={split}>
          <Prose>
            <p className="text-body text-copy">
              Run <Code>{initCommand}</Code> first: <Code>-d</Code> takes the
              defaults, so it asks nothing and writes{" "}
              <Code>components.json</Code>. It also writes shadcn&apos;s own{" "}
              <Code>lib/utils.ts</Code> and{" "}
              <Code>components/ui/button.tsx</Code>, which is why the base, and
              later the button, are added with <Code>--overwrite</Code>: the
              Blocks files replace them. If the app already has a{" "}
              <Code>components.json</Code>, skip init.
            </p>
            <p className="text-body text-copy">
              init also installs the <Code>shadcn</Code> and{" "}
              <Code>tw-animate-css</Code> packages. Blocks does not use them
              once the CSS is wired, so remove them or leave them.
            </p>
            <div className="grid gap-2">
              <SubHeading>What it adds</SubHeading>
              <ul className="grid gap-1.5 pt-1">
                {baseFiles.map((file) => (
                  <li key={file}>
                    <Code>{file}</Code>
                  </li>
                ))}
              </ul>
            </div>
          </Prose>
          <Snippet code={`${initCommand}\n${baseCommand}\n`} />
        </div>
      </Section>

      <Section
        id="css"
        title="Wire the CSS"
        description={
          <>
            Your app imports one file. <Code>blocks.css</Code> imports{" "}
            <Code>tokens.css</Code>, <Code>variants.css</Code> and{" "}
            <Code>animate.css</Code>, so Tailwind sees every token, state
            variant and animation from a single import.
          </>
        }
      >
        <div className={split}>
          <Prose>
            <p className="text-body text-copy">
              <Code>app/globals.css</Code> should be exactly these two lines.{" "}
              <Code>shadcn init</Code> fills it with its own imports and
              variables, so replace the whole file: the Blocks tokens stand in
              for shadcn&apos;s variables, and Tailwind&apos;s default palette,
              shadows and type scale are removed on purpose.
            </p>
          </Prose>
          <Snippet code={globalsCss} file="app/globals.css" />
        </div>
      </Section>

      <Section
        id="fonts"
        title="Fonts"
        description="Blocks never names a font family in a component. Each theme's font tokens read CSS variables, so you load the faces once, under the names tokens.css expects, and every theme finds them."
      >
        <div className={split}>
          <Prose>
            <p className="text-body text-copy">
              For the default theme, load Plus Jakarta Sans as{" "}
              <Code>--font-jakarta</Code> and Geist Mono as{" "}
              <Code>--font-geist-mono</Code> with <Code>next/font</Code>, and
              put both variable classes on <Code>&lt;html&gt;</Code>. Google
              Fonts is the quickest route; this site self-hosts the same faces
              from <Code>app/fonts</Code> with <Code>next/font/local</Code>, and
              you can do the same.
            </p>
            <p className="text-body text-copy">
              Load only the faces of the themes you ship. Every theme sets code
              in Geist Mono, so <Code>--font-geist-mono</Code> is always needed.
              A variable that is not defined falls back to the system stack, so
              the app builds and runs before this step; it only looks right
              after it.
            </p>
          </Prose>
          <Snippet code={fontsLayout} file="app/layout.tsx" />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Theme</TableHead>
              <TableHead>Text</TableHead>
              <TableHead>Headings</TableHead>
              <TableHead>Variables</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {themes.map((theme) => {
              const faces = [theme.fonts.sans, theme.fonts.heading].filter(
                (face, index, all) => all.indexOf(face) === index
              )
              return (
                <TableRow key={theme.id}>
                  <TableCell className="font-semibold text-foreground">
                    {theme.name}
                  </TableCell>
                  <TableCell>{theme.fonts.sans}</TableCell>
                  <TableCell>{theme.fonts.heading}</TableCell>
                  <TableCell>
                    <span className="flex flex-wrap gap-x-3 gap-y-0.5">
                      {faces.map((face) => (
                        <Code key={face} className="whitespace-nowrap">
                          {fontVariables[face] ?? face}
                        </Code>
                      ))}
                    </span>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Section>

      <Section
        id="components"
        title="Add components"
        description="Each component is its own registry item, named after its file in components/ui. Dependencies between components resolve on their own: dropdown-menu pulls in button."
      >
        <div className={split}>
          <Prose>
            <p className="text-body text-copy">
              Add a component by its slug, then import it from{" "}
              <Code>@/components/ui</Code>. The button takes{" "}
              <Code>--overwrite</Code> once, because init wrote shadcn&apos;s
              own <Code>button.tsx</Code>. No other component needs a flag: the
              CLI skips files that are already installed and identical, and
              pulls in the base and any component it depends on.
            </p>
            <p className="text-body text-copy">
              The APIs follow shadcn/ui, so its examples carry over; composition
              uses the <Code>render</Code> prop; there is no child-slot prop to
              swap in.
            </p>
            <div className="grid gap-2">
              <SubHeading>Every item</SubHeading>
              <p className="text-body text-copy">
                The index lists the base and every component with its files and
                dependencies.
              </p>
              <CommandRow text={registryIndex} label="Copy registry URL" />
            </div>
          </Prose>
          <div className="grid min-w-0 gap-6">
            <Snippet code={`${buttonCommand}\n${menuCommand}\n`} />
            <Snippet code={usage} file="components/toolbar.tsx" />
          </div>
        </div>
      </Section>

      <Section
        id="theme"
        title="Pick a theme"
        description={
          <>
            <Code>data-theme=&quot;&lt;id&gt;&quot;</Code> on{" "}
            <Code>&lt;html&gt;</Code>, or on any element, gives its subtree that
            theme. <Code>.dark</Code> switches a subtree to dark values and{" "}
            <Code>.light</Code> forces light ones. No attribute means Blocks.
          </>
        }
      >
        <div className={split}>
          <Prose>
            <p className="text-body text-copy">
              The ids are{" "}
              {themes.map((theme, index) => (
                <span key={theme.id}>
                  {index > 0
                    ? index === themes.length - 1
                      ? " and "
                      : ", "
                    : null}
                  <Code>{theme.id}</Code>
                </span>
              ))}
              . A theme changes the accent, the neutrals, the radii and the
              fonts; spacing, sizes and status meanings stay the same, and every
              theme works in both modes.
            </p>
            <Link
              href="/foundations/themes"
              className="text-label text-brand link-underline outline-none focus-visible:focus-ring"
            >
              See the five themes
            </Link>
          </Prose>
          <Snippet code={themeScope} label="Copy theme scopes" />
        </div>
      </Section>

      <Section
        id="agents"
        title="Use in agents"
        description="Coding agents read the same contract people do. One plain-text file holds the rules of the system and the list of components, with their install commands."
      >
        <div className="grid gap-3">
          <p className="text-body text-copy">
            Point an agent at <Code>llms.txt</Code> before it writes UI, and it
            installs from this registry and follows the design contract.
          </p>
          <CommandRow text={llmsUrl} label="Copy llms.txt URL" />
        </div>
      </Section>
    </FoundationPage>
  )
}
