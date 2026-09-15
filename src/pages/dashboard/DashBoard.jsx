import { useMemo } from 'react';
import QuickActionsGrid from '../../components/dashboard/quick-actions-grid';
import OperationalOverview from '../../components/dashboard/operational-overview';
import RoomStatusBoard from '../../components/dashboard/room-status-board';
import VacatingRooms from '../../components/dashboard/vacating-rooms';
import QuickRoomStatus from '../../components/dashboard/quick-room-status';
import { useRooms } from '../../hooks/useRooms';
import { ROOM_STATUS } from '../../constants/roomStatus';
import { PATHS } from '../../constants/paths';

const QUICK_ACTIONS = [
  {
    id: 'reservations',
    label: 'Reservations',
    icon: 'reservations',
    tone: 'occupied',
    to: PATHS.BOOKING,
  },
  {
    id: 'check-in',
    label: 'Guest Check-in',
    icon: 'checkIn',
    tone: 'available',
    to: PATHS.CHECK_IN,
  },
  {
    id: 'check-out',
    label: 'Guest Check-Out',
    icon: 'checkOut',
    tone: 'dirty',
    to: PATHS.CHECK_OUT,
  },
  {
    id: 'housekeeping',
    label: 'Housekeeping',
    icon: 'housekeeping',
    tone: 'occupied',
  },
  {
    id: 'restaurant',
    label: 'Restaurant',
    icon: 'restaurant',
    tone: 'maintenance',
  },
  { id: 'whatsapp', label: 'WhatsApp', icon: 'whatsapp', tone: 'available' },
  { id: 'rooms', label: 'Rooms', icon: 'rooms', tone: 'accent' },
  {
    id: 'staff',
    label: 'Staff',
    icon: 'staff',
    tone: 'occupied',
    badge: '2 tasks',
  },
  { id: 'floors', label: 'Floors', icon: 'floors', tone: 'available' },
  { id: 'reports', label: 'Reports', icon: 'reports', tone: 'maintenance' },
  { id: 'settings', label: 'Settings', icon: 'settings', tone: 'blocked' },
  {
    id: 'group-booking',
    label: 'New: Group Booking',
    icon: 'groupBooking',
    tone: 'navy',
  },
];

function DashBoard() {
  const { data: rooms = [], isPending, isError } = useRooms();

  const stats = useMemo(() => {
    const occupied = rooms.filter(r => r.status === ROOM_STATUS.OCCUPIED);

    const vacating = rooms
      .filter(room => room.departureNote)
      .map(room => ({
        id: room.id,
        number: room.number,
        note: room.departureNote,
      }));

    const alerts = rooms
      .filter(room => room.cleaningOverdue)
      .map(room => `Room ${room.number} cleaning overdue`);

    return {
      occupancyRate: rooms.length
        ? Math.round((occupied.length / rooms.length) * 100)
        : 0,
      revenueToday: occupied.reduce((sum, r) => sum + r.pricePerNight, 0),
      vacating,
      alerts,
    };
  }, [rooms]);

  return (
    <div className="container px-4 py-6 sm:px-6">
      <h1 className="text-style-1 text-ink">Main Dashboard</h1>

      {isError ? (
        <p className="text-style-4 text-error mt-6">
          Could not load rooms. Please retry.
        </p>
      ) : isPending ? (
        <p className="text-style-4 text-ink-subtle mt-6">Loading rooms…</p>
      ) : (
        <div className="mt-5 space-y-5">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,70fr)_minmax(0,30fr)]">
            <QuickActionsGrid actions={QUICK_ACTIONS} />
            <OperationalOverview
              occupancyRate={stats.occupancyRate}
              pendingCheckIns={0}
              pendingDepartures={stats.vacating.length}
              revenueToday={stats.revenueToday}
            />
          </div>

          <RoomStatusBoard rooms={rooms} occupancyRate={stats.occupancyRate} />

          <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,63fr)_minmax(0,37fr)]">
            <VacatingRooms rooms={stats.vacating} alerts={stats.alerts} />
            <QuickRoomStatus rooms={rooms} />
          </div>
        </div>
      )}
    </div>
  );
}

export default DashBoard;
