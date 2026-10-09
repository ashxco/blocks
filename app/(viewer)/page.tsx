import Link from "next/link"

import { components, foundations, molecules, templates } from "@/lib/registry"

export default function Overview() {
  return (
    <main className="grid gap-10">
      <h1 className="text-display">Blocks</h1>
      {[
        ["foundations", foundations],
        ["components", components],
        ["molecules", molecules],
      ].map(([base, list]) => (
        <ul key={base as string} className="flex flex-wrap gap-3">
          {(list as { slug: string; title: string }[]).map((e) => (
            <li key={e.slug}>
              <Link className="text-brand" href={`/${base}/${e.slug}`}>{e.title}</Link>
            </li>
          ))}
        </ul>
      ))}
      <ul className="flex flex-wrap gap-3">
        {templates.map((t) => (
          <li key={t.slug}><Link className="text-brand" href={t.href}>{t.title}</Link></li>
        ))}
      </ul>
    </main>
  )
}
