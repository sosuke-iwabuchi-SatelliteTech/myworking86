import { describe, it, expect, vi } from 'vitest';
import { initializeCsrf } from './csrf';
import axios from 'axios';

vi.mock('axios');

describe('initializeCsrf', () => {
    it('calls the sanctum csrf-cookie endpoint', async () => {
        await initializeCsrf();
        expect(axios.get).toHaveBeenCalledWith('/sanctum/csrf-cookie');
    });
});
