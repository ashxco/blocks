import type { Metadata } from "next"

import { AuthForm } from "@/components/blocks/auth-form"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to Acme to pick up your tasks, projects and docs where you left them.",
}

export default function SignInPage() {
  return <AuthForm mode="sign-in" />
}
