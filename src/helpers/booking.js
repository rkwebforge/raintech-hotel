import { BOOKING_ERROR, BOOKING_ERROR_MESSAGES } from '../constants/booking';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Parses `YYYY-MM-DD` to a UTC midnight timestamp.
 *
 * Date inputs hand back a plain calendar date with no timezone. `new Date(str)`
 * would read it as UTC midnight but compare against a local-time "today",
 * so west of Greenwich today's date parses as yesterday. Pinning both sides to
 * UTC midnight keeps the comparison on calendar days and makes the night count
 * immune to daylight-saving shifts, which is why we never subtract raw Dates.
 */
function toUtcDay(isoDate) {
  if (!isoDate) return null;
  const [year, month, day] = isoDate.split('-').map(Number);
  if (!year || !month || !day) return null;
  const timestamp = Date.UTC(year, month - 1, day);
  return Number.isNaN(timestamp) ? null : timestamp;
}

/** Today as a UTC midnight timestamp, built from the local calendar date. */
function todayUtcDay() {
  const now = new Date();
  return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
}

/** Today as `YYYY-MM-DD`, for the check-in picker's floor. */
export function todayIso() {
  return new Date(todayUtcDay()).toISOString().slice(0, 10);
}

/**
 * The day after `isoDate`, as `YYYY-MM-DD`. Used for the check-out picker's
 * floor so it can't offer the check-in day itself, which would be zero nights.
 */
export function dayAfter(isoDate) {
  const day = toUtcDay(isoDate);
  if (day === null) return '';
  return new Date(day + MS_PER_DAY).toISOString().slice(0, 10);
}

/**
 * Nights between two `YYYY-MM-DD` dates. Returns 0 rather than a negative or
 * fractional count when the range is invalid, so callers can't bill for it.
 */
export function nightsBetween(checkIn, checkOut) {
  const start = toUtcDay(checkIn);
  const end = toUtcDay(checkOut);
  if (start === null || end === null) return 0;
  const nights = (end - start) / MS_PER_DAY;
  return nights > 0 ? nights : 0;
}

/** Total for a stay: nights x nightly rate. */
export function stayTotal(pricePerNight, nights) {
  return pricePerNight * nights;
}

/**
 * Whether `[checkIn, checkOut)` overlaps an existing booking. Treated as
 * half-open: a stay ending the day another begins does not clash, since the
 * room turns over that morning.
 */
export function overlapsBooking(checkIn, checkOut, booking) {
  const start = toUtcDay(checkIn);
  const end = toUtcDay(checkOut);
  const bookedStart = toUtcDay(booking.checkIn);
  const bookedEnd = toUtcDay(booking.checkOut);
  if (start === null || end === null) return false;
  // A malformed booking record must not read as "no clash" — comparing
  // against null would quietly mark an occupied room available.
  if (bookedStart === null || bookedEnd === null) return false;
  return start < bookedEnd && end > bookedStart;
}

/** Rooms with no booking clashing against the selected range. */
export function isRoomAvailable(room, checkIn, checkOut, bookings) {
  return !bookings.some(
    booking =>
      booking.roomCode === room.code &&
      overlapsBooking(checkIn, checkOut, booking)
  );
}

/**
 * Validates the chosen dates on their own, independent of any room, so the
 * date errors surface before a room has been picked.
 */
export function validateDates(checkIn, checkOut) {
  if (!checkIn) return BOOKING_ERROR.MISSING_CHECK_IN;
  if (!checkOut) return BOOKING_ERROR.MISSING_CHECK_OUT;
  if (toUtcDay(checkIn) < todayUtcDay()) return BOOKING_ERROR.CHECK_IN_IN_PAST;
  if (nightsBetween(checkIn, checkOut) === 0) {
    return BOOKING_ERROR.CHECK_OUT_NOT_AFTER_CHECK_IN;
  }
  return null;
}

/**
 * Indian mobile number: ten digits starting 6-9, optionally prefixed with +91
 * or 0. Spaces, dashes and brackets are stripped first — guests paste numbers
 * in whatever shape their contacts app stored them.
 */
export function isIndianPhone(value) {
  const digits = String(value ?? '').replace(/[\s\-()]/g, '');
  return /^(?:\+91|0)?[6-9]\d{9}$/.test(digits);
}

/**
 * Guest details required before a reservation can be confirmed, checked in the
 * order the form reads. Kept apart from quoteStay: an incomplete guest must not
 * suppress the price, or the guest can't see what they're being asked to pay
 * for while they fill the form in.
 */
