/**
 * Centralized utility to resolve the API URL based on the environment.
 * Reads VITE_API_URL set in .env.local / .env.production.
 */
export const getApiUrl = () => {
    // Vite environment variable (set in .env.local or .env.production)
    const viteApiUrl = (import.meta as any).env?.VITE_API_URL;
    if (viteApiUrl) {
        return viteApiUrl.replace(/\/$/, '');
    }

    // Fallback: client-side hostname detection
    if (typeof window !== 'undefined') {
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

        if (isLocal) {
            return 'http://localhost:5000/api';
        }

        // On a live domain assume API is served at /api (same origin)
        return '/api';
    }

    return 'http://localhost:5000/api';
};
