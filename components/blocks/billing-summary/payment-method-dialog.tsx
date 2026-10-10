"use client"

import * as React from "react"
import { CreditCardIcon, LockIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

export interface PaymentMethod {
  /** Card brand, e.g. "Visa". */
  brand: string
  last4: string
  /** Expiry as MM/YYYY. */
  expires: string
  /** Where receipts go. */
  email: string
  /** Legal name on invoices. */
  billedTo?: string
}

type CardField = "name" | "number" | "expiry" | "cvc"

function brandFor(digits: string) {
  if (/^4/.test(digits)) return "Visa"
  if (/^(5[1-5]|2[2-7])/.test(digits)) return "Mastercard"
  if (/^3[47]/.test(digits)) return "Amex"
  return "Card"
}

function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(.{4})/g, "$1 ")
    .trim()
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4)
  return digits.length > 2 ? `${digits.slice(0, 2)} / ${digits.slice(2)}` : digits
}

function validate(values: Record<CardField, string>) {
  const errors: Partial<Record<CardField, string>> = {}
  const digits = values.number.replace(/\D/g, "")
  const [mm, yy] = values.expiry.split("/").map((s) => s.trim())
  if (!values.name.trim()) errors.name = "Enter the name printed on the card."
  if (digits.length < 13) errors.number = "Enter the full card number."
  if (!mm || !yy || Number(mm) < 1 || Number(mm) > 12 || yy.length !== 2)
    errors.expiry = "Use the MM / YY format."
  if (!/^\d{3,4}$/.test(values.cvc)) errors.cvc = "Enter the 3 or 4 digits on the back."
  return errors
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function PaymentMethodDialog({
  onSave,
}: {
  onSave: (method: Pick<PaymentMethod, "brand" | "last4" | "expires">) => void
}) {
  const id = React.useId()
  const [open, setOpen] = React.useState(false)
  const [values, setValues] = React.useState<Record<CardField, string>>({ name: "", number: "", expiry: "", cvc: "" })
  const [attempted, setAttempted] = React.useState(false)
  const [pending, setPending] = React.useState(false)

  const errors = validate(values)
  const errorFor = (field: CardField) => (attempted ? errors[field] : undefined)

  function handleOpenChange(next: boolean) {
    if (pending) return
    setOpen(next)
    if (!next) {
      setValues({ name: "", number: "", expiry: "", cvc: "" })
      setAttempted(false)
    }
  }

  function set(field: CardField, value: string) {
    setValues((v) => ({ ...v, [field]: value }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAttempted(true)
    const first = (Object.keys(validate(values)) as CardField[])[0]
    if (first) {
      document.getElementById(`${id}-${first}`)?.focus()
      return
    }
    setPending(true)
    await wait(800)
    const digits = values.number.replace(/\D/g, "")
    const [mm, yy] = values.expiry.split("/").map((s) => s.trim())
    onSave({ brand: brandFor(digits), last4: digits.slice(-4), expires: `${mm}/20${yy}` })
    setPending(false)
    setOpen(false)
    setValues({ name: "", number: "", expiry: "", cvc: "" })
    setAttempted(false)
  }

  const fieldProps = (field: CardField) => ({
    id: `${id}-${field}`,
    "aria-invalid": Boolean(errorFor(field)),
    "aria-describedby": errorFor(field) ? `${id}-${field}-error` : undefined,
  })

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <CreditCardIcon data-icon="inline-start" />
        Update payment method
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit} noValidate className="contents">
          <DialogHeader>
            <DialogTitle>Update payment method</DialogTitle>
            <DialogDescription>The new card is charged from your next invoice.</DialogDescription>
          </DialogHeader>

          <FieldGroup className="gap-4">
            <Field data-invalid={Boolean(errorFor("name"))}>
              <FieldLabel htmlFor={`${id}-name`}>Name on card</FieldLabel>
              <Input
                {...fieldProps("name")}
                autoComplete="cc-name"
                placeholder="Lucas Moreau"
                value={values.name}
                onChange={(e) => set("name", e.target.value)}
              />
              <FieldError id={`${id}-name-error`}>{errorFor("name")}</FieldError>
            </Field>
            <Field data-invalid={Boolean(errorFor("number"))}>
              <FieldLabel htmlFor={`${id}-number`}>Card number</FieldLabel>
              <Input
                {...fieldProps("number")}
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="1234 1234 1234 1234"
                className="font-mono tabular-nums"
                value={values.number}
                onChange={(e) => set("number", formatCardNumber(e.target.value))}
              />
              <FieldError id={`${id}-number-error`}>{errorFor("number")}</FieldError>
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field data-invalid={Boolean(errorFor("expiry"))}>
                <FieldLabel htmlFor={`${id}-expiry`}>Expiry</FieldLabel>
                <Input
                  {...fieldProps("expiry")}
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder="MM / YY"
                  className="font-mono tabular-nums"
                  value={values.expiry}
                  onChange={(e) => set("expiry", formatExpiry(e.target.value))}
                />
                <FieldError id={`${id}-expiry-error`}>{errorFor("expiry")}</FieldError>
              </Field>
              <Field data-invalid={Boolean(errorFor("cvc"))}>
                <FieldLabel htmlFor={`${id}-cvc`}>Security code</FieldLabel>
                <Input
                  {...fieldProps("cvc")}
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  placeholder="CVC"
                  className="font-mono tabular-nums"
                  value={values.cvc}
                  onChange={(e) => set("cvc", e.target.value.replace(/\D/g, "").slice(0, 4))}
                />
                <FieldError id={`${id}-cvc-error`}>{errorFor("cvc")}</FieldError>
              </Field>
            </div>
            <p className="flex items-center gap-2 text-caption text-muted-foreground">
              <LockIcon className="size-3.5 shrink-0" aria-hidden="true" />
              Card details are encrypted and sent straight to our payment processor.
            </p>
          </FieldGroup>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" />} disabled={pending}>
              Cancel
            </DialogClose>
            <Button type="submit" disabled={pending}>
              {pending ? <Spinner data-icon="inline-start" /> : null}
              Save card
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
