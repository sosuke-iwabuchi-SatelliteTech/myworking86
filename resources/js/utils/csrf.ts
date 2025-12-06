import axios from 'axios';

/**
 * Initialize CSRF cookie by calling the Sanctum endpoint.
 * This ensures that subsequent requests have the XSRF-TOKEN cookie set.
 */
export const initializeCsrf = async (): Promise<void> => {
    await axios.get('/sanctum/csrf-cookie');
};
