import PropTypes from 'prop-types';
import Field from '../../field';
import { controlClasses } from '../../field/controlClasses';

function NumberInput({
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
      <input
        id={inputId}
        type="number"
        disabled={disabled}
        inputMode="numeric"
        aria-invalid={Boolean(errorMessage)}
        className={controlClasses({ errorMessage, disabled, className })}
        {...props}
      />
    </Field>
  );
}

NumberInput.propTypes = {
  inputId: PropTypes.string.isRequired,
  label: PropTypes.string,
  errorMessage: PropTypes.string,
  hint: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default NumberInput;
