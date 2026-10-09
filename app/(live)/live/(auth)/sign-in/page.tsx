import type { Metadata } from "next"

import { AuthForm } from "@/components/blocks/auth-form"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to Lumen to deploy, review preview URLs and read your logs.",
}

export default function SignInPage() {
  return <AuthForm mode="sign-in" />
}
