import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Icon from '../../../widget/icon';
import { cn } from '../../../utils/cn';

const TONES = {
  available: 'bg-available-soft text-available',
  dirty: 'bg-dirty-soft text-dirty',
  occupied: 'bg-occupied-soft text-occupied',
  maintenance: 'bg-maintenance-soft text-maintenance',
  accent: 'bg-accent-soft text-accent',
  navy: 'bg-navy-soft text-navy',
  blocked: 'bg-blocked-soft text-blocked',
};

const TILE =
  'bg-surface border-line rounded-card shadow-card hover:border-navy-light hover:bg-navy-soft/40 hover:shadow-raised relative flex flex-col items-center justify-center gap-2 border px-3 py-5 transition';

function QuickActionsGrid({ actions, className = '' }) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6',
        className
      )}
    >
      {actions.map(action => {
        const body = (
          <>
            {action.badge && (
              <span className="bg-occupied-soft text-occupied text-style-7 absolute top-2 right-2 rounded-full px-2 py-0.5 font-medium">
                {action.badge}
              </span>
            )}
            <span
              className={cn(
                'flex h-11 w-11 items-center justify-center rounded-full',
                TONES[action.tone]
              )}
            >
              <Icon name={action.icon} size="h-5 w-5" />
            </span>
            <span className="text-style-5 text-ink text-center">
              {action.label}
            </span>
          </>
        );

        // Actions whose destination exists navigate; the rest are inert
        // buttons until their pages land.
        return action.to ? (
          <Link key={action.id} to={action.to} className={TILE}>
            {body}
          </Link>
        ) : (
          <button key={action.id} type="button" className={TILE}>
            {body}
          </button>
        );
      })}
    </div>
  );
}

QuickActionsGrid.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      tone: PropTypes.oneOf(Object.keys(TONES)).isRequired,
      badge: PropTypes.string,
      to: PropTypes.string,
    })
  ).isRequired,
  className: PropTypes.string,
};

export default QuickActionsGrid;
