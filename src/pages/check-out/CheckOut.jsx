import { useState } from 'react';
import IdentifyGuest from '../../components/check-out/identify-guest';
import FinalizeBill from '../../components/check-out/finalize-bill';
import PaymentCheckout from '../../components/check-out/payment-checkout';
import { useDepartingGuest } from '../../hooks/useDepartingGuest';
import { combinedTotal } from '../../helpers/billing';

function CheckOut() {
  const { data: guest, isPending, isError } = useDepartingGuest();

  /* Tracked as the rooms the user has *un*selected, so every room on the folio
     starts selected whatever its id — a hardcoded selected-list would select
     nothing once the real API returns different ids. */
  const [deselectedRooms, setDeselectedRooms] = useState([]);

  const toggleRoom = roomId =>
    setDeselectedRooms(prev =>
      prev.includes(roomId)
        ? prev.filter(id => id !== roomId)
        : [...prev, roomId]
    );

  const rooms = guest?.rooms ?? [];
  const billedRooms = rooms.filter(room => !deselectedRooms.includes(room.id));
  const selectedRooms = billedRooms.map(room => room.id);

  return (
    <div className="container px-4 py-6 sm:px-6">
      <h1 className="text-style-1 text-ink">Guest Check-Out</h1>

      {isError ? (
        <p className="text-style-4 text-error mt-6">
          Could not load the guest. Please retry.
        </p>
      ) : isPending ? (
        <p className="text-style-4 text-ink-subtle mt-6">Loading guest…</p>
      ) : (
        <div className="mt-5 grid items-start gap-5 xl:grid-cols-[minmax(0,30fr)_minmax(0,42fr)_minmax(0,28fr)]">
          <IdentifyGuest
            guest={guest}
            selectedRooms={selectedRooms}
            onToggleRoom={toggleRoom}
          />
          <FinalizeBill rooms={billedRooms} />
          <PaymentCheckout
            amountDue={combinedTotal(billedRooms)}
            roomCount={billedRooms.length}
          />
        </div>
      )}
    </div>
  );
}

export default CheckOut;
