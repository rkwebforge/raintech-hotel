import PropTypes from 'prop-types';
import Card from '../../../widget/card';
import SummaryDetails from '../summary-details';
import { cn } from '../../../utils/cn';

/** The last few confirmed reservations, newest first. */
function RecentBookings({ bookings, className = '' }) {
  if (bookings.length === 0) return null;

  return (
    <Card
      title="Recent Bookings"
      className={cn(className)}
      bodyClassName="space-y-4"
    >
      {bookings.map(booking => (
        <SummaryDetails
          key={booking.id}
          guestName={booking.guestName}
          roomCode={booking.roomCode}
          roomType={booking.roomType}
          checkIn={booking.checkIn}
          checkOut={booking.checkOut}
          adults={booking.adults}
          kids={booking.kids}
          nights={booking.nights}
          pricePerNight={booking.pricePerNight}
          total={booking.total}
          className="border-line rounded-card border p-4"
        />
      ))}
    </Card>
  );
}

RecentBookings.propTypes = {
  bookings: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      guestName: PropTypes.string,
      roomCode: PropTypes.string.isRequired,
      roomType: PropTypes.string.isRequired,
      checkIn: PropTypes.string,
      checkOut: PropTypes.string,
      adults: PropTypes.number.isRequired,
      kids: PropTypes.number.isRequired,
      nights: PropTypes.number.isRequired,
      pricePerNight: PropTypes.number.isRequired,
      total: PropTypes.number.isRequired,
    })
  ).isRequired,
  className: PropTypes.string,
};

export default RecentBookings;
