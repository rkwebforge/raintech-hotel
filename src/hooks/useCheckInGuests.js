import { useQuery } from '@tanstack/react-query';
import { getCheckInGuests } from '../services/mock-data/guests';

export const useCheckInGuests = () =>
  useQuery({
    queryKey: ['check-in-guests'],
    queryFn: getCheckInGuests,
  });
