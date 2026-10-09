import { AuthShowcase, AuthShowcaseCompact } from "@/components/blocks/auth-form/showcase"

import { AuthFrame } from "./_components/auth-frame"

/**
 * Shared frame for the Lumen account templates. Sign in, sign up and reset
 * password sit in a split screen: the form column on the left, a dark panel
 * with its own headline, a live deploy log and a customer quote on the right
 * (from lg up; the reset screen leaves the quote out).
 * Below lg the quote follows the form on a small dark panel, except on the
 * reset page, where a testimonial is off-key for someone locked out.
 * Onboarding gets a full-width frame so its own step panel has room.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthFrame
      aside={<AuthShowcase />}
      asideByRoute={{
        "/live/sign-up": <AuthShowcase variant="sign-up" />,
        "/live/forgot-password": <AuthShowcase variant="reset" />,
      }}
      compact={<AuthShowcaseCompact />}
    >
      {children}
    </AuthFrame>
  )
}
