// React Query Configuration
export const QUERY_CONFIG = {
  // staleTime: 5 * 60 * 1000, // 5 minutes
  // cacheTime: 10 * 60 * 1000, // 10 minutes
  retry: 1,
  refetchOnWindowFocus: false,
  refetchOnReconnect: 'always',
};

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_DEVTOOLS: import.meta.env.DEV,
};
