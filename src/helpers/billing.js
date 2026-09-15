/** A room's folio total: the nightly rate for the stay plus posted extras. */
export function roomTotal(room) {
  const charges = room.charges.reduce((sum, charge) => sum + charge.amount, 0);
  return room.nights * room.rate + charges;
}

/** Combined total for the rooms selected for check-out. */
export function combinedTotal(rooms) {
  return rooms.reduce((sum, room) => sum + roomTotal(room), 0);
}

/**
 * The check-in folio for a booking. `gst` is a per-night rupee amount (~9% of
 * rent in the seed data), not a percentage, so it multiplies by nights like
 * the rent does.
 */
export function bookingFolio(booking) {
  const roomCharge = booking.nights * booking.rent;
  const tax = booking.nights * booking.gst;
  return {
    roomCharge,
    extraCharges: booking.extraCharges,
    tax,
    total: roomCharge + booking.extraCharges + tax,
    amountPaid: booking.amountPaid,
  };
}
