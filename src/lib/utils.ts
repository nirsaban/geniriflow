/** Tiny className joiner — keeps conditional classes readable without a dep. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
