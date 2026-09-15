import PropTypes from 'prop-types';
import Icon from '../../../widget/icon';
import MetricTile from '../../../widget/metric-tile';
import { formatCurrency } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';
import { cn } from '../../../utils/cn';

/**
 * The quote. Shows either the blocking message or the priced stay — never
 * both, so a stale total can't sit beside an error.
 */
function StaySummary({
  quote,
  room,
  checkIn,
  checkOut,
  guestName,
  adults = 0,
  kids = 0,
  className = '',
}) {
  if (quote.error) {
    return (
      <div
        role="status"
        className={cn(
          'bg-warn-soft border-warn/25 rounded-card flex items-start gap-2 border p-4',
          className
        )}
      >
        <Icon name="alert" className="text-warn mt-0.5 shrink-0" />
        <p className="text-style-4 text-ink">{quote.message}</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)} role="status">
      <div className="text-style-4 text-ink-muted flex flex-wrap items-center gap-x-2 gap-y-1">
        {guestName && (
          <>
            <span className="text-ink">{guestName}</span>
            <span aria-hidden="true">·</span>
          </>
        )}
        <span className="text-ink">
          {room.code} · {room.type}
        </span>
        <span aria-hidden="true">·</span>
        <span>
          {formatDate(checkIn)} → {formatDate(checkOut)}
        </span>
        <span aria-hidden="true">·</span>
        <span>
          {adults} {adults === 1 ? 'adult' : 'adults'}
          {kids > 0 && `, ${kids} ${kids === 1 ? 'kid' : 'kids'}`}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <MetricTile label="Nights" value={quote.nights} tone="info" />
        <MetricTile
          label="Rate / night"
          value={formatCurrency(room.pricePerNight)}
        />
        <MetricTile
          label="Total"
          value={formatCurrency(quote.total)}
          tone="success"
        />
      </div>

      <p className="text-style-7 text-ink-subtle">
        {quote.nights} {quote.nights === 1 ? 'night' : 'nights'} ×{' '}
        {formatCurrency(room.pricePerNight)} = {formatCurrency(quote.total)}
      </p>
    </div>
  );
}

StaySummary.propTypes = {
  quote: PropTypes.shape({
    error: PropTypes.string,
    message: PropTypes.string,
    nights: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
  }).isRequired,
  room: PropTypes.shape({
    code: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    pricePerNight: PropTypes.number.isRequired,
  }),
  checkIn: PropTypes.string,
  checkOut: PropTypes.string,
  guestName: PropTypes.string,
  adults: PropTypes.number,
  kids: PropTypes.number,
  className: PropTypes.string,
};

export default StaySummary;
