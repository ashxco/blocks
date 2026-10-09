/** Flat avatar fills. Same names as the Avatar tones and the tint-* tokens. */
export type PersonTone = "violet" | "mint" | "sand" | "sky" | "rose"

/**
 * The people of Acme Inc., the Lumen sample workspace, and the avatar tint
 * each one keeps everywhere: the top bar, the team page, the activity feed,
 * recent deployments and the account screens. Molecules look a person up here
 * by name, so one name always gets one colour. Anyone not listed falls back to
 * the Avatar's own tint, picked from their initials.
 */
export const PEOPLE: Record<string, PersonTone> = {
  "Maya Chen": "violet",
  "Daniel Okafor": "sky",
  "Priya Shah": "mint",
  "Leo Martins": "sand",
  "Sam Rivera": "rose",
  "Nina Petrova": "sky",
}

/** The tint for a person, or undefined to let the Avatar pick one from the initials. */
export function personTone(name?: string): PersonTone | undefined {
  return name ? PEOPLE[name.trim()] : undefined
}
