/**
 * Formats a score with at most 2 decimals and no trailing zeros.
 * 7 → "7", 7.5 → "7.5", 3.3333 → "3.33".
 */
export function formatScore(value: number): string {
  return String(Number(value.toFixed(2)));
}
