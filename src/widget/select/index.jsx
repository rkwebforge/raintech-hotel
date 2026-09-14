import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import Field from '../field';
import Icon from '../icon';
import SearchInput from '../input/search-input';
import { useDropdown } from '../../hooks/useDropdown';
import { cn } from '../../utils/cn';

// A short list isn't worth filtering; only show the search box past this many.
const SEARCH_MIN_OPTIONS = 8;

const toOption = option =>
  typeof option === 'string' ? { label: option, value: option } : option;

/**
 * Styled dropdown. The panel is portalled to the body so it escapes any
 * `overflow: hidden` ancestor, and positioned by `useDropdown`.
 *
 * `onChange` receives the selected option's value, not a DOM event.
 */
function Select({
  inputId,
  label,
  options,
  value,
  onChange,
  placeholder = 'Select',
  errorMessage,
  hint,
  disabled = false,
  searchable = false,
  searchPlaceholder = 'Search',
  noResultsText = 'No matches',
  className = '',
}) {
  const generatedId = useId();
  const listboxId = `${inputId || generatedId}-listbox`;

  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const optionRefs = useRef([]);

  const normalized = useMemo(() => options.map(toOption), [options]);

  const { isOpen, position, triggerRef, panelRef, close, toggle } = useDropdown(
    {
      disabled,
      // Seed the active option from the current value when opening, and clear
      // the query when closing, so the panel always opens in a clean state.
      onOpen: () =>
        setActiveIndex(normalized.findIndex(option => option.value === value)),
      onClose: () => {
        setQuery('');
        setActiveIndex(-1);
      },
    }
  );
  const showSearch = searchable && normalized.length >= SEARCH_MIN_OPTIONS;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return normalized;
    return normalized.filter(option =>
      String(option.label).toLowerCase().includes(q)
    );
  }, [normalized, query]);

  const selected = normalized.find(option => option.value === value);

  useEffect(() => {
    if (activeIndex >= 0) {
      optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  const commit = option => {
    onChange?.(option.value);
    close();
    triggerRef.current?.focus();
  };

  const handleKeyDown = event => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (isOpen && activeIndex >= 0 && visible[activeIndex]) {
          commit(visible[activeIndex]);
        } else {
          toggle();
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) toggle();
        else setActiveIndex(prev => Math.min(prev + 1, visible.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (isOpen) setActiveIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Home':
        if (isOpen) {
          event.preventDefault();
          setActiveIndex(0);
        }
        break;
      case 'End':
        if (isOpen) {
          event.preventDefault();
          setActiveIndex(visible.length - 1);
        }
        break;
      case 'Escape':
        if (isOpen) {
          event.preventDefault();
          close();
          triggerRef.current?.focus();
        }
        break;
      case 'Tab':
        if (isOpen) close();
        break;
      default:
        break;
    }
  };

  return (
    <Field
      label={label}
      htmlFor={inputId}
      errorMessage={errorMessage}
      hint={hint}
    >
      <button
        id={inputId}
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        aria-invalid={Boolean(errorMessage)}
        disabled={disabled}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        className={cn(
          'text-style-4 bg-surface border-line-strong rounded-field flex h-10 w-full items-center justify-between gap-2 border px-3 text-left transition-colors',
          'focus:border-line-focus focus:ring-navy-light/20 outline-none focus:ring-2',
          selected ? 'text-ink' : 'text-ink-subtle',
          errorMessage && 'border-error focus:border-error focus:ring-error/20',
          disabled && 'bg-surface-sunken cursor-not-allowed opacity-60',
          className
        )}
      >
        <span className="truncate">
          {selected ? selected.label : placeholder}
        </span>
        <Icon
          name="chevronDown"
          className={cn(
            'text-ink-muted transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen &&
        position &&
        createPortal(
          <div
            ref={panelRef}
            style={{
              position: 'fixed',
              left: position.left,
              width: position.width,
              maxHeight: position.maxHeight,
              ...(position.top !== undefined
                ? { top: position.top }
                : { bottom: position.bottom }),
            }}
            className="bg-surface border-line rounded-card shadow-overlay z-50 flex flex-col overflow-hidden border"
          >
            {showSearch && (
              <div className="border-line border-b p-2">
                <SearchInput
                  inputId={`${listboxId}-search`}
                  placeholder={searchPlaceholder}
                  value={query}
                  autoFocus
                  onChange={event => {
                    setQuery(event.target.value);
                    setActiveIndex(-1);
                  }}
                  onKeyDown={handleKeyDown}
                />
              </div>
            )}

            <ul id={listboxId} role="listbox" className="overflow-y-auto p-1">
              {visible.length === 0 && (
                <li className="text-style-7 text-ink-subtle px-3 py-4 text-center">
                  {noResultsText}
                </li>
              )}
              {visible.map((option, index) => {
                const isSelected = option.value === value;
                return (
                  <li key={option.value}>
                    <button
                      ref={element => {
                        optionRefs.current[index] = element;
                      }}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => commit(option)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={cn(
                        'text-style-4 rounded-field flex w-full items-center justify-between gap-2 px-3 py-2 text-left transition-colors',
                        index === activeIndex && 'bg-navy-soft',
                        isSelected ? 'text-navy font-semibold' : 'text-ink'
                      )}
                    >
                      <span className="truncate">{option.label}</span>
                      {isSelected && <span aria-hidden="true">✓</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>,
          document.body
        )}
    </Field>
  );
}

Select.propTypes = {
  inputId: PropTypes.string.isRequired,
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
      }),
    ])
  ).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  errorMessage: PropTypes.string,
  hint: PropTypes.string,
  disabled: PropTypes.bool,
  searchable: PropTypes.bool,
  searchPlaceholder: PropTypes.string,
  noResultsText: PropTypes.string,
  className: PropTypes.string,
};

export default Select;
