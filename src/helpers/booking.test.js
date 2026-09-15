import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  validateGuest,
  nightsBetween,
  stayTotal,
  overlapsBooking,
  isRoomAvailable,
  validateDates,
  quoteStay,
  bookingResolver,
  isIndianPhone,
  dayAfter,
  todayIso,
} from './booking';
import { BOOKING_ERROR } from '../constants/booking';

// Every "past"/"future" assertion is relative to this, so the suite can't start
// failing on a particular calendar day.
const TODAY = '2026-09-15';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(`${TODAY}T10:00:00`));
});

afterEach(() => {
  vi.useRealTimers();
});

const room = { code: 'R101', pricePerNight: 3500, maxGuests: 2 };

describe('nightsBetween', () => {
  it('counts nights across a normal range', () => {
    expect(nightsBetween('2026-09-15', '2026-09-18')).toBe(3);
  });

  it('counts a single night', () => {
    expect(nightsBetween('2026-09-15', '2026-09-16')).toBe(1);
  });

  it('returns 0 for a same-day range', () => {
    expect(nightsBetween('2026-09-15', '2026-09-15')).toBe(0);
  });

  it('returns 0 when check-out precedes check-in', () => {
    expect(nightsBetween('2026-09-18', '2026-09-15')).toBe(0);
  });

  it('returns 0 when either date is missing', () => {
    expect(nightsBetween('', '2026-09-18')).toBe(0);
    expect(nightsBetween('2026-09-15', '')).toBe(0);
  });

  it('counts across a month boundary', () => {
    expect(nightsBetween('2026-09-29', '2026-10-02')).toBe(3);
  });

  it('counts across a leap day', () => {
    expect(nightsBetween('2028-02-28', '2028-03-01')).toBe(2);
  });

  // A daylight-saving shift makes the span 23 or 25 hours, which naive date
  // subtraction rounds to the wrong night count.
  it('is unaffected by daylight-saving transitions', () => {
    expect(nightsBetween('2026-03-28', '2026-03-30')).toBe(2);
    expect(nightsBetween('2026-10-24', '2026-10-26')).toBe(2);
  });
});

describe('stayTotal', () => {
  it('multiplies rate by nights', () => {
    expect(stayTotal(3500, 3)).toBe(10500);
  });

  it('is 0 for no nights', () => {
    expect(stayTotal(3500, 0)).toBe(0);
  });
});

describe('overlapsBooking', () => {
  const booking = {
    roomCode: 'R101',
    checkIn: '2026-09-20',
    checkOut: '2026-09-24',
  };

  it('detects a range landing inside the booking', () => {
    expect(overlapsBooking('2026-09-21', '2026-09-23', booking)).toBe(true);
  });

  it('detects a range straddling the booking', () => {
    expect(overlapsBooking('2026-09-18', '2026-09-26', booking)).toBe(true);
  });

  it('allows a stay ending the day the booking starts', () => {
    expect(overlapsBooking('2026-09-18', '2026-09-20', booking)).toBe(false);
  });

  it('allows a stay starting the day the booking ends', () => {
    expect(overlapsBooking('2026-09-24', '2026-09-26', booking)).toBe(false);
  });

  // A record missing or mangling its dates must read as "can't tell", not as
  // "no clash" — the latter would sell a room that is already occupied.
  it.each([
    ['a missing checkOut', { checkIn: '2026-09-20' }],
    ['a missing checkIn', { checkOut: '2026-09-24' }],
    ['an unparseable date', { checkIn: 'soon', checkOut: '2026-09-24' }],
  ])('treats %s as no overlap', (_label, partial) => {
    expect(overlapsBooking('2026-09-21', '2026-09-23', partial)).toBe(false);
  });
});

describe('isRoomAvailable', () => {
  const bookings = [
    { roomCode: 'R101', checkIn: '2026-09-20', checkOut: '2026-09-24' },
  ];

  it('is false when the same room clashes', () => {
    expect(isRoomAvailable(room, '2026-09-21', '2026-09-23', bookings)).toBe(
      false
    );
  });

  it('ignores clashes on a different room', () => {
    const other = { code: 'R102', pricePerNight: 3500, maxGuests: 2 };
    expect(isRoomAvailable(other, '2026-09-21', '2026-09-23', bookings)).toBe(
      true
    );
  });
});

describe('validateDates', () => {
  it('rejects a missing check-in', () => {
    expect(validateDates('', '2026-09-18')).toBe(
      BOOKING_ERROR.MISSING_CHECK_IN
    );
  });

  it('rejects a missing check-out', () => {
    expect(validateDates('2026-09-16', '')).toBe(
      BOOKING_ERROR.MISSING_CHECK_OUT
    );
  });

  it('rejects a check-in before today', () => {
    expect(validateDates('2026-09-14', '2026-09-18')).toBe(
      BOOKING_ERROR.CHECK_IN_IN_PAST
    );
  });

  it('accepts a check-in of today', () => {
    expect(validateDates(TODAY, '2026-09-16')).toBeNull();
  });

  it('rejects a same-day check-out', () => {
    expect(validateDates('2026-09-16', '2026-09-16')).toBe(
      BOOKING_ERROR.CHECK_OUT_NOT_AFTER_CHECK_IN
    );
  });

  it('rejects a check-out before check-in', () => {
    expect(validateDates('2026-09-18', '2026-09-16')).toBe(
      BOOKING_ERROR.CHECK_OUT_NOT_AFTER_CHECK_IN
    );
  });
});

