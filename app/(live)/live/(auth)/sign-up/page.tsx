import type { Metadata } from "next"

import { AuthForm } from "@/components/blocks/auth-form"

export const metadata: Metadata = {
  title: "Create your account",
  description:
    "Create a Lumen account and deploy your first project in under a minute. Every new workspace starts with 14 days of Pro, no card needed.",
}

export default function SignUpPage() {
  return <AuthForm mode="sign-up" termsHref="#" privacyHref="#" />
}
