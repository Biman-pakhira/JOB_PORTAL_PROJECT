/**
 * Centralized utility to resolve the API URL based on the environment.
 * Prioritizes the NEXT_PUBLIC_API_URL environment variable.
 */
export const getApiUrl = () => {
    // If an environment variable is explicitly provided, use it.
    if (process.env.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
    }

    // Fallback logic for client-side resolution
    if (typeof window !== 'undefined') {
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        
        if (isLocal) {
            return 'http://localhost:5001/api';
        }

        // If on a live domain, assume the API is at /api (same project)
        return '/api';
    }

    // Default for SSR
    return 'http://localhost:5001/api';
};
