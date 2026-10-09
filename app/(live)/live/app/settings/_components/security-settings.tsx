"use client"

import * as React from "react"
import {
  FingerprintIcon,
  KeyRoundIcon,
  LaptopIcon,
  MonitorIcon,
  ShieldCheckIcon,
  SmartphoneIcon,
  TerminalIcon,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { PASSWORD_MIN } from "@/components/blocks/auth-form"
import { SettingsSection } from "@/components/blocks/settings-section"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { toast } from "@/components/ui/toast"

import { INITIAL_RECOVERY_CODES, RecoveryCodesDialog } from "./recovery-codes-dialog"

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/*
 * Item lists: rows line up with the card text; in narrow cards the actions drop under the text.
 * Titles use the label role, like the SwitchRow settings on the other tabs, so every settings row shares one size.
 */
const itemList = "@container/items -my-3.5"
const itemActions = "@max-[28rem]/items:basis-full @max-[28rem]/items:pl-14"
/** Two-step rows vary in height (the passkey list), so every action sits at the top, beside the title. */
const methodActions = cn(itemActions, "self-start")

/** Security tab: password, two-step verification and signed-in devices. */
export function SecuritySettings() {
  return (
    <div className="divide-y">
      <PasswordSection />
      <TwoStepSection />
      <SessionsSection />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Password                                                                   */
/* -------------------------------------------------------------------------- */

function PasswordSection() {
  const id = React.useId()
  const confirmRef = React.useRef<HTMLInputElement>(null)
  const [current, setCurrent] = React.useState("")
  const [next, setNext] = React.useState("")
  const [confirm, setConfirm] = React.useState("")
  const mismatch = confirm.length > 0 && confirm !== next

  // Let the browser block the submit while the two new passwords differ.
  React.useEffect(() => {
    confirmRef.current?.setCustomValidity(mismatch ? "The new passwords don’t match." : "")
  }, [mismatch])

  return (
    <SettingsSection
      title="Password"
      description={`Use at least ${PASSWORD_MIN} characters. A few unrelated words make a strong password that’s easy to type.`}
      footerNote="Last changed on June 2, 2026."
      saveLabel="Update password"
      successTitle="Password updated"
      successDescription="Use it the next time you sign in. Your other sessions stay signed in."
      onSave={async () => {
        await wait(700)
        setCurrent("")
        setNext("")
        setConfirm("")
      }}
    >
      <FieldGroup>
        {/* Lets password managers file the new password under the right account. */}
        <input type="email" name="username" autoComplete="username" value="maya@acme.dev" readOnly hidden />

        <Field>
          <FieldLabel htmlFor={`${id}-current`}>Current password</FieldLabel>
          <Input
            id={`${id}-current`}
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            required
          />
        </Field>

        <div className="grid gap-6 @min-[30rem]/field-group:grid-cols-2">
          <Field>
            <FieldLabel htmlFor={`${id}-new`}>New password</FieldLabel>
            <Input
              id={`${id}-new`}
              name="newPassword"
              type="password"
              autoComplete="new-password"
              minLength={PASSWORD_MIN}
              value={next}
              onChange={(e) => setNext(e.target.value)}
              aria-describedby={`${id}-new-hint`}
              required
            />
            <FieldDescription id={`${id}-new-hint`}>At least {PASSWORD_MIN} characters.</FieldDescription>
          </Field>

          <Field data-invalid={mismatch || undefined}>
            <FieldLabel htmlFor={`${id}-confirm`}>Confirm new password</FieldLabel>
            <Input
              ref={confirmRef}
              id={`${id}-confirm`}
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              aria-invalid={mismatch || undefined}
              aria-describedby={mismatch ? `${id}-confirm-error` : undefined}
              required
            />
            {mismatch ? (
              <FieldError id={`${id}-confirm-error`}>Doesn’t match the new password. Type it again.</FieldError>
            ) : null}
          </Field>
        </div>
      </FieldGroup>
    </SettingsSection>
  )
}

/* -------------------------------------------------------------------------- */
/* Two-step verification                                                       */
/* -------------------------------------------------------------------------- */

const passkeys = [
  { id: "touch-id", name: "MacBook Pro Touch ID", meta: "Added Mar 3, 2026 · Used today" },
  { id: "yubikey", name: "YubiKey 5C NFC", meta: "Added Jan 12, 2026 · Used 9 days ago" },
]

function TwoStepSection() {
  const requireId = React.useId()
  const [authenticator, setAuthenticator] = React.useState(true)
  const [confirmOff, setConfirmOff] = React.useState(false)
  const [codes, setCodes] = React.useState(INITIAL_RECOVERY_CODES)
  const unused = codes.filter((c) => !c.used).length

  function turnOff() {
    setConfirmOff(false)
    setAuthenticator(false)
    toast.add({ title: "Authenticator app turned off", description: "You can still sign in with your passkeys." })
  }

  function setUp() {
    setAuthenticator(true)
    toast.add({ title: "Authenticator app connected", description: "Lumen asks for a code the next time you sign in." })
  }

  return (
    <SettingsSection
      title="Two-step verification"
      description="A second step at sign-in keeps your account safe if your password leaks."
      hideFooter
    >
      <div className="grid gap-6">
        <ItemGroup variant="divided" className={itemList}>
          <Item role="listitem">
            <ItemMedia variant="icon">
              <SmartphoneIcon aria-hidden="true" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle className="text-label">
                Authenticator app
                {authenticator ? <Badge variant="success">On</Badge> : <Badge variant="outline">Off</Badge>}
              </ItemTitle>
              <ItemDescription className="line-clamp-none text-caption">
                {authenticator
                  ? "Six-digit codes from 1Password, Authy or Google Authenticator. Set up on Mar 3, 2026."
                  : "Use an app such as 1Password, Authy or Google Authenticator to get sign-in codes."}
              </ItemDescription>
            </ItemContent>
            <ItemActions className={methodActions}>
              {/* One button that changes its label, so focus stays put when the state flips. */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => (authenticator ? setConfirmOff(true) : setUp())}
              >
                {authenticator ? "Turn off" : "Set up"}
              </Button>
            </ItemActions>
          </Item>

          <Item role="listitem">
            <ItemMedia variant="icon">
              <FingerprintIcon aria-hidden="true" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle className="text-label">
                Passkeys
                <Badge variant="secondary">{passkeys.length}</Badge>
              </ItemTitle>
              <ItemDescription className="line-clamp-none text-caption">Sign in with Touch ID, Windows Hello or a security key instead of a code.</ItemDescription>
              <ul className="mt-2 grid gap-1.5">
                {passkeys.map((key) => (
                  <li key={key.id} className="flex flex-wrap items-baseline gap-x-2 text-sm">
                    <span className="font-semibold text-foreground">{key.name}</span>
                    <span className="text-caption text-muted-foreground">{key.meta}</span>
                  </li>
                ))}
              </ul>
            </ItemContent>
            <ItemActions className={methodActions}>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  toast.add({
                    title: "Waiting for your browser",
                    description: "Follow the prompt from your browser or security key to add a passkey.",
                  })
                }
              >
                Add passkey
              </Button>
            </ItemActions>
          </Item>

          <Item role="listitem">
            <ItemMedia variant="icon">
              <KeyRoundIcon aria-hidden="true" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle className="text-label">Recovery codes</ItemTitle>
              <ItemDescription className="line-clamp-none text-caption">
                {unused} of {codes.length} codes left. Each one signs you in once if you lose your phone and keys.
              </ItemDescription>
            </ItemContent>
            <ItemActions className={methodActions}>
              <RecoveryCodesDialog codes={codes} onRegenerate={setCodes} />
            </ItemActions>
          </Item>

          {/* A workspace policy, but the same row shape as the methods above: icon tile, title, control. */}
          <Item role="listitem">
            <ItemMedia variant="icon">
              <ShieldCheckIcon aria-hidden="true" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle className="text-label" id={`${requireId}-title`}>Require it in Acme Inc.</ItemTitle>
              <ItemDescription id={`${requireId}-description`} className="line-clamp-none text-caption">
                Members without two-step verification set it up the next time they sign in. Only owners and admins
                can change this.
              </ItemDescription>
            </ItemContent>
            <ItemActions className={methodActions}>
              <Switch
                aria-labelledby={`${requireId}-title`}
                aria-describedby={`${requireId}-description`}
                defaultChecked={false}
                onCheckedChange={(on) =>
                  toast.add({
                    title: on ? "Two-step verification is now required" : "Two-step verification is optional again",
                    description: on ? "4 members will be asked to set it up at their next sign-in." : undefined,
                  })
                }
              />
            </ItemActions>
          </Item>
        </ItemGroup>
      </div>

      <AlertDialog open={confirmOff} onOpenChange={setConfirmOff}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Turn off the authenticator app?</AlertDialogTitle>
            <AlertDialogDescription>
              You can still sign in with your passkeys. Workspaces that require two-step verification will ask you to
              set it up again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={turnOff}>
              Turn off
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SettingsSection>
  )
}

/* -------------------------------------------------------------------------- */
/* Active sessions                                                             */
/* -------------------------------------------------------------------------- */

interface Session {
  id: string
  device: string
  client: string
  location: string
  lastActive: string
  icon: LucideIcon
  current?: boolean
}

const initialSessions: Session[] = [
  {
    id: "mbp",
    device: "MacBook Pro",
    client: "Chrome 141 on macOS",
    location: "Berlin, Germany",
    lastActive: "Active now",
    icon: LaptopIcon,
    current: true,
  },
  {
    id: "iphone",
    device: "iPhone 17",
    client: "Lumen for iOS 3.4",
    location: "Berlin, Germany",
    lastActive: "Active 2 hours ago",
    icon: SmartphoneIcon,
  },
  {
    id: "studio",
    device: "Studio desktop",
    client: "Firefox 143 on Windows",
    location: "Lisbon, Portugal",
    lastActive: "Active 5 days ago",
    icon: MonitorIcon,
  },
  {
    id: "cli",
    device: "Lumen CLI",
    client: "lumen 4.2.0 on Linux",
    location: "Frankfurt, Germany",
    lastActive: "Active 3 weeks ago",
    icon: TerminalIcon,
  },
]

function SessionsSection() {
  const [sessions, setSessions] = React.useState(initialSessions)
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  // Captured when the dialog opens, so its copy doesn’t change while it animates out.
  const [confirmCount, setConfirmCount] = React.useState(0)
  const others = sessions.filter((s) => !s.current)

  function signOut(session: Session) {
    setSessions((list) => list.filter((s) => s.id !== session.id))
    toast.add({ title: `Signed out of ${session.device}`, description: `${session.client} has to sign in again.` })
  }

  function askSignOutOthers() {
    setConfirmCount(others.length)
    setConfirmOpen(true)
  }

  function signOutOthers() {
    setConfirmOpen(false)
    setSessions((list) => list.filter((s) => s.current))
    toast.add({
      title: confirmCount === 1 ? "Signed out of 1 session" : `Signed out of ${confirmCount} sessions`,
      description: "Only this device is still signed in.",
    })
  }

  return (
    <SettingsSection
      title="Active sessions"
      description="Devices signed in to your account. If you don’t recognise one, sign it out and change your password."
      hideFooter
    >
      <div className="grid gap-6">
        <ItemGroup variant="divided" className={itemList}>
          {sessions.map((session) => (
            <Item key={session.id} role="listitem">
              <ItemMedia variant="icon">
                <session.icon aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="text-label">
                  {session.device}
                  {session.current ? <Badge variant="brand">This device</Badge> : null}
                </ItemTitle>
                <ItemDescription className="line-clamp-none text-caption">
                  {session.client} · {session.location} · {session.lastActive}
                </ItemDescription>
              </ItemContent>
              {session.current ? null : (
                <ItemActions className={itemActions}>
                  <Button type="button" variant="outline" size="sm" onClick={() => signOut(session)}>
                    Sign out
                  </Button>
                </ItemActions>
              )}
            </Item>
          ))}
        </ItemGroup>

        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t pt-6">
          <p className="text-sm text-muted-foreground">
            {others.length
              ? `${others.length} other ${others.length === 1 ? "session" : "sessions"} signed in.`
              : "Only this device is signed in."}
          </p>
          <Button type="button" variant="outline" size="sm" disabled={others.length === 0} onClick={askSignOutOthers}>
            Sign out of other sessions
          </Button>
        </div>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out of every other session?</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmCount === 1 ? "1 device has" : `${confirmCount} devices have`} to sign in again. Deploy tokens
              used in CI keep working.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={signOutOthers}>
              Sign out others
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SettingsSection>
  )
}
