import type { Metadata } from "next"

import { AuthForm } from "@/components/blocks/auth-form"

export const metadata: Metadata = {
  title: "Create your account",
  description:
    "Create an Acme account and plan your team’s work in one place. Free for up to 3 members, or try Pro free for 14 days.",
}

export default function SignUpPage() {
  return <AuthForm mode="sign-up" termsHref="#" privacyHref="#" />
}
