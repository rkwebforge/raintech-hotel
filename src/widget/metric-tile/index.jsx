import PropTypes from 'prop-types';
import { cn } from '../../utils/cn';

const TONES = {
  neutral: 'bg-surface-sunken border-line',
  info: 'bg-info-soft border-info/25',
  success: 'bg-success-soft border-success/25',
  warn: 'bg-warn-soft border-warn/25',
};

/** Single readout in the Operational Overview grid. */
function MetricTile({ label, value, tone = 'neutral', className = '' }) {
  return (
    <div className={cn('rounded-card border p-3', TONES[tone], className)}>
      <p className="text-style-7 text-ink-muted">{label}</p>
      <p className="text-style-9 text-ink mt-1">{value}</p>
    </div>
  );
}

MetricTile.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  tone: PropTypes.oneOf(Object.keys(TONES)),
  className: PropTypes.string,
};

export default MetricTile;
