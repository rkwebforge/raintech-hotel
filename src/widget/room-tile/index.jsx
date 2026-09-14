import PropTypes from 'prop-types';
import { cn } from '../../utils/cn';
import {
  ROOM_STATUS,
  ROOM_STATUS_LABELS,
  ROOM_STATUS_VALUES,
} from '../../constants/roomStatus';

const TONES = {
  [ROOM_STATUS.AVAILABLE]:
    'bg-available-soft text-available border-available/30',
  [ROOM_STATUS.OCCUPIED]: 'bg-occupied-soft text-occupied border-occupied/30',
  [ROOM_STATUS.DIRTY]: 'bg-dirty-soft text-dirty border-dirty/30',
  [ROOM_STATUS.MAINTENANCE]:
    'bg-maintenance-soft text-maintenance border-maintenance/30',
  [ROOM_STATUS.BLOCKED]: 'bg-blocked-soft text-blocked border-blocked/30',
};

/** One room in the interactive floor view. */
function RoomTile({
  roomNumber,
  status,
  selected = false,
  className = '',
  ...props
}) {
  return (
    <button
      type="button"
      aria-label={`Room ${roomNumber} — ${ROOM_STATUS_LABELS[status]}`}
      aria-pressed={selected}
      className={cn(
        'text-style-5 rounded-tile flex h-9 w-full min-w-11 items-center justify-center border transition-transform',
        'hover:scale-105 active:scale-95',
        TONES[status],
        selected && 'ring-navy ring-2 ring-offset-1',
        className
      )}
      {...props}
    >
      {roomNumber}
    </button>
  );
}

RoomTile.propTypes = {
  roomNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  status: PropTypes.oneOf(ROOM_STATUS_VALUES).isRequired,
  selected: PropTypes.bool,
  className: PropTypes.string,
};

export default RoomTile;
