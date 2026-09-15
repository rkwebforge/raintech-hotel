import PropTypes from 'prop-types';
import { cn } from '../../utils/cn';
import {
  ROOM_STATUS,
  ROOM_STATUS_LABELS,
  ROOM_STATUS_VALUES,
} from '../../constants/roomStatus';

const TONES = {
  [ROOM_STATUS.AVAILABLE]: 'bg-available-soft text-available',
  [ROOM_STATUS.OCCUPIED]: 'bg-occupied-soft text-occupied',
  [ROOM_STATUS.DIRTY]: 'bg-dirty-soft text-dirty',
  [ROOM_STATUS.MAINTENANCE]: 'bg-maintenance-soft text-maintenance',
  [ROOM_STATUS.BLOCKED]: 'bg-blocked-soft text-blocked',
};

function StatusBadge({ status, children, className = '' }) {
  return (
    <span
      className={cn(
        'text-style-7 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium',
        TONES[status],
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children ?? ROOM_STATUS_LABELS[status]}
    </span>
  );
}

StatusBadge.propTypes = {
  status: PropTypes.oneOf(ROOM_STATUS_VALUES).isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
};

export default StatusBadge;
