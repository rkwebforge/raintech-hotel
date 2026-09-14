import PropTypes from 'prop-types';
import Icon from '../../icon';
import { cn } from '../../../utils/cn';

function SearchInput({
  inputId,
  placeholder = 'Search',
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <div className={cn('relative w-full', className)}>
      <Icon
        name="search"
        className="text-ink-subtle pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
      />
      <input
        id={inputId}
        type="search"
        role="searchbox"
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        className={cn(
          'text-style-4 text-ink bg-surface border-line-strong rounded-field h-10 w-full border pr-3 pl-9',
          'placeholder:text-ink-subtle transition-colors outline-none',
          'focus:border-line-focus focus:ring-navy-light/20 focus:ring-2',
          disabled && 'bg-surface-sunken cursor-not-allowed opacity-60'
        )}
        {...props}
      />
    </div>
  );
}

SearchInput.propTypes = {
  inputId: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default SearchInput;
