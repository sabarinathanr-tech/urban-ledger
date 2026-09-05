/**
 * Utility to conditionally join class names.
 * Filters out falsy values and joins remaining strings with a space.
 */
export function cn(
  ...classes: (string | boolean | undefined | null)[]
): string {
  return classes.filter(Boolean).join(' ');
}