describe('quoteStay', () => {
  it('quotes nights and total for a valid selection', () => {
    expect(
      quoteStay({ room, checkIn: '2026-09-16', checkOut: '2026-09-19' })
    ).toEqual({ error: null, message: null, nights: 3, total: 10500 });
  });

  it('reports a date error before asking for a room', () => {
    const quote = quoteStay({
      room: null,
      checkIn: '2026-09-14',
      checkOut: '2026-09-19',
    });
    expect(quote.error).toBe(BOOKING_ERROR.CHECK_IN_IN_PAST);
    expect(quote.total).toBe(0);
  });

  it('asks for a room once the dates are valid', () => {
    expect(
      quoteStay({ room: null, checkIn: '2026-09-16', checkOut: '2026-09-19' })
        .error
    ).toBe(BOOKING_ERROR.NO_ROOM_SELECTED);
  });

  it('rejects more guests than the room sleeps', () => {
    expect(
      quoteStay({
        room,
        checkIn: '2026-09-16',
        checkOut: '2026-09-19',
        guests: 3,
      }).error
    ).toBe(BOOKING_ERROR.ROOM_OVER_CAPACITY);
  });

  it('rejects a room already booked for the range', () => {
    const bookings = [
      { roomCode: 'R101', checkIn: '2026-09-17', checkOut: '2026-09-20' },
    ];
    expect(
      quoteStay({
        room,
        checkIn: '2026-09-16',
        checkOut: '2026-09-19',
        bookings,
      }).error
    ).toBe(BOOKING_ERROR.ROOM_UNAVAILABLE);
  });

  it('carries a message alongside every error', () => {
    const quote = quoteStay({ room, checkIn: '', checkOut: '' });
    expect(quote.message).toBeTruthy();
  });
});

describe('isIndianPhone', () => {
  it.each([
    '9876543210',
    '+919876543210',
    '+91 98765 43210',
    '09876543210',
    '98765-43210',
    '(98765) 43210',
    '6012345678',
  ])('accepts %s', value => {
    expect(isIndianPhone(value)).toBe(true);
  });

  it.each([
    ['too short', '98765432'],
    ['too long', '98765432101'],
    ['starts below 6', '5876543210'],
    ['letters', '98765abcde'],
    ['empty', ''],
    ['wrong country code', '+449876543210'],
    ['country code without the plus', '919876543210'],
  ])('rejects %s', (_label, value) => {
    expect(isIndianPhone(value)).toBe(false);
  });
});

describe('validateGuest', () => {
  const complete = {
    guestName: 'Mathew Hyden',
    guestPhone: '+91 98765 43210',
    idProofName: 'id.pdf',
    adults: 2,
  };

  it('accepts complete guest details', () => {
    expect(validateGuest(complete)).toEqual([]);
  });

  it('rejects a missing name', () => {
    expect(validateGuest({ ...complete, guestName: '' })).toContain(
      BOOKING_ERROR.MISSING_GUEST_NAME
    );
  });

  it('rejects a whitespace-only name', () => {
    expect(validateGuest({ ...complete, guestName: '   ' })).toContain(
      BOOKING_ERROR.MISSING_GUEST_NAME
    );
  });

  it('rejects a missing phone number', () => {
    expect(validateGuest({ ...complete, guestPhone: '' })).toContain(
      BOOKING_ERROR.MISSING_GUEST_PHONE
    );
  });

  it('rejects a phone number that is not an Indian mobile', () => {
    expect(validateGuest({ ...complete, guestPhone: '12345' })).toContain(
      BOOKING_ERROR.INVALID_GUEST_PHONE
    );
  });

  // Blank and malformed are separate messages; a blank field shouldn't be told
  // its format is wrong.
  it('reports a blank phone as missing, not invalid', () => {
    const codes = validateGuest({ ...complete, guestPhone: '' });
    expect(codes).not.toContain(BOOKING_ERROR.INVALID_GUEST_PHONE);
  });

  it('rejects a missing ID proof', () => {
    expect(validateGuest({ ...complete, idProofName: '' })).toContain(
      BOOKING_ERROR.MISSING_ID_PROOF
    );
  });

  it('rejects a booking with no adult', () => {
    expect(validateGuest({ ...complete, adults: 0 })).toContain(
      BOOKING_ERROR.NO_ADULTS
    );
  });

  // Number('') is 0 but Number('abc') is NaN, and every comparison with NaN is
  // false — a naive `< 1` check would let a typed-over field through.
  it.each(['', 'abc', null, undefined, NaN])(
    'rejects a non-numeric adults value (%p)',
    adults => {
      expect(validateGuest({ ...complete, adults })).toContain(
        BOOKING_ERROR.NO_ADULTS
      );
    }
  );

  it('reports every failing field at once', () => {
    expect(
      validateGuest({
        guestName: '',
        guestPhone: '',
        idProofName: '',
        adults: 0,
      })
    ).toEqual([
      BOOKING_ERROR.MISSING_GUEST_NAME,
      BOOKING_ERROR.MISSING_GUEST_PHONE,
      BOOKING_ERROR.MISSING_ID_PROOF,
      BOOKING_ERROR.NO_ADULTS,
    ]);
  });

  // Kids alone can't hold a reservation, but they don't invalidate one.
  it('accepts adults travelling with kids', () => {
    expect(validateGuest({ ...complete, adults: 1 })).toEqual([]);
  });
});

