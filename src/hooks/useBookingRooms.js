import { useQuery } from '@tanstack/react-query';
import {
  getBookingRooms,
  getExistingBookings,
} from '../services/mock-data/bookingRooms';

export const useBookingRooms = () =>
  useQuery({
    queryKey: ['booking-rooms'],
    queryFn: getBookingRooms,
  });

export const useExistingBookings = () =>
  useQuery({
    queryKey: ['existing-bookings'],
    queryFn: getExistingBookings,
  });
