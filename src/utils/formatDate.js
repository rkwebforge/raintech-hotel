// Constructed once at module load; see the note in formatCurrency.js.
const DAY_MONTH_YEAR = new Intl.DateTimeFormat('en-GB');

/** Formats an ISO date string (`2026-04-02`) as `02/04/2026`. */
export function formatDate(isoDate) {
  return DAY_MONTH_YEAR.format(new Date(isoDate));
}
