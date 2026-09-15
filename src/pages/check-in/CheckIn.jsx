import SelectBooking from '../../components/check-in/select-booking';
import ReviewDetails from '../../components/check-in/review-details';
import GuestTable from '../../components/check-in/guest-table';
import FinalizePayment from '../../components/check-in/finalize-payment';
import { useGuests } from '../../hooks/useGuests';
import { useCheckInGuests } from '../../hooks/useCheckInGuests';
import { useActiveBooking } from '../../hooks/useActiveBooking';
import { bookingFolio } from '../../helpers/billing';

function CheckIn() {
  const { data: guests = [] } = useGuests();
  const { data: checkInGuests = [], isPending, isError } = useCheckInGuests();
  const { data: booking } = useActiveBooking();

  const folio = booking ? bookingFolio(booking) : null;

  return (
    <div className="container px-4 py-6 sm:px-6">
      <h1 className="text-style-1 text-ink">Guest Check-in</h1>

      <div className="mt-5 space-y-5">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,30fr)_minmax(0,70fr)]">
          <SelectBooking
            guests={guests}
            bookingDate="02/04/2026"
            bookingTime="07:00 PM"
          />
          {booking && <ReviewDetails booking={booking} />}
        </div>

        {/* minmax(0,...) on the table track, not a px floor: the container caps
            at 1440px, so a floor wide enough for ten columns would overflow it
            rather than let the table's own scroller take over. */}
        <div className="grid items-start gap-5 min-[1400px]:grid-cols-[minmax(0,1fr)_23rem]">
          {isError ? (
            <p className="text-style-4 text-error">
              Could not load guests. Please retry.
            </p>
          ) : isPending ? (
            <p className="text-style-4 text-ink-subtle">Loading guests…</p>
          ) : (
            <GuestTable guests={checkInGuests} />
          )}

          {folio && (
            <FinalizePayment
              roomCharge={folio.roomCharge}
              extraCharges={folio.extraCharges}
              tax={folio.tax}
              amountPaid={folio.amountPaid}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default CheckIn;
