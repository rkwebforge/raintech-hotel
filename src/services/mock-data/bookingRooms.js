import { ROOM_TYPE } from '../../constants/booking';

// The bookable inventory, kept separate from services/mock-data/rooms.js: that
// one drives the housekeeping floor view (status per physical room), this one
// is the rate card the booking page quotes from.
const BOOKING_ROOMS = [
  {
    code: 'R101',
    type: ROOM_TYPE.DELUXE,
    pricePerNight: 3500,
    maxGuests: 2,
  },
  {
    code: 'R102',
    type: ROOM_TYPE.DELUXE,
    pricePerNight: 3500,
    maxGuests: 2,
  },
  {
    code: 'R201',
    type: ROOM_TYPE.EXECUTIVE_SUITE,
    pricePerNight: 5800,
    maxGuests: 3,
  },
  {
    code: 'R202',
    type: ROOM_TYPE.EXECUTIVE_SUITE,
    pricePerNight: 5800,
    maxGuests: 3,
  },
  {
    code: 'R301',
    type: ROOM_TYPE.FAMILY,
    pricePerNight: 4200,
    maxGuests: 4,
  },
];

/**
 * Seed bookings so the availability check has something to clash with.
 * Dates are relative to today — a fixed date would fall into the past and stop
 * blocking anything. `[checkIn, checkOut)`, so R101 frees up on day 4.
 */
const offsetDate = days => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

const EXISTING_BOOKINGS = [
  { id: 1, roomCode: 'R101', checkIn: offsetDate(1), checkOut: offsetDate(4) },
  { id: 2, roomCode: 'R201', checkIn: offsetDate(2), checkOut: offsetDate(6) },
];

// Dummy data until the API is ready.
export const getBookingRooms = async () => BOOKING_ROOMS;
export const getExistingBookings = async () => EXISTING_BOOKINGS;
