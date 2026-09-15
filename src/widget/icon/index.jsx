import PropTypes from 'prop-types';
import {
  AlertCircle,
  BarChart3,
  BedDouble,
  Bell,
  Brush,
  Calendar,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ClipboardCheck,
  Download,
  FileText,
  Layers,
  LayoutGrid,
  Mail,
  LogOut,
  MessageCircle,
  MoreVertical,
  Pencil,
  Plus,
  Printer,
  RefreshCw,
  ArrowLeftRight,
  Search,
  Settings2,
  Sparkles,
  Trash2,
  Upload,
  UserPlus,
  Users,
  UtensilsCrossed,
  Wallet,
  Wrench,
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
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  calendar: Calendar,
  close: X,
  check: Check,
  bell: Bell,
  appGrid: LayoutGrid,
  switcher: ChevronsUpDown,
  quickActions: Zap,
  checkIn: ClipboardCheck,
  checkOut: LogOut,
  reservations: CalendarDays,
  housekeeping: Sparkles,
  restaurant: UtensilsCrossed,
  whatsapp: MessageCircle,
  rooms: BedDouble,
  staff: Users,
  floors: Layers,
  reports: BarChart3,
  settings: Settings2,
  groupBooking: UserPlus,
  alert: AlertCircle,
  cleaning: Brush,
  maintenance: Wrench,
  upload: Upload,
  document: FileText,
  edit: Pencil,
  delete: Trash2,
  update: RefreshCw,
  print: Printer,
  download: Download,
  payment: Wallet,
  more: MoreVertical,
  plus: Plus,
  adjust: ArrowLeftRight,
  mail: Mail,
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
