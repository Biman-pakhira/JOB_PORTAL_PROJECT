/**
 * Centralized utility to resolve the API URL based on the environment.
 * Prioritizes the VITE_API_URL or NEXT_PUBLIC_API_URL environment variables.
 */
export const getApiUrl = () => {
    // Vite standard environment variable
    const viteApiUrl = (import.meta as any).env?.VITE_API_URL;
    if (viteApiUrl) {
        return viteApiUrl.replace(/\/$/, '');
    }

    // Next.js fallback (if running in a hybrid environment)
    const nextApiUrl = typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL;
    if (nextApiUrl) {
        return nextApiUrl.replace(/\/$/, '');
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

    return 'http://localhost:5001/api';
};
