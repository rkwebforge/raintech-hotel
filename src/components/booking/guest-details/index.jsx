import PropTypes from 'prop-types';
import Icon from '../../../widget/icon';
import TextInput from '../../../widget/input/text-input';
import NumberInput from '../../../widget/input/number-input';
import { cn } from '../../../utils/cn';

/**
 * Guest identity for the reservation, mirroring the check-in window's fields.
 * Only the file *name* is kept — nothing uploads until the API exists, and the
 * name is all the summary needs to show. The file input can't be registered
 * (a File is not the form value), so the name is written with setValue by the
 * page instead.
 */
function GuestDetails({
  register,
  errors,
  idProofName,
  onIdProofChange,
  className = '',
}) {
  const phone = register('guestPhone');

  return (
    <div className={cn('space-y-4', className)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput
          inputId="booking-guest-name"
          label="Guest Name"
          placeholder="Full name as on ID"
          errorMessage={errors.guestName?.message}
          {...register('guestName')}
        />

        <TextInput
          inputId="booking-guest-phone"
          label="Phone Number"
          type="tel"
          inputMode="numeric"
          placeholder="Contact number"
          errorMessage={errors.guestPhone?.message}
          {...phone}
          onChange={event => {
            // Keep the separators isIndianPhone already strips, so a pasted
            // "+91 98765 43210" survives; letters are what we're keeping out.
            event.target.value = event.target.value.replace(
              /[^\d+\-\s()]/g,
              ''
            );
            phone.onChange(event);
          }}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <NumberInput
          inputId="booking-adults"
          label="No. of Adults"
          min={1}
          errorMessage={errors.adults?.message}
          {...register('adults')}
        />

        <NumberInput
          inputId="booking-kids"
          label="No. of Kids"
          min={0}
          {...register('kids')}
        />
      </div>

      <div>
        <p className="text-style-6 text-ink-muted mb-1.5">ID Proof</p>
        {idProofName ? (
          <p className="border-line-strong bg-surface rounded-field text-style-4 text-ink mb-2 flex h-10 items-center gap-2 border px-3">
            <span className="truncate">{idProofName}</span>
            <Icon name="document" className="text-ink-subtle ml-auto" />
          </p>
        ) : null}

        <label
          htmlFor="booking-id-upload"
          className={cn(
            'rounded-card flex h-20 cursor-pointer items-center justify-center gap-2 border border-dashed transition-colors',
            'border-line-strong text-ink-muted hover:bg-surface-muted',
            errors.idProofName && 'border-error text-error'
          )}
        >
          <Icon name="upload" />
          <span className="text-style-8">
            {idProofName ? 'Replace ID Proof' : 'Upload ID Proof'}
          </span>
          <input
            id="booking-id-upload"
            type="file"
            className="sr-only"
            onChange={event => {
              const file = event.target.files?.[0];
              if (file) onIdProofChange(file.name);
            }}
          />
        </label>

        {errors.idProofName && (
          <p className="text-style-7 text-error mt-1.5">
            {errors.idProofName.message}
          </p>
        )}
      </div>
    </div>
  );
}

const fieldError = PropTypes.shape({ message: PropTypes.string });

GuestDetails.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    guestName: fieldError,
    guestPhone: fieldError,
    adults: fieldError,
    idProofName: fieldError,
  }).isRequired,
  idProofName: PropTypes.string.isRequired,
  onIdProofChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default GuestDetails;
