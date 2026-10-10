/** Flat avatar fills. Same names as the Avatar tones and the tint-* tokens. */
export type PersonTone = "violet" | "mint" | "sand" | "sky" | "rose"

/**
 * The Acme team in the docs examples, and the avatar tint each person keeps
 * in every example, so one teammate never changes colour between pages.
 * Anyone not listed falls back to the Avatar's own tint, picked from their
 * initials.
 */
const PEOPLE: Record<string, PersonTone> = {
  "Maya Patel": "violet",
  "Hana Kim": "sand",
  "Daniel Brooks": "sky",
  "Jordan Lee": "mint",
  "Sofia Alvarez": "rose",
  "Sam Okafor": "mint",
  "Priya Raman": "sky",
  "Lucas Moreau": "rose",
}

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .toUpperCase()

/** Teammates by initials ("MP"), for examples that only carry initials. Each team member's initials are unique. */
const TONES_BY_INITIALS: Record<string, PersonTone> = Object.fromEntries(
  Object.entries(PEOPLE).map(([name, tone]) => [initialsOf(name), tone])
)

/** The tint for a teammate's initials, such as "MP", or undefined for anyone else. */
export function initialsTone(initials?: string): PersonTone | undefined {
  return initials ? TONES_BY_INITIALS[initials.trim().toUpperCase()] : undefined
}
