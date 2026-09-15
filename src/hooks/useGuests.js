import { useQuery } from '@tanstack/react-query';
import { getGuests } from '../services/mock-data/guests';

export const useGuests = () =>
  useQuery({
    queryKey: ['guests'],
    queryFn: getGuests,
  });
