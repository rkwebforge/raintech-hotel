import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../../../widget/button';
import Card from '../../../widget/card';
import Icon from '../../../widget/icon';
import Select from '../../../widget/select';
import TextInput from '../../../widget/input/text-input';
import NumberInput from '../../../widget/input/number-input';
import DateInput from '../../../widget/input/date-input';
import { formatCurrency } from '../../../utils/formatCurrency';

const GUEST_COUNT_OPTIONS = ['01', '02', '03', '04', '05', '06'];

function ReviewDetails({
  booking,
  onConfirm,
  onUpdate,
  onEdit,
  onDelete,
  className = '',
}) {
  /* The editable copy of the booking. Seeded from the prop and owned here —
     the parent is told about changes only when the user confirms. */
  const [draft, setDraft] = useState({
    guestName: booking.name,
    adults: booking.adults,
    kids: booking.kids,
    guestCount: booking.guestCount,
    checkoutDate: booking.checkoutDate,
    idProofName: booking.idProof,
  });

  const setField = (field, value) =>
    setDraft(prev => ({ ...prev, [field]: value }));

  const handleIdProofChange = event => {
    const file = event.target.files?.[0];
    if (file) setField('idProofName', file.name);
  };

  return (
    <Card title="2. Review & Update Details" className={className}>
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[minmax(0,0.6fr)_repeat(5,minmax(0,1fr))]">
          <div>
            <p className="text-style-6 text-ink-muted mb-1.5">Room No.</p>
            <p className="from-accent-soft to-accent/35 text-accent border-accent/60 rounded-field text-style-9 inline-flex h-10 items-center gap-2 border bg-gradient-to-b px-3">
              <Icon name="rooms" />
              {booking.roomNumber}
            </p>
          </div>

          <TextInput
            inputId="review-rent"
            label="Rent"
            value={formatCurrency(booking.rent)}
            readOnly
            className="bg-surface-sunken"
          />

          <TextInput
            inputId="review-gst"
            label="GST"
            value={formatCurrency(booking.gst)}
            readOnly
            className="bg-surface-sunken"
          />

          <TextInput
            inputId="review-tenant"
            label="Tenant Name"
            value={booking.tenantName}
            readOnly
            className="bg-surface-sunken"
          />

          <NumberInput
            inputId="review-adults"
            label="No. of Adults"
            min={0}
            value={draft.adults}
            onChange={event => setField('adults', Number(event.target.value))}
          />

          <NumberInput
            inputId="review-kids"
            label="No. of Kids"
            min={0}
            value={draft.kids}
            onChange={event => setField('kids', Number(event.target.value))}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="grid gap-4 sm:grid-cols-3">
            <DateInput
              inputId="review-checkout"
              label="Checkout Date"
              value={draft.checkoutDate}
              onChange={event => setField('checkoutDate', event.target.value)}
            />

            <div>
              <p className="text-style-6 text-ink-muted mb-1.5">ID Proof</p>
              <p className="border-line-strong bg-surface rounded-field text-style-4 text-ink flex h-10 items-center gap-2 border px-3">
                <span className="truncate">{draft.idProofName}</span>
                <Icon name="document" className="text-ink-subtle ml-auto" />
              </p>
            </div>

            <Select
              inputId="review-guest-count"
              label="Guest Count"
              options={GUEST_COUNT_OPTIONS}
              value={draft.guestCount}
              onChange={value => setField('guestCount', value)}
            />

            <TextInput
              inputId="review-guest-name"
              label="Update Guest Name"
              value={draft.guestName}
              onChange={event => setField('guestName', event.target.value)}
            />

            <label
              htmlFor="review-id-upload"
              className="border-line-strong text-ink-muted hover:bg-surface-muted rounded-card flex h-20 cursor-pointer items-center justify-center gap-2 border border-dashed transition-colors sm:col-span-2"
            >
              <Icon name="upload" />
              <span className="text-style-8">Update ID Proof</span>
              <input
                id="review-id-upload"
                type="file"
                className="sr-only"
                onChange={handleIdProofChange}
              />
            </label>
          </div>

          <div className="bg-surface-sunken border-line rounded-card border p-3">
            <h3 className="text-style-3 text-ink mb-2">Additional Charges</h3>
            <dl className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <dt className="text-style-4 text-ink-muted">Beds</dt>
                <dd className="text-style-5 text-ink">{booking.beds}</dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-style-4 text-ink-muted">Extra Charges</dt>
                <dd className="text-style-5 text-ink">
                  {formatCurrency(booking.extraCharges)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-style-4 text-ink-muted">Tax</dt>
                <dd className="text-style-5 text-ink">
                  {formatCurrency(booking.tax)}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="border-line flex flex-wrap justify-end gap-2 border-t pt-4">
          <Button variant="secondary" onClick={onDelete}>
            <Icon name="delete" />
            Delete
          </Button>
          <Button variant="secondary" onClick={onEdit}>
            <Icon name="edit" />
            Edit
          </Button>
          <Button variant="secondary" onClick={() => onUpdate?.(draft)}>
            <Icon name="update" />
            Update
          </Button>
          <Button onClick={() => onConfirm?.(draft)}>
            Confirm Guest Details
          </Button>
        </div>
      </div>
    </Card>
  );
}

ReviewDetails.propTypes = {
  booking: PropTypes.shape({
    roomNumber: PropTypes.string.isRequired,
    rent: PropTypes.number.isRequired,
    gst: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    tenantName: PropTypes.string.isRequired,
    adults: PropTypes.number.isRequired,
    kids: PropTypes.number.isRequired,
    guestCount: PropTypes.string.isRequired,
    checkoutDate: PropTypes.string.isRequired,
    idProof: PropTypes.string.isRequired,
    beds: PropTypes.number.isRequired,
    extraCharges: PropTypes.number.isRequired,
    tax: PropTypes.number.isRequired,
  }).isRequired,
  onConfirm: PropTypes.func,
  onUpdate: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  className: PropTypes.string,
};

export default ReviewDetails;
