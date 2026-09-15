/** Room types in the bookable inventory. */
export const ROOM_TYPE = {
  DELUXE: 'Deluxe Room',
  EXECUTIVE_SUITE: 'Executive Suite',
  FAMILY: 'Family Room',
};

export const ROOM_TYPE_VALUES = Object.values(ROOM_TYPE);

/** Why a date/room selection was rejected. Keyed to messages in helpers/booking.js. */
export const BOOKING_ERROR = {
  MISSING_CHECK_IN: 'MISSING_CHECK_IN',
  MISSING_CHECK_OUT: 'MISSING_CHECK_OUT',
  CHECK_IN_IN_PAST: 'CHECK_IN_IN_PAST',
  CHECK_OUT_NOT_AFTER_CHECK_IN: 'CHECK_OUT_NOT_AFTER_CHECK_IN',
  NO_ROOM_SELECTED: 'NO_ROOM_SELECTED',
  ROOM_UNAVAILABLE: 'ROOM_UNAVAILABLE',
  ROOM_OVER_CAPACITY: 'ROOM_OVER_CAPACITY',
  MISSING_GUEST_NAME: 'MISSING_GUEST_NAME',
  MISSING_GUEST_PHONE: 'MISSING_GUEST_PHONE',
  INVALID_GUEST_PHONE: 'INVALID_GUEST_PHONE',
  MISSING_ID_PROOF: 'MISSING_ID_PROOF',
  NO_ADULTS: 'NO_ADULTS',
};

export const BOOKING_ERROR_MESSAGES = {
  [BOOKING_ERROR.MISSING_CHECK_IN]: 'Select a check-in date.',
  [BOOKING_ERROR.MISSING_CHECK_OUT]: 'Select a check-out date.',
  [BOOKING_ERROR.CHECK_IN_IN_PAST]: 'Check-in cannot be in the past.',
  [BOOKING_ERROR.CHECK_OUT_NOT_AFTER_CHECK_IN]:
    'Check-out must be after check-in.',
  [BOOKING_ERROR.NO_ROOM_SELECTED]: 'Select a room to see the total.',
  [BOOKING_ERROR.ROOM_UNAVAILABLE]:
    'This room is already booked for the selected dates.',
  [BOOKING_ERROR.ROOM_OVER_CAPACITY]:
    'This room does not sleep the number of guests selected.',
  [BOOKING_ERROR.MISSING_GUEST_NAME]: 'Enter the guest name.',
  [BOOKING_ERROR.MISSING_GUEST_PHONE]: 'Enter the guest phone number.',
  [BOOKING_ERROR.INVALID_GUEST_PHONE]:
    'Enter a valid 10-digit Indian mobile number.',
  [BOOKING_ERROR.MISSING_ID_PROOF]: 'Upload an ID proof for the guest.',
  [BOOKING_ERROR.NO_ADULTS]: 'A booking needs at least one adult.',
};
