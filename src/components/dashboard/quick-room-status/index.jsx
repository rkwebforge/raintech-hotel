import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../../../widget/button';
import Card from '../../../widget/card';
import Icon from '../../../widget/icon';
import Select from '../../../widget/select';

function QuickRoomStatus({ rooms, className = '' }) {
  const [roomNumber, setRoomNumber] = useState('');

  const options = rooms.map(room => ({
    label: room.number,
    value: room.number,
  }));

  return (
    <Card className={className}>
      <h2 className="text-style-2 text-ink mb-3">
        Quick Room Status Changer &amp; Actions
      </h2>

      <div className="space-y-3">
        {/* items-center keeps the button on the field's midline even if the
            field grows an error message. */}
        <div className="grid items-center gap-3 sm:grid-cols-2">
          <Select
            inputId="quick-room-number"
            label="Room #"
            options={options}
            value={roomNumber}
            onChange={setRoomNumber}
            placeholder="Select room"
            hint="Enter number"
            searchable
          />

          <Button variant="success" disabled={!roomNumber} wrap>
            <Icon name="cleaning" className="shrink-0" />
            Cleaning done, ready to serve
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button variant="danger" wrap>
            Set all Dirty to Cleaning
          </Button>

          <Button variant="secondary" wrap>
            <Icon name="maintenance" className="shrink-0" />
            View All Maintenance
          </Button>
        </div>
      </div>
    </Card>
  );
}

QuickRoomStatus.propTypes = {
  rooms: PropTypes.arrayOf(
    PropTypes.shape({
      number: PropTypes.string.isRequired,
    })
  ).isRequired,
  className: PropTypes.string,
};

export default QuickRoomStatus;
