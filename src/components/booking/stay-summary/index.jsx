import PropTypes from 'prop-types';
import Icon from '../../../widget/icon';
import SummaryDetails from '../summary-details';
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
    <SummaryDetails
      role="status"
      guestName={guestName}
      roomCode={room.code}
      roomType={room.type}
      checkIn={checkIn}
      checkOut={checkOut}
      adults={adults}
      kids={kids}
      nights={quote.nights}
      pricePerNight={room.pricePerNight}
      total={quote.total}
      className={className}
    />
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
