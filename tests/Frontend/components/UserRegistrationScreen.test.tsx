import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserRegistrationScreen from '@/components/UserRegistrationScreen';

// Mock axios
import axios from 'axios';
vi.mock('axios', async (importOriginal) => {
    const actual = await importOriginal<typeof import('axios')>();
    return {
        ...actual,
        default: {
            ...actual.default,
            post: vi.fn(),
            get: vi.fn(),
            isAxiosError: (payload: any) => payload?.isAxiosError === true,
        },
        isAxiosError: (payload: any) => payload?.isAxiosError === true,
    };
});

// Mock crypto.randomUUID
Object.defineProperty(global, 'crypto', {
    value: {
        randomUUID: () => 'test-uuid-1234'
    }
});

describe('UserRegistrationScreen', () => {
    beforeEach(() => {
        vi.mocked(axios.post).mockClear();
        vi.mocked(axios.post).mockResolvedValue({
            data: {
                user: {
                    id: 'test-uuid-1234',
                    name: 'TestUser',
                    grade: 1
                }
            }
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders the form correctly', () => {
        render(<UserRegistrationScreen onComplete={() => { }} />);

        expect(screen.getByLabelText(/ニックネーム/)).toBeDefined();
        expect(screen.getByLabelText(/がくねん/)).toBeDefined();
        expect(screen.getByRole('button', { name: 'はじめる！' })).toBeDefined();
    });

    it('submits the form to the API and calls onComplete on success', async () => {
        const onComplete = vi.fn();
        render(<UserRegistrationScreen onComplete={onComplete} />);

        // Fill out the form
        fireEvent.change(screen.getByLabelText(/ニックネーム/), { target: { value: 'TestUser' } });
        fireEvent.change(screen.getByLabelText(/がくねん/), { target: { value: '1' } });

        // Submit
        const button = screen.getByRole('button', { name: 'はじめる！' }) as HTMLButtonElement;
        expect(button.disabled).toBe(false);
        fireEvent.click(button);

        // Verify API call
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith('/api/user', expect.objectContaining({
                id: 'test-uuid-1234',
                name: 'TestUser',
                grade: 1
            }));
        });

        // Verify onComplete call
        await waitFor(() => {
            expect(onComplete).toHaveBeenCalledWith({
                id: 'test-uuid-1234',
                nickname: 'TestUser',
                grade: 1
            });
        });
    });

    it('displays an error message when API call fails', async () => {
        vi.mocked(axios.post).mockRejectedValue({
            isAxiosError: true,
            response: {
                data: { message: 'Server Error' }
            }
        });

        const onComplete = vi.fn();
        render(<UserRegistrationScreen onComplete={onComplete} />);

        // Fill out the form
        fireEvent.change(screen.getByLabelText(/ニックネーム/), { target: { value: 'TestUser' } });
        fireEvent.change(screen.getByLabelText(/がくねん/), { target: { value: '1' } });

        // Submit
        fireEvent.click(screen.getByRole('button', { name: 'はじめる！' }));

        // Verify error message
        await waitFor(() => {
            expect(screen.queryByText('Server Error')).not.toBeNull();
        });

        expect(onComplete).not.toHaveBeenCalled();
    });
});
