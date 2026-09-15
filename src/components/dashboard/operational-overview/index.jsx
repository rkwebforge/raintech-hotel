import PropTypes from 'prop-types';
import Card from '../../../widget/card';
import { cn } from '../../../utils/cn';
import MetricTile from '../../../widget/metric-tile';
import { formatCurrency } from '../../../utils/formatCurrency';

function OperationalOverview({
  occupancyRate,
  pendingCheckIns,
  pendingDepartures,
  revenueToday,
  className = '',
}) {
  return (
    <Card
      className={cn('flex flex-col', className)}
      bodyClassName="flex flex-1 flex-col"
    >
      <h2 className="text-style-2 text-ink mb-3">Operational Overview</h2>
      <div className="grid flex-1 grid-cols-2 gap-3">
        <MetricTile label="Occupancy" value={`${occupancyRate}%`} tone="info" />
        <MetricTile label="Pending Check-ins" value={pendingCheckIns} />
        <MetricTile label="Pending Departures" value={pendingDepartures} />
        <MetricTile
          label="Revenue Today"
          value={formatCurrency(revenueToday)}
          tone="success"
        />
      </div>
    </Card>
  );
}

OperationalOverview.propTypes = {
  occupancyRate: PropTypes.number.isRequired,
  pendingCheckIns: PropTypes.number.isRequired,
  pendingDepartures: PropTypes.number.isRequired,
  revenueToday: PropTypes.number.isRequired,
  className: PropTypes.string,
};

export default OperationalOverview;
