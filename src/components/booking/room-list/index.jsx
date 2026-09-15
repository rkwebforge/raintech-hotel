import PropTypes from 'prop-types';
import Icon from '../../../widget/icon';
import { cn } from '../../../utils/cn';
import { formatCurrency } from '../../../utils/formatCurrency';
import { ROOM_TYPE_VALUES } from '../../../constants/booking';

/**
 * Selectable room list. A room can be listed but unbookable — booked for the
 * chosen dates, or too small for the party — so `rooms` carries an
 * `unavailableReason` per room and those stay visible but disabled, which
 * tells the guest more than silently dropping them from the list.
 */
function RoomList({ rooms, selectedCode, onSelect, className = '' }) {
  if (rooms.length === 0) {
    return (
      <p className="text-style-4 text-ink-subtle py-8 text-center">
        No rooms sleep that many guests.
      </p>
    );
  }

  return (
    <ul
      className={cn('grid gap-3 sm:grid-cols-2', className)}
      aria-label="Available rooms"
    >
      {rooms.map(room => {
        const isSelected = room.code === selectedCode;
        const isDisabled = Boolean(room.unavailableReason);

        return (
          <li key={room.code}>
            <button
              type="button"
              disabled={isDisabled}
              aria-pressed={isSelected}
              onClick={() => onSelect(room.code)}
              className={cn(
                'rounded-card w-full border p-4 text-left transition-colors',
                'focus:border-line-focus focus:ring-navy-light/20 outline-none focus:ring-2',
                isDisabled
                  ? 'bg-surface-sunken border-line cursor-not-allowed opacity-60'
                  : 'bg-surface border-line-strong hover:bg-navy-soft',
                isSelected && 'border-navy bg-navy-soft ring-navy ring-1'
              )}
            >
              <span className="flex items-start justify-between gap-2">
                <span>
                  <span className="text-style-5 text-ink block">
                    {room.type}
                  </span>
                  <span className="bg-accent-soft text-accent text-style-7 mt-1 inline-block rounded-full px-2 py-0.5">
                    {room.code}
                  </span>
                </span>
                {isSelected && (
                  <Icon name="check" className="text-navy shrink-0" />
                )}
              </span>

              <span className="mt-3 flex items-end justify-between gap-2">
                <span className="text-style-7 text-ink-muted flex items-center gap-1">
                  <Icon name="staff" size="h-3.5 w-3.5" />
                  Sleeps {room.maxGuests}
                </span>
                <span className="text-style-5 text-ink">
                  {formatCurrency(room.pricePerNight)}
                  <span className="text-style-7 text-ink-subtle"> / night</span>
                </span>
              </span>

              {room.unavailableReason && (
                <span className="text-style-7 text-error mt-2 flex items-center gap-1">
                  <Icon name="alert" size="h-3.5 w-3.5" />
                  {room.unavailableReason}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

RoomList.propTypes = {
  rooms: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
      type: PropTypes.oneOf(ROOM_TYPE_VALUES).isRequired,
      pricePerNight: PropTypes.number.isRequired,
      maxGuests: PropTypes.number.isRequired,
      unavailableReason: PropTypes.string,
    })
  ).isRequired,
  selectedCode: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default RoomList;
