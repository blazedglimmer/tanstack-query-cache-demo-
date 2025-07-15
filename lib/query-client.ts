'use client';

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache for 10 minutes (600,000 milliseconds)
      staleTime: 10 * 60 * 1000,
      gcTime: 10 * 60 * 1000, // Garbage collection time (formerly cacheTime)
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  },
});
