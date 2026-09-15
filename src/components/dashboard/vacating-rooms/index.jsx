import PropTypes from 'prop-types';
import Card from '../../../widget/card';
import Icon from '../../../widget/icon';

function VacatingRooms({ rooms, alerts, className = '' }) {
  return (
    <Card className={className}>
      <h2 className="text-style-2 text-ink mb-3 flex items-center gap-2">
        <Icon name="rooms" className="text-ink-muted" />
        Going to Vacate Rooms
      </h2>

      {rooms.length === 0 ? (
        <p className="text-style-4 text-ink-subtle py-6 text-center">
          No departures scheduled today.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map(room => (
            <div
              key={room.id}
              className="border-line bg-surface-sunken rounded-card flex items-center gap-3 border p-3"
            >
              <span
                aria-hidden="true"
                className="bg-surface-muted border-line rounded-tile h-14 w-20 shrink-0 border"
              />
              <div className="min-w-0">
                <p className="text-style-5 text-ink">Room {room.number}</p>
                <p className="text-style-7 text-ink-muted">{room.note}</p>
              </div>
            </div>
          ))}

          {alerts.length > 0 && (
            <ul className="border-line space-y-2 border-t pt-3 sm:col-span-2 lg:col-span-1 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-3">
              {alerts.map(alert => (
                <li
                  key={alert}
                  className="text-style-7 text-warn flex items-start gap-1.5"
                >
                  <Icon name="alert" size="h-3.5 w-3.5" className="mt-0.5" />
                  <span>{alert}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Card>
  );
}

VacatingRooms.propTypes = {
  rooms: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      number: PropTypes.string.isRequired,
      note: PropTypes.string.isRequired,
    })
  ).isRequired,
  alerts: PropTypes.arrayOf(PropTypes.string).isRequired,
  className: PropTypes.string,
};

export default VacatingRooms;
