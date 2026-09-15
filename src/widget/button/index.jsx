import PropTypes from 'prop-types';
import { cn } from '../../utils/cn';

const VARIANTS = {
  primary: 'bg-navy text-ink-inverse not-disabled:hover:bg-navy-dark',
  secondary:
    'bg-surface-muted text-ink border border-line-strong not-disabled:hover:bg-line',
  ghost: 'bg-transparent text-navy not-disabled:hover:bg-navy-soft',
  success:
    'bg-success-soft text-success border border-success/30 not-disabled:hover:bg-success not-disabled:hover:text-ink-inverse',
  danger:
    'bg-error-soft text-error border border-error/30 not-disabled:hover:bg-error not-disabled:hover:text-ink-inverse',
};

const SIZES = {
  sm: 'h-8 px-3 gap-1.5',
  md: 'h-10 px-4 gap-2',
  lg: 'h-12 px-5 gap-2',
};

// `wrap` trades the fixed height for a minimum so long labels can run to a
// second line. Mirrors SIZES so the padding matches.
const WRAP_SIZES = {
  sm: 'min-h-8 px-3 py-1.5 gap-1.5',
  md: 'min-h-10 px-4 py-2 gap-2',
  lg: 'min-h-12 px-5 py-2.5 gap-2',
};

function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  fullWidth = false,
  wrap = false,
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(
        'text-style-8 rounded-field inline-flex items-center justify-center transition-colors select-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        VARIANTS[variant],
        wrap ? `${WRAP_SIZES[size]} text-center` : SIZES[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(Object.keys(VARIANTS)),
  size: PropTypes.oneOf(Object.keys(SIZES)),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  fullWidth: PropTypes.bool,
  wrap: PropTypes.bool,
  className: PropTypes.string,
};

export default Button;
