import type { Metadata } from "next"

import { ResetRequestForm } from "./_components/reset-request-form"

export const metadata: Metadata = {
  title: "Reset your password",
  description: "Get a link to choose a new password for your Lumen account.",
}

export default function ForgotPasswordPage() {
  return <ResetRequestForm />
}
