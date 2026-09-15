import PropTypes from 'prop-types';
import Icon from '../icon';
import { cn } from '../../utils/cn';

// Most slots the number strip may occupy, ellipses included. Odd, so the
// current page sits centred when the window floats between both ends.
const MAX_SLOTS = 7;

/**
 * The page numbers to show, with `null` marking a gap. Always keeps the first
 * and last page reachable and centres the window on the current page.
 */
function pageSlots(pageIndex, pageCount) {
  if (pageCount <= MAX_SLOTS) {
    return Array.from({ length: pageCount }, (_, page) => page);
  }

  // First, last, current, its two neighbours, and the two ellipses fill the
  // budget exactly; the clamp keeps the window inside the real page range.
  const start = Math.min(Math.max(pageIndex - 1, 1), pageCount - 4);
  const end = Math.max(Math.min(pageIndex + 1, pageCount - 2), 3);

  const slots = [0];
  if (start > 1) slots.push(null);
  for (let page = start; page <= end; page += 1) slots.push(page);
  if (end < pageCount - 2) slots.push(null);
  slots.push(pageCount - 1);

  return slots;
}

/**
 * Page navigation for a table. Page numbers are 0-based to match the table
 * state that drives it; only the labels are 1-based.
 */
function Pagination({
  pageIndex,
  pageCount,
  onPageChange,
  className = '',
  ...props
}) {
  const canPrevious = pageIndex > 0;
  const canNext = pageIndex < pageCount - 1;

  const buttonClasses =
    'text-style-8 rounded-field border-line-strong text-ink flex h-8 min-w-8 items-center justify-center gap-1 border px-2 transition-colors not-disabled:hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3',
        className
      )}
      {...props}
    >
      <p className="text-style-7 text-ink-muted">
        Page {pageIndex + 1} of {pageCount}
      </p>

      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          aria-label="Previous page"
          disabled={!canPrevious}
          onClick={() => onPageChange(pageIndex - 1)}
          className={buttonClasses}
        >
          <Icon name="chevronLeft" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {pageSlots(pageIndex, pageCount).map((page, slot) =>
          page === null ? (
            <span
              // Only two gaps exist and neither moves, so the slot index is a
              // stable key for them.
              key={`gap-${slot}`}
              aria-hidden="true"
              className="text-style-7 text-ink-subtle px-1"
            >
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              aria-label={`Page ${page + 1}`}
              aria-current={page === pageIndex ? 'page' : undefined}
              onClick={() => onPageChange(page)}
              className={cn(
                buttonClasses,
                page === pageIndex &&
                  'bg-navy text-ink-inverse border-navy hover:bg-navy-dark'
              )}
            >
              {page + 1}
            </button>
          )
        )}

        <button
          type="button"
          aria-label="Next page"
          disabled={!canNext}
          onClick={() => onPageChange(pageIndex + 1)}
          className={buttonClasses}
        >
          <span className="hidden sm:inline">Next</span>
          <Icon name="chevronRight" />
        </button>
      </div>
    </div>
  );
}

Pagination.propTypes = {
  pageIndex: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default Pagination;
