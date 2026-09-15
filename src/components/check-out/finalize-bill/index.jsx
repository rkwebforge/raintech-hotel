import PropTypes from 'prop-types';
import Card from '../../../widget/card';
import RoomBill from '../room-bill';
import { formatCurrency } from '../../../utils/formatCurrency';
import { combinedTotal } from '../../../helpers/billing';

function FinalizeBill({
  rooms,
  onAddCharge,
  onPrintInvoice,
  onAdjustCharges,
  className = '',
  ...props
}) {
  return (
    <Card title="2. Review & Finalize Bill" className={className} {...props}>
      {rooms.length === 0 ? (
        <p className="text-style-4 text-ink-subtle py-8 text-center">
          Select a room for check-out to review its bill.
        </p>
      ) : (
        <div className="divide-line space-y-5 divide-y">
          {rooms.map(room => (
            <div key={room.id} className="[&:not(:first-child)]:pt-5">
              <RoomBill
                room={room}
                onAddCharge={onAddCharge}
                onPrintInvoice={onPrintInvoice}
                onAdjustCharges={onAdjustCharges}
              />
            </div>
          ))}

          <div className="flex items-center justify-between gap-3 pt-5">
            <p className="text-style-3 text-ink">
              Selected Rooms Combined Total:
            </p>
            <p className="text-style-9 text-ink">
              {formatCurrency(combinedTotal(rooms))}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}

FinalizeBill.propTypes = {
  rooms: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.number.isRequired }))
    .isRequired,
  onAddCharge: PropTypes.func,
  onPrintInvoice: PropTypes.func,
  onAdjustCharges: PropTypes.func,
  className: PropTypes.string,
};

export default FinalizeBill;