export function validateGuest({ guestName, guestPhone, idProofName, adults }) {
  const codes = [];
  if (!guestName?.trim()) codes.push(BOOKING_ERROR.MISSING_GUEST_NAME);
  if (!guestPhone?.trim()) codes.push(BOOKING_ERROR.MISSING_GUEST_PHONE);
  else if (!isIndianPhone(guestPhone))
    codes.push(BOOKING_ERROR.INVALID_GUEST_PHONE);
  if (!idProofName) codes.push(BOOKING_ERROR.MISSING_ID_PROOF);
  // Negated >= so a non-numeric adults value (NaN) fails rather than slips through.
  if (!(Number(adults) >= 1)) codes.push(BOOKING_ERROR.NO_ADULTS);
  return codes;
}

/**
 * The full picture for the current selection: the first blocking error, and
 * the quote once there isn't one. `error` is a code; `message` is the copy to
 * show. Both are null when the selection is bookable.
 */
export function quoteStay({
  room,
  checkIn,
  checkOut,
  guests = 1,
  bookings = [],
}) {
  const blocked = code => ({
    error: code,
    message: BOOKING_ERROR_MESSAGES[code],
    nights: 0,
    total: 0,
  });

  const dateError = validateDates(checkIn, checkOut);
  if (dateError) return blocked(dateError);
  if (!room) return blocked(BOOKING_ERROR.NO_ROOM_SELECTED);
  if (guests > room.maxGuests) return blocked(BOOKING_ERROR.ROOM_OVER_CAPACITY);
  if (!isRoomAvailable(room, checkIn, checkOut, bookings)) {
    return blocked(BOOKING_ERROR.ROOM_UNAVAILABLE);
  }

  const nights = nightsBetween(checkIn, checkOut);
  return {
    error: null,
    message: null,
    nights,
    total: stayTotal(room.pricePerNight, nights),
  };
}

/**
 * Which field each blocking error belongs under. Codes absent here have no
 * single owning input (ROOM_UNAVAILABLE is shown on the room tile itself), so
 * they fall back to the form-level `root` error the summary renders.
 */
const ERROR_FIELDS = {
  [BOOKING_ERROR.MISSING_GUEST_NAME]: 'guestName',
  [BOOKING_ERROR.MISSING_GUEST_PHONE]: 'guestPhone',
  [BOOKING_ERROR.INVALID_GUEST_PHONE]: 'guestPhone',
  [BOOKING_ERROR.MISSING_ID_PROOF]: 'idProofName',
  [BOOKING_ERROR.NO_ADULTS]: 'adults',
  [BOOKING_ERROR.MISSING_CHECK_IN]: 'checkIn',
  [BOOKING_ERROR.CHECK_IN_IN_PAST]: 'checkIn',
  [BOOKING_ERROR.MISSING_CHECK_OUT]: 'checkOut',
  [BOOKING_ERROR.CHECK_OUT_NOT_AFTER_CHECK_IN]: 'checkOut',
  [BOOKING_ERROR.NO_ROOM_SELECTED]: 'selectedCode',
  [BOOKING_ERROR.ROOM_OVER_CAPACITY]: 'selectedCode',
};

/**
 * react-hook-form resolver over the validators above, so the rules stay in one
 * place and keep their own tests. Guest and stay errors are collected together
 * rather than short-circuiting — RHF shows every field at once on submit, and
 * validateGuest/quoteStay each return only their first failure.
 */
export function bookingResolver({ rooms = [], bookings = [] } = {}) {
  return values => {
    const party = (Number(values.adults) || 0) + (Number(values.kids) || 0);
    const room = rooms.find(
      candidate => candidate.code === values.selectedCode
    );
    const codes = [
      ...validateGuest(values),
      quoteStay({
        room: room ?? null,
        checkIn: values.checkIn,
        checkOut: values.checkOut,
        guests: Math.max(party, 1),
        bookings,
      }).error,
    ].filter(Boolean);

    const errors = {};
    codes.forEach(code => {
      const field = ERROR_FIELDS[code] ?? 'root';
      // First code per field wins; validators already order them by priority.
      if (!errors[field]) {
        errors[field] = { type: code, message: BOOKING_ERROR_MESSAGES[code] };
      }
    });

    // RHF's ResolverError contract: a failing resolve reports no values.
    return Object.keys(errors).length
      ? { values: {}, errors }
      : { values, errors: {} };
  };
}
