import { cn } from "cn"

/**
 * Blocks spinner. A thin ring with a quarter arc, drawn in currentColor so it
 * takes the colour of the text around it. Size it with `size-*`.
 * Under reduced motion the ring stays still.
 */
function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      className={cn("size-4 shrink-0 animate-spin", className)}
      {...props}
    >
      <circle cx="12" cy="12" r="9" className="opacity-20" />
      <path d="M12 3a9 9 0 0 1 9 9" />
    </svg>
  )
}

export { Spinner }
