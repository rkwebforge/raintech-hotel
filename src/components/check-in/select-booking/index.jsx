import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../../../widget/button';
import Card from '../../../widget/card';
import Icon from '../../../widget/icon';
import Select from '../../../widget/select';
import SearchInput from '../../../widget/input/search-input';

function SelectBooking({
  guests,
  bookingDate,
  bookingTime,
  onAddGuest,
  className = '',
}) {
  const [query, setQuery] = useState('');
  const [customer, setCustomer] = useState('');

  const term = query.trim().toLowerCase();
  const options = guests
    .filter(
      guest =>
        !term ||
        guest.name.toLowerCase().includes(term) ||
        guest.phone.includes(term)
    )
    .map(guest => ({
      label: `${guest.name} — ${guest.phone}`,
      value: String(guest.id),
    }));

  return (
    <Card title="1. Select Booking & Guest" className={className}>
      <div className="space-y-4">
        <SearchInput
          inputId="booking-search"
          placeholder="Search Booking ID / Guest Name"
          value={query}
          onChange={event => setQuery(event.target.value)}
        />

        {/* items-end keeps the button on the control's baseline — the Select
            carries a label above it, the button doesn't. Stacks below sm,
            where the two side by side overflow a 320px screen. */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <Select
            inputId="booking-customer"
            label="Select Customer"
            options={options}
            value={customer}
            onChange={setCustomer}
            placeholder="Name/Phone number"
            searchable
            searchPlaceholder="Search guests"
            noResultsText="No guests match that search"
          />
          <Button className="w-full sm:w-auto sm:shrink-0" onClick={onAddGuest}>
            <Icon name="groupBooking" />
            Add Guest
          </Button>
        </div>

        <dl className="border-line grid grid-cols-2 gap-3 border-t pt-4">
          <div>
            <dt className="text-style-6 text-ink-muted">Booking Date</dt>
            <dd className="text-style-4 text-ink mt-1">{bookingDate}</dd>
          </div>
          <div>
            <dt className="text-style-6 text-ink-muted">Booking Time</dt>
            <dd className="text-style-4 text-ink mt-1 flex items-center gap-1.5">
              {bookingTime}
              <Icon name="calendar" className="text-ink-subtle" />
            </dd>
          </div>
        </dl>
      </div>
    </Card>
  );
}

SelectBooking.propTypes = {
  guests: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
    })
  ).isRequired,
  bookingDate: PropTypes.string.isRequired,
  bookingTime: PropTypes.string.isRequired,
  onAddGuest: PropTypes.func,
  className: PropTypes.string,
};

export default SelectBooking;
