import PropTypes from 'prop-types';
import {
  Bell,
  Calendar,
  Check,
  ChevronDown,
  ChevronsUpDown,
  LayoutGrid,
  Search,
  X,
  Zap,
} from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Named wrapper over lucide-react. Widgets reference icons by role
 * ("chevronDown") rather than importing lucide directly, so swapping an
 * icon is a one-line change here instead of a hunt across call sites.
 */
const ICONS = {
  search: Search,
  chevronDown: ChevronDown,
  calendar: Calendar,
  close: X,
  check: Check,
  bell: Bell,
  appGrid: LayoutGrid,
  switcher: ChevronsUpDown,
  quickActions: Zap,
};

function Icon({ name, size = 'h-4 w-4', className = '', ...props }) {
  const LucideIcon = ICONS[name];

  return (
    <LucideIcon
      aria-hidden="true"
      className={cn('shrink-0', size, className)}
      {...props}
    />
  );
}

Icon.propTypes = {
  name: PropTypes.oneOf(Object.keys(ICONS)).isRequired,
  /** Sizing classes. Kept separate from `className` so callers styling the
   *  icon (colour, position) can't accidentally drop its dimensions. */
  size: PropTypes.string,
  className: PropTypes.string,
};

export default Icon;
