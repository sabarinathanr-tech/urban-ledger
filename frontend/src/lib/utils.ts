/**
 * Utility function to conditionally combine CSS class names.
 * Filters out falsy values and handles strings, arrays, and objects.
 */
export function cn(
  ...classes: (string | boolean | undefined | null | Record<string, boolean> | (string | boolean | undefined | null)[])[]
): string {
  const result: string[] = [];

  for (const item of classes) {
    if (!item) continue;

    if (typeof item === 'string') {
      result.push(item);
    } else if (Array.isArray(item)) {
      result.push(cn(...item));
    } else if (typeof item === 'object') {
      for (const [key, value] of Object.entries(item)) {
        if (value) result.push(key);
      }
    }
  }

  return result.join(' ').trim();
}
