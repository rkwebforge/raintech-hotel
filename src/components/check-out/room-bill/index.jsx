import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../../../widget/button';
import Icon from '../../../widget/icon';
import SearchInput from '../../../widget/input/search-input';
import { formatCurrency } from '../../../utils/formatCurrency';
import { roomTotal } from '../../../helpers/billing';
import { formatDate } from '../../../utils/formatDate';

const QUICK_CHARGES = ['Mini-bar', 'Laundry'];

function RoomBill({ room, onAddCharge, onPrintInvoice, onAdjustCharges }) {
  const [query, setQuery] = useState('');

  return (
    <section className="space-y-3">
      <div>
        <h3 className="text-style-2 text-ink">Room {room.number}</h3>
        <p className="text-style-7 text-ink-muted mt-0.5">
          Nights: {room.nights}, Rate: {formatCurrency(room.rate)}, Total:{' '}
          {formatCurrency(room.nights * room.rate)}
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-style-6 text-ink-muted">
          Additional Charges (Add Items)
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <SearchInput
            inputId={`charge-search-${room.id}`}
            placeholder="Search/Add Additional Charges"
            value={query}
            onChange={event => setQuery(event.target.value)}
          />
          <div className="flex shrink-0 gap-2">
            {QUICK_CHARGES.map(charge => (
              <Button
                key={charge}
                variant="secondary"
                className="flex-1 whitespace-nowrap"
                onClick={() => onAddCharge?.(room.id, charge)}
              >
                {charge}
              </Button>
            ))}
            <Button
              aria-label={`Add charge to room ${room.number}`}
              onClick={() => onAddCharge?.(room.id, query)}
            >
              <Icon name="plus" />
            </Button>
          </div>
        </div>
      </div>

      <dl className="border-line rounded-card divide-line divide-y border">
        <div className="bg-surface-sunken text-style-label text-ink-muted flex items-center gap-3 px-3 py-2.5">
          <dt className="flex-1">Room Charges &amp; External Bills</dt>
          <dd className="w-16 shrink-0 sm:w-24">Date</dd>
          <dd className="w-16 shrink-0 text-right sm:w-20">Amount</dd>
        </div>
        {room.charges.map(charge => (
          <div
            key={charge.id}
            className="text-style-4 text-ink flex items-center gap-3 px-3 py-2.5"
          >
            <dt className="min-w-0 flex-1 truncate">{charge.label}</dt>
            <dd className="text-ink-muted w-16 shrink-0 text-[0.6875rem] whitespace-nowrap sm:w-24 sm:text-inherit">
              {formatDate(charge.date)}
            </dd>
            <dd className="w-16 shrink-0 text-right whitespace-nowrap sm:w-20">
              {formatCurrency(charge.amount)}
            </dd>
          </div>
        ))}
      </dl>

      <div className="flex items-center justify-between gap-3">
        <p className="text-style-3 text-ink">Room {room.number} Total</p>
        <p className="text-style-9 text-ink">
          {formatCurrency(roomTotal(room))}
        </p>
      </div>

      <div className="flex flex-wrap justify-end gap-2">
        <Button variant="secondary" onClick={() => onPrintInvoice?.(room.id)}>
          <Icon name="print" />
          Print Room {room.number} Invoice
        </Button>
        <Button onClick={() => onAdjustCharges?.(room.id)}>
          <Icon name="adjust" />
          Adjust Charges (Room {room.number})
        </Button>
      </div>
    </section>
  );
}

RoomBill.propTypes = {
  room: PropTypes.shape({
    id: PropTypes.number.isRequired,
    number: PropTypes.string.isRequired,
    nights: PropTypes.number.isRequired,
    rate: PropTypes.number.isRequired,
    charges: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        label: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
  onAddCharge: PropTypes.func,
  onPrintInvoice: PropTypes.func,
  onAdjustCharges: PropTypes.func,
};

export default RoomBill;
