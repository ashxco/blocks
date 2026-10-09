import { AuthFrame } from "./_components/auth-frame"
import { AuthShowcase } from "./_components/auth-showcase"

/**
 * Shared frame for the Lumen account templates. Sign in, sign up and reset
 * password sit in a split screen: the form column on the left, a dark panel
 * with a live deploy log and a customer quote on the right (from lg up).
 * Onboarding gets a full-width frame so its own step panel has room.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthFrame aside={<AuthShowcase />}>{children}</AuthFrame>
}
