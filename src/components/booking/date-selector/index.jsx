import PropTypes from 'prop-types';
import DateInput from '../../../widget/input/date-input';
import { dayAfter } from '../../../helpers/booking';
import { cn } from '../../../utils/cn';

/**
 * Stay dates. `minCheckIn` is passed down to the native picker
 * as well as being validated in the resolver — the attribute is a convenience,
 * not the guard, since a typed date can still land in the past. Check-out stays
 * disabled until check-in is set, then floors at the day after it: the same day
 * is zero nights, not a stay.
 */
function StayDateSelector({
  register,
  errors,
  minCheckIn,
  checkIn = '',
  className = '',
}) {
  return (
    <div className={cn('grid gap-4 sm:grid-cols-2', className)}>
      <DateInput
        inputId="booking-check-in"
        label="Check-in"
        min={minCheckIn}
        errorMessage={errors.checkIn?.message}
        {...register('checkIn')}
      />
      <DateInput
        inputId="booking-check-out"
        label="Check-out"
        disabled={!checkIn}
        hint={checkIn ? undefined : 'Pick a check-in date first.'}
        min={checkIn ? dayAfter(checkIn) : dayAfter(minCheckIn)}
        errorMessage={errors.checkOut?.message}
        {...register('checkOut')}
      />
    </div>
  );
}

const fieldError = PropTypes.shape({ message: PropTypes.string });

StayDateSelector.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    checkIn: fieldError,
    checkOut: fieldError,
  }).isRequired,
  minCheckIn: PropTypes.string.isRequired,
  checkIn: PropTypes.string,
  className: PropTypes.string,
};

export default StayDateSelector;
