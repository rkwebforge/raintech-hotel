import { useQuery } from '@tanstack/react-query';
import { getActiveBooking } from '../services/mock-data/guests';

export const useActiveBooking = () =>
  useQuery({
    queryKey: ['active-booking'],
    queryFn: getActiveBooking,
  });
