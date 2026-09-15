import PropTypes from 'prop-types';
import Button from '../../../widget/button';
import Card from '../../../widget/card';
import Icon from '../../../widget/icon';
import { formatCurrency } from '../../../utils/formatCurrency';

function FinalizePayment({
  roomCharge,
  extraCharges,
  tax,
  amountPaid,
  onCompleteCheckIn,
  onGetData,
  onMobilePay,
  onPrint,
  onPrintRegistrationCard,
  onDownloadFolio,
  className = '',
}) {
  const total = roomCharge + extraCharges + tax;
  const balanceDue = total - amountPaid;

  return (
    <Card title="3. Finalize Check-in & Payment" className={className}>
      {/* The card fills its column so it lines up with the table when stacked,
          but the bill rows and buttons stay readable rather than stretching a
          label and its amount to opposite edges of the page. */}
      <div className="max-w-2xl space-y-4">
        <dl className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <dt className="text-style-4 text-ink-muted">Room Charge</dt>
            <dd className="text-style-5 text-ink">
              {formatCurrency(roomCharge)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="text-style-4 text-ink-muted">Extra Charges</dt>
            <dd className="text-style-5 text-ink">
              {formatCurrency(extraCharges)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="text-style-4 text-ink-muted">Tax</dt>
            <dd className="text-style-5 text-ink">{formatCurrency(tax)}</dd>
          </div>
        </dl>

        <div className="border-line flex items-center justify-between gap-2 border-t pt-3">
          <span className="text-style-3 text-ink">Total Amount:</span>
          <span className="text-style-9 text-ink">{formatCurrency(total)}</span>
        </div>

        <dl className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <dt className="text-style-4 text-ink-muted">Amount Paid</dt>
            <dd className="text-style-5 text-ink">
              {formatCurrency(amountPaid)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="text-style-3 text-ink">Balance Due</dt>
            <dd className="text-style-5 text-ink">
              {formatCurrency(balanceDue)}
            </dd>
          </div>
        </dl>

        <Button fullWidth onClick={onCompleteCheckIn}>
          Complete Check-in
        </Button>

        <div className="grid grid-cols-3 gap-2">
          <Button variant="secondary" wrap onClick={onGetData}>
            Get Data
          </Button>
          <Button variant="secondary" wrap onClick={onMobilePay}>
            <Icon name="payment" />
            M-Pay
          </Button>
          <Button variant="secondary" wrap onClick={onPrint}>
            <Icon name="print" />
            Print
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" wrap onClick={onPrintRegistrationCard}>
            <Icon name="print" />
            Print Registration Card
          </Button>
          <Button variant="secondary" wrap onClick={onDownloadFolio}>
            <Icon name="download" />
            Download Folio
          </Button>
        </div>
      </div>
    </Card>
  );
}

FinalizePayment.propTypes = {
  roomCharge: PropTypes.number.isRequired,
  extraCharges: PropTypes.number.isRequired,
  tax: PropTypes.number.isRequired,
  amountPaid: PropTypes.number.isRequired,
  onCompleteCheckIn: PropTypes.func,
  onGetData: PropTypes.func,
  onMobilePay: PropTypes.func,
  onPrint: PropTypes.func,
  onPrintRegistrationCard: PropTypes.func,
  onDownloadFolio: PropTypes.func,
  className: PropTypes.string,
};

export default FinalizePayment;
