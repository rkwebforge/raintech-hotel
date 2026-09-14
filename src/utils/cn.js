/**
 * Joins class names, skipping falsy values. Later classes win by virtue of
 * appearing last in the string, which is enough for how the widgets compose
 * (base classes first, caller `className` last).
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
