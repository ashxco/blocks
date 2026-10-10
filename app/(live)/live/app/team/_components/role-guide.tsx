import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { ROLE_GUIDE } from "./team-data"

/** What each role can do, so people pick the right one before they invite. */
export function RoleGuide({ className }: { className?: string }) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>
          <h2>Roles</h2>
        </CardTitle>
        <CardDescription>What each role can do in Acme Inc.</CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="-my-3 divide-y">
          {ROLE_GUIDE.map((item) => (
            <div key={item.role} className="grid gap-1 py-3">
              <dt className="text-label text-foreground">{item.role}</dt>
              <dd className="text-sm text-copy">{item.description}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}
