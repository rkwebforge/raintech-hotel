import PropTypes from 'prop-types';
import MetricTile from '../../../widget/metric-tile';
import { formatCurrency } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';
import { cn } from '../../../utils/cn';

/**
 * The priced stay, laid out once for both the live summary and the recent
 * booking cards. Takes flat values rather than a room/quote pair so a saved
 * booking doesn't have to reconstruct the shapes the form works in.
 */
function SummaryDetails({
  guestName,
  roomCode,
  roomType,
  checkIn,
  checkOut,
  adults,
  kids,
  nights,
  pricePerNight,
  total,
  className = '',
  ...props
}) {
  return (
    <div className={cn('space-y-4', className)} {...props}>
      <div className="text-style-4 text-ink-muted flex flex-wrap items-center gap-x-2 gap-y-1">
        {guestName && (
          <>
            <span className="text-ink">{guestName}</span>
            <span aria-hidden="true">·</span>
          </>
        )}
        <span className="text-ink">
          {roomCode} · {roomType}
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
        <MetricTile label="Nights" value={nights} tone="info" />
        <MetricTile
          label="Rate / night"
          value={formatCurrency(pricePerNight)}
        />
        <MetricTile
          label="Total"
          value={formatCurrency(total)}
          tone="success"
        />
      </div>

      <p className="text-style-7 text-ink-subtle">
        {nights} {nights === 1 ? 'night' : 'nights'} ×{' '}
        {formatCurrency(pricePerNight)} = {formatCurrency(total)}
      </p>
    </div>
  );
}

SummaryDetails.propTypes = {
  guestName: PropTypes.string,
  roomCode: PropTypes.string.isRequired,
  roomType: PropTypes.string.isRequired,
  checkIn: PropTypes.string,
  checkOut: PropTypes.string,
  adults: PropTypes.number.isRequired,
  kids: PropTypes.number.isRequired,
  nights: PropTypes.number.isRequired,
  pricePerNight: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  className: PropTypes.string,
};

export default SummaryDetails;
