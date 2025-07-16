'use client';

import { QueryClient } from '@tanstack/react-query';

// Create a stable QueryClient instance that won't be recreated
let browserQueryClient: QueryClient | undefined = undefined;

const makeQueryClient = (): QueryClient => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Cache for 10 minutes (600,000 milliseconds)
        staleTime: 10 * 60 * 1000, // Data stays fresh for 10 minutes
        gcTime: 15 * 60 * 1000, // Keep in cache for 15 minutes (longer than staleTime)
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        retry: 1,
      },
    },
  });
};

export const getQueryClient = (): QueryClient => {
  // Server: always make a new query client
  if (typeof window === 'undefined') {
    return makeQueryClient();
  }

  // Browser: make a new query client if we don't already have one
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }

  return browserQueryClient;
};
