import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../../../widget/button';
import Card from '../../../widget/card';
import Icon from '../../../widget/icon';
import Select from '../../../widget/select';
import NumberInput from '../../../widget/input/number-input';
import { formatDate } from '../../../utils/formatDate';
import Table, {
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
} from '../../../widget/table';

function IdentifyGuest({
  guest,
  selectedRooms,
  onToggleRoom,
  onFindGuest,
  onChangeRooms,
  className = '',
  ...props
}) {
  const guestOptions = [{ label: guest.name, value: String(guest.id) }];

  const [selectedGuest, setSelectedGuest] = useState(String(guest.id));
  const [roomNumber, setRoomNumber] = useState(guest.primaryRoom);

  return (
    <Card title="1. Identify Departing Guest" className={className} {...props}>
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Select
            inputId="checkout-find-guest"
            label="Find Guest"
            options={guestOptions}
            value={selectedGuest}
            onChange={setSelectedGuest}
            placeholder="Search Guest"
          />
          <NumberInput
            inputId="checkout-room-number"
            label="Identify by Room"
            min={1}
            value={roomNumber}
            onChange={event => setRoomNumber(event.target.value)}
          />
        </div>

        {/* items-end keeps the button on the select's baseline — the select
            carries a label above it, the button doesn't. */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <Select
            inputId="checkout-guest-list"
            options={guestOptions}
            value={selectedGuest}
            onChange={setSelectedGuest}
            placeholder="Select Guest from List"
          />
          <Button
            className="w-full sm:w-auto sm:shrink-0"
            onClick={() => onFindGuest?.({ selectedGuest, roomNumber })}
          >
            Find Room/Guest
          </Button>
        </div>

        <dl className="border-line grid grid-cols-2 gap-3 border-t pt-4">
          <div>
            <dt className="text-style-6 text-ink-muted">Guest Name</dt>
            <dd className="text-style-4 text-ink mt-1">{guest.name}</dd>
          </div>
          <div>
            <dt className="text-style-6 text-ink-muted">Room No.</dt>
            <dd className="mt-1">
              <span className="from-accent-soft to-accent/35 text-accent border-accent/60 rounded-field text-style-5 inline-flex h-9 items-center gap-2 border bg-gradient-to-b px-3">
                <Icon name="rooms" />
                {guest.primaryRoom}
              </span>
            </dd>
          </div>
        </dl>

        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Room</TableHeaderCell>
              <TableHeaderCell>Stay Dates</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {guest.rooms.map(room => (
              <TableRow key={room.id}>
                <TableCell>{room.number}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatDate(room.stayFrom)}-{formatDate(room.stayTo)}
                </TableCell>
                <TableCell>
                  {/* The column is too narrow for the full phrase, so the
                      visible label is short and the accessible name carries
                      the room it applies to. */}
                  <label className="text-style-7 text-ink flex items-center gap-2 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedRooms.includes(room.id)}
                      onChange={() => onToggleRoom(room.id)}
                      aria-label={`Select room ${room.number} for check-out`}
                      className="accent-navy h-4 w-4 shrink-0"
                    />
                    <span aria-hidden="true">Select</span>
                  </label>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Button
          variant="secondary"
          fullWidth
          onClick={() => onChangeRooms?.(selectedRooms)}
        >
          <Icon name="search" />
          Add/Change Selected Rooms
        </Button>
      </div>
    </Card>
  );
}

IdentifyGuest.propTypes = {
  guest: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    primaryRoom: PropTypes.string.isRequired,
    rooms: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        number: PropTypes.string.isRequired,
        stayFrom: PropTypes.string.isRequired,
        stayTo: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  selectedRooms: PropTypes.arrayOf(PropTypes.number).isRequired,
  onToggleRoom: PropTypes.func.isRequired,
  onFindGuest: PropTypes.func,
  onChangeRooms: PropTypes.func,
  className: PropTypes.string,
};

export default IdentifyGuest;