describe('bookingResolver', () => {
  const rooms = [
    { code: 'R101', type: 'Deluxe Room', pricePerNight: 3500, maxGuests: 2 },
  ];

  const complete = {
    guestName: 'Asha Menon',
    guestPhone: '9876543210',
    idProofName: 'aadhaar.png',
    adults: 2,
    kids: 0,
    checkIn: '2026-09-16',
    checkOut: '2026-09-18',
    selectedCode: 'R101',
  };

  it('passes the values through when everything is valid', () => {
    const result = bookingResolver({ rooms })(complete);
    expect(result.errors).toEqual({});
    expect(result.values).toEqual(complete);
  });

  it('hangs each error under its own field', () => {
    const result = bookingResolver({ rooms })({
      ...complete,
      guestName: '  ',
      checkOut: '2026-09-16',
    });
    expect(result.errors.guestName.type).toBe(BOOKING_ERROR.MISSING_GUEST_NAME);
    expect(result.errors.checkOut.type).toBe(
      BOOKING_ERROR.CHECK_OUT_NOT_AFTER_CHECK_IN
    );
    expect(result.values).toEqual({});
  });

  it('reports a guest error and a stay error together', () => {
    const result = bookingResolver({ rooms })({
      ...complete,
      guestPhone: '',
      selectedCode: null,
    });
    expect(Object.keys(result.errors).sort()).toEqual([
      'guestPhone',
      'selectedCode',
    ]);
  });

  it('flags a room booked for the selected dates', () => {
    const bookings = [
      { roomCode: 'R101', checkIn: '2026-09-17', checkOut: '2026-09-19' },
    ];
    const result = bookingResolver({ rooms, bookings })(complete);
    expect(result.errors.root.type).toBe(BOOKING_ERROR.ROOM_UNAVAILABLE);
  });

  it('counts kids against room capacity', () => {
    const result = bookingResolver({ rooms })({ ...complete, kids: 2 });
    expect(result.errors.selectedCode.type).toBe(
      BOOKING_ERROR.ROOM_OVER_CAPACITY
    );
  });
});

describe('todayIso', () => {
  it("returns the local calendar date, not the UTC instant's", () => {
    expect(todayIso()).toBe(TODAY);
  });
});

describe('dayAfter', () => {
  it('returns the next day', () => {
    expect(dayAfter('2026-09-15')).toBe('2026-09-16');
  });

  it('rolls over a month end', () => {
    expect(dayAfter('2026-09-30')).toBe('2026-10-01');
  });

  it('rolls over a leap day', () => {
    expect(dayAfter('2028-02-28')).toBe('2028-02-29');
  });

  it('returns an empty string for no date', () => {
    expect(dayAfter('')).toBe('');
  });
});

describe('bookingResolver phone and multi-field errors', () => {
  const rooms = [
    { code: 'R101', type: 'Deluxe Room', pricePerNight: 3500, maxGuests: 2 },
  ];

  const complete = {
    guestName: 'Asha Menon',
    guestPhone: '9876543210',
    idProofName: 'aadhaar.png',
    adults: 2,
    kids: 0,
    checkIn: '2026-09-16',
    checkOut: '2026-09-18',
    selectedCode: 'R101',
  };

  it('hangs a malformed phone under the phone field', () => {
    const result = bookingResolver({ rooms })({
      ...complete,
      guestPhone: '12345',
    });
    expect(result.errors.guestPhone.type).toBe(
      BOOKING_ERROR.INVALID_GUEST_PHONE
    );
  });

  // The bug this replaced: a blank name short-circuited validateGuest, so the
  // phone and ID proof fields stayed silent on submit.
  it('shows name, phone and ID proof errors together', () => {
    const result = bookingResolver({ rooms })({
      ...complete,
      guestName: '',
      guestPhone: '',
      idProofName: '',
    });
    expect(Object.keys(result.errors).sort()).toEqual([
      'guestName',
      'guestPhone',
      'idProofName',
    ]);
  });
});
