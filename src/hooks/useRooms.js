import { useQuery } from '@tanstack/react-query';
import { getRooms } from '../services/mock-data/rooms';

export const useRooms = () =>
  useQuery({
    queryKey: ['rooms'],
    queryFn: getRooms,
  });
