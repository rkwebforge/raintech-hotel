import PropTypes from 'prop-types';
import Button from '../../widget/button';
import Icon from '../../widget/icon';
import SearchInput from '../../widget/input/search-input';
import { cn } from '../../utils/cn';

const DATE_TIME_FORMAT = {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
};

// Read once at module load, not per render, so the two copies of the bar can't
// show different times.
const CURRENT_DATE_TIME = new Intl.DateTimeFormat(
  undefined,
  DATE_TIME_FORMAT
).format(new Date());

function Navbar({ propertyName, propertyType, className = '', ...props }) {
  /* Rendered twice (inline bar + stacked mobile row), so each copy needs its
     own id to keep ids unique in the document. */
  const renderSearch = inputId => (
    <SearchInput
      inputId={inputId}
      placeholder="Search guests, rooms, reservations, staff..."
    />
  );

  return (
    <div className="bg-surface border-line border-b">
      <header className={cn('container px-4 sm:px-6', className)} {...props}>
        <div className="flex h-16 items-center gap-2 sm:gap-3">
          <button
            type="button"
            aria-label="Open app menu"
            className="bg-navy text-ink-inverse rounded-field hover:bg-navy-dark flex h-10 w-10 shrink-0 items-center justify-center transition-colors"
          >
            <Icon name="appGrid" size="h-5 w-5" />
          </button>

          <button
            type="button"
            className="border-line-strong rounded-field hover:bg-surface-muted flex shrink-0 items-center gap-2 border py-1.5 pr-2 pl-1.5 transition-colors"
          >
            <span className="bg-navy-soft text-navy text-style-5 flex h-7 w-7 items-center justify-center rounded-full">
              {propertyName.charAt(0)}
            </span>
            <span className="text-left">
              <span className="text-style-5 text-ink block leading-tight">
                {propertyName}
              </span>
              <span className="text-style-7 text-ink-subtle block tracking-wide uppercase">
                {propertyType}
              </span>
            </span>
          </button>

          <div className="mx-auto hidden w-full max-w-md sm:block">
            {renderSearch('global-search')}
          </div>

          <div className="text-style-5 text-ink border-line-strong rounded-field hidden shrink-0 items-center gap-2 border px-3 py-2 lg:flex">
            <Icon name="calendar" className="text-ink-subtle" />
            {CURRENT_DATE_TIME}
          </div>

          {/* max-sm:ml-auto: below sm the search bar has moved out of this row,
              so nothing else absorbs the slack. */}
          <Button
            aria-label="Quick actions"
            className="shrink-0 max-md:h-10 max-md:w-10 max-md:px-0 max-sm:ml-auto"
          >
            <Icon name="quickActions" />
            <span className="hidden md:inline">Quick Actions</span>
          </Button>

          <button
            type="button"
            aria-label="Notifications"
            className="text-ink-muted rounded-field hover:bg-surface-muted hover:text-ink flex h-10 w-10 shrink-0 items-center justify-center transition-colors"
          >
            <Icon name="bell" size="h-5 w-5" />
          </button>

          <button
            type="button"
            aria-label="Account menu"
            className="rounded-field hover:bg-surface-muted flex shrink-0 items-center gap-1 p-1 transition-colors"
          >
            <span className="bg-accent-soft text-accent text-style-5 flex h-8 w-8 items-center justify-center rounded-full">
              {propertyName.charAt(0)}
            </span>
            <Icon name="chevronDown" className="text-ink-subtle" />
          </button>
        </div>

        <div className="pb-3 sm:hidden">
          {renderSearch('global-search-mobile')}
        </div>
      </header>
    </div>
  );
}

Navbar.propTypes = {
  propertyName: PropTypes.string.isRequired,
  propertyType: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default Navbar;
