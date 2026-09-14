import PropTypes from 'prop-types';
import Field from '../../field';
import Icon from '../../icon';
import { controlClasses } from '../../field/controlClasses';
import { cn } from '../../../utils/cn';

/**
 * Native date control. The browser supplies the picker, so no date library
 * is needed; the icon is decorative and sits beside the native indicator.
 */
function DateInput({
  inputId,
  label,
  errorMessage,
  hint,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <Field
      label={label}
      htmlFor={inputId}
      errorMessage={errorMessage}
      hint={hint}
    >
      <div className="relative">
        <input
          id={inputId}
          type="date"
          disabled={disabled}
          aria-invalid={Boolean(errorMessage)}
          className={controlClasses({
            errorMessage,
            disabled,
            className: cn(
              'pr-9 [&::-webkit-calendar-picker-indicator]:opacity-0',
              className
            ),
          })}
          {...props}
        />
        <Icon
          name="calendar"
          className="text-ink-subtle pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
        />
      </div>
    </Field>
  );
}

DateInput.propTypes = {
  inputId: PropTypes.string.isRequired,
  label: PropTypes.string,
  errorMessage: PropTypes.string,
  hint: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default DateInput;
