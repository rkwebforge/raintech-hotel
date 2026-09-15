import { QueryClient } from '@tanstack/react-query';
import { QUERY_CONFIG } from '../config';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: QUERY_CONFIG,
  },
});
