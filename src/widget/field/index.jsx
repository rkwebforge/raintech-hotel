import PropTypes from 'prop-types';
import { cn } from '../../utils/cn';

/**
 * Label + error/hint wrapper shared by every form control, so spacing and
 * error styling stay identical across inputs, selects and date fields.
 */
function Field({
  label,
  htmlFor,
  errorMessage,
  hint,
  className = '',
  children,
}) {
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="text-style-6 text-ink-muted mb-1.5 block"
        >
          {label}
        </label>
      )}
      {children}
      {errorMessage ? (
        <p className="text-style-7 text-error mt-1">{errorMessage}</p>
      ) : (
        hint && <p className="text-style-7 text-ink-subtle mt-1">{hint}</p>
      )}
    </div>
  );
}

Field.propTypes = {
  label: PropTypes.string,
  htmlFor: PropTypes.string,
  errorMessage: PropTypes.string,
  hint: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Field;
