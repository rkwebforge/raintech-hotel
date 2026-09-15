import { useQuery } from '@tanstack/react-query';
import { getDepartingGuest } from '../services/mock-data/checkout';

export const useDepartingGuest = () =>
  useQuery({
    queryKey: ['departing-guest'],
    queryFn: getDepartingGuest,
  });
