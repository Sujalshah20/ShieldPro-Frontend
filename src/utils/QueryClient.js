import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,  // 5 minutes
            gcTime: 1000 * 60 * 30,    // 30 minutes
            retry: (failureCount, error) => {
                // BUG FIX: Do not retry on 401 (Unauthorized) or 403 (Forbidden). This stops the terminal/console flood.
                if (error?.status === 401 || error?.status === 403) return false;
                return failureCount < 2;
            },
            refetchOnWindowFocus: false,
        },
    },
});
