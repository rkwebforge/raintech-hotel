// Constructed once at module load — building an Intl formatter is far more
// expensive than calling one, and these run per row in tables.
const RUPEES = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
});

/** Formats a number as Indian rupees, matching the amounts in the UI. */
export function formatCurrency(amount) {
  return RUPEES.format(amount);
}
