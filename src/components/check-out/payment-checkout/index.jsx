import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../../../widget/button';
import Card from '../../../widget/card';
import Icon from '../../../widget/icon';
import Select from '../../../widget/select';
import NumberInput from '../../../widget/input/number-input';
import { PAYMENT_METHODS } from '../../../constants/payment';
import { formatCurrency } from '../../../utils/formatCurrency';

function PaymentCheckout({
  amountDue,
  roomCount,
  onProcessPayment,
  onCombinedCheckout,
  onPrintInvoice,
  onEmailInvoice,
  className = '',
  ...props
}) {
  const [method, setMethod] = useState(PAYMENT_METHODS[0].value);
  /* Raw input string, not a number: clearing the field must leave it empty
     rather than snapping back to 0 while the user retypes. `null` means the
     user hasn't typed, so the field tracks the amount due as rooms are
     selected; once they edit it, their figure stands. */
  const [enteredAmount, setEnteredAmount] = useState(null);
  const amount = enteredAmount ?? String(amountDue);

  return (
    <Card title="3. Payment & Check-out" className={className} {...props}>
      <div className="max-w-2xl space-y-4">
        <dl className="space-y-1">
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-style-3 text-ink">Total Amount Due</dt>
            <dd className="text-style-9 text-ink">
              {formatCurrency(amountDue)}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-style-7 text-ink-muted">Selected Rooms</dt>
            <dd className="text-style-5 text-ink-muted">{roomCount}</dd>
          </div>
        </dl>

        <div className="border-line space-y-3 border-t pt-4">
          <Select
            inputId="checkout-payment-method"
            label="Payment Method"
            options={PAYMENT_METHODS}
            value={method}
            onChange={setMethod}
          />

          <NumberInput
            inputId="checkout-payment-amount"
            label="Payment Amount"
            min={0}
            value={amount}
            onChange={event => setEnteredAmount(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Button
            fullWidth
            wrap
            disabled={roomCount === 0}
            onClick={() =>
              onProcessPayment?.({ method, amount: Number(amount) })
            }
          >
            Process Payment &amp; Check-out
          </Button>
          <Button
            variant="secondary"
            fullWidth
            wrap
            disabled={roomCount < 2}
            onClick={onCombinedCheckout}
          >
            Combine and Proceed with Selected Rooms Check-out
          </Button>
        </div>

        <div className="border-line grid gap-2 border-t pt-4 sm:grid-cols-2">
          <Button variant="secondary" wrap onClick={onPrintInvoice}>
            <Icon name="print" />
            Print Final Invoice
          </Button>
          <Button variant="secondary" wrap onClick={onEmailInvoice}>
            <Icon name="mail" />
            Email Final Invoice
          </Button>
        </div>
      </div>
    </Card>
  );
}

PaymentCheckout.propTypes = {
  amountDue: PropTypes.number.isRequired,
  roomCount: PropTypes.number.isRequired,
  onProcessPayment: PropTypes.func,
  onCombinedCheckout: PropTypes.func,
  onPrintInvoice: PropTypes.func,
  onEmailInvoice: PropTypes.func,
  className: PropTypes.string,
};

export default PaymentCheckout;
