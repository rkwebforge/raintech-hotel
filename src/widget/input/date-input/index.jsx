import PropTypes from 'prop-types';
import { useRef } from 'react';
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
  ref,
  ...props
}) {
  const inputRef = useRef(null);

  // A caller's ref (react-hook-form's register, say) has to reach the input
  // without displacing ours — openPicker needs the node too.
  const setRef = node => {
    inputRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  // The native indicator is hidden so only our icon shows, which leaves the
  // picker with no clickable target — open it from a click anywhere on the
  // field instead. showPicker() is absent in older Safari; typing still works.
  const openPicker = () => {
    if (disabled) return;
    inputRef.current?.showPicker?.();
  };

  return (
    <Field
      label={label}
      htmlFor={inputId}
      errorMessage={errorMessage}
      hint={hint}
    >
      <div className="relative">
        <input
          ref={setRef}
          id={inputId}
          type="date"
          disabled={disabled}
          aria-invalid={Boolean(errorMessage)}
          onClick={openPicker}
          className={controlClasses({
            errorMessage,
            disabled,
            className: cn(
              'pr-9 [&::-webkit-calendar-picker-indicator]:hidden',
              !disabled && 'cursor-pointer',
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
  ref: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
};

export default DateInput;
