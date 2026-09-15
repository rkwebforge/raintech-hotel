import { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import Button from '../../widget/button';
import Card from '../../widget/card';
import Icon from '../../widget/icon';
import StayDateSelector from '../../components/booking/date-selector';
import GuestDetails from '../../components/booking/guest-details';
import RecentBookings from '../../components/booking/recent-bookings';
import RoomList from '../../components/booking/room-list';
import StaySummary from '../../components/booking/stay-summary';
import {
  useBookingRooms,
  useExistingBookings,
} from '../../hooks/useBookingRooms';
import {
  bookingResolver,
  isRoomAvailable,
  nightsBetween,
  quoteStay,
  todayIso,
  validateDates,
} from '../../helpers/booking';
import { BOOKING_ERROR_MESSAGES, BOOKING_ERROR } from '../../constants/booking';

const EMPTY = Object.freeze([]);
const MAX_RECENT_BOOKINGS = 5;
const DEFAULT_VALUES = Object.freeze({
  guestName: '',
  guestPhone: '',
  idProofName: '',
  adults: 1,
  kids: 0,
  checkIn: '',
  checkOut: '',
  selectedCode: null,
});

function Booking() {
  const minCheckIn = todayIso();

  const roomsQuery = useBookingRooms();
  const bookingsQuery = useExistingBookings();

  const rooms = roomsQuery.data ?? EMPTY;
  const bookings = bookingsQuery.data ?? EMPTY;
  // Availability is derived from the existing bookings, so a failed bookings
  // fetch can't be shrugged off — it would show every room as free.
  const isPending = roomsQuery.isPending || bookingsQuery.isPending;
  const isError = roomsQuery.isError || bookingsQuery.isError;

  const [recentBookings, setRecentBookings] = useState(EMPTY);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: DEFAULT_VALUES,
    // Errors stay hidden until the first confirm, so the form doesn't scold the
    // user about fields they haven't reached yet; after that every edit revalidates.
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    resolver: bookingResolver({ rooms, bookings }),
  });

  // The summary re-quotes as the guest types, so these fields are watched rather
  // than left uncontrolled — the page has to re-render for the price to track.
  const values = useWatch({ control });
  const {
    adults = 0,
    kids = 0,
    checkIn = '',
    checkOut = '',
    selectedCode = null,
    guestName = '',
  } = values;

  // Moving check-in past an existing check-out would leave a stay the picker's
  // own min can no longer reach, so drop the stale date rather than strand it.
  useEffect(() => {
    if (checkIn && checkOut && nightsBetween(checkIn, checkOut) === 0) {
      setValue('checkOut', '');
    }
  }, [checkIn, checkOut, setValue]);

  // Kids occupy beds too, so the whole party counts against room capacity.
  const partySize = (Number(adults) || 0) + (Number(kids) || 0);
  const datesAreValid = validateDates(checkIn, checkOut) === null;

  // Rooms too small for the party drop out; ones booked for these dates stay
  // listed but disabled, so the guest can see why they can't have them.
  const listedRooms = useMemo(
    () =>
      rooms
        .filter(room => room.maxGuests >= Math.max(partySize, 1))
        .map(room => ({
          ...room,
          unavailableReason:
            datesAreValid && !isRoomAvailable(room, checkIn, checkOut, bookings)
              ? BOOKING_ERROR_MESSAGES[BOOKING_ERROR.ROOM_UNAVAILABLE]
              : null,
        })),
    [rooms, partySize, datesAreValid, checkIn, checkOut, bookings]
  );

  const selectedRoom =
    listedRooms.find(room => room.code === selectedCode) ?? null;

  const quote = quoteStay({
    room: selectedRoom,
    checkIn,
    checkOut,
    guests: Math.max(partySize, 1),
    bookings,
  });

  // Nothing is persisted yet — see the README. Confirming snapshots the stay
  // into the session's recent list and clears the form for the next guest.
  const onSubmit = data => {
    setRecentBookings(previous =>
      [
        {
          id: `${Date.now()}`,
          guestName: data.guestName,
          roomCode: selectedRoom.code,
          roomType: selectedRoom.type,
          checkIn: data.checkIn,
          checkOut: data.checkOut,
          adults: Number(data.adults) || 0,
          kids: Number(data.kids) || 0,
          nights: quote.nights,
          pricePerNight: selectedRoom.pricePerNight,
          total: quote.total,
        },
        ...previous,
      ].slice(0, MAX_RECENT_BOOKINGS)
    );
    reset(DEFAULT_VALUES);
  };

  return (
    <div className="container px-4 py-6 sm:px-6">
      <h1 className="text-style-1 text-ink">Room Booking</h1>
      <p className="text-style-4 text-ink-muted mt-1">
        Enter the guest details, pick your dates and a room to see the total.
      </p>

      {isError ? (
        <p className="text-style-4 text-error mt-6">
          Could not load rooms. Please retry.
        </p>
      ) : isPending ? (
        <p className="text-style-4 text-ink-subtle mt-6">Loading rooms…</p>
      ) : (
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="mt-5 grid items-start gap-5 lg:grid-cols-[minmax(0,62fr)_minmax(0,38fr)]"
        >
          <div className="space-y-5">
            <Card title="1. Guest Details">
              <GuestDetails
                register={register}
                errors={errors}
                idProofName={values.idProofName ?? ''}
                onIdProofChange={value =>
                  setValue('idProofName', value, { shouldValidate: true })
                }
              />
            </Card>

            <Card title="2. Stay Dates">
              <StayDateSelector
                register={register}
                errors={errors}
                minCheckIn={minCheckIn}
                checkIn={checkIn}
              />
            </Card>

            <Card title="3. Select a Room">
              <RoomList
                rooms={listedRooms}
                selectedCode={selectedCode}
                onSelect={code =>
                  setValue('selectedCode', code, { shouldValidate: true })
                }
              />
            </Card>
          </div>

          <div className="space-y-5">
            <Card title="Booking Summary">
              <StaySummary
                quote={quote}
                room={selectedRoom}
                checkIn={checkIn}
                checkOut={checkOut}
                guestName={guestName}
                adults={Number(adults) || 0}
                kids={Number(kids) || 0}
              />

              {errors.root && (
                <p className="text-style-7 text-error mt-3 flex items-start gap-1.5">
                  <Icon name="alert" size="h-3.5 w-3.5" className="mt-0.5" />
                  {errors.root.message}
                </p>
              )}

              <Button fullWidth type="submit" className="mt-4">
                Confirm Reservation
              </Button>
            </Card>

            <RecentBookings bookings={recentBookings} />
          </div>
        </form>
      )}
    </div>
  );
}

export default Booking;
