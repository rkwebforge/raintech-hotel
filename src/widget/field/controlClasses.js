import { cn } from '../../utils/cn';

/** Border/background chrome shared by input, select and date controls. */
export function controlClasses({ errorMessage, disabled, className = '' }) {
  return cn(
    'text-style-4 text-ink bg-surface border-line-strong rounded-field h-10 w-full border px-3',
    'placeholder:text-ink-subtle outline-none transition-colors',
    'focus:border-line-focus focus:ring-2 focus:ring-navy-light/20',
    errorMessage && 'border-error focus:border-error focus:ring-error/20',
    disabled && 'bg-surface-sunken cursor-not-allowed opacity-60',
    className
  );
}
