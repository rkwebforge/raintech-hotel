import PropTypes from 'prop-types';
import { cn } from '../../utils/cn';

/**
 * Panel container. `title` renders the navy header bar used by the
 * check-in / check-out step panels; without it the card is a plain
 * white surface like the dashboard tiles.
 */
function Card({
  children,
  title,
  action,
  padded = true,
  className = '',
  bodyClassName = '',
  ...props
}) {
  return (
    <div
      className={cn(
        'bg-surface border-line rounded-card shadow-card overflow-hidden border',
        className
      )}
      {...props}
    >
      {title && (
        <div className="bg-navy text-ink-inverse flex items-center justify-between gap-3 px-4 py-3">
          <h2 className="text-style-2">{title}</h2>
          {action}
        </div>
      )}
      <div className={cn(padded && 'p-4', bodyClassName)}>{children}</div>
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.node,
  action: PropTypes.node,
  padded: PropTypes.bool,
  className: PropTypes.string,
  bodyClassName: PropTypes.string,
};

export default Card;
